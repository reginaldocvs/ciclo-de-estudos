/* Simulação realista com os dados reais (cópia): 2 sessões por dia, cada uma com 1 tópico e 2 a 3 aulas/questões (com acertos),
   pontos de revisão do ciclo, revisões por tópico no dia em que vencem e, conforme o modo:
   ciclos: revisão por ciclos a cada 5 (5 ciclos de estudo + ciclo de revisão);  grupos: revisão por grupos (grupo disponível = feito no dia).
   PLANOS=2: cria um 2º plano (4 disciplinas, ponto de revisão, o outro sistema: grupos ↔ ciclos a cada 2) e alterna os planos a cada dia pela tela Planos;
   confere que cada plano volta igual ao que foi deixado, que nada de um aparece no outro, cronômetro e Desfazer na troca.
   Uso: [SRV=1|RQ=1] [PLANOS=2] node lint/simreal.mjs <dados.json> <saída> <ciclos|grupos> [dias=24] [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,MODE0='ciclos',ND='24',WD='390']=process.argv.slice(2);const w=+WD;let MODE=MODE0;const P2=process.env.PLANOS==='2';
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
const st={rqJan:0,rqMax:0,rqReg:0,rqPul:0,rqDep:0,rqAc:0,rqHoje:0,rqAdv:0,dias:0,estudo:0,blocos:0,topicos:0,acTop:0,ciclosRev:0,grupos:0,acertos:0,sessoes:0,sessPul:0,sessAc:0,sessConc:0};
const SRV=!!process.env.SRV;
/* revisão por sessões (SRV=1): na vez da disciplina, o cartão do Ciclo; registra (com acertos e tempo) ou, às vezes, pula.
   Confere: só aparece com N sessões novas, cada item listado ganha +1, nenhum passa de Y, e depois sai da vez */
async function srvReview(id){if(!SRV)return;/* repetição da disciplina no ciclo (cópia): a revisão por sessões é da original */id=await x.ev(id=>{const s=subjAny(id);return s&&s.of||id},id);const a=await x.ev(id=>({due:srDue(id),nw:srNew(id).length,n:srN(),y:srY(),cnt:Object.fromEntries(srItems(id).flatMap(t=>t.its.map(z=>[z.k,z.n]))),todo:srTodo(id).flatMap(t=>t.its.map(z=>z.k)),cov:srSplit(id).cov.reduce((a,t)=>a+t.its.length,0),card:!!document.querySelector('#app .srvc'),tags:[...document.querySelectorAll('#app .srvc .srn')].map(e=>e.textContent)}),id);
 if(a.due!==(a.nw>=a.n&&a.todo.length>0))ok(false,'sessões: disponível fora da regra '+JSON.stringify({due:a.due,nw:a.nw}));
 if(Object.values(a.cnt).some(v=>v>a.y))ok(false,'sessões: item com mais de '+a.y+' revisões');
 if(!a.due&&a.nw>=a.n&&a.cov)st.srCob=(st.srCob||0)+1; /* vez em que outra revisão (bloco, tópico, grupo) já cobriu a rodada */
 if(!a.due){if(a.card)ok(false,'sessões: cartão sem revisão disponível '+JSON.stringify({id,nw:a.nw,todo:a.todo.length,cs:await x.ev(()=>{const c=document.querySelector('#app .srvc');return c&&c.innerText.slice(0,160)}),cur:await x.ev(()=>{const c=current();return c&&[c.id,c.of||'',S.sel.subj]})}));return}
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
 if(!(await x.ev(id=>!!document.querySelector(`.srlate [data-act=srreg][data-id="${id}"]`),id))){ok(false,'atrasadas: seção sem o botão Registrar');return}/* fora da vez a lista vem fechada: abre */await x.ev(id=>{const c=[...document.querySelectorAll('.srsc')].find(e=>e.querySelector(`.srlate [data-act=srreg][data-id="${id}"]`));const t=c&&c.querySelector('.srlate .srtg');if(t&&t.getAttribute('aria-expanded')==='false')t.click()},id);await W(200);
 await once('sessoes-atrasadas');
 const nb=await x.ev(id=>[...document.querySelectorAll('.srlate input[data-srk]')].length,id);for(let i=0;i<nb;i++)if(rnd()<.5||i===0){await x.ev(i=>{const e=document.querySelectorAll('.srlate input[data-srk]')[i];e&&e.click()},i);await W(120)}
 const mk=await x.ev(id=>srMkT(id).flatMap(t=>t.its.map(z=>z.k)),id);if(mk.some(k=>!a.late.includes(k)))ok(false,'atrasadas: marcada fora da lista de atrasadas');
 await x.ev(id=>document.querySelector(`.srlate [data-act=srreg][data-id="${id}"]`).click(),id);await W(300);await x.submit('#modal form[data-f=srreg]');await W(300);st.atras=(st.atras||0)+1;st.atrasIt=(st.atrasIt||0)+mk.length;
 const z=await x.ev(id=>({cnt:Object.fromEntries((({todo,fin})=>todo.concat(fin))(srSplit(id)).flatMap(t=>t.its.map(z=>[z.k,z.n]))),nw:srNew(id).length,due:srDue(id),late:srLate(id).flatMap(t=>t.its.map(z=>z.k))}),id);
 const M=new Set(mk),bad=Object.keys(a.cnt).filter(k=>z.cnt[k]!==a.cnt[k]+(M.has(k)?1:0));if(bad.length)ok(false,'atrasadas: contagem errada '+bad.slice(0,3).join());
 if(z.nw!==a.nw||z.due)ok(false,'atrasadas: pôr em dia mexeu nas sessões novas ou deixou disponível');if(z.late.some(k=>M.has(k)))ok(false,'atrasadas: marcada continua atrasada')}
