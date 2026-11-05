/* Simulação realista com os dados reais (cópia): 2 sessões por dia, cada uma com 1 tópico e 2 a 3 aulas/questões (com acertos),
   pontos de revisão do ciclo, revisões por tópico no dia em que vencem e, conforme o modo:
   ciclos: revisão por ciclos a cada 5 (5 ciclos de estudo + ciclo de revisão);  grupos: revisão por grupos (grupo disponível = feito no dia).
   Uso: node lint/simreal.mjs <dados.json> <saída> <ciclos|grupos> [dias=24] [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,MODE='ciclos',ND='24',WD='390']=process.argv.slice(2);const w=+WD;
const log=[],ok=(c,m)=>{log.push((c?'OK    ':'FALHA ')+m);if(!c)console.log('FALHA '+m)},info=m=>log.push('      '+m);
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rvf=null;if(process.env.CYN){S0.cyrv={...(S0.cyrv||{}),n:+process.env.CYN,d5:1}}
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:860});const x=mk(p);
const tabTo=async t=>{await x.ev(t=>{const e=document.querySelector(`nav [data-tab=${t}]`);e&&e.click()},t);await W(300)};
let n=0;const shot=async(nm,full)=>{n++;await p.screenshot({path:`${OUT}/${String(n).padStart(2,'0')}-${nm}.png`,fullPage:!!full})};
const shotOnce=new Set(),once=async nm=>{if(shotOnce.has(nm))return;shotOnce.add(nm);await x.ev(()=>scrollTo(0,0));await shot(nm)};
const vis=a=>x.ev(a=>{const e=[...document.querySelectorAll(`[data-act=${a}]`)].filter(e=>e.offsetParent).pop();if(e)e.click();return !!e},a);
/* acertos: preenche os pares qa/qt do formulário aberto (o total vem sugerido quando já houve tentativa) */
const fillAc=async()=>{let c=0;for(let i=0;i<40;i++){const r=await x.ev((i,s)=>{const rows=[...document.querySelectorAll('#modal .acrow')].filter(e=>e.offsetParent);const row=rows[i];if(!row)return null;const qa=row.querySelector('input[data-qa]'),qt=row.querySelector('input[data-qt]');let k=s;const rn=()=>{k=(k*16807)%2147483647;return k/2147483647};
  const set=(e,v)=>{e.focus();e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))};const tq=+qt.value||5+Math.floor(rn()*6);set(qt,tq);set(qa,Math.round(tq*(.5+rn()*.5)));return true},i,ri(1,1e6));if(!r)break;c++;await W(60)}return c};
const st={dias:0,estudo:0,blocos:0,topicos:0,acTop:0,ciclosRev:0,grupos:0,acertos:0,sessoes:0,sessPul:0,sessAc:0,sessConc:0};
const SRV=!!process.env.SRV;
/* revisão por sessões (SRV=1): na vez da disciplina, o cartão do Ciclo; registra (com acertos e tempo) ou, às vezes, pula.
   Confere: só aparece com N sessões novas, cada item listado ganha +1, nenhum passa de Y, e depois sai da vez */
