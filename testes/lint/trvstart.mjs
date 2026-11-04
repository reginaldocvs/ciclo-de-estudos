/* Revisão por tópico ligada depois: estudo feito com ela desligada não deve entrar na fila */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const D0=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));if(process.argv[3]==='velho')D0.trv={off:true,t:{},start:'2026-10-01'}; /* dado gravado pela versão antiga */
const DATA=JSON.stringify(D0);
const {b,p,errs}=await open({w:1280,h:800,data:{'ciclo-estudos-v2':DATA,'ciclo-welcome-skip':'1'}});const x=mk(p);
const d0=await x.ev(()=>({start:S.trv.start,today:today(),off:S.trv.off,gaps:S.trv.gaps}));console.log('ao abrir:',JSON.stringify(d0));
await x.days(5);
/* estudo com tópico e aula, como o registro normal grava */
await x.ev(()=>{const s=S.subjects.find(s=>s.name==='Português');const t={id:'tp1',name:'Crase',done:false,links:[]};s.topics.push(t);S.sessions.push({id:'x1',ses:'x1',subj:s.id,topic:'tp1',min:30,cycle:S.cycle,set:1,review:false,kind:'aula',items:[{kind:'aula',name:'Aula 1',link:''}],date:today()});save()});
const d1=await x.ev(()=>today());console.log('estudo (revisão desligada) em',d1);
await x.days(10);
await x.ev(()=>document.querySelector('nav [data-tab="rev"]').click());await W(300);await x.act('rvadj');
await x.act('rvsys','t');
const r=await x.ev(()=>({hoje:today(),start:S.trv.start,off:S.trv.off,lista:trvList().map(o=>o.k+' due='+o.due)}));
console.log('depois de ligar:',JSON.stringify(r));
console.log(r.start===r.hoje&&r.lista.length===0?'OK    estudo com a revisão desligada fica de fora; início = dia em que foi ligada':'FALHA estudo de antes entrou ou início errado');
/* desliga e religa: o início continua o primeiro dia em que foi ligada; estudo novo entra */
const tog=async()=>{await x.ev(()=>document.querySelector('nav [data-tab="rev"]').click());await W(300);await x.act('rvadj');await x.act('rvsys','t');await x.act('tvoffok').catch(()=>{})};
await x.days(2);await tog();console.log('desligada:',await x.ev(()=>JSON.stringify(S.trv)));await x.days(1);await tog();
await x.ev(()=>{const s=S.subjects.find(s=>s.name==='Português');S.sessions.push({id:'x2',ses:'x2',subj:s.id,topic:'tp1',min:30,cycle:S.cycle,set:1,review:false,kind:'aula',items:[{kind:'aula',name:'Aula 2',link:''}],date:today()});save()});
const r2=await x.ev(()=>({start:S.trv.start,lista:trvList().map(o=>o.k)}));
console.log(r2.start===r.start&&r2.lista.length===1?'OK    religar mantém o início e o estudo novo entra':'FALHA religar: '+JSON.stringify(r2));console.log(errs.join('\n'));await b.close();
