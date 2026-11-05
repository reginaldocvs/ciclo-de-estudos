/* Explorador automático: carrega uma cópia de um backup, faz ações aleatórias como uma pessoa
   (clica no que está visível, digita nos campos, avança dias, muda a largura, recarrega) e confere
   regras de coerência a cada passo. Nunca grava no arquivo de backup: os dados vão só para o localStorage
   de um Chrome temporário.
   Uso: node lint/explorador.mjs <backup.json> [passos=300] [sementes=1,2,3] [saída=explo]  */
import {open,W} from './lib.mjs';
import fs from 'fs';
const [BK,NSTEPS='300',SEEDS='1,2,3',OUT='explo']=process.argv.slice(2);
if(!BK){console.log('uso: node lint/explorador.mjs <backup.json> [passos] [sementes] [saída]');process.exit(1)}
const RAW0=JSON.parse(fs.readFileSync(BK,'utf8')),DATA=RAW0['ciclo-estudos-v2']||JSON.stringify(RAW0); /* aceita o backup ou um dump do localStorage */
fs.mkdirSync(OUT,{recursive:true});
const KEY='ciclo-estudos-v2';
const WIDTHS=[[360,740],[390,844],[768,1024],[1280,800]];

/* gerador aleatório com semente, para repetir uma exploração */
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
let R;const pick=a=>a[Math.floor(R()*a.length)];const chance=p=>R()<p;

/* o que uma pessoa digitaria, por tipo de campo */
const NAMES=['Português','Direito Constitucional','Direito Penal','Informática','Ética','Raciocínio Lógico','Matemática Financeira','Direito Administrativo e Legislação Aplicada ao Serviço Público Federal','  Português  ','Atualidades 2026','Contabilidade','Língua Inglesa'];
const TOPICS=['Crase','Regência verbal\nConcordância\nPontuação','Atos administrativos','Lei 8.112/90','Princípios fundamentais\nDireitos e garantias','Redes de computadores','Aula 1','Aula 2 — revisão','Interpretação de texto'];
const WORDS=['Aula 1','Aula 3','PDF capítulo 2','Revisar depois','https://www.youtube.com/watch?v=abc123','qconcursos.com/questoes','Livro p. 45','',' ','<b>teste</b>','Muito texto para ver se a linha quebra no lugar certo sem estourar a largura da tela','😀 emoji','12','Concurso 2026'];
function valueFor(f){
 if(f.tm)return pick(['0','5','30','45','100','130','200','015','999','1h30','abc','']);
 if(f.num||f.type==='number')return pick(['0','1','5','10','20','35','100','-3','']);
 if(f.type==='date')return null;
 if(f.tag==='TEXTAREA')return pick(TOPICS.concat(WORDS));
 if(f.name==='n')return pick(NAMES);
 if(f.type==='url'||/link|url/i.test(f.id+f.name+f.ph))return pick(['https://youtu.be/xyz','www.site.com/aula','texto sem link','']);
 return pick(WORDS.concat(NAMES.slice(0,4)));
}

/* nunca toca em login, sincronização, exportação ou arquivos */
const BLOCK=/Google|Sair da conta|Entrar|sincroniz|Exportar|Importar|Baixar|backup|Restaurar|Copiar link/i;
const BLOCKACT=new Set(['fblogin','fblogout']);

async function controls(p){return p.evaluate(BLOCKS=>{const BL=new RegExp(BLOCKS,'i'),root=document.querySelector('#modal .dlg')?document.querySelector('#modal'):document;
 const vis=e=>{if(!e.getClientRects().length)return false;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;const cs=getComputedStyle(e);return cs.visibility!=='hidden'&&cs.pointerEvents!=='none'};
 const out=[];let i=0;
 root.querySelectorAll('button,a,[data-act],input,textarea,select,[role=button],label.chk,summary').forEach(e=>{if(!vis(e)||e.disabled||e.closest('[inert]'))return;
  const t=(e.getAttribute('aria-label')||e.textContent||e.placeholder||'').trim().replace(/\s+/g,' ').slice(0,50);
  if(BL.test(t))return;if(e.tagName==='A'&&/^https?:/.test(e.getAttribute('href')||''))return;if(e.type==='file'||e.type==='hidden')return;
  e.setAttribute('data-xp',String(i));
  const kind=(e.tagName==='INPUT'&&!['checkbox','radio','button','submit','range'].includes(e.type))||e.tagName==='TEXTAREA'?'type':e.tagName==='SELECT'?'select':'click';
  out.push({i:i++,kind,tag:e.tagName,type:e.type||'',act:e.dataset.act||'',id:e.id||'',name:e.name||'',ph:e.placeholder||'',tm:e.hasAttribute('data-tm'),num:e.inputMode==='numeric',t})});
 return out},BLOCK.source)}