async function srvReview(id){if(!SRV)return;const a=await x.ev(id=>({due:srDue(id),nw:srNew(id).length,n:srN(),y:srY(),cnt:Object.fromEntries(srItems(id).flatMap(t=>t.its.map(z=>[z.k,z.n]))),todo:srTodo(id).flatMap(t=>t.its.map(z=>z.k)),card:!!document.querySelector('#app .srvc'),tags:[...document.querySelectorAll('#app .srvc .srn')].map(e=>e.textContent)}),id);
 if(a.due!==(a.nw>=a.n&&a.todo.length>0))ok(false,'sessões: disponível fora da regra '+JSON.stringify({due:a.due,nw:a.nw}));
 if(Object.values(a.cnt).some(v=>v>a.y))ok(false,'sessões: item com mais de '+a.y+' revisões');
 if(!a.due){if(a.card)ok(false,'sessões: cartão sem revisão disponível');return}
 if(!a.card){ok(false,'sessões: revisão disponível sem o cartão no Ciclo');return}
 if(a.tags.some(t=>!/^\dª de \d$/.test(t)||+t[0]>a.y))ok(false,'sessões: etiqueta estranha '+a.tags.join());
 await once('sessoes-cartao');
 if(rnd()<.2){await x.ev(()=>document.querySelector('#app .srvc [data-act=srskip]').click());await W(300);st.sessPul++;
  const z=await x.ev(id=>({due:srDue(id),cnt:Object.fromEntries(srItems(id).flatMap(t=>t.its.map(z=>[z.k,z.n])))}),id);
  if(z.due||Object.keys(a.cnt).some(k=>z.cnt[k]!==a.cnt[k]))ok(false,'sessões: Pular mudou a contagem ou não saiu da vez');return}
 /* marca uma parte (às vezes todas) como uma pessoa faria: clicando nas caixinhas visíveis */
 const all=rnd()<.3;if(all){await x.ev(()=>document.querySelector('#app .srvc [data-act=srall]').click());await W(200)}else{const nb=await x.ev(()=>document.querySelectorAll('#app .srvc input[data-srk]').length);for(let i=0;i<nb;i++)if(rnd()<.6||i===0){await x.ev(i=>document.querySelectorAll('#app .srvc input[data-srk]')[i].click(),i);await W(120)}}
 const mk=await x.ev(id=>srMkT(id).flatMap(t=>t.its.map(z=>z.k)),id);if(!mk.length){ok(false,'sessões: nada ficou marcado');return}st.sessMk=(st.sessMk||0)+mk.length;st.sessLista=(st.sessLista||0)+a.todo.length;
 await x.ev(()=>document.querySelector('#app .srvc [data-act=srreg]').click());await W(300);
 if(await x.ev(n=>document.querySelectorAll('#modal .actp').length!==n,new Set(mk.map(k=>k.split('|')[1])).size))ok(false,'sessões: janela de registro com tópicos fora das marcadas');await x.fill('#modal input[name=m]','0h'+ri(10,25));const c=await fillAc();st.sessAc+=c;
 if(!shotOnce.has('sessoes-registro')){shotOnce.add('sessoes-registro');await shot('sessoes-registro')}
 await x.submit('#modal form[data-f=srreg]');await W(300);st.sessoes++;
 const z=await x.ev(id=>({due:srDue(id),nw:srNew(id).length,cnt:Object.fromEntries(srItems(id).flatMap(t=>t.its.map(z=>[z.k,z.n]))),fin:srSplit(id).fin.reduce((a,t)=>a+t.its.length,0),card:!!document.querySelector('#app .srvc')}),id);
 const M=new Set(mk),bad=a.todo.filter(k=>z.cnt[k]!==a.cnt[k]+(M.has(k)?1:0));if(bad.length)ok(false,'sessões: contagem errada (marcadas +1, desmarcadas iguais) '+bad.slice(0,3).join());
 if(await x.ev(id=>srMkT(id).length||Object.keys(S.srMk||{}).some(k=>k.startsWith(id+'|')),id))ok(false,'sessões: marcas ficaram depois de registrar');
 if(z.due||z.nw||z.card)ok(false,'sessões: depois de registrar continua na vez '+JSON.stringify({due:z.due,nw:z.nw,card:z.card}));st.sessConc=Math.max(st.sessConc,z.fin)}
