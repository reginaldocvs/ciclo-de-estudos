/* Editar registro: ao rolar, o título fica fixo e o rodapé (tempo, data, botões) rola junto; nada passa da tela */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,O]=process.argv.slice(2);const RAW=JSON.parse(fs.readFileSync(F,'utf8')),DATA=RAW['ciclo-estudos-v2']||JSON.stringify(RAW);let bad=0;
for(const [w,h] of [[360,640],[390,844],[1280,560],[1920,740]]){const {b,p,errs}=await open({w,h,data:{'ciclo-estudos-v2':DATA,'ciclo-welcome-skip':'1'}});const x=mk(p);
 await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);
 await x.act('edit',await x.ev(()=>document.querySelector('#hres [data-act=edit]').dataset.id));await W(400);
 /* várias aulas para a janela precisar rolar */
 for(let i=0;i<5;i++)await x.act('addrow').catch(()=>{});await W(300);
 const r=await x.ev(async()=>{const d=document.querySelector('.dlg.edlg'),hd=d.querySelector('.edh'),f=d.querySelector('.edf');const dr=d.getBoundingClientRect(),f0=f.getBoundingClientRect().top;
  const can=d.scrollHeight>d.clientHeight+1;d.scrollTop=0;await new Promise(r=>setTimeout(r,50));const fTop0=f.getBoundingClientRect().top;d.scrollTop=d.scrollHeight;await new Promise(r=>setTimeout(r,50));
  return {can,fits:dr.bottom<=innerHeight+1&&dr.top>=-1,hdTop:Math.round(hd.getBoundingClientRect().top-d.getBoundingClientRect().top),fMoved:Math.round(fTop0-f.getBoundingClientRect().top),fVisEnd:f.getBoundingClientRect().bottom<=d.getBoundingClientRect().bottom+1}});
 const ok=r.fits&&r.fVisEnd&&(!r.can||(r.hdTop<=1&&r.fMoved>0));if(!ok)bad++;console.log((ok?'OK    ':'FALHA ')+w+'x'+h,JSON.stringify(r));
 await p.screenshot({path:`${O}/edscroll-${w}.png`});if(errs.length){bad++;console.log(errs)}await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
