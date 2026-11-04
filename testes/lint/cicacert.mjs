/* Modo Ciclos: cada ciclo mostra os acertos dele e compara com a tentativa anterior (não com as mais recentes de qualquer data) */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const S0=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const SID=(S0.subjects.filter(s=>!s.off&&!s.of)[0]||S0.subjects[0]).id; /* disciplina do ciclo, sem depender do arquivo de dados */let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const sub=S0.subjects.find(s=>s.id===SID);sub.topics=[{id:'tpC',name:'Crase',done:false,links:[]}];
const it=(a,t)=>[{kind:'aula',name:'Aula 3',link:'',ac:a,tq:t}],ses=(id,c,d,a,t)=>({id,ses:id,subj:SID,topic:'tpC',min:60,cycle:c,set:1,review:false,kind:'aula',items:it(a,t),date:d,at:'10:00'});
S0.sessions=[ses('s1',1,'2026-10-01',5,10),ses('s2',2,'2026-10-10',7,10),ses('s3',3,'2026-10-20',9,10)];S0.cycle=3;
const {b,p,errs}=await open({w:390,h:900,data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'}});const x=mk(p);
await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);await x.act('hmode','cic');await W(300);
const byC=async n=>x.ev(n=>{const h=[...document.querySelectorAll('.hcb')].find(e=>new RegExp('^Ciclo '+n+'$').test(e.querySelector('.hct b').textContent));if(!h.classList.contains('open'))h.querySelector('[data-act=hctog]').click();return null},n).then(()=>W(250)).then(()=>x.ev(n=>{const h=[...document.querySelectorAll('.hcb')].find(e=>new RegExp('^Ciclo '+n+'$').test(e.querySelector('.hct b').textContent));return [...h.querySelectorAll('.ritq')].map(e=>e.textContent.trim()).join(' ')},n));
console.log('  blocos:',JSON.stringify(await x.ev(()=>[...document.querySelectorAll('.hcb')].map(e=>e.querySelector('.hct').textContent))));
const c1=await byC(1),c2=await byC(2),c3=await byC(3);console.log('  ',JSON.stringify({c1,c2,c3}));
ok(c1==='5/10 · 50%','Ciclo 1 mostra os acertos dele, sem "antes" ('+c1+')');
ok(/^antes 50% → ?7\/10 · 70%$/.test(c2),'Ciclo 2 compara com a tentativa do ciclo 1 ('+c2+')');
ok(/^antes 70% → ?9\/10 · 90%$/.test(c3),'Ciclo 3 compara com a do ciclo 2 ('+c3+')');
await p.screenshot({path:process.argv[3],fullPage:true});
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
