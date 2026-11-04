import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';d['ciclo-estudos-v2']=JSON.stringify(S0);
for(const w of [320,390,1280]){const {b,p}=await open({data:d,w,h:900});const x=mk(p);
 await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.act('rvt','hoje');const g=await x.ev(()=>rgNext());await x.act('rvstart',g);await W(400);
 const sid=await x.ev(()=>{const s=actives().find(s=>rvRows(s).some(o=>acList(o.t.id,o.rows.map(r=>r.l)).length));rvRows(s).forEach(o=>o.rows.forEach(r=>S.checked[r.k]=true));render();return s.id});await x.act('rreg',sid);await W(400);
 await x.ev(()=>{const e=document.querySelector('#modal [data-qa][data-tik]');e.value='7';e.dispatchEvent(new Event('input',{bubbles:true}))});await W(150);
 const r=await x.ev(()=>{const L=[...document.querySelectorAll('#modal .acit [data-qa]')].map(e=>Math.round(e.getBoundingClientRect().left));const lb=[...document.querySelectorAll('#modal .acit .rlb .snt')].map(e=>e.scrollWidth>e.clientWidth);return {L,cut:lb,ovf:document.documentElement.scrollWidth>innerWidth+1}});
 console.log(w,JSON.stringify(r),new Set(r.L).size===1?'OK alinhado':'FALHA desalinhado');await b.close()}