/* ===== Regras de coerência ===== */
async function rules(p,errs,tag){const bad=[];
 if(errs.length){errs.splice(0).forEach(e=>bad.push(['erro de script',e]))}
 const r=await p.evaluate((KEY,EQ)=>{const out=[],add=(rule,msg)=>out.push([rule,msg]);
  const txt=document.body.innerText,m=txt.match(/[^\n]{0,30}\b(NaN|undefined|null|Infinity)\b[^\n]{0,30}|\[object Object\]/g);if(m)add('texto quebrado',m.slice(0,3).join(' ¦ '));
  if(document.documentElement.scrollWidth>innerWidth+1)add('rolagem lateral','página com '+document.documentElement.scrollWidth+'px numa tela de '+innerWidth+'px');
  /* janela cabe na tela (ou rola por dentro) */
  const d=document.querySelector('#modal .dlg');if(d){const b=d.getBoundingClientRect();
   if(b.left<-1||b.right>innerWidth+1)add('janela fora da tela','janela "'+((d.querySelector('h2,h3,.dlgt')||{}).textContent||'').trim().slice(0,40)+'" sai pelos lados ('+Math.round(b.left)+'..'+Math.round(b.right)+' de '+innerWidth+')');
   if(b.bottom>innerHeight+2&&d.scrollHeight<=d.clientHeight+1&&getComputedStyle(d).overflowY!=='auto')add('janela fora da tela','janela passa do fim da tela e não rola')}
  if(typeof S==='undefined'||!S)return out;
  /* dados */
  const ids=S.subjects.map(s=>s.id),dup=ids.filter((x,i)=>ids.indexOf(x)!==i);if(dup.length)add('ids repetidos','disciplinas com id repetido: '+dup.join(','));
  S.subjects.forEach(s=>{const n=s.name||'(sem nome)';
   if(!String(s.name||'').trim())add('disciplina sem nome','id '+s.id);
   if(!(isFinite(s.goal)&&s.goal>0))add('meta inválida',n+': meta '+s.goal);
   if(!Array.isArray(s.topics))add('tópicos inválidos',n);
   if(s.of){const b=S.subjects.find(x=>x.id===s.of);if(!b)add('cópia sem original',n+' aponta para '+s.of);else{if(b.of)add('cópia de cópia',n);if(b.name!==s.name)add('cópia com nome diferente',s.name+' ≠ '+b.name);if(b.topics!==s.topics)add('cópia com tópicos separados',n)}}
   const tids=(s.topics||[]).map(t=>t.id);if(tids.some((x,i)=>tids.indexOf(x)!==i))add('tópicos repetidos',n);
   (s.topics||[]).forEach(t=>{if(!String(t.name||'').trim())add('tópico sem nome',n)})});
  Object.entries(S.progress||{}).forEach(([k,v])=>{if(!(isFinite(v)&&v>=0))add('progresso inválido',k+'='+v)});
  Object.entries(S.bump||{}).forEach(([k,v])=>{if(!(isFinite(v)&&v>=0))add('ajuste de meta inválido',k+'='+v)});
  (S.sessions||[]).forEach(x=>{if(!(isFinite(x.min)&&x.min>=0))add('sessão com tempo inválido',(x.subj||'?')+': '+x.min);
   if(!/^\d{4}-\d\d-\d\d$/.test(x.date||''))add('sessão sem data',(x.subj||'?')+': '+x.date);else if(x.date>today())add('sessão no futuro',x.date+' > '+today());
   if(!x.trv&&(x.set||1)===(S.set||1)&&x.cycle>S.cycle&&!x.rid)add('sessão em ciclo futuro','ciclo '+x.cycle+' > '+S.cycle);
   if(x.tq!=null&&!(+x.ac>=0&&+x.ac<=+x.tq))add('acertos maiores que questões',x.ac+'/'+x.tq);
   (x.items||[]).forEach(i=>{if(i.tq!=null&&!(Number.isInteger(+i.tq)&&+i.tq>0&&+i.ac>=0&&+i.ac<=+i.tq))add('acertos da aula inválidos',(i.name||'?')+': '+i.ac+'/'+i.tq)})});
  {const sid=(S.sessions||[]).map(x=>x.id),dd=sid.filter((v,i)=>sid.indexOf(v)!==i);if(dd.length)add('registros com id repetido',dd.slice(0,3).join(','))}
  /* Histórico: nenhum registro duas vezes na lista; total da linha de cima bate com as linhas quando cabe tudo numa página */
  if(document.querySelector('#hres')&&!document.querySelector('#modal .dlg')){const its=[...document.querySelectorAll('#hres .ritem [data-act=delreg]')].map(e=>e.dataset.id),du=its.filter((v,i)=>its.indexOf(v)!==i);if(du.length)add('registro repetido no Histórico',du.slice(0,3).join(','));
   const ht=document.querySelector('#hres .htot'),m=ht&&ht.textContent.match(/^(\d+) registros?/);if(m&&!document.querySelector('[data-act=hmore]')&&+m[1]!==its.length)add('total do Histórico não bate com a lista',m[1]+' ≠ '+its.length)}
  if(!(Number.isInteger(S.cycle)&&S.cycle>=1))add('ciclo inválido',String(S.cycle));
  if((S.mode==='review')!==(S.type==='review'))add('modo e tipo desencontrados','mode='+S.mode+' type='+S.type);
  if(S.mode==='review'&&!S.rv)add('revisão sem dados','modo revisão sem S.rv');
  if(S.sel&&S.sel.subj&&!S.subjects.some(s=>s.id===S.sel.subj))add('seleção aponta para disciplina inexistente',S.sel.subj);
  if(S.timer&&S.timer.running&&!S.sx)add('cronômetro sem foco','timer.running com sx=false');
  if(S.plan&&S.plans&&!S.plans.some(p=>p.id===S.plan))add('plano atual inexistente',S.plan);
  /* tela x dados */
  const nwn=document.querySelector('#app .nwn');if(nwn&&!document.querySelector('#modal .dlg')){const t=nwn.textContent.trim();if(t&&typeof actives==='function'&&!S.subjects.some(s=>t.includes(s.name)))add('cartão Agora com nome estranho','"'+t.slice(0,50)+'"')}
  if(typeof actives==='function'&&typeof gDone==='function'&&S.type!=='review'){
   actives().forEach(s=>{if(gDone(s)&&!S.sessions.some(x=>!x.review&&!x.rid&&(x.set||1)===(S.set||1)&&x.cycle===S.cycle&&(x.subj===s.id||x.blk===s.id)))add('concluída sem sessão',s.name+' está com a meta cumprida mas não tem sessão neste ciclo')})}
  /* gravação */
  try{const j=localStorage.getItem(KEY);if(j&&j!==JSON.stringify(S)&&!window.__ro){const A=JSON.parse(j),eq=eval(EQ),ks=Object.keys(S).filter(k=>!['bumpMig','mig2','sel','edit'].includes(k)&&!eq(A[k],S[k])) /* seleção e rascunho de edição só valem até reabrir */;if(ks.length)add('não gravou','campos diferentes do salvo: '+ks.join(', ')+' :: '+ks.map(k=>k+': '+String(JSON.stringify(A[k])).slice(0,200)+' → '+String(JSON.stringify(S[k])).slice(0,200)).join(' ; '))}}catch(e){}
  return out},KEY,EQ);
 return bad.concat(r).map(([rule,msg])=>({rule,msg,tag}))}

