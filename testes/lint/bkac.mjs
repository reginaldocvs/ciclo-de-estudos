import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w:390,h:844});const x=mk(p);
await x.ev(()=>{S.blk=[{id:'m1',pos:1}];save();render()});
const A=await x.ev(()=>inCycle().map(s=>s.id));
await x.act('rreg',A[0]);await x.ev(()=>{const g=S.sel.groups[0];g.nt='Tópico K';g.rows=[{id:'r1',kind:'aula',name:'Aula K1',link:'',q:''}];render()});await x.submit('#modal form[data-f=man]');await W(300);
for(const via of ['card','foco','tempo-lista']){
 if(via!=='foco')await x.act('bkreg',A[0]);else{await x.act('bkgo',A[0]);await x.act('rvfrs');await W(1200);await x.act('rvfreg')}
 await W(300);
 console.log(via,'campos:',await x.ev(()=>[...document.querySelectorAll('#modal [data-f=bkreg] input')].map(i=>i.name+'|'+Object.keys(i.dataset).join(',')).join(' ; ')));
 const qa=await p.$('#modal [data-f=bkreg] input[name^=qa-]');const qt=await p.$('#modal [data-f=bkreg] input[name^=qt-]');
 await qa.click();await p.keyboard.type('7');await qt.click();await p.keyboard.type('10');await W(200);if(via==='tempo-lista'){await x.act('tdd','bkr');await x.act('tpick','bkr:30');await W(200)}
 console.log(via,'antes de salvar:',await x.ev(()=>[...document.querySelectorAll('#modal [data-f=bkreg] input[name^=q]')].map(i=>i.name+'='+i.value).join(' ')));
 await p.click('#modal [data-f=bkreg] button.btn:not(.g)');await W(400);
 console.log(via,'salvo:',await x.ev(s=>JSON.stringify(S.sessions.filter(x=>x.bkr&&x.subj===s).map(x=>({ac:x.ac,tq:x.tq,min:x.min}))),A[0]));
 await x.act('bkunreg',A[0]);
}
console.log(errs);await b.close();
