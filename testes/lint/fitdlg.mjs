import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.trv={start:'2026-09-25',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const probs=[];
const tab=t=>`document.querySelector('nav [data-tab=${t}]')?.click()`;
const D=[
 ['Ajustes de revisão',`${tab('rev')};ui.rvadj=true`],
 ['Revisão por tópico (ajustes)',`${tab('rev')};ui.rvadj=null;ui.trvcfg=true;ui.trviv=trvIv().slice()`],
 ['Ajustes de grupos',`${tab('rev')};ui.trvcfg=null;ui.rvcfg=true`],
 ['Calendário',`${tab('rev')};ui.rvcfg=null;ui.rvcalm=true`],
 ['Registrar revisão de tópico',`${tab('rev')};ui.rvcalm=null;ui.trvk=trvList().find(o=>!o.fix).k`],
 ['Grupo (ver)',`${tab('rev')};ui.trvk=null;ui.rvt='grupos';render();document.querySelector('#app [data-act=rgview]')?.click()`],
 ['Ajuda longa',`ui.rgview=null;ui.info='trv'`],
 ['Ajuda grupos',`ui.info='rvgrp'`],
 ['Planos',`ui.info=null;ui.pl=true`],
 ['Editar ciclo',`ui.pl=null;${tab('ciclo')};ui.ed=true`],
 ['Registrar sessão',`ui.ed=null;S.sx='manual';const s=actives().find(s=>!gDone(s));S.sel.subj=s.id;const g=grps()[0];g.nt='Crase';for(let i=0;i<5;i++)g.rows.push({id:uid(),kind:'aula',name:'Aula '+i,link:'',q:'',open:i===4})`],
];
for(const [w,hh] of [[1280,600],[1280,900],[768,520],[390,600],[360,560]]){const {b,p,errs}=await open({data:d,w,h:hh});const x=mk(p);
 for(const [nm,code] of D){try{await x.ev(c=>{eval(c);render()},code);await W(450);
  const r=await x.ev(()=>{const L=[...document.querySelectorAll('#modal .dlg')].filter(e=>e.getClientRects().length);const e=L[L.length-1];if(!e)return null;const b=e.getBoundingClientRect(),cs=getComputedStyle(e);
   const scrollers=[e,...e.querySelectorAll('*')].filter(z=>{const c=getComputedStyle(z);return /(auto|scroll)/.test(c.overflowY)&&z.scrollHeight>z.clientHeight+1});
   const over=e.scrollHeight>e.clientHeight+1&&!/(auto|scroll)/.test(cs.overflowY);
   return {top:Math.round(b.top),bot:Math.round(b.bottom),l:Math.round(b.left),r:Math.round(b.right),vh:innerHeight,vw:innerWidth,over,sc:scrollers.length,cls:e.className}});
  if(!r){probs.push(`${w}x${hh} ${nm}: janela não abriu`);continue}
  if(r.top<-1||r.bot>r.vh+1||r.l<-1||r.r>r.vw+1)probs.push(`${w}x${hh} ${nm}: fora da tela ${JSON.stringify(r)}`);
  if(r.over)probs.push(`${w}x${hh} ${nm}: conteúdo cortado sem rolagem ${r.cls}`);
 }catch(e){probs.push(`${w}x${hh} ${nm}: EXCEÇÃO ${e.message}`)}}
 errs.forEach(e=>probs.push(`${w}x${hh} console: ${e}`));await b.close()}
console.log(probs.length?probs.join('\n'):'todas as janelas cabem');
