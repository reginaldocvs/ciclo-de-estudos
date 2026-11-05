/* Auditoria de botões e textos: em cada tela, toca em cada botão visível (a partir do mesmo estado, recarregando os dados)
   e procura os defeitos que já apareceram no uso:
   - botão sem efeito (nada muda na tela nem nos dados);
   - botão que abre janela ou expande só com o que já estava à vista ("Ver todas (1)" com o item já no cartão);
   - textos: plural errado ("1 dias"), "(0)", "0 restantes", NaN/undefined, separador sobrando (" · ·", "· " no fim), repetição;
   - "Mostrar mais N" maior que o que falta; erros de script.
   Também entra um nível nas janelas que abrem (toca nos botões delas).
   Uso: node lint/auditoria.mjs <dados.json> <saída> [largura=390] [dias=0] */
import {open,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,WD='390',DAYS='0']=process.argv.slice(2);const w=+WD,days=+DAYS;
const RAW=JSON.parse(fs.readFileSync(F,'utf8'));const S0=RAW['ciclo-estudos-v2']?JSON.parse(RAW['ciclo-estudos-v2']):RAW;
S0.timer={running:false,start:0,acc:0};const DATA=JSON.stringify(S0);const KEY='ciclo-estudos-v2';
const BLOCK=/Google|Sair da conta|Entrar|sincroniz|Exportar|Importar|Baixar|backup|Restaurar|Copiar|Instalar|Apagar tudo|Começar do zero/i;
const SCREENS=[['ciclo'],['rev','hoje'],['rev','grupos'],['rev','topicos'],['reg'],['st'],['bk']];
const found=new Map();const add=(kind,where,msg)=>{const k=kind+'|'+msg;if(!found.has(k))found.set(k,{kind,where,msg,n:0});found.get(k).n++};

const {b,p,errs}=await open({w,h:w<500?844:860,data:{[KEY]:DATA,'ciclo-welcome-skip':'1','__fkoff':String(days*864e5)}});
async function reset(scr){await p.evaluate((K,D,o)=>{localStorage.clear();localStorage.setItem(K,D);localStorage.setItem('ciclo-welcome-skip','1');localStorage.setItem('__fkoff',o)},KEY,DATA,String(days*864e5));
 await p.reload();await W(450);await p.evaluate(s=>{const t=document.querySelector(`nav [data-tab="${s[0]}"]`);t&&t.click()},scr);await W(250);
 if(scr[1])await p.evaluate(id=>{const t=document.querySelector(`[data-act=rvt][data-id="${id}"]`);t&&t.click()},scr[1]);await W(250);errs.splice(0)}

/* estado da tela: html, dados, textos visíveis, rolagem */
const snap=()=>p.evaluate(()=>{const vis=e=>{if(!e.getClientRects().length)return false;const cs=getComputedStyle(e);return cs.visibility!=='hidden'&&cs.opacity!=='0'};
 const leaf=root=>{const out=[];root.querySelectorAll('*').forEach(e=>{if(e.closest('button,select,option,[aria-hidden=true]'))return;let t='';e.childNodes.forEach(n=>{if(n.nodeType===3)t+=n.textContent});t=t.trim().replace(/\s+/g,' ');if(t&&vis(e))out.push(t)});return out};
 const m=document.getElementById('modal'),dlg=m&&m.querySelector('.dlg');
 return {html:(document.querySelector('main')||document.body).outerHTML+'||'+(m?m.outerHTML.replace(/ enter\b/g,''):''),s:localStorage.getItem('ciclo-estudos-v2'),y:Math.round(scrollY),
  dlg:dlg?(dlg.getAttribute('aria-label')||(dlg.querySelector('h2,h3')||{}).textContent||'?').trim():'',dlgLeaf:dlg?leaf(dlg):[],appLeaf:leaf(document.querySelector('main')||document.body),
  foc:document.activeElement?document.activeElement.outerHTML.slice(0,80):''}});

/* defeitos de texto em qualquer estado */
async function textChecks(where){const r=await p.evaluate(()=>{const out=[];const T=document.body.innerText;
 const W='dias|revisões|itens|aulas|tópicos|vezes|minutos|horas|sessões|questões|restantes|anotações|pausas|ciclos|grupos|disciplinas|registros|semanas|meses|blocos|pontos|tentativas|estudos|acertos|leituras|links|planos';
 (T.match(new RegExp('(?:^|[^\\d.,/:])1 ('+W+')\\b[^\\n]{0,20}','gm'))||[]).forEach(x=>out.push(['plural',x.trim()]));
 (T.match(/[^\n]{0,25}\b(?:há|em|de) 0 (?:dias?|minutos?|horas?)[^\n]{0,15}/g)||[]).forEach(x=>out.push(['zero estranho',x.trim()]));
 (T.match(/[^\n]{0,30}\(0\)[^\n]{0,10}|[^\n]{0,20}\b0 restantes/g)||[]).forEach(x=>out.push(['contagem zero',x.trim()]));
 (T.match(/[^\n]{0,30}\b(NaN|undefined|null|Infinity|Invalid Date)\b[^\n]{0,30}|\[object Object\]/g)||[]).forEach(x=>out.push(['texto quebrado',x.trim()]));
 (T.match(/[^\n]{0,20}(·[ \t]*·|,[ \t]*,|\([ \t]*\))[^\n]{0,20}/g)||[]).forEach(x=>out.push(['separador sobrando',x.trim()]));
 (T.match(/(\b[\wÀ-ú]{3,}(?: [\wÀ-ú]+){0,3}) · \1\b/g)||[]).forEach(x=>out.push(['repetido',x.trim()]));
 document.querySelectorAll('.pgm').forEach(m=>{const t=m.textContent,a=t.match(/Mostrar mais (\d+)/),r=t.match(/· (\d+) restantes/);if(a&&r&&+a[1]>+r[1])out.push(['paginação','"'+t.trim()+'"'])});
 document.querySelectorAll('.card').forEach(c=>{if(!c.getClientRects().length)return;const h=c.querySelector('h2');if(h&&!c.querySelector('[aria-expanded=false]')&&c.innerText.trim()===h.innerText.trim())out.push(['cartão vazio',h.innerText.trim()])});
 if(document.documentElement.scrollWidth>innerWidth+1)out.push(['rolagem lateral',document.documentElement.scrollWidth+'px']);
 return out});r.forEach(([k,m])=>add(k,where,m));if(errs.length){errs.splice(0).forEach(e=>add('erro de script',where,e))}}