const RQ=!!process.env.RQ;
/* revisão por questões (RQ=1): a janela logo depois do estudo; registra com acertos (60%), pula (20%) ou deixa para depois (20%); confere a regra a cada sessão */
async function rqAfter(id){if(!RQ)return;const b=await x.ev(id=>{const s=subjAny(id);return s&&s.of||id},id);
 const a=await x.ev(b=>{const L=rqSes(b),iv=rqIv();return {n:L.length,iv,D:rqDue(b).map(z=>({m:z.m,ks:z.ks})),open:!!document.querySelector('#undo [data-act=rqreg]'),k:L.length?L[L.length-1].k:null}},b);
 const bad=a.D.filter(z=>!z.ks.every(k=>z.m+a.iv[k]<=a.n));if(bad.length)ok(false,'rq: revisão antes da hora '+JSON.stringify(bad));
 if(a.D.length&&!a.open)ok(false,'rq: havia revisão e não veio o aviso com Revisar');if(!a.D.length&&a.open)ok(false,'rq: aviso sem revisão');
 if(await x.ev(()=>!!document.querySelector('[data-f=rqreg]')))ok(false,'rq: a janela abriu sozinha depois de registrar');
 if(!a.open)return;await x.ev(()=>document.querySelector('#undo [data-act=rqreg]').click());await W(250);st.rqJan++;st.rqMax=Math.max(st.rqMax,a.D.length);await once('rq-janela');
 await rqAct(b,'janela')}
async function rqAct(b,why){const r=rnd();
 if(r<.6){const c=await x.ev(()=>{const f=document.querySelector('[data-f=rqreg]');let c=0;f.querySelectorAll('input[name^=qa-]').forEach(i=>{if(Math.random()<.7){const t=f.querySelector('[name="'+i.name.replace('qa-','qt-')+'"]');const tq=+t.value||10;t.value=tq;i.value=Math.ceil(tq*.6);c++}});return c});
  await x.submit('#modal form[data-f=rqreg]');await W(250);st.rqReg++;st.rqAc+=c;const z=await x.ev(b=>({d:rqDue(b).length,open:!!document.querySelector('[data-f=rqreg]')}),b);if(z.d||z.open)ok(false,'rq ('+why+'): registrar deixou pendente '+JSON.stringify(z))}
 else if(r<.8){await x.act('rqskip');st.rqPul++;if(await x.ev(b=>rqDue(b).length,b))ok(false,'rq ('+why+'): pular deixou pendente')}
 else{await x.act('rqregx');st.rqDep++;if(!await x.ev(b=>rqDue(b).length,b))ok(false,'rq ('+why+'): depois não deixou pendente')}}
/* pendentes (RQ=1): às vezes, pelo Para hoje */
async function rqToday(){if(!RQ||rnd()>.4)return;const ids=await x.ev(()=>rqSubs().filter(s=>rqDue(s.id).length).map(s=>s.id));if(!ids.length)return;
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=hoje]');b&&b.click()});await W(250);await x.ev(()=>{ui.pg={...(ui.pg||{}),hoje:99};render()});await W(150);
 const id=ids[0];if(!await x.ev(id=>{const e=document.querySelector(`.rvtoday [data-act=rqreg][data-id="${id}"]`);if(e){e.click();return true}return false},id)){ok(false,'rq: pendente sem "Revisar" no Para hoje');return}
 await W(300);await once('rq-para-hoje');st.rqHoje++;await rqAct(id,'para hoje')}
/* durante a sessão (RQ=1): às vezes revisa antes de registrar, pelo botão do cartão Agora; o que vem com a sessão fica feito */
async function rqDuring(id){if(!RQ||rnd()>.35)return;const has=await x.ev(()=>{const e=[...document.querySelectorAll('#app [data-act=rqnow]')].find(e=>e.offsetParent);if(e){e.click();return true}return false});if(!has)return;await W(250);
 const b=await x.ev(id=>{const s=subjAny(id);return s&&s.of||id},id),z=await x.ev(()=>{const d=document.querySelector('[data-f=rqreg]');return d?{sub:d.closest('.dlg').querySelector('.trvok .mut').textContent,tempo:!!d.querySelector('[name=m]')}:null});
 if(!z||!/durante a sessão/.test(z.sub)||z.tempo){ok(false,'rq: janela do Agora sem "durante a sessão" ou com tempo '+JSON.stringify(z));return}
 await once('rq-agora');st.rqDur=(st.rqDur||0)+1;const r=rnd();
 if(r<.75){await x.ev(()=>{const f=document.querySelector('[data-f=rqreg]');f.querySelectorAll('input[name^=qa-]').forEach(i=>{const t=f.querySelector('[name="'+i.name.replace('qa-','qt-')+'"]');t.value=+t.value||10;i.value=Math.ceil(+t.value*.7)})});await x.submit('#modal form[data-f=rqreg]');await W(250);st.rqReg++;
  if(await x.ev(b=>rqDue(b,true).length,b))ok(false,'rq: registrar no Agora deixou pendente para esta sessão')}
 else await x.act('rqregx')}