/* recarrega e confere se os dados voltam iguais */
async function reloadCheck(p,errs){const a=await p.evaluate(()=>JSON.stringify(S));await p.reload();await W(700);const b=await p.evaluate(()=>JSON.stringify(S));
 if(a===b)return [];const A=JSON.parse(a),B=JSON.parse(b),ks=diff(A,B),out=[];
 const tm=A.timer?(+A.timer.acc||0)+(A.timer.running&&A.timer.start?1:0):0;
 if(pzSum(B)<pzSum(A)||(tm>0&&pzSum(B)<=pzSum(A)&&A.sel&&A.progress&&(A.progress[A.sel.subj]||0)<((A.subjects.find(x=>x.id===A.sel.subj)||{}).goal||0)))out.push({rule:'tempo perdido ao recarregar',msg:'pausado antes '+pzSum(A)+'ms + cronômetro '+(A.timer&&A.timer.acc)+'ms → pausado depois '+pzSum(B)+'ms'});
 if(!ks.length)return out;
 return out.concat([{rule:'recarregar muda os dados',msg:'campos: '+ks.join(', '),detail:ks.map(k=>k+': '+String(JSON.stringify(A[k])).slice(0,300)+'  →  '+String(JSON.stringify(B[k])).slice(0,300)).join('\n')}])}

