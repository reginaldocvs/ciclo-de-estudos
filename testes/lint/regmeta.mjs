/* Registrar sem cronômetro: o tempo já vem com o que falta para a meta (meta inteira se nada foi feito; 0h00 se já cumpriu);
   com tempo no cronômetro, vem o do cronômetro; registrar sem mexer grava esse tempo.
   Uso: node lint/regmeta.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:844});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const sid=await ev(()=>{const s=S.subjects.find(x=>!x.of&&!x.off&&x.goal>=60&&!gDone(x));S.progress[s.id]=0;save();render();return s.id});
const reg=()=>ev(id=>{ui.rqreg=null;S.sx=false;S.timer={running:false,start:0,acc:0};if(S.paused)delete S.paused[id];render();const b=[...document.querySelectorAll(`[data-act=rreg][data-id="${id}"]`)].find(e=>e.getClientRects().length);b.click()},sid).then(()=>W(250));
const fld=()=>ev(()=>(document.querySelector('[data-f=man] [name=m]')||{}).value);
await reg();let r={v:await fld(),g:await ev(id=>tmFmt(S.subjects.find(x=>x.id===id).goal),sid)};ok(r.v===r.g,'nada estudado: vem a meta inteira '+JSON.stringify(r));
await ev(id=>{S.progress[id]=30;S.sx=false;save()},sid);await reg();r={v:await fld(),g:await ev(id=>tmFmt(S.subjects.find(x=>x.id===id).goal-30),sid)};ok(r.v===r.g,'30 min feitos: vem o que falta '+JSON.stringify(r));
ok(await ev(id=>{const o=S.progress[id];S.progress[id]=S.subjects.find(x=>x.id===id).goal+10;S.sel.subj=id;const v=regGoalMs();S.progress[id]=o;return v===0},sid),'meta cumprida (ou passada): nada a sugerir (0h00)');
/* com tempo no cronômetro, vem o do cronômetro */
await ev(id=>{S.progress[id]=0;S.sx=false;S.paused=S.paused||{};S.paused[id]={ms:25*60000,d0:today()};save();render();const b=[...document.querySelectorAll(`[data-act=rreg][data-id="${id}"]`)].find(e=>e.getClientRects().length);b.click()},sid);await W(250);
ok(await fld()==='0h25','com tempo no cronômetro: vem o do cronômetro (0h25)');
/* registrar sem mexer grava o que falta */
await reg();const before=await ev(()=>S.sessions.length);await ev(()=>{S.sel.groups=null;const f=document.querySelector('[data-f=man]');f.requestSubmit()});await W(300);
r=await ev(([id,n])=>{const L=S.sessions.slice(n);return {n:L.length,min:Math.round(L.reduce((a,x)=>a+x.min,0)),g:S.subjects.find(x=>x.id===id).goal}},[sid,before]);ok(r.n>=1&&r.min===r.g,'registrar sem mexer grava a meta '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
