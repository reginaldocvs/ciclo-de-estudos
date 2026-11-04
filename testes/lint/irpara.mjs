/* Cartão "Revisão de bloco · pulada": "Ir para" fica numa linha só em qualquer largura; o nome encolhe com reticências */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);
S0.subjects.forEach(s=>{if(!s.of&&/Inform/.test(s.name))s.name='Conhecimentos Específicos da Área de Tecnologia'});d['ciclo-estudos-v2']=JSON.stringify(S0);
let bad=0;
for(const w of [320,360,390,440,1280]){const {b,p,errs}=await open({data:d,w,h:900});const x=mk(p);
 await x.ev(()=>{S.blk=[{id:'m1',pos:3}];save();render()});
 let k=0;const reg=async id=>{await x.act('rreg',id);await x.ev(k=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Tópico S'+k;g.rows[0].name='Aula S'+k;render()},++k);await x.submit('#modal form[data-f=man]');await W(250)};
 const A=await x.ev(()=>inCycle().map(s=>s.id));await reg(A[0]);await reg(A[1]);await reg(A[2]);await x.act('blkend');await W(300);
 await x.ev(()=>document.querySelector('#app .bkrow').click());await W(300);
 const r=await x.ev(()=>{const b=document.querySelector('#app .blkc [data-act=bkback]');if(!b)return null;const s=b.querySelector('span'),lh=parseFloat(getComputedStyle(s).lineHeight)||20;b.scrollIntoView({block:'center'});return {txt:b.innerText.replace(/\n/g,' / '),ir1:s.getBoundingClientRect().height<lh*1.5,inside:b.getBoundingClientRect().right<=innerWidth}});
 const ok=r&&r.ir1&&r.inside;if(!ok)bad++;console.log((ok?'OK    ':'FALHA ')+w+'px',JSON.stringify(r));
 if(w===360)await p.screenshot({path:process.argv[2]});await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