/* uma sessão de estudo: 1 tópico (novo a cada 2 sessões da disciplina) com 2 a 3 aulas/questões */
const tpN={};
async function study(){await tabTo('ciclo');await blocks();
 const id=await x.ev(()=>{if(S.type==='review'||S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)return false;
 await srvReview(id);await rqDuring(id);
 await x.act('rreg',id);const k=tpN[id]=(tpN[id]||0)+1,nr=ri(2,3),qrow=rnd()<.5,acs=[...Array(nr)].map(()=>{const tq=ri(5,10);return {tq,ac:ri(Math.ceil(tq/2),tq)}});
 await x.ev((k,nr,qrow,acs)=>{const s=curS(),g=S.sel.groups[0],t=Math.ceil(k/2);g.nt=s.name.split(' ')[0]+' · Assunto '+t;g.rows=[];
  for(let i=0;i<nr;i++){const last=i===nr-1&&qrow;g.rows.push({id:uid(),kind:'aula',name:last?'':'Aula '+((k-1)*3+i+1),link:'',q:i>0||last?'Apostila p. '+((k-1)*3+i+1):'',...(last?{qo:true}:{}),...(i>0||last?{ac:String(acs[i].ac),tq:String(acs[i].tq)}:{})})}render()},k,nr,qrow,acs);
 const m=await x.ev(id=>fmt(Math.max(1,S.subjects.find(s=>s.id===id).goal-prog(id))),id);await x.fill('#modal input[name=m]',m);
 if(!shotOnce.has('registro-estudo')){shotOnce.add('registro-estudo');await shot('registro-estudo')}
 await x.submit('#modal form[data-f=man]');await W(250);st.estudo++;await rqAfter(id);await blocks();return true}
/* revisões por tópico que vencem hoje */
/* caderno na revisão por tópico (desde 2026-11-27): liga um caderno de teste à sessão de estudo de algumas revisões; na janela Registrar, às vezes muda
   o número (− / +), resolve, confere o placar e, ao registrar, o registro (qtipo 't') e a fatia fixa; confere que a revisão por questões não mudou */
const TQV={cad:0,res:0,reg:0};
async function tqSim(k){const r=await x.ev(k=>{const o=trvList().find(o=>o.k===k);if(!o)return null;const b=o.s.of||o.s.id,K=S.sessions.filter(x=>!x.review&&!x.rid&&!x.trv&&x.topic===o.tp.id&&x.date===o.sd&&trvBase(x.subj)===b).map(x=>x.ses||x.id);
  let made=0;if(K[0]&&!qCadOf(K[0])&&Math.random()<.5){const qs=Array.from({length:15},(_,i)=>({id:uid(),n:i+1,dis:'',tp:i%2?'A':'B',t:'CE',tb:null,cm:'',en:'Sim tópico '+k+' '+i,al:null,g:'C',c:{}}));const cid=uid();qcL().push({id:cid,subj:b,ses:K[0],nome:'Sim tópico',n:15,ce:15,me:0,d:today()});qSave(cid,{qs});made=1;save();render()}
  const U=trvQ(o);return {made,u:U.length,i:o.n,q:U[0]?qPartsOf(U[0].cid,'q').map(L=>L.length).join():''}},k);
 if(!r)return;TQV.cad+=r.made;if(!r.u)return;const f=await x.ev(()=>!!document.querySelector('#modal .tqcad [data-act=tqgo]'));ok(f,'revisão por tópico: a janela Registrar tem a linha do caderno');if(!f||Math.random()<.3)return;
 const d=ri(-1,2);for(let j=0;j<Math.abs(d);j++){await x.ev(dd=>{const e=document.querySelector(`#modal .tqcad [data-act=qns][data-d="${dd}"]`);e&&!e.disabled&&e.click()},d<0?-1:1);await W(80)}
 await x.ev(()=>document.querySelector('#modal .tqcad [data-act=tqgo]').click());await W(250);const n=await x.ev(()=>ui.qz?ui.qz.ids.length:0);
 for(let i=0;i<n;i++){await x.ev(()=>qAns(Math.random()<.7?'C':'E'));await W(30);await x.ev(()=>document.querySelector('.qznav [data-act=qnext]')?.click());await W(40)}
 await x.ev(()=>{ui.qz=null;render()});await W(250);const sc=await x.ev(()=>/✓ \d+\/\d+/.test((document.querySelector('#modal .tqcad')||{}).textContent||''));ok(sc,'revisão por tópico: placar do caderno na janela');TQV.res++;return {k,i:r.i,q:r.q}}
async function tqAfter(t){if(!t)return;const c=await x.ev(t=>{const R=S.sessions.filter(x=>x.qtipo==='t'&&x.trv===t.k&&x.qpart===t.i);const m=R[0]&&qcM(R[0].qcad);return {n:R.length,fz:!!(m&&((m.pdt||{}).t||{})[t.i]),q:m?qPartsOf(m.id,'q').map(L=>L.length).join():''}},t);
 ok(c.n===1&&c.fz&&c.q===t.q,'revisão por tópico: registro do caderno, fatia fixa, e a divisão da revisão por questões igual '+JSON.stringify(c));TQV.reg++}
async function topicReviews(){for(let i=0;i<30;i++){const k=await x.ev(()=>{const d=trvDue();return d[0]?d[0].k:null});if(!k)return;
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=topicos]');b&&b.click()});await W(250);
 await once('revisao-topicos');
 /* a lista corta em 6 e agrupa por disciplina: abre tudo para achar o item */await x.ev(()=>{ui.pg={...(ui.pg||{}),trvdue:99};render()});await W(150);await x.act('trvok',k);await x.fill('#modal input[name=m]','0h'+ri(15,25));const tq=await tqSim(k);const c=await fillAc();st.acTop+=c;if(c&&!shotOnce.has('topico-registro')){shotOnce.add('topico-registro');await shot('topico-registro')}
 await x.submit('#modal form[data-f=trvok]');await W(250);st.topicos++;await tqAfter(tq);
 if(await x.ev(k=>trvDue().some(o=>o.k===k),k)){ok(false,'revisão de tópico registrada continua vencida: '+k);return}}}
/* revisão por ciclos: marca as aulas de cada disciplina e registra na meta, 2 por dia */
/* questões do caderno no ciclo de revisão (desde 2026-11-27): no começo, liga um caderno de teste à 1ª sessão de cada disciplina do período (se ela não tiver);
   em cada disciplina, confere que as partes são só de sessões do período, escolhe quais e quantas, resolve uma parte e confere o registro (qtipo 'c') e o placar */
const RVQ={cad:0,vis:0,res:0};
async function rvqSim(id){const r=await x.ev(([id,sd])=>{if(!rvqOn())return {off:1};const s=S.subjects.find(z=>z.id===id),b=s.of||s.id,G=grp(b);
  if(!S.rv.__sim){S.rv.__sim=1;let n=0;S.subjects.filter(z=>!z.of&&!gone(z)).forEach(z=>{const L=CS().filter(x=>grp(z.id).includes(x.subj)&&!x.review&&inSrc(x));const k=L[0]&&(L[0].ses||L[0].id);if(!k||qCadOf(k))return;
   const qs=Array.from({length:6},(_,i)=>({id:uid(),n:i+1,dis:'',tp:'T',t:'CE',tb:null,cm:'',en:'Sim ciclo '+z.name+' '+(i+1),al:null,g:'C',c:{}}));const cid=uid();qcL().push({id:cid,subj:z.id,ses:k,nome:'Sim ciclo '+z.name,n:6,ce:6,me:0,d:today()});qSave(cid,{qs});n++});save();render();window.__rvqn=n}
  const inW=new Set(CS().filter(x=>G.includes(x.subj)&&!x.review&&inSrc(x)).map(x=>x.ses||x.id)),U=rvqUnits(b),bad=U.filter(u=>!inW.has(u.k)).length;
  S.rv.qf=['all','err','pend'][Math.floor(Math.random()*3)];S.rv.qn=[0,5,10][Math.floor(Math.random()*3)];render();
  const U2=rvqUnits(b),over=U2.filter(u=>S.rv.qn&&u.ids.length>S.rv.qn).length,card=!!document.querySelector('.rvqcard');return {n:U.length,bad,over,card,cad:window.__rvqn||0,u:U2[0]&&U2[0].key}},[id]);
 if(r.off)return;RVQ.cad=Math.max(RVQ.cad,r.cad);ok(!r.bad&&!r.over,'ciclo de revisão: partes só de sessões do período e no limite por sessão '+JSON.stringify(r));if(r.n)RVQ.vis++;
 if(!r.u||!r.card)return;await x.ev(k=>{const e=[...document.querySelectorAll('.rvqcard [data-act=rvqgo]')].find(e=>e.dataset.id===k);e&&e.click()},r.u);await W(250);
 const n=await x.ev(()=>ui.qz?ui.qz.ids.length:0);if(!n)return;for(let i=0;i<n;i++){await x.ev(()=>qAns(Math.random()<.7?'C':'E'));await W(40);await x.ev(()=>document.querySelector('.qznav [data-act=qnext]')?.click());await W(50)}
 const c=await x.ev(k=>{const d=(S.rv.qd||{})[k],R=S.sessions.filter(x=>x.rid===S.rv.id&&x.qtipo==='c'&&x.ac===d.ok&&x.tq===d.a);ui.qz=null;render();return {d,r:R.length}},r.u);ok(c.d&&c.r>=1,'ciclo de revisão: a parte resolvida tem placar e registro '+JSON.stringify(c));RVQ.res++}
async function cycleReview(perDay){let j=0;for(let i=0;i<30;i++){const id=await x.ev(()=>{if(!S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)break;
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=ciclos]');b&&b.click()});await W(250);
 await x.ev(id=>{const s=S.subjects.find(z=>z.id===id);rvRows(s).forEach(o=>o.rows.forEach(r=>S.checked[r.k]=true));render()},id);await once('revisao-ciclos');await rvqSim(id);
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
async function setupRev(MODE,cyn){await tabTo('rev');await x.act('rvadj');
await x.ev(m=>{const sw=k=>document.querySelector(`[data-act=rvsys][data-id=${k}]`),on=k=>sw(k).getAttribute('aria-checked')==='true';if(m==='ciclos'&&!on('c'))sw('c').click();if(m==='grupos'&&!on('g'))sw('g').click()},MODE);await W(300);
await x.ev(()=>{const sw=document.querySelector('[data-act=rvsys][data-id=t]');if(sw.getAttribute('aria-checked')!=='true')sw.click()});await W(300);
if(RQ){await x.ev(()=>{const sw=document.querySelector('[data-act=rvsys][data-id=q]');if(sw.getAttribute('aria-checked')!=='true')sw.click()});await W(300);ok(await x.ev(()=>rqOn()&&!srOn()&&rqIv().join()==='1,4,8'),'revisão por questões ligada (1 · 4 · 8) e a por sessões desligada')}
if(SRV){await x.ev(()=>{const sw=document.querySelector('[data-act=rvsys][data-id=s]');if(sw.getAttribute('aria-checked')!=='true')sw.click()});await W(300);ok(await x.ev(()=>srOn()&&srN()===2&&srY()===3),'revisão por sessões ligada (a cada 2 sessões, até 3 revisões)')}
if(MODE==='ciclos'){await x.ev(n=>{if(S.cyrv&&cyN()!==n){S.cyrv.n=n;save();render()}},cyn);ok(await x.ev(n=>cyOn()&&cyN()===n&&!rgOn()&&tvOn(),cyn),'por ciclos (a cada '+(await x.ev(()=>cyN()))+') e por tópico ligadas')}
else ok(await x.ev(()=>rgOn()&&!cyOn()&&tvOn()),'por grupos ('+(await x.ev(()=>rvInt()+' dias, revisar '+rvWait()+' depois'))+') e por tópico ligadas');
await shot('ajustes');await x.ev(()=>{const c=document.querySelector('#modal [data-act=rvadjx]');c&&c.click()});await W(300);}
await setupRev(MODE,+(process.env.CYN||5));
const c00=info0.cy;let crDone=false;
/* ===== 2 planos ===== */
const pm={},last={};let PA=null,PB=null;st.trocas=0;
const fp=()=>x.ev(()=>JSON.stringify({rq:S.rq||null,ses:S.sessions.map(s=>s.id).sort(),pt:(S.srvPt||[]).map(p=>p.id).sort(),trv:Object.entries((S.trv&&S.trv.t)||{}).map(([k,v])=>k+':'+(v.h||[]).join()).sort(),bd:Object.keys(S.blkDone||{}).sort(),br:S.blkRev||{},cy:S.cycle,set:S.set||1,srv:S.srv||null,cyrv:S.cyrv?{on:!!S.cyrv.on,n:S.cyrv.n||null,last:S.cyrv.last||0}:null,rg:!!S.rvgOff,tv:!!(S.trv&&S.trv.off),rvd:Object.keys(S.reviewed||{}).sort(),rv:S.rv?S.rv.id:null,type:S.type,prog:S.progress||{},blk:(S.blk||[]).map(b=>b.id+'@'+b.pos),lay:S.subjects.filter(s=>!s.off).map(s=>s.id+':'+s.goal),mk:Object.keys(S.srMk||{}).sort(),rvp:Object.keys(S.rvp||{}).sort(),alt:S.alt&&S.alt.progress||null,tm:S.timer?Math.round((+S.timer.acc||0)/60000):0}));
const iso=()=>x.ev(()=>{const base=s=>s.of?S.subjects.find(y=>y.id===s.of)||s:s,pl=s=>{const e=S.editais.find(e=>e.id===base(s).ed);return e&&e.plan},mine=new Set(S.subjects.filter(s=>pl(s)===S.plan).map(s=>s.id));
 const fora=S.sessions.filter(x=>!mine.has(x.subj)&&!(sa=>sa&&mine.has(sa.of||sa.id))(subjAny(x.subj))); /* durante o ciclo de revisão, as repetições do ciclo de estudo ficam em S.alt.lay: subjAny acha a disciplina */if(fora.length)window.__fora=fora.slice(0,4).map(x=>({subj:x.subj,date:x.date,rev:!!x.review,rid:x.rid||null}));
 return {sessoes:fora.length,ciclo:inCycle().filter(s=>!mine.has(s.id)).length,abaSessoes:srSubs().filter(s=>!mine.has(s.id)).length,topicos:trvList().filter(o=>!mine.has(o.s.id)).length,
  tela:[...document.querySelectorAll('#app .snt')].map(e=>e.getAttribute('title')).filter(t=>t&&S.subjects.some(s=>s.name===t&&pl(s)!==S.plan)&&!S.subjects.some(s=>s.name===t&&pl(s)===S.plan)).length}});
async function plSwitch(to,why){const from=await x.ev(()=>S.plan);if(from===to)return;/* foto já na aba Ciclo: ela sai do modo revisão (o progresso da revisão fica guardado em S.alt) */await tabTo('ciclo');last[from]=await fp();
 if(await vis('fmoff'))await W(300);await x.act('plopen');await W(300);await x.act('plsw',to);await W(500);
 if(await x.ev(()=>S.plan)!==to){ok(false,'troca de plano não aconteceu ('+why+')');return}st.trocas++;MODE=pm[to];
 if(last[to]){const a=JSON.parse(last[to]),b=JSON.parse(await fp()),dif=Object.keys(a).filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));if(dif.length)ok(false,'plano voltou diferente do que foi deixado ('+why+'): '+dif.map(k=>k+' '+JSON.stringify(a[k]).slice(0,80)+' → '+JSON.stringify(b[k]).slice(0,80)).join(' | '))}
 for(const t of ['ciclo','rev','reg','st']){await tabTo(t);const i=await iso();if(Object.values(i).some(v=>v))ok(false,'dados de outro plano à vista na aba '+t+' ('+why+'): '+JSON.stringify(i)+(i.sessoes?' '+JSON.stringify(await x.ev(()=>window.__fora)):''))}
 await tabTo('rev');for(const sub of ['hoje','topicos','sessoes','ciclos','grupos']){await x.ev(s=>{const e=document.querySelector(`[data-act=rvt][data-id=${s}]`);e&&e.click()},sub);await W(150);const i=await iso();if(i.tela)ok(false,'disciplina de outro plano na Revisão/'+sub+' ('+why+')')}
 await tabTo('ciclo')}
const PLB=[['Contabilidade',['Patrimônio','Lançamentos','Balanço','DRE']],['Economia',['Oferta e demanda','Elasticidade','Inflação','Juros']],['Estatística',['Média','Desvio padrão','Probabilidade','Amostragem']],['Inglês',['Leitura','Vocabulário','Gramática','Tempos verbais']]];
if(P2){PA=await x.ev(()=>S.plan);pm[PA]=MODE0;const nA=await x.ev(()=>S.sessions.length);const MB=MODE0==='grupos'?'ciclos':'grupos';
 await tabTo('ciclo');await x.act('plopen');await W(300);await x.fill('form[data-f=plnew] input[name=n]','Plano B');await x.submit('form[data-f=plnew]');await W(400);
 for(const [nm,tops] of PLB){await x.txt('+ Nova disciplina');await x.fill('#modal input[name=n]',nm);await x.submit('#modal form');
  const sid=await x.ev(n=>S.subjects.find(s=>s.name===n&&!s.of).id,nm);await x.act('pdedit',sid);await x.act('pdaddopen',sid);await x.fill('#modal textarea[name=t]',tops.join('\n'));await x.txt('Adicionar');await x.act('pdsave',sid)}
 await x.act('plclose');await W(300);PB=await x.ev(()=>S.plan);pm[PB]=MB;
 ok(PB!==PA&&await x.ev(()=>inCycle().length===4&&S.sessions.length===0),'Plano B criado pela tela Planos, com 4 disciplinas e sem registros');
 await tabTo('ciclo');await x.act('edopen');await x.act('blkadd');await x.ev(()=>{S.blk[0].pos=2;save();render()});await x.act('edclose');
 MODE=MB;await setupRev(MB,2);await once('plano-b-ciclo');
 const i=await iso();ok(!Object.values(i).some(v=>v),'Plano B não mostra nada do Plano A '+JSON.stringify(i));
 ok(await x.ev((a,n)=>{const d=S.planData[a];return !!d&&d.sessions.length===n},PA,nA),'Plano A guardado com os '+nA+' registros dele enquanto o B está aberto');
 info('Plano A: '+MODE0+'; Plano B: '+MB+(MB==='ciclos'?' (a cada 2 ciclos)':'')+', revisão por tópico'+(SRV?' e por sessões':'')+' nos dois')}

let tmChk=null,tmDay=0;
for(let d=1;d<=+ND;d++){st.dias=d;
 if(P2){const to=d%2?PA:PB;
  if(!tmDay&&d>=4){await tabTo('ciclo')}
  if(!tmDay&&d>=4&&await x.ev(()=>{const e=document.querySelector('.nwplay');return !!(e&&e.offsetParent)})){tmDay=d;/* estudo pelo foco, sair (fica em pausa) e trocar de plano: o que sai guarda o tempo; o que entra não tem nada */await x.ev(()=>{const e=document.querySelector('.nwplay');e&&e.click();const b=document.querySelector('.fmd [data-act=tstart]');if(S.sx===true&&!S.timer.running&&!el()&&b)b.click()});await W(300);await x.ev(()=>{if(S.timer.running){S.timer.start=Date.now()-7*60000;save()}});await vis('fmoff');await W(300);tmChk=await x.ev(()=>({pl:S.plan,s:selId()}))}
  await plSwitch(to,'dia '+d);
  if(tmDay===d){/* sair do foco guarda o tempo em S.paused ("Estudo em pausa") */const t=await x.ev(c=>{const d=S.planData[c.pl]||{},ms=o=>Object.values(o||{}).reduce((a,v)=>a+(+(v&&v.ms!=null?v.ms:v)||0),0);return {run:S.timer.running,cur:ms(S.paused)+(+S.timer.acc||0),old:ms(d.paused),oldRun:!!(d.timer&&d.timer.running)}},tmChk);ok(!t.run&&!t.cur&&!t.oldRun&&t.old>=6.5*60000,'cronômetro na troca: o plano que saiu guarda ~7 min em pausa, o que entrou não tem tempo nenhum '+JSON.stringify(t))}
  if(tmDay&&d===tmDay+1){await tabTo('ciclo');const t=await x.ev(s=>({run:S.timer.running,ms:pzMs(s),txt:document.querySelector('#app .now .mut')&&document.querySelector('#app .now .mut').textContent}),tmChk.s);ok(!t.run&&t.ms>=6.5*60000,'ao voltar, o tempo do plano está lá, em pausa '+JSON.stringify({min:Math.round(t.ms/60000),tela:t.txt}))}}
 await topicReviews();await lateReviews();await rqToday();
 if(MODE==='grupos'&&await groupReview()){await check(d);await x.days(1);continue}
 if(MODE==='ciclos'&&await x.ev(()=>!!(S.rv&&S.rv.cy))){if(await cycleReview(2))crDone=true;await check(d);await x.days(1);continue}
 for(let s=0;s<2;s++){const did=await study();if(!did){await tabTo('ciclo');const nx=await x.ev(()=>{const b=document.querySelector('[data-act=next]');return b&&b.offsetParent?b.textContent:null});
   if(nx){if(/revisão/.test(nx))await once('ciclo-pede-revisao');await x.act('next');await W(400);if(/revisão/.test(nx)){info('dia '+d+': começa o ciclo de revisão '+JSON.stringify(await x.ev(()=>S.rv&&S.rv.src)));break}s--}else break}}
 if(P2&&d===6){/* registra e troca de plano com o aviso de Desfazer ainda na tela */const pl0=await x.ev(()=>S.plan),tot=async()=>x.ev(()=>{const o=Object.entries(S.planData).map(([k,v])=>[k,(v.sessions||[]).length]);return Object.fromEntries([[S.plan,S.sessions.length],...o])});
  const did=await study();const before=await tot(),oth=pl0===PA?PB:PA;await x.act('plopen');await W(200);await x.act('plsw',oth);await W(400);
  const u=await x.ev(()=>{const b=[...document.querySelectorAll('button')].find(b=>/^Desfazer/.test(b.textContent.trim())&&b.offsetParent);if(b){b.click();return true}return false});await W(400);
  const after=await tot(),cur=await x.ev(()=>S.plan),ids=await x.ev(()=>{const a=[S.sessions,...Object.values(S.planData).map(v=>v.sessions||[])].flat().map(s=>s.id);return a.length-new Set(a).size});
  info('Desfazer depois de trocar de plano: '+(u?'aviso ainda na tela e tocado':'aviso some na troca')+'; registros '+JSON.stringify(before)+' → '+JSON.stringify(after)+'; plano aberto '+(cur===pl0?'o de antes':'o novo'));
  ok(did&&!ids&&(before[oth]===after[oth])&&(after[pl0]>=before[pl0]-1),'Desfazer depois de trocar de plano não apaga nem duplica registros do outro plano');
  if(cur!==pl0){MODE=pm[cur]}if(await x.ev(()=>S.plan)!==pl0){await x.act('plopen');await W(200);await x.act('plsw',pl0);await W(400);MODE=pm[pl0]}}
 const c=await check(d);if(d===3)await once('ciclo-dia3');if(d===10){await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=hoje]');b&&b.click()});await W(250);await once('revisao-hoje-dia10')}
 await x.days(1)}
if(P2){for(const pl of [PA,PB]){await plSwitch(pl,'fim');await topicReviews();const f=await x.ev(()=>({nome:S.plans.find(p=>p.id===S.plan).name,cy:S.cycle,ses:S.sessions.filter(s=>!s.review).length,rev:S.sessions.filter(s=>s.review).length,sr:(S.srvPt||[]).length,late:trvDue().filter(o=>o.due<today()).length}));info('fim '+f.nome+': '+JSON.stringify(f));ok(f.ses>0&&f.late===0,f.nome+': estudou ('+f.ses+' registros) e sem revisão por tópico atrasada')}
 ok(st.trocas>=+ND-1,'trocou de plano '+st.trocas+' vezes')}
const fim=await x.ev(()=>({cy:S.cycle,ses:S.sessions.filter(s=>!s.review).length,rev:S.sessions.filter(s=>s.review).length,trvAg:trvList().length,due:trvDue().length,late:trvDue().filter(o=>o.due<today()).length,cyLast:S.cyrv&&S.cyrv.last,rv:!!S.rv}));
info('fim: '+JSON.stringify(fim));info('contagem: '+JSON.stringify(st));
if(P2){ok(crDone,'plano por ciclos fez o ciclo de revisão');ok(st.grupos>=1,'plano por grupos fez '+st.grupos+' revisão(ões) de grupo')}else if(MODE==='ciclos'){const NN=+(process.env.CYN||5);ok(crDone,'fez o ciclo de revisão (ciclos '+(c00)+' a '+(c00+NN-1)+')');ok(fim.cyLast>=c00+NN-1,'última revisão por ciclos cobre até o ciclo '+fim.cyLast);ok(RVQ.cad>0&&RVQ.res>0,'questões do caderno no ciclo de revisão: '+JSON.stringify(RVQ))}else ok(st.grupos>=1,'fez '+st.grupos+' revisão(ões) de grupo');
if(SRV){ok(st.sessoes>0||st.srCob>0,'fez '+st.sessoes+' revisões por sessões; '+(st.srCob||0)+' vezes a rodada já estava coberta por outra revisão ('+st.sessMk+' de '+st.sessLista+' itens marcados, '+(st.atras||0)+' de atrasadas com '+(st.atrasIt||0)+' itens, '+st.sessPul+' puladas, '+st.sessAc+' com acertos por aula); '+st.sessConc+' itens com ✓ na disciplina com mais');
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=sessoes]');b&&b.click()});await W(300);await shot('sessoes-aba',true);
 ok(await x.ev(()=>!!document.querySelector('.srsc')),'aba Sessões com as disciplinas')}
if(RQ){const c=await x.ev(()=>{const B=rqSubs(),cnt=b=>new Set(S.sessions.filter(x=>!x.review&&!x.rid&&!x.trv&&!x.tdel&&x.date&&srBase(x)&&srBase(x).id===b).map(x=>x.ses||x.id)).size;return {difs:B.filter(s=>rqSes(s.id).length!==cnt(s.id)).map(s=>s.name),reg:S.sessions.filter(x=>kindOf(x)==='q').length,pend:B.reduce((a,s)=>a+rqDue(s.id).length,0),adv:B.find(s=>rqInfo(s.id).rows.some(r=>r.vz.some(v=>v.st==='fu')))?.id||null}});
 ok(!c.difs.length,'rq: a numeração de cada disciplina bate com as sessões de estudo dela '+JSON.stringify(c.difs));
 ok(st.rqJan>0&&st.rqReg>0&&c.reg>0,'rq: '+st.rqJan+' janelas depois do estudo (até '+st.rqMax+' sessões numa), '+st.rqReg+' registradas ('+st.rqAc+' aulas com acertos), '+st.rqPul+' puladas, '+st.rqDep+' para depois, '+st.rqHoje+' pelo Para hoje, '+(st.rqDur||0)+' durante a sessão (Agora); '+c.reg+' registros "rev. questões"; '+c.pend+' pendentes no fim');
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=questoes]');b&&b.click()});await W(300);await shot('questoes-aba',true);
 ok(await x.ev(()=>!!document.querySelector('.rqsc')),'aba Questões com as disciplinas');
 if(c.adv){await x.ev(id=>{ui.open.add('rqs:'+id);render()},c.adv);await W(200);await x.ev(id=>{const e=document.querySelector(`[data-act=rqadv][data-id="${id}"]`);e&&e.click()},c.adv);await W(300);
  const n0=await x.ev(id=>rqInfo(id).rows.filter(r=>r.vz.some(v=>v.st==='fu')).length,c.adv);await shot('questoes-adiantar');await x.submit('#modal form[data-f=rqreg]');await W(300);
  const z=await x.ev(id=>({pend:rqDue(id).length,open:!!document.querySelector('[data-f=rqreg]')}),c.adv);ok(!z.pend&&!z.open,'rq: Adiantar registrou tudo ('+n0+' sessões com revisões futuras) '+JSON.stringify(z))}}
ok(st.topicos>0,'fez '+st.topicos+' revisões por tópico ('+st.acTop+' com acertos por aula)');ok(TQV.cad>0&&TQV.reg>0,'caderno na revisão por tópico: '+JSON.stringify(TQV));ok(fim.late===0,'nenhuma revisão por tópico atrasada');
await tabTo('reg');await once('historico');await x.ev(()=>{const b=[...document.querySelectorAll('#app button')].find(b=>b.offsetParent&&b.textContent.trim()==='Ciclos');b&&b.click()});await W(300);await shot('historico-ciclos');
await tabTo('st');await once('estatisticas');await shot('estatisticas-pagina',true);
await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvcalm]');b&&b.click()});await W(400);await shot('calendario');
ok(!errs.length,'sem erros na página '+JSON.stringify(errs.slice(0,3)));fs.writeFileSync(OUT+'/estado-final.json',await x.ev(()=>JSON.stringify(S)));
await b.close();console.log(log.join('\n'));console.log(log.some(l=>l.startsWith('FALHA'))?'COM FALHAS':'TUDO OK');
