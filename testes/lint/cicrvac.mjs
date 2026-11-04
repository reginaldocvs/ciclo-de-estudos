/* Modo Ciclos: blocos de revisão por grupos e por ciclos mostram os acertos da revisão e comparam com a tentativa anterior do tópico */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const S0=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const SID=(S0.subjects.filter(s=>!s.off&&!s.of)[0]||S0.subjects[0]).id; /* disciplina do ciclo, sem depender do arquivo de dados */let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const sub=S0.subjects.find(s=>s.id===SID);sub.topics=[{id:'tpC',name:'Crase',done:false,links:[]}];
const items=[{kind:'aula',name:'Aula 3',link:''}];
S0.rgs=[{id:'gA',idx:1,len:7,dates:['2026-10-01']}];
S0.reviews=[{id:'rvG',src:['gA'],lbl:'Grupo 1',start:'2026-10-05',end:'2026-10-05'},{id:'rvC',src:[1],lbl:'Ciclo 1',start:'2026-10-08',end:'2026-10-08',cy:true}];
S0.sessions=[{id:'s1',ses:'s1',subj:SID,topic:'tpC',min:60,cycle:1,set:1,review:false,kind:'aula',items:[{...items[0],ac:5,tq:10}],date:'2026-10-01',at:'10:00'},
 {id:'g1',ses:'g1',rid:'rvG',subj:SID,topic:'tpC',min:20,cycle:2,set:1,review:true,kind:'aula',items,ac:8,tq:10,date:'2026-10-05',at:'09:00'},
 {id:'c1',ses:'c1',rid:'rvC',subj:SID,topic:'tpC',min:20,cycle:2,set:1,review:true,kind:'aula',items,ac:9,tq:10,date:'2026-10-08',at:'09:00'}];S0.cycle=2;
const {b,p,errs}=await open({w:390,h:1000,data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'}});const x=mk(p);
await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);await x.act('hmode','cic');await W(300);
await x.ev(()=>document.querySelectorAll('.hcb:not(.open) [data-act=hctog]').forEach(e=>e.click()));await W(300);
await x.ev(()=>document.querySelectorAll('.hcb:not(.open) .pvh').forEach(e=>e.click()));await W(300);
const r=await x.ev(()=>Object.fromEntries([...document.querySelectorAll('.hcb')].map(h=>[h.querySelector('.hct b').textContent,[...h.querySelectorAll('.rvit')].map(e=>e.innerText.replace(/\s+/g,' ').trim())])));
console.log('  ',JSON.stringify(r));
const g=(r['Revisão · Grupo 1']||[]).join(' | '),c=(r['Revisão · Ciclo 1']||[]).join(' | '),s=(r['Ciclo 1']||[]).join(' | ');
ok(/Acertos antes 50% → ?8\/10 · 80%/.test(g),'revisão por grupos: 8/10, comparando com o estudo (50%)');
ok(/Acertos antes 80% → ?9\/10 · 90%/.test(c),'revisão por ciclos: 9/10, comparando com a revisão por grupos (80%)');
ok(!/Acertos antes/.test(s)&&/5\/10 · 50%/.test(s),'ciclo de estudo continua com os acertos das aulas');
await p.screenshot({path:process.argv[3],fullPage:true});ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
