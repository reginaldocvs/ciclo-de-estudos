/* Edição com data passada: tempo, data e horário numa linha só, sem cortar o texto (320, 360, 390, 768, 1280) */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,O]=process.argv.slice(2);const RAW=JSON.parse(fs.readFileSync(F,'utf8')),DATA=RAW['ciclo-estudos-v2']||JSON.stringify(RAW);let bad=0;
for(const w of [320,360,390,768,1280]){const {b,p,errs}=await open({w,h:760,data:{'ciclo-estudos-v2':DATA,'ciclo-welcome-skip':'1'}});const x=mk(p);
 await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);
 await x.act('edit',await x.ev(()=>document.querySelector('#hres [data-act=edit]').dataset.id));
 const r=await x.ev(()=>{const t=document.querySelector('.tmd .tf'),d=document.querySelector('[data-ed]'),h=document.querySelector('[data-eat]');if(!h)return null;const R=[t,d,h].map(e=>e.getBoundingClientRect());
  const tin=t.querySelector('input');return {row:Math.abs(R[0].top-R[1].top)<2&&Math.abs(R[1].top-R[2].top)<2,inside:R[2].right<=innerWidth-8,w:R.map(r=>Math.round(r.width)),clipT:tin.scrollWidth>tin.clientWidth+1}});
 const ok=r&&r.row&&r.inside&&!r.clipT;if(!ok)bad++;console.log((ok?'OK    ':'FALHA ')+w+'px',JSON.stringify(r));
 if(w===360||w===320)await p.screenshot({path:`${O}/edrow-${w}.png`});await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
