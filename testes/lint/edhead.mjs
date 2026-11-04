/* Editar registro: alça visível no celular (também depois de rolar) e meta na mesma linha do nome da disciplina */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,O]=process.argv.slice(2);const RAW=JSON.parse(fs.readFileSync(F,'utf8')),DATA=RAW['ciclo-estudos-v2']||JSON.stringify(RAW);let bad=0;
for(const [w,h] of [[360,640],[390,844],[1280,700]]){const {b,p,errs}=await open({w,h,data:{'ciclo-estudos-v2':DATA,'ciclo-welcome-skip':'1'}});const x=mk(p);
 await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);
 await x.act('edit',await x.ev(()=>document.querySelector('#hres [data-act=edit]').dataset.id));await W(500);for(let i=0;i<4;i++)await x.act('addrow').catch(()=>{});await W(300);
 const r=await x.ev(async()=>{const d=document.querySelector('.dlg.edlg'),n=d.querySelector('.edn'),g=d.querySelector('.edh .sxgoal');
  const grip=()=>{const e=d.querySelector('.sgrip');if(!e||getComputedStyle(e).display==='none')return null;const r=e.getBoundingClientRect(),at=document.elementFromPoint(r.left+r.width/2,r.top+12);return {top:Math.round(r.top-d.getBoundingClientRect().top),hit:!!at&&(at===e||e.contains(at))}};
  const nb=n.getBoundingClientRect(),gb=g.getBoundingClientRect(),cs=s=>{const r=s.getBoundingClientRect();return r.top+r.height/2};
  const g0=grip();d.scrollTop=d.scrollHeight;await new Promise(r=>setTimeout(r,80));const g1=grip();
  return {dy:Math.round(cs(n)-cs(g)),g0,g1}});
 const mob=w<=600,ok=Math.abs(r.dy)<=2&&(!mob||(r.g0&&r.g0.hit&&r.g1&&r.g1.hit&&r.g1.top===0));if(!ok)bad++;console.log((ok?'OK    ':'FALHA ')+w+'px',JSON.stringify(r));
 await x.ev(()=>document.querySelector('.dlg.edlg').scrollTop=0);await p.screenshot({path:`${O}/edhead-${w}.png`,clip:{x:0,y:0,width:w,height:Math.min(h,400)}});await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
