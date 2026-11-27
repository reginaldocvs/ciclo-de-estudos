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
let st=await ev(()=>(document.querySelector('.edp .edrq')||{}).textContent||'');ok(/Próxima revisão: sessão 2/.test(st),'concluída: diz quando vem a próxima revisão ('+st+')');
/* as duas posições concluídas: o Revisar fica na sessão que trouxe a revisão (a 2ª), dizendo o que revisa; a 1ª (a revisada) só diz quando */
await reg(P2,30);r=await btn(P2);st=await ev(()=>[...document.querySelectorAll('.edp .edrq')].map(e=>e.textContent).join(' | '));
ok(r.done&&r.btn&&/Revisão: agora · sessão 1 · 1ª/.test(st)&&/Próxima revisão desta sessão: sessão 3/.test(st),'2ª posição concluída: Revisar com "sessão 1 · 1ª" e a próxima desta sessão ('+st+')');
ok(await ev(()=>!/sessão 1 · 1ª/.test(document.querySelector('.edrvs').textContent)),'com o Revisar no painel, a Revisão de hoje não repete a disciplina');
r=await btn(P1);st=await ev(()=>(document.querySelector('.edp .edrq')||{}).textContent||'');
ok(!r.btn&&/1ª revisão: agora, na sessão 2/.test(st),'1ª posição (a revisada): sem botão, diz "1ª revisão: agora, na sessão 2" ('+st+')');
ok(await ev(()=>/sessão 1 · 1ª/.test(document.querySelector('.edrvs').textContent)),'sem o Revisar no painel, a Revisão de hoje lembra a revisão');
await ev(id=>{S.sessions=S.sessions.filter(x=>x.subj!==id);S.progress[id]=0;save();render()},P2);await W(300);
await ev(id=>{const b=srBase({subj:id});S.sessions.push({id:uid(),ses:uid(),rid:'rq-t1',subj:b.id,topic:null,min:0,cycle:S.cycle,set:S.set||1,review:true,kind:'aula',items:[],date:today(),ac:8,tq:10});save();render()},P1);await W(300);await btn(P1);
st=await ev(()=>(document.querySelector('.edp .edrq')||{}).textContent||'');ok(/✓ Revisão por questões · 8\/10 \(80%\)/.test(st),'feita neste ciclo: ✓ com o placar ('+st+')');
ok(await ev(()=>!document.querySelector('.edp .edrqv')),'sem olho na linha do painel');
await ev(id=>{const L=S.sessions.filter(x=>x.subj===id&&!x.review&&x.cycle===S.cycle),k=L[L.length-1].ses||L[L.length-1].id;S.rq.d=S.rq.d||{};S.rq.d[k]={0:{p:'t1',r:true}};const r=S.sessions.find(x=>x.rid==='rq-t1');r.topic=L[L.length-1].topic;save();ui.rview=id;render()},P1);await W(400);
let vr=await ev(()=>{const d=document.querySelector('.dlg.reg[aria-label="Registro da disciplina"]');return d?{tabs:[...d.querySelectorAll('.sttab')].map(e=>e.textContent),txt:d.textContent.replace(/\s+/g,' ')}:null});
ok(vr&&/^O que foi estudado( · .*)?,Acertos na revisão$/.test(vr.tabs.join())&&/1ª revisão/.test(vr.txt)&&/8\/10 · 80%/.test(vr.txt),'Ver registro: "O que foi estudado" e "Acertos na revisão" com 1ª revisão 8/10 '+JSON.stringify(vr&&vr.tabs));
await ev(()=>{ui.rview=null;render()});
await ev(id=>{const L=S.sessions.filter(x=>x.subj===id&&!x.review&&x.cycle===S.cycle),l=L[L.length-1];S.reopen=S.reopen||{};S.reopen[id]={cycle:S.cycle,ses:l.ses||l.id,set:S.set||1};S.progress[id]=0;save();render()},P1);await W(300);
r=await btn(P1);ok(!r.done&&!r.btn,'1ª posição reiniciada: some (o próximo registro se junta à mesma sessão 1) '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
