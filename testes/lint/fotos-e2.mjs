/* Fotos da etapa 2 (caderno na revisão por tópico, "Quantas agora", "Como dividir", aviso das questões novas), para aprovação das telas.
   Uso: node lint/fotos-e2.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qh;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const J=JSON.stringify(Array.from({length:12},(_,i)=>({numero:i+1,disciplina:'X',topico:i%2?'Regência':'Crase',tipo:'CE',enunciado:'Tópico item '+(i+1)+'.',gabarito:'C'})));
const D=await ev(j=>{const s=qSubs()[0];S.trv={...(S.trv||{}),off:false,start:addD(today(),-30),t:{}};S.rq={on:true,iv:[1,4,8],b:{},hold:[]};
 const t=(s.topics=s.topics||[])[0]||(s.topics.push({id:'te1',name:'Crase e regência',done:false,links:[]}),s.topics[0]);
 S.sessions.push({id:'ts1',ses:'ts1',subj:s.id,topic:t.id,min:40,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',date:addD(today(),-7),items:[{kind:'aula',name:'Aula de crase',link:''}]});
 const P=qPrev({txt:j}),id=uid();qcL().push({id,subj:s.id,ses:'ts1',nome:'Caderno de crase',n:P.qs.length,ce:P.qs.length,me:0,d:today()});qSave(id,{qs:P.qs});save();render();
 const o=trvList().find(o=>o.sd===addD(today(),-7));return {sid:s.id,cid:id,k:o&&o.k}},J);
const shot=async n=>{await W(250);await p.screenshot({path:`saida/e2-${n}-${w}.png`});console.log(n+': '+(await ev(()=>document.documentElement.scrollWidth<=innerWidth)?'ok':'ROLAGEM'))};
/* Revisão › Tópicos: a linha aberta com o caderno */
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=topicos]');e&&e.click()});await W(300);
await ev(k=>{ui.open.add('tdi:'+k);render();const r=document.querySelector('.tqcad');r&&r.scrollIntoView({block:'center'})},D.k);await shot('topicos-linha');
await W(200);await shot('topicos-lapis');
await ev(()=>{const e=document.querySelector('.qsin');e.value='4';e.dispatchEvent(new Event('change',{bubbles:true}))});await W(250);await ev(()=>{const r=document.querySelector('.tqcad');r&&r.scrollIntoView({block:'center'})});await shot('topicos-4agora');
/* janela Registrar revisão */
await ev(k=>{ui.trvk=k;render()},D.k);await W(400);await shot('topicos-registrar');
/* resolver as 4 e voltar: placar na janela */
await ev(()=>document.querySelector('#modal .tqcad [data-act=tqgo]').click());await W(300);const n=await ev(()=>ui.qz?ui.qz.ids.length:0);console.log('bateria com '+n+' questões');
for(let i=0;i<n;i++){await ev(k=>qAns(k),i===1?'E':'C');await W(50);await ev(()=>document.querySelector('.qznav [data-act=qnext]').click());await W(60)}await ev(()=>{ui.qz=null;render()});await W(300);await shot('topicos-registrar-placar');
await ev(k=>{ui.trvk=null;render()},D.k);
/* caderno: seção Revisões e a engrenagem com "Como dividir" */
await ev(c=>{tab='qz';ui.qcad=c;render()},D.cid);await W(300);await ev(()=>{const h=[...document.querySelectorAll('.qzsh')].find(e=>/Revisões/.test(e.textContent));h&&h.scrollIntoView({block:'start'});scrollBy(0,-70)});await shot('caderno-revisoes');
await ev(()=>document.querySelector('[data-act=qdv]').click());await W(250);await ev(c=>{const e=document.querySelector(`[data-act=qdvk][data-id="${c}:q:ini"]`);e&&e.click()},D.cid);await W(250);
await ev(c=>{const e=document.querySelector(`[data-act=qdvk][data-id="${c}:t:pct"]`);e&&e.click()},D.cid);await W(250);await ev(()=>{const e=document.querySelector('.qzdvt');e&&e.scrollIntoView({block:'start'});scrollBy(0,-80)});await shot('caderno-dividir');
await ev(c=>{const e=document.querySelector(`[data-act=qdvk][data-id="${c}:t:num"]`);e&&e.click()},D.cid);await W(250);await ev(c=>{const e=document.querySelector(`[data-dvt="${c}:t"]`);e.value='8';e.dispatchEvent(new Event('change',{bubbles:true}))},D.cid);await W(250);await ev(c=>{const e=document.querySelector(`[data-act=qdvk][data-id="${c}:t:ini"]`);e&&e.click()},D.cid);await W(250);await ev(()=>{const e=[...document.querySelectorAll('.qzdvt')][1];e&&e.scrollIntoView({block:'start'});scrollBy(0,-80)});await shot('caderno-porvez');
/* com 2 por vez, sobram de fora: a linha da revisão por tópico mostra "fora das revisões" e o lápis deixa pegar mais */
await ev(k=>{tab='rev';ui.qcad=null;if(S.trv)delete S.trv.qd;ui.open.add('tdi:'+k);render()},D.k);await W(300);await ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=topicos]');e&&e.click()});await W(300);await ev(k=>{ui.open.add('tdi:'+k);render();const r=document.querySelector('.tqcad');r&&r.scrollIntoView({block:'center'})},D.k);await shot('topicos-fora');
await W(200);await shot('topicos-fora-lapis');
await ev(()=>{const e=document.querySelector('.qsin');e.value='6';e.dispatchEvent(new Event('change',{bubbles:true}))});await W(250);await ev(()=>{const r=document.querySelector('.tqcad');r&&r.scrollIntoView({block:'center'})});await shot('topicos-fora-6');
await ev(c=>{tab='qz';ui.qcad=c;render()},D.cid);await W(300);
await ev(()=>{scrollTo(0,0);ui.qdv=null;render()});await ev(c=>{0},D.cid);await W(200);await shot('caderno-topo');await ev(()=>{const e=document.querySelector('.qsin');e.value='5';e.dispatchEvent(new Event('change',{bubbles:true}))});await W(250);await shot('caderno-5agora');
/* aviso das questões novas: todas as fatias da revisão por tópico feitas */
await ev(c=>{const m=qcM(c),P=qPartsOf(c,'t');P.forEach((L,i)=>{qPdSet(m,'t',i,L.slice());S.sessions.push({id:'fx'+i,ses:'fx'+i,subj:m.subj,min:0,review:true,qcad:c,qtipo:'t',qpart:i,ac:1,tq:1,date:today(),cycle:S.cycle,items:[]})});save();
 ui.qimp={cad:c,txt:JSON.stringify([{numero:1,disciplina:'X',topico:'Crase',tipo:'CE',enunciado:'Nova 1.',gabarito:'C'},{numero:2,disciplina:'X',topico:'Crase',tipo:'CE',enunciado:'Nova 2.',gabarito:'C'}])};qImpSave()},D.cid);await W(300);await shot('aviso-novas');
console.log(errs.length?'ERROS '+errs.slice(0,3).join(' | '):'sem erros');await b.close();