const errTot=()=>errs.length;
/* pontos de revisão do ciclo: registra cada disciplina do bloco (com acertos por aula) */
async function blocks(){for(let g=0;g<6;g++){if(await vis('bkback'))await W(300);const ids=await x.ev(()=>blkCur()?[...document.querySelectorAll('#app [data-act=bkreg]')].filter(e=>e.offsetParent).map(e=>e.dataset.id):null);if(!ids)return;
 await once('ponto-de-revisao');
 for(const id of ids){await x.act('bkreg',id);st.acertos+=await fillAc();if(!shotOnce.has('ponto-registro')){shotOnce.add('ponto-registro');await shot('ponto-registro')}await x.submit('#modal form[data-f=bkreg]');await W(250);st.blocos++}
 await x.ev(()=>{const e=[...document.querySelectorAll('#app [data-act=blkend]')].find(e=>e.offsetParent);e&&e.click()});await W(300)}}
/* atrasadas (SRV=1): às vezes, pela aba Sessões, põe em dia parte das atrasadas de uma disciplina fora da vez */
async function lateReviews(){if(!SRV||rnd()>.35)return;const ids=await x.ev(()=>srSubs().filter(s=>!srDue(s.id)&&srLate(s.id).length).map(s=>s.id));if(!ids.length)return;
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=sessoes]');b&&b.click()});await W(300);
 const id=ids[0],a=await x.ev(id=>({cnt:Object.fromEntries((({todo,fin})=>todo.concat(fin))(srSplit(id)).flatMap(t=>t.its.map(z=>[z.k,z.n]))),nw:srNew(id).length,late:srLate(id).flatMap(t=>t.its.map(z=>z.k))}),id);
 if(!(await x.ev(id=>!!document.querySelector(`.srlate [data-act=srreg][data-id="${id}"]`),id))){ok(false,'atrasadas: seção sem o botão Registrar');return}
 await once('sessoes-atrasadas');
 const nb=await x.ev(id=>[...document.querySelectorAll('.srlate input[data-srk]')].length,id);for(let i=0;i<nb;i++)if(rnd()<.5||i===0){await x.ev(i=>{const e=document.querySelectorAll('.srlate input[data-srk]')[i];e&&e.click()},i);await W(120)}
 const mk=await x.ev(id=>srMkT(id).flatMap(t=>t.its.map(z=>z.k)),id);if(mk.some(k=>!a.late.includes(k)))ok(false,'atrasadas: marcada fora da lista de atrasadas');
 await x.ev(id=>document.querySelector(`.srlate [data-act=srreg][data-id="${id}"]`).click(),id);await W(300);await x.submit('#modal form[data-f=srreg]');await W(300);st.atras=(st.atras||0)+1;st.atrasIt=(st.atrasIt||0)+mk.length;
 const z=await x.ev(id=>({cnt:Object.fromEntries((({todo,fin})=>todo.concat(fin))(srSplit(id)).flatMap(t=>t.its.map(z=>[z.k,z.n]))),nw:srNew(id).length,due:srDue(id),late:srLate(id).flatMap(t=>t.its.map(z=>z.k))}),id);
 const M=new Set(mk),bad=Object.keys(a.cnt).filter(k=>z.cnt[k]!==a.cnt[k]+(M.has(k)?1:0));if(bad.length)ok(false,'atrasadas: contagem errada '+bad.slice(0,3).join());
 if(z.nw!==a.nw||z.due)ok(false,'atrasadas: pôr em dia mexeu nas sessões novas ou deixou disponível');if(z.late.some(k=>M.has(k)))ok(false,'atrasadas: marcada continua atrasada')}
