/* Histórico da Revisão por questões: etiqueta com a vez ("rev. questões · 1ª") e a sessão na descrição;
   acerto ao lado de cada tópico quando o registro tem mais de um tópico com acerto; duas sessões num registro só.
   Uso: node lint/histrq.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.rq;delete S0.srv;
S0.subjects.push({id:'qx',name:'Teste Q',goal:60,topics:[{id:'ta',name:'Classes Gramaticais',done:false,links:[]},{id:'tb',name:'Concordância Verbal',done:false,links:[]}]});
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:1200});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const study=n=>ev(n=>{S.sel.subj='qx';S.sel.groups=[{id:'ga'+n,nt:'Classes Gramaticais',rows:[{id:'ra'+n,kind:'aula',name:'Aula A'+n,link:''}]},{id:'gb'+n,nt:'Concordância Verbal',rows:[{id:'rb'+n,kind:'aula',name:'Aula B'+n,link:''}]}];addSession(30);save();render()},n);
const fill=V=>ev(V=>{const f=document.querySelector('[data-f=rqreg]');Object.entries(V).forEach(([n,v])=>f.querySelector(`[name="${n}"]`).value=v);f.requestSubmit()},V);
const hist=()=>ev(()=>{tab='reg';render();return [...document.querySelectorAll('.ritem')].map(e=>({tag:(e.querySelector('.rvk,.rmeta .tag:last-child')||{}).textContent,d:(e.querySelector('.rvk')||{}).title||'',tq:[...e.querySelectorAll('.rtpn')].map(t=>(t.querySelector('.qsc')||{}).textContent||'')}))});
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};save()});await study(1);await W(100);await study(2);await W(150);
await ev(()=>{const b=document.querySelector('#undo [data-act=rqreg]');b&&b.click()});await W(300);
await fill({'qa-0-0':'8','qt-0-0':'10','qa-0-1':'6','qt-0-1':'10'});await W(300);
let r=await hist();const sd=await ev(()=>sdm(rqSesAll('qx')[0].d));
ok(r[0].tag==='rev. questões · 1ª'&&r[0].d===`1ª revisão da sessão 1 (${sd}), por questões.`,'etiqueta com a vez e a sessão na descrição '+JSON.stringify(r[0]));
ok(r[0].tq.join('|')==='8/10 · 80%|6/10 · 60%','acerto ao lado de cada tópico '+JSON.stringify(r[0].tq));
ok(r[1].tq.every(t=>!t),'registro de estudo: sem acerto por tópico '+JSON.stringify(r[1].tq));
await p.screenshot({path:'saida/histrq-'+w+'.png'});
/* sessões 3, 4 e 5 sem revisar: na 5 chegam a 1ª das sessões 2, 3 e 4 (atrasadas as duas primeiras) e a 2ª da sessão 1 — num registro só */
await study(3);await W(150);await ev(()=>{ui.rqreg=null;render()});await study(4);await W(150);await ev(()=>{ui.rqreg=null;render()});
await study(5);await W(150);await ev(()=>{ui.rqreg='qx';render()});await W(300);
const n=await ev(()=>document.querySelectorAll('[data-f=rqreg] .rqb').length);
const V={};for(let i=0;i<n;i++)Object.assign(V,{[`qa-${i}-0`]:'5',[`qt-${i}-0`]:'10'});await fill(V);await W(300);
r=await hist();ok(n===4&&r[0].tag==='rev. questões'&&r[0].d==='Revisão por questões das sessões 1 (2ª), 2 (1ª), 3 (1ª) e 4 (1ª).','duas sessões num registro: as sessões e as vezes na descrição '+JSON.stringify({n,...r[0]}));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
