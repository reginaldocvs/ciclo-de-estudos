/* Questões do caderno no ciclo de revisão (etapa 1):
   - durante o ciclo de revisão, a disciplina da vez tem o cartão "Questões do caderno", com as sessões do período que têm caderno;
   - "Quais" (todas, só as que errei, só as que faltam) e "Quantas por sessão" (todas, até 5/10/20; primeiro as erradas, depois as nunca feitas);
   - resolver: ao terminar, o placar aparece na parte e vira um registro da revisão (qtipo 'c'); refazer troca o registro, não duplica;
   - o Desempenho do caderno diz "Revisão por ciclos"; sessão fora do período não entra.
   Uso: node lint/qzrvc.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qh;S0.qfim={rv:false,cad:false};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const J=n=>JSON.stringify(Array.from({length:n},(_,i)=>({numero:i+1,disciplina:'X',topico:i%2?'Assunto B':'Assunto A',tipo:'CE',enunciado:'Ciclo item '+(i+1)+'.',gabarito:'C'})));
/* sessões da disciplina A nos ciclos 1 e 2 (período da revisão) e no 3 (fora); caderno ligado à do ciclo 1; q1 errada e q2 certa antes */
const D=await ev(j=>{const s=qSubs()[0];S.cyrv={on:true,n:2,last:0};S.cycle=3;S.set=S.set||1;S.rv=null;S.mode='study';
 const t=(s.topics=s.topics||[])[0]||(s.topics.push({id:'tc1',name:'Tópico do ciclo',done:false,links:[]}),s.topics[0]);
 const mkS=(cy,k)=>S.sessions.push({id:k,ses:k,subj:s.id,topic:t.id,min:30,cycle:cy,set:S.set,review:false,kind:'aula',date:addD(today(),-10+cy),items:[{kind:'aula',name:'Aula '+k,link:''}]});
 mkS(1,'cs1');mkS(2,'cs2');mkS(3,'cs3');
 const P=qPrev({txt:j}),id=uid();qcL().push({id,subj:s.id,ses:'cs1',nome:'Caderno do ciclo',n:P.qs.length,ce:P.qs.length,me:0,d:today()});qSave(id,{qs:P.qs});
 const id3=uid(),P3=qPrev({txt:j.replace(/Ciclo item/g,'Fora item')});qcL().push({id:id3,subj:s.id,ses:'cs3',nome:'Caderno fora',n:P3.qs.length,ce:P3.qs.length,me:0,d:today()});qSave(id3,{qs:P3.qs});
 const Q=qLoad(id).qs;S.qa={[id]:{[Q[0].id]:[{d:addD(today(),-3),r:'E',ok:false}],[Q[1].id]:[{d:addD(today(),-3),r:'C',ok:true}]}};
 save();cyStart();save();render();return {sid:s.id,cid:id,q:Q.map(q=>q.id)}},J(7));
await ev(()=>{document.querySelector('nav [data-tab=rev]').click()});await W(300);
await ev(sid=>{S.sel.subj=sid;render()},D.sid);await W(250);
const card=()=>ev(()=>{const c=document.querySelector('.rvqcard');return c?{t:c.innerText.replace(/\s+/g,' '),u:[...c.querySelectorAll('[data-act=rvqgo].qzplay')].map(e=>e.dataset.id),n:c.querySelectorAll('.cstp').length}:null});
let r=await card();ok(r&&/Questões do caderno de/.test(r.t)&&r.u.length===1&&/0 de 1 sessão feita · 7 questões/.test(r.t),'ciclo de revisão: cartão "Questões do caderno", só a sessão do período (7 questões) '+JSON.stringify(r&&r.t.slice(0,160)));
const ids=()=>ev(()=>{const U=rvqUnits(S.sel.subj);return U.length?U[0].ids:[]});
await x.pick('rvqf','err');await W(200);let L=await ids();ok(L.length===1&&L[0]===D.q[0],'Só as que errei: 1 (a q1)');
await x.pick('rvqf','pend');await W(200);L=await ids();ok(L.length===5&&!L.includes(D.q[0])&&!L.includes(D.q[1]),'Só as que faltam: as 5 nunca feitas');
await x.pick('rvqf','all');await x.fill('.rvqcard input[name=rvqn]','5');await ev(()=>document.querySelector('.rvqcard input[name=rvqn]').dispatchEvent(new Event('change',{bubbles:true})));await W(250);L=await ids();
const nA=L.filter(i=>D.q.indexOf(i)%2===0).length,nB=L.length-nA;ok(L.length===5&&L.includes(D.q[0])&&Math.abs(nA-nB)<=1,'Quantas por sessão = 5: a errada entra e as 5 ficam equilibradas entre os assuntos ('+nA+' A, '+nB+' B) '+JSON.stringify(L.map(i=>D.q.indexOf(i)+1)));
await ev(()=>render());await W(150);ok(JSON.stringify(await ids())===JSON.stringify(L),'o sorteio fica fixo durante a revisão');
ok(await ev(()=>document.querySelector('.rvqcard input[name=rvqn]').value==='5'),'o campo mostra 5');
await p.screenshot({path:`saida/qzrvc-cartao-${w}.png`});
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
/* resolver as 5: 4 certas e 1 errada */
const solve=async ans=>{await ev(()=>document.querySelector('.rvqcard .csgo [data-act=rvqgo]')?.click()||document.querySelector('.rvqcard [data-act=rvqgo]').click());await W(250);
 const n=await ev(()=>ui.qz?ui.qz.ids.length:0);for(let i=0;i<n;i++){await ev(k=>qAns(k),ans[i]||'C');await W(60);await ev(()=>document.querySelector('.qznav [data-act=qnext]').click());await W(80)}return n};
let n=await solve(['C','C','E','C','C']);ok(n===5,'Resolver abre as 5');
r=await ev(cid=>{const R=S.sessions.filter(x=>x.rid===S.rv.id&&x.qtipo==='c');return {n:R.length,ac:R[0]&&R[0].ac,tq:R[0]&&R[0].tq,cad:R[0]&&R[0].qcad===cid,done:!!ui.qz&&ui.qz.done,h:((S.qh||{})[cid]||[]).slice(-1)[0]}},D.cid);
ok(r.n===1&&r.ac===4&&r.tq===5&&r.cad,'ao terminar: um registro da revisão com 4/5 e o caderno '+JSON.stringify(r));
ok(r.h&&r.h.k==='cy'&&await ev(()=>QHK.cy==='Revisão por ciclos'),'Desempenho do caderno: "Revisão por ciclos"');
await ev(()=>{ui.qz=null;render()});await W(250);
r=await card();ok(r&&/✓ 4\/5 · 80%/.test(r.t),'a parte mostra o placar ✓ 4/5 · 80% '+JSON.stringify(r&&r.t.slice(0,200)));
/* refazer: troca o registro */
await ev(()=>document.querySelector('.rvqcard .qzplay').click());await W(250);n=await ev(()=>ui.qz.ids.length);for(let i=0;i<n;i++){await ev(()=>qAns('C'));await W(50);await ev(()=>document.querySelector('.qznav [data-act=qnext]').click());await W(60)}
r=await ev(()=>{const R=S.sessions.filter(x=>x.rid===S.rv.id&&x.qtipo==='c');return {n:R.length,ac:R[0].ac,tq:R[0].tq}});ok(r.n===1&&r.ac===r.tq,'refazer troca o registro (não duplica) '+JSON.stringify(r));
await ev(()=>{ui.qz=null;render()});await W(200);
await p.screenshot({path:`saida/qzrvc-feito-${w}.png`});
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
