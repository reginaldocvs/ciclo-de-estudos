/* Foco da revisão (ponto de revisão e revisão por tópico): depois da meta, "0h45 ✓ · +12min" e o tempo a mais em tom mais claro, como no estudo */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);S0.blk=[{id:'m1',pos:2}];d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:900});const x=mk(p);
let k=0;const reg=async id=>{await x.act('rreg',id);await x.ev(k=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Tópico M'+k;g.rows[0].name='Aula M'+k;render()},++k);await x.submit('#modal form[data-f=man]');await W(250)};
await x.ev(()=>{S.blk[0].goal=45;save()});const A=await x.ev(()=>inCycle().map(s=>s.id));await reg(A[0]);await reg(A[1]);
await x.act('bkgo',A[0]);await W(500);await x.act('rvfrs');await W(800);
const rd=()=>x.ev(()=>{const c=document.getElementById('rvfb'),bw=c.getBoundingClientRect().width,g=document.getElementById('rvfbar').getBoundingClientRect().width,xx=c.querySelector('i.gx').getBoundingClientRect().width;return {gl:document.getElementById('rvfgl').textContent,g:+(g/bw*100).toFixed(1),x:+(xx/bw*100).toFixed(1),ov:c.classList.contains('fmov')}});
let r=await rd();console.log('    antes da meta',JSON.stringify(r));ok(/^00:00:0\d de 00:45:00$/.test(r.gl)&&!r.ov&&r.x===0,'antes da meta: "00:00:0x de 00:45:00", sem trecho claro');
await x.ev(()=>{S.rvf.start-=57*60000});await W(1300);r=await rd();console.log('    +12min',JSON.stringify(r));
ok(r.gl==='45min ✓ · +12min','depois da meta: "45min ✓ · +12min"');ok(r.ov&&r.x>19&&r.x<22&&r.g+r.x<=100.1,'barra: meta '+r.g+'% e extra '+r.x+'% (12 de 57 min)');
ok(await x.ev(()=>S.rvf.run),'o cronômetro continua');await p.screenshot({path:`${OUT}/rvf-meta-bloco.png`});
await x.ev(()=>{S.rvf.start-=60*60000});await W(1300);r=await rd();ok(Math.abs(r.x-33.3)<1,'com +1h12 o extra fica em um terço ('+r.x+'%)');
// pausa e recarrega: continua igual
await x.act('rvfpz');await W(400);r=await rd();ok(r.gl==='45min ✓ · +1h12'&&r.ov,'pausado: '+r.gl);
console.log(errs.length?'erros: '+JSON.stringify(errs):'');ok(!errs.length,'sem erros');console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
