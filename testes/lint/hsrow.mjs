/* Busca e botão Filtrar não se sobrepõem em nenhuma largura */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,O]=process.argv.slice(2);const RAW=JSON.parse(fs.readFileSync(F,'utf8')),DATA=RAW['ciclo-estudos-v2']||JSON.stringify(RAW);let bad=0;
const {b,p}=await open({w:360,h:740,data:{'ciclo-estudos-v2':DATA,'ciclo-welcome-skip':'1'}});const x=mk(p);
await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);
await x.ev(()=>{ui.hfs=S.subjects.filter(s=>!s.of).slice(0,2).map(s=>s.id);ui.hfc=['c1.1'];render()});
for(const w of [320,360,390,420,440,480,520,560,600,601,700,1280]){await p.setViewport({width:w,height:740});await W(250);
 const r=await x.ev(()=>{const s=document.querySelector('.hsrow .hsrch'),i=s.querySelector('input'),f=document.querySelector('#hfb'),a=s.getBoundingClientRect(),ii=i.getBoundingClientRect(),c=f.getBoundingClientRect();return {srch:Math.round(a.right),input:Math.round(ii.right),btnL:Math.round(c.left),btnW:Math.round(c.width),txt:getComputedStyle(f.querySelector('span')).display,ovf:document.documentElement.scrollWidth>innerWidth+1}});
 const ok=r.input<=r.btnL-4&&!r.ovf;if(!ok)bad++;console.log((ok?'OK    ':'FALHA ')+w+'px',JSON.stringify(r));if(w===440||w===360)await p.screenshot({path:`${O}/hsrow-${w}.png`,clip:{x:0,y:150,width:w,height:250}})}
console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
