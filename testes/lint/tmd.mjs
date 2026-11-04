import {open,mk,W} from './lib.mjs';
import fs from 'fs';
const [SHOT,OUT]=process.argv.slice(2);
const d=JSON.parse(fs.readFileSync(SHOT+'/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.trv={start:'2026-09-25',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const row=x=>x.ev(()=>[...document.querySelectorAll('#modal .tmd')].map(g=>{const a=g.querySelector('.cb.tf').getBoundingClientRect(),b=g.querySelector('input[type=date]').getBoundingClientRect(),dl=g.closest('.dlg').getBoundingClientRect();return {mesma:Math.abs(a.top-b.top)<2,tempo:Math.round(a.width),dentro:b.right<=dl.right+1}}));
for(const w of [300,320,360,390,1280]){const {b,p,errs}=await open({data:d,w,h:820});const x=mk(p);
 const id=await x.ev(()=>actives().find(s=>!gDone(s)).id);await x.act('rreg',id);const r1=await row(x);await p.screenshot({path:`${OUT}/tmd-${w}-reg.png`});await x.ev(()=>{S.sx=false;S.sel.groups=null;render()});
 await x.ev(()=>document.querySelector('[data-tab=reg]').click());await W(300);const e=await x.ev(()=>document.querySelector('#app [data-act=edit]').dataset.id);await x.act('edit',e);const r2=await row(x);await x.act('canceledit');
 await x.ev(()=>document.querySelector('[data-tab=rev]').click());await W(300);await x.act('rvt','topicos');const k=await x.ev(()=>trvDue()[0].k);await x.act('trvok',k);const r3=await row(x);
 console.log(w,JSON.stringify({registro:r1,editar:r2,revisao:r3}),errs);await b.close()}