/* igualdade tolerante: valores vazios (ausente, null, [], {}, '', false) contam como iguais; assim
   o preenchimento de padrões pelo app (ex.: edit: undefined → null) não vira falso alarme */
const EQ=`(function eq(a,b){if(a===undefined&&b==='study'||a==='study'&&b===undefined)return true;const E=v=>v==null||v===''||v===false||v===0||(Array.isArray(v)&&!v.length)||(typeof v==='object'&&!Array.isArray(v)&&!Object.keys(v).length);
 if(E(a)&&E(b))return true;if(typeof a!=='object'||typeof b!=='object'||a===null||b===null)return a===b;
 if(Array.isArray(a)!==Array.isArray(b))return false;if(Array.isArray(a))return a.length===b.length&&a.every((x,i)=>eq(x,b[i]));
 return [...new Set(Object.keys(a).concat(Object.keys(b)))].every(k=>eq(a[k],b[k]))})`;
const eq=eval(EQ);
const MIG=new Set(['bumpMig','mig2']); /* marcas de migração que o app grava ao abrir */
/* o que o app zera de propósito ao abrir (bootReset): modo do Histórico, cartões recolhidos, edição, foco,
   registro sendo preenchido e cronômetro (que vira tempo pausado; esse tempo é conferido à parte) */
const BOOT=new Set(['hmode','rvaClosed','rodOpen','edit','sx','draft','sel','timer','paused','rvf','rvp']);
/* o contexto estacionado durante a revisão (alt) também passa pela limpeza da abertura */
const nb=v=>v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>!BOOT.has(k))):v;
const diff=(A,B)=>[...new Set(Object.keys(A).concat(Object.keys(B)))].filter(k=>!MIG.has(k)&&!BOOT.has(k)&&!(k==='alt'?eq(nb(A[k]),nb(B[k])):eq(A[k],B[k])));
const pzSum=o=>Object.values(o.paused||{}).reduce((a,v)=>a+(+v.ms||0),0);
const sig=b=>b.rule+'|'+b.msg.replace(/\d+/g,'#').replace(/\b[a-z0-9]{7}\b/g,'@');
const found=new Map();

