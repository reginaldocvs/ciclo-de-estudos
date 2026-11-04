import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,O]=process.argv.slice(2);const RAW=JSON.parse(fs.readFileSync(F,'utf8')),S0=JSON.parse(RAW['ciclo-estudos-v2']||JSON.stringify(RAW));
/* uma revisão nos dados, para aparecer o Tipo (4 linhas) */
const r0=S0.sessions[S0.sessions.length-1];S0.sessions.push({...r0,id:'rvx',ses:'rvx',review:true,rid:'rv-x'});
for(const w of [320,360,1280]){const {b,p,errs}=await open({w,h:740,data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'}});const x=mk(p);
 await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);await x.act('hfo');
 const r=await x.ev(()=>{const pn=document.querySelector('#hfpan').getBoundingClientRect();return {rows:document.querySelectorAll('#hfpan .hfsel').length+1,l:Math.round(pn.left),r:Math.round(innerWidth-pn.right),ovf:document.documentElement.scrollWidth>innerWidth+1}});
 console.log(w,JSON.stringify(r),errs.join('|'));await p.screenshot({path:`${O}/pop-${w}.png`,clip:{x:0,y:0,width:w,height:Math.min(560,740)}});await b.close()}