/* uma sessão de estudo: 1 tópico (novo a cada 2 sessões da disciplina) com 2 a 3 aulas/questões */
const tpN={};
async function study(){await tabTo('ciclo');await blocks();
 const id=await x.ev(()=>{if(S.type==='review'||S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)return false;
 await srvReview(id);
 await x.act('rreg',id);const k=tpN[id]=(tpN[id]||0)+1,nr=ri(2,3),qrow=rnd()<.5,acs=[...Array(nr)].map(()=>{const tq=ri(5,10);return {tq,ac:ri(Math.ceil(tq/2),tq)}});
 await x.ev((k,nr,qrow,acs)=>{const s=curS(),g=S.sel.groups[0],t=Math.ceil(k/2);g.nt=s.name.split(' ')[0]+' · Assunto '+t;g.rows=[];
  for(let i=0;i<nr;i++){const last=i===nr-1&&qrow;g.rows.push({id:uid(),kind:'aula',name:last?'':'Aula '+((k-1)*3+i+1),link:'',q:'',...(last?{qo:true}:{}),...(i>0||last?{ac:String(acs[i].ac),tq:String(acs[i].tq)}:{})})}render()},k,nr,qrow,acs);
 const m=await x.ev(id=>fmt(Math.max(1,S.subjects.find(s=>s.id===id).goal-prog(id))),id);await x.fill('#modal input[name=m]',m);
 if(!shotOnce.has('registro-estudo')){shotOnce.add('registro-estudo');await shot('registro-estudo')}
 await x.submit('#modal form[data-f=man]');await W(250);st.estudo++;await blocks();return true}
/* revisões por tópico que vencem hoje */
async function topicReviews(){for(let i=0;i<30;i++){const k=await x.ev(()=>{const d=trvDue();return d[0]?d[0].k:null});if(!k)return;
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=topicos]');b&&b.click()});await W(250);
 await once('revisao-topicos');
 await x.act('trvok',k);await x.fill('#modal input[name=m]','0h'+ri(15,25));const c=await fillAc();st.acTop+=c;if(c&&!shotOnce.has('topico-registro')){shotOnce.add('topico-registro');await shot('topico-registro')}
 await x.submit('#modal form[data-f=trvok]');await W(250);st.topicos++;
 if(await x.ev(k=>trvDue().some(o=>o.k===k),k)){ok(false,'revisão de tópico registrada continua vencida: '+k);return}}}
/* revisão por ciclos: marca as aulas de cada disciplina e registra na meta, 2 por dia */
async function cycleReview(perDay){let j=0;for(let i=0;i<30;i++){const id=await x.ev(()=>{if(!S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)break;
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=ciclos]');b&&b.click()});await W(250);
 await x.ev(id=>{const s=S.subjects.find(z=>z.id===id);rvRows(s).forEach(o=>o.rows.forEach(r=>S.checked[r.k]=true));render()},id);await once('revisao-ciclos');
 await x.act('rreg',id);st.acertos+=await fillAc();if(process.env.DBG&&!shotOnce.has('revisao-ciclos-registro'))console.log('DBG',await x.ev(()=>JSON.stringify([...document.querySelectorAll('#modal input[name^=qa],#modal input[name^=qt]')].map(i=>i.name+'='+i.value+'|'+(i.offsetParent?'vis':'oculto')+'|'+(i.getAttribute('data-rq')||i.className)))));const m=await x.ev(id=>fmt(Math.max(1,S.subjects.find(s=>s.id===id).goal-prog(id))),id);await x.fill('#modal input[name=m]',m);if(process.env.DBG&&!shotOnce.has('revisao-ciclos-registro')){const g=()=>x.ev(()=>{const b=document.getElementById('regbtn');return JSON.stringify({dis:b&&b.disabled,mt:S.sel.mt,mtAuto:S.sel.mtAuto,mtMs:S.sel.mtMs,rm:regMin(),sx:S.sx,mval:document.querySelector('#modal input[name=m]').value})});console.log('DBG agora',await g());await W(1200);console.log('DBG 1,2s',await g())};
 if(!shotOnce.has('revisao-ciclos-registro')){shotOnce.add('revisao-ciclos-registro');await shot('revisao-ciclos-registro')}
 await x.submit('#modal form[data-f=man]');await W(250);if(++j>=perDay&&await x.ev(()=>actives().some(s=>!gDone(s))))return false}
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=ciclos]');b&&b.click()});await W(250);await x.ev(()=>scrollTo(0,0));await once('revisao-ciclos-concluir');
 if(await vis('rvend')){await W(400);st.ciclosRev++;await once('revisao-ciclos-fim');return true}return false}
/* revisão por grupos: o grupo disponível mais antigo, no dia em que fica disponível */
async function groupReview(){await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=hoje]');b&&b.click()});await W(250);
 const g=await x.ev(()=>{const o=rgInfo().list.find(o=>o.st==='disponivel');return o?o.g.id:null});if(!g)return false;
 await once('grupo-disponivel');await x.act('rvstart',g);ok(await x.ev(()=>S.type==='review'&&!!S.rv),'grupo '+g+': revisão iniciada');
 for(let i=0;i<12;i++){const id=await x.ev(()=>{if(!S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)break;
  await x.ev(id=>{const s=S.subjects.find(z=>z.id===id);rvRows(s).forEach(o=>o.rows.forEach(r=>S.checked[r.k]=true));render()},id);await once('grupo-revisando');
  await x.act('rreg',id);st.acertos+=await fillAc();const m=await x.ev(id=>fmt(Math.max(1,S.subjects.find(s=>s.id===id).goal-prog(id))),id);await x.fill('#modal input[name=m]',m);await x.submit('#modal form[data-f=man]');await W(250)}
 if(await x.ev(()=>!!S.rv)){await vis('rvend');await W(400)}
 const done=await x.ev(g=>!S.rv&&S.reviewed&&!!S.reviewed[g],g);ok(done,'grupo '+g+' revisado');if(done)st.grupos++;await once('grupo-fim');return done}
/* coerência a cada dia */
async function check(d){const c=await x.ev(()=>{const ids=S.sessions.map(s=>s.id),dup=ids.length-new Set(ids).size,late=trvDue().filter(o=>o.due<today()).length,neg=Object.values(S.progress||{}).some(v=>v<0),orf=S.sessions.filter(s=>s.topic&&!S.subjects.some(x=>x.id===s.subj&&(x.topics||[]).some(t=>t.id===s.topic))&&!s.trv&&!s.tdel).length;return {dup,late,neg,orf,cy:S.cycle,mode:S.mode,type:S.type}});
 if(c.dup||c.neg)ok(false,'dia '+d+': '+JSON.stringify(c));return c}
const info0=await x.ev(()=>({cy:S.cycle,n:inCycle().length,nomes:inCycle().map(s=>s.name),blk:blkL().length,tv:tvOn(),rg:rgOn(),cyo:cyOn()}));
info('início: ciclo '+info0.cy+', '+info0.n+' sessões no ciclo ('+info0.nomes.join(', ')+'), '+info0.blk+' pontos de revisão; tópico '+(info0.tv?'ligada':'desligada'));
/* liga o sistema do modo e a revisão por tópico */
await tabTo('rev');await x.act('rvadj');
await x.ev(m=>{const sw=k=>document.querySelector(`[data-act=rvsys][data-id=${k}]`),on=k=>sw(k).getAttribute('aria-checked')==='true';if(m==='ciclos'&&!on('c'))sw('c').click();if(m==='grupos'&&!on('g'))sw('g').click()},MODE);await W(300);
await x.ev(()=>{const sw=document.querySelector('[data-act=rvsys][data-id=t]');if(sw.getAttribute('aria-checked')!=='true')sw.click()});await W(300);
if(SRV){await x.ev(()=>{const sw=document.querySelector('[data-act=rvsys][data-id=s]');if(sw.getAttribute('aria-checked')!=='true')sw.click()});await W(300);ok(await x.ev(()=>srOn()&&srN()===2&&srY()===3),'revisão por sessões ligada (a cada 2 sessões, até 3 revisões)')}
if(MODE==='ciclos'){ok(await x.ev(n=>cyOn()&&cyN()===n&&!rgOn()&&tvOn(),+(process.env.CYN||5)),'por ciclos (a cada '+(await x.ev(()=>cyN()))+') e por tópico ligadas')}
else ok(await x.ev(()=>rgOn()&&!cyOn()&&tvOn()),'por grupos ('+(await x.ev(()=>rvInt()+' dias, revisar '+rvWait()+' depois'))+') e por tópico ligadas');
await shot('ajustes');await x.ev(()=>{const c=document.querySelector('#modal [data-act=rvadjx]');c&&c.click()});await W(300);
const c00=info0.cy;let crDone=false;
for(let d=1;d<=+ND;d++){st.dias=d;
 await topicReviews();await lateReviews();
 if(MODE==='grupos'&&await groupReview()){await check(d);await x.days(1);continue}
 if(MODE==='ciclos'&&await x.ev(()=>!!(S.rv&&S.rv.cy))){if(await cycleReview(2))crDone=true;await check(d);await x.days(1);continue}
 for(let s=0;s<2;s++){const did=await study();if(!did){await tabTo('ciclo');const nx=await x.ev(()=>{const b=document.querySelector('[data-act=next]');return b&&b.offsetParent?b.textContent:null});
   if(nx){if(/revisão/.test(nx))await once('ciclo-pede-revisao');await x.act('next');await W(400);if(/revisão/.test(nx)){info('dia '+d+': começa o ciclo de revisão '+JSON.stringify(await x.ev(()=>S.rv&&S.rv.src)));break}s--}else break}}
 const c=await check(d);if(d===3)await once('ciclo-dia3');if(d===10){await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=hoje]');b&&b.click()});await W(250);await once('revisao-hoje-dia10')}
 await x.days(1)}
const fim=await x.ev(()=>({cy:S.cycle,ses:S.sessions.filter(s=>!s.review).length,rev:S.sessions.filter(s=>s.review).length,trvAg:trvList().length,due:trvDue().length,late:trvDue().filter(o=>o.due<today()).length,cyLast:S.cyrv&&S.cyrv.last,rv:!!S.rv}));
info('fim: '+JSON.stringify(fim));info('contagem: '+JSON.stringify(st));
if(MODE==='ciclos'){const NN=+(process.env.CYN||5);ok(crDone,'fez o ciclo de revisão (ciclos '+(c00)+' a '+(c00+NN-1)+')');ok(fim.cyLast>=c00+NN-1,'última revisão por ciclos cobre até o ciclo '+fim.cyLast)}else ok(st.grupos>=1,'fez '+st.grupos+' revisão(ões) de grupo');
if(SRV){ok(st.sessoes>0,'fez '+st.sessoes+' revisões por sessões ('+st.sessMk+' de '+st.sessLista+' itens marcados, '+(st.atras||0)+' de atrasadas com '+(st.atrasIt||0)+' itens, '+st.sessPul+' puladas, '+st.sessAc+' com acertos por aula); '+st.sessConc+' itens com ✓ na disciplina com mais');
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=sessoes]');b&&b.click()});await W(300);await shot('sessoes-aba',true);
 ok(await x.ev(()=>!!document.querySelector('.srsc')),'aba Sessões com as disciplinas')}
ok(st.topicos>0,'fez '+st.topicos+' revisões por tópico ('+st.acTop+' com acertos por aula)');ok(fim.late===0,'nenhuma revisão por tópico atrasada');
await tabTo('reg');await once('historico');await x.ev(()=>{const b=[...document.querySelectorAll('#app button')].find(b=>b.offsetParent&&b.textContent.trim()==='Ciclos');b&&b.click()});await W(300);await shot('historico-ciclos');
await tabTo('st');await once('estatisticas');await shot('estatisticas-pagina',true);
await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvcalm]');b&&b.click()});await W(400);await shot('calendario');
ok(!errs.length,'sem erros na página '+JSON.stringify(errs.slice(0,3)));fs.writeFileSync(OUT+'/estado-final.json',await x.ev(()=>JSON.stringify(S)));
await b.close();console.log(log.join('\n'));console.log(log.some(l=>l.startsWith('FALHA'))?'COM FALHAS':'TUDO OK');
