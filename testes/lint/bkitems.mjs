import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w:390,h:844});const x=mk(p);const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
await x.ev(()=>{S.blk=[{id:'m1',pos:1}];save();render()});
const A=await x.ev(()=>inCycle().map(s=>s.id));
await x.act('rreg',A[0]);await x.ev(()=>{const g=S.sel.groups[0];g.nt='Tópico K';g.rows=[{id:'r1',kind:'aula',name:'Aula K1',link:'PDF p. 3',q:''},{id:'r2',kind:'aula',name:'',link:'',qo:true,ac:'6',tq:'10'}];render()});await x.submit('#modal form[data-f=man]');await W(300);
await x.act('bkreg',A[0]);await x.fill('#modal [data-f=bkreg] input[name=m]','15');await x.submit('#modal form[data-f=bkreg]');await W(300);
const r=await x.ev(s=>S.sessions.filter(x=>x.bkr&&x.subj===s).map(x=>x.items),A[0]);
ok(r.length&&r[0].length===2&&r[0][0].name==='Aula K1'&&r[0][0].link==='PDF p. 3'&&r[0][1].qo,'registro de bloco guarda as aulas: '+JSON.stringify(r));
const ses=await x.ev(s=>S.sessions.find(x=>x.bkr&&x.subj===s).ses,A[0]);
await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(300);await x.ev(id=>document.querySelector(`[data-act=edit][data-id="${id}"]`).click(),ses);await W(400);
ok(/Aula K1/.test(await x.ev(()=>document.querySelector('#modal .stbox')?.innerText||'')),'editar mostra as aulas revisadas');
const ins=await p.$$('#modal [data-qa],#modal [data-qt]');if(ins.length>=2){await ins[0].click();await p.keyboard.type('6');await ins[1].click({clickCount:3});await p.keyboard.type('9');await W(150)}
await x.act('saveedit');await W(300);
/* a aula "Questões" já teve questões no estudo: os acertos da revisão ficam nela */
ok(await x.ev(id=>{const r=S.sessions.find(x=>x.ses===id);return r&&!r.tq&&r.items.some(i=>i.qo&&i.ac===6&&i.tq===9)},ses),'editar a revisão de bloco salva os acertos na aula: '+await x.ev(id=>JSON.stringify(S.sessions.filter(x=>x.ses===id).map(x=>x.items)),ses));
log.push('erros: '+JSON.stringify(errs));await b.close();console.log(log.join('\n'));