const ctrls=()=>p.evaluate(BL=>{const B=new RegExp(BL,'i'),m=document.querySelector('#modal .dlg'),root=m||document.querySelector('main')||document.body;
 const vis=e=>{if(!e.getClientRects().length)return false;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;const cs=getComputedStyle(e);return cs.visibility!=='hidden'&&cs.pointerEvents!=='none'};
 const out=[];root.querySelectorAll('button,a[data-act],a[data-tab],[role=button],summary,[data-act]:not(input):not(select):not(textarea)').forEach(e=>{if(!vis(e)||e.disabled||e.closest('[inert]'))return;
  if(e.tagName==='A'&&/^https?:/.test(e.getAttribute('href')||''))return;if(e.type==='submit'&&!e.dataset.act)return;
  const t=(e.getAttribute('aria-label')||e.textContent||'').trim().replace(/\s+/g,' ').slice(0,60);if(B.test(t))return;
  const cur=e.matches('[aria-pressed=true],[aria-checked=true],[aria-selected=true],[aria-current],.on,.sel,.act,.cur');out.push({t,cur,act:e.dataset.act||e.dataset.tab||'',id:e.dataset.id||'',sig:(e.dataset.act||'')+'|'+(e.dataset.id||'')+'|'+t})});
 const seen=new Set();return out.filter(o=>!seen.has(o.sig)&&seen.add(o.sig))},BLOCK.source);
const clickSig=sig=>p.evaluate((sig,BL)=>{const m=document.querySelector('#modal .dlg'),root=m||document.querySelector('main')||document.body;
 const e=[...root.querySelectorAll('button,a[data-act],a[data-tab],[role=button],summary,[data-act]')].find(e=>e.getClientRects().length&&((e.dataset.act||'')+'|'+(e.dataset.id||'')+'|'+(e.getAttribute('aria-label')||e.textContent||'').trim().replace(/\s+/g,' ').slice(0,60))===sig);
 if(!e)return false;e.click();return true},sig,BLOCK.source);

async function judge(where,c,a,z){
 const same=a.html===z.html&&a.s===z.s&&a.y===z.y&&a.foc===z.foc;
 if(same&&!c.cur)add('sem efeito',where,`"${c.t}" (${c.act||'-'}) não muda nada`);
 if(z.dlg&&z.dlg!==a.dlg){const before=new Set(a.dlg?a.dlgLeaf:a.appLeaf),nw=z.dlgLeaf.filter(t=>!before.has(t)&&t!==z.dlg);
  if(nw.length===0)add('só repete',where,`"${c.t}" abre a janela "${z.dlg}" com nada além do que já estava à vista`)}
 else if(!z.dlg&&!a.dlg&&a.s===z.s&&a.html!==z.html&&/ver|mostrar|mais|todas|todos|abrir|expandir/i.test(c.t)){const before=new Set(a.appLeaf),nw=z.appLeaf.filter(t=>!before.has(t));
  if(nw.length===0)add('só repete',where,`"${c.t}" muda a tela mas não mostra nada novo`)}}

let nClicks=0;
for(const scr of SCREENS){const where=scr.join('/')+'@'+w+(days?'+'+days+'d':'');
 await reset(scr);await textChecks(where);const top=await ctrls();
 for(const c of top){if(c.act==='rvt'||(c.act&&scr[0]===c.act))continue;
  await reset(scr);const a=await snap();if(!(await clickSig(c.sig)))continue;nClicks++;await W(500);const z=await snap();
  await judge(where,c,a,z);await textChecks(where+' › '+c.t);
  /* um nível dentro da janela que abriu */
  if(z.dlg&&!a.dlg){const inner=(await ctrls()).slice(0,25);
   for(const d of inner){if(/fechar|cancelar|voltar|close/i.test(d.t)||/close|back|cancel/i.test(d.act))continue;
    await reset(scr);if(!(await clickSig(c.sig)))break;await W(450);const a2=await snap();if(!(await clickSig(d.sig)))continue;nClicks++;await W(500);const z2=await snap();
    await judge(where+' › '+z.dlg,d,a2,z2);await textChecks(where+' › '+z.dlg+' › '+d.t)}}}}
await b.close();
const L=[...found.values()];fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(`${OUT}/audit-${F.split(/[\\/]/).pop().replace('.json','')}-${w}-${days}.json`,JSON.stringify(L,null,1));
console.log(`${nClicks} toques, ${L.length} achados`);L.forEach(x=>console.log(`${x.kind.padEnd(18)} ${x.where} :: ${x.msg}${x.n>1?' (x'+x.n+')':''}`));
