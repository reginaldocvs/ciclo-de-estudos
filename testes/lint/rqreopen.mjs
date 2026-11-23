/* Painel da sessão › "Revisar com questões": antecipa a revisão da sessão anterior só quando a próxima é uma sessão nova.
   - a mesma disciplina na posição seguinte do ciclo: sessão nova → aparece (revisa a sessão 1 na 2);
   - concluída: some (a próxima sessão é no outro ciclo);
   - reiniciada (Reiniciar meta): some (o próximo registro se junta à mesma sessão 1).
   Uso: node lint/rqreopen.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rq;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>document.querySelector('nav [data-tab=ciclo]')?.click());await W(200);
const reg=(id,m)=>ev(([id,m])=>{S.sel.subj=id;S.sel.groups=[{id:'g'+m,nt:'Tópico R',rows:[{id:'r'+m,kind:'aula',name:'Aula R',link:''}]}];addSession(m);save();render()},[id,m]).then(()=>W(300));
const btn=id=>ev(id=>{document.querySelector(`[data-act=pickrow][data-id="${id}"]`)?.click()},id).then(()=>W(250)).then(()=>ev(id=>{const s=S.subjects.find(x=>x.id===id);return {btn:!!document.querySelector('.edp .rqfmb'),done:prog(id)>=s.goal}},id));
/* a disciplina que aparece duas vezes no ciclo: P1 e P2 (mesma base) */
const [P1,P2]=await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};save();const L=actives(),by={};L.forEach(x=>{const b=x.of||x.id;(by[b]=by[b]||[]).push(x.id)});return Object.values(by).find(v=>v.length>1)});
ok(!!P2,'há disciplina repetida no ciclo');
await reg(P1,30);
let r=await btn(P2);ok(r.btn&&!r.done,'2ª posição da mesma disciplina: sessão nova, aparece "Revisar com questões" (revisa a 1ª) '+JSON.stringify(r));
r=await btn(P1);ok(r.done&&!r.btn,'1ª posição, já registrada (concluída): some '+JSON.stringify(r));
let st=await ev(()=>(document.querySelector('.edp .edrq')||{}).textContent||'');ok(/Próxima revisão por questões: sessão 2/.test(st),'concluída: diz quando vem a próxima revisão ('+st+')');
await ev(id=>{const b=srBase({subj:id});S.sessions.push({id:uid(),ses:uid(),rid:'rq-t1',subj:b.id,topic:null,min:0,cycle:S.cycle,set:S.set||1,review:true,kind:'aula',items:[],date:today(),ac:8,tq:10});save();render()},P1);await W(300);await btn(P1);
st=await ev(()=>(document.querySelector('.edp .edrq')||{}).textContent||'');ok(/✓ Revisão por questões feita · 8\/10 \(80%\)/.test(st),'feita neste ciclo: ✓ com o placar ('+st+')');
await ev(()=>document.querySelector('.edp .edrqv').click());await W(400);ok(await ev(()=>!!document.querySelector('.dlg.edlg')&&!!S.edit),'olho abre o registro da revisão');await p.keyboard.press('Escape');await W(300);
await ev(id=>{const L=S.sessions.filter(x=>x.subj===id&&!x.review&&x.cycle===S.cycle),l=L[L.length-1];S.reopen=S.reopen||{};S.reopen[id]={cycle:S.cycle,ses:l.ses||l.id,set:S.set||1};S.progress[id]=0;save();render()},P1);await W(300);
r=await btn(P1);ok(!r.done&&!r.btn,'1ª posição reiniciada: some (o próximo registro se junta à mesma sessão 1) '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