for(const seed of SEEDS.split(',').map(Number)){
 R=rng(seed);const [w,h]=pick(WIDTHS);
 const {b,p,errs}=await open({w,h,data:{[KEY]:DATA,'ciclo-welcome-skip':'1'}});
 p.on('dialog',d=>d.accept());
 /* TRAIL=1: vigia de travamento — se um passo passar de 60 s, pausa a página e grava onde o código está preso */
 if(process.env.TRAIL){const cdp=await p.target().createCDPSession();await cdp.send('Debugger.enable');cdp.on('Debugger.paused',ev=>{fs.writeFileSync(`${OUT}/travou-s${seed}.txt`,ev.callFrames.map(f=>(f.functionName||'(anônima)')+' linha '+(f.location.lineNumber+1)+':'+f.location.columnNumber).join(String.fromCharCode(10)));console.log('TRAVOU: pilha gravada');process.exit(3)});
  let last=Date.now();globalThis.__tick=()=>{last=Date.now()};setInterval(()=>{if(Date.now()-last>60000){last=Date.now();cdp.send('Debugger.pause').catch(()=>{})}},5000).unref()}
 const trail=[];let step=0;
 const note=async(list)=>{for(const x of list){const k=sig(x);if(found.has(k)){found.get(k).n++;continue}
  const shot=`${OUT}/s${seed}-p${step}.png`;await p.screenshot({path:shot}).catch(()=>{});
  const st=await p.evaluate(()=>JSON.stringify(S)).catch(()=>'');fs.writeFileSync(`${OUT}/s${seed}-p${step}.json`,st);
  found.set(k,{...x,seed,step,width:(p.viewport()||{}).width,n:1,shot,trail:trail.slice(-15)});console.log(`  ✗ [s${seed} p${step}] ${x.rule}: ${x.msg.slice(0,300)}`);fs.writeFileSync(`${OUT}/relatorio.json`,JSON.stringify([...found.values()],null,1))}};
 await rules(p,errs,'início'); /* no começo o app ainda não gravou a migração dos dados: só confere a partir do 1º passo */
 for(step=1;step<=+NSTEPS;step++){
  let desc='';
  try{
   if(globalThis.__tick)globalThis.__tick();const roll=R();const pre=t=>{if(process.env.TRAIL)fs.appendFileSync(`${OUT}/andamento-s${seed}.txt`,'   … '+step+' '+t+String.fromCharCode(10))};pre('sorteio '+roll.toFixed(3));
   if(roll<0.03){const n=pick([1,1,2,7]);await p.evaluate(n=>localStorage.setItem('__fkoff',String(+(localStorage.getItem('__fkoff')||0)+n*86400000)),n);await p.reload();await W(700);desc='avança '+n+' dia(s) e reabre'}
   else if(roll<0.05){const [w2,h2]=pick(WIDTHS);await p.setViewport({width:w2,height:h2});await W(300);desc='muda a tela para '+w2+'px'}
   else if(roll<0.08){desc='recarrega a página';const l=await reloadCheck(p,errs);if(l.length){trail.push({step,desc});await note(l)}}
   else if(roll<0.10){const m=pick([5,20,45,90]);await p.evaluate(m=>localStorage.setItem('__fkoff',String(+(localStorage.getItem('__fkoff')||0)+m*60000)),m);await W(1100);desc='passam '+m+' min'}
   else if(roll<0.15){const k=pick(['Escape','Escape','Enter','Tab']);await p.keyboard.press(k);await W(300);desc='tecla '+k}
   else{
    const cs=await controls(p);if(!cs.length){await p.keyboard.press('Escape');desc='nada clicável; Esc'}
    else{const types=cs.filter(c=>c.kind==='type'),clicks=cs.filter(c=>c.kind!=='type'&&!BLOCKACT.has(c.act));
     const c=types.length&&chance(0.3)?pick(types):pick(clicks.length?clicks:cs);const sel=`[data-xp="${c.i}"]`;pre(c.kind+' '+c.t+' '+c.act);
     if(c.kind==='type'){const v=valueFor(c);if(v===null){desc='pula campo de data'}else{
       await Promise.race([p.click(sel,{clickCount:3}),new Promise((_,no)=>setTimeout(()=>no(new Error('clique sem resposta')),8000))]).catch(()=>p.focus(sel));await p.keyboard.down('Control');await p.keyboard.press('a');await p.keyboard.up('Control');await p.keyboard.press('Backspace');
       await p.keyboard.type(v,{delay:8});if(chance(0.35)){await p.keyboard.press('Enter')}await W(250);desc=`digita "${v.replace(/\n/g,'⏎')}" em ${c.tag.toLowerCase()} ${c.name||c.id||c.ph||c.t}`}}
     else if(c.kind==='select'){await p.evaluate(s=>{const e=document.querySelector(s),o=e.options;e.selectedIndex=Math.floor(Math.random()*o.length);e.dispatchEvent(new Event('change',{bubbles:true}))},sel);await W(250);desc='escolhe opção em '+(c.name||c.id)}
     else{/* o clique do Puppeteer espera um IntersectionObserver que às vezes nunca responde (a página segue livre): com 8 s sem resposta, clica direto */
      await Promise.race([p.click(sel),new Promise((_,no)=>setTimeout(()=>no(new Error('clique sem resposta')),8000))]).catch(async()=>{await p.evaluate(s=>document.querySelector(s)&&document.querySelector(s).click(),sel)});await W(300);desc=`clica "${c.t}"`+(c.act?` (${c.act})`:'')}}}
  }catch(e){desc+=' — exceção: '+e.message.split('\n')[0];errs.push('exceção do explorador: '+e.message.split('\n')[0])}
  trail.push({step,desc});if(process.env.TRAIL)fs.appendFileSync(`${OUT}/andamento-s${seed}.txt`,step+'. '+desc+String.fromCharCode(10)); /* TRAIL=1: grava cada passo (para achar onde travou) */
  await W(150);
  await note(await rules(p,errs,desc));
 }
 await note(await reloadCheck(p,errs));
 fs.writeFileSync(`${OUT}/trilha-s${seed}.txt`,trail.map(t=>t.step+'. '+t.desc).join('\n'));
 console.log(`semente ${seed}: ${+NSTEPS} passos, tela inicial ${w}px`);
 await b.close();
}
const list=[...found.values()].sort((a,b)=>b.n-a.n);
fs.writeFileSync(`${OUT}/relatorio.json`,JSON.stringify(list,null,1));
console.log(`\nPROBLEMAS DISTINTOS: ${list.length}`);
list.forEach(x=>console.log(`- ${x.rule} (${x.n}x) · ${x.msg}\n    primeira vez: semente ${x.seed}, passo ${x.step}, ${x.width}px · ${x.shot}\n    últimos passos: ${x.trail.slice(-5).map(t=>t.desc).join(' → ')}`+(x.detail?'\n    '+x.detail.replace(/\n/g,'\n    '):'')));
