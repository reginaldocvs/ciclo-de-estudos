/* Registros: "antes X% →" em relação à tentativa anterior àquele registro — nas aulas do estudo e nos acertos da revisão;
   registro sem horário (antigo) conta pela ordem de registro */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const S0=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const SID=(S0.subjects.filter(s=>!s.off&&!s.of)[0]||S0.subjects[0]).id; /* disciplina do ciclo, sem depender do arquivo de dados */let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const sub=S0.subjects.find(s=>s.id===SID);sub.topics=[{id:'tpC',name:'Crase',done:false,links:[]}];
const it=(a,t)=>[{kind:'aula',name:'Aula 3',link:'',...(t?{ac:a,tq:t}:{})}];
S0.reviews=[{id:'rvG',src:['gA'],lbl:'Grupo 1',start:'2026-10-12',end:'2026-10-12'}];S0.rgs=[{id:'gA',idx:1,len:7,dates:['2026-10-01']}];
S0.sessions=[{id:'s1',ses:'s1',subj:SID,topic:'tpC',min:60,cycle:1,set:1,review:false,kind:'aula',items:it(5,10),date:'2026-10-10'},
 {id:'s2',ses:'s2',subj:SID,topic:'tpC',min:60,cycle:2,set:1,review:false,kind:'aula',items:it(7,10),date:'2026-10-11',at:'10:00'},
 {id:'g1',ses:'g1',rid:'rvG',subj:SID,topic:'tpC',min:20,cycle:2,set:1,review:true,kind:'aula',items:it(),ac:9,tq:10,date:'2026-10-12',at:'09:00'},
 {id:'b1',ses:'b1',rid:'bk-1-2-x',bkr:'k',subj:SID,topic:'tpC',min:20,cycle:2,set:1,review:true,kind:'aula',items:it(),ac:6,tq:10,date:'2026-10-12',at:'22:00'}];S0.cycle=2;
const {b,p,errs}=await open({w:1280,h:900,data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'}});const x=mk(p);
await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);
const r=await x.ev(()=>Object.fromEntries([...document.querySelectorAll('#hres .ritem')].map(e=>[e.querySelector('[data-act=edit]').dataset.id,[...e.querySelectorAll('.qprev')].map(q=>q.textContent.trim()).join(' ')])));console.log('  ',JSON.stringify(r));
ok(r.s1==='','primeiro estudo: sem "antes"');ok(r.s2==='antes 50% →','estudo seguinte: aula com "antes 50%"');
ok(r.g1==='antes 70% →','revisão por grupos: "antes 70%" (o estudo anterior)');ok(r.b1==='antes 90% →','revisão de bloco no mesmo dia, mais tarde: "antes 90%" (a revisão das 09:00)');
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
