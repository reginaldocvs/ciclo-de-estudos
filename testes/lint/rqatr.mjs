/* Revisão por questões: a da vez no painel, as atrasadas na Revisão de hoje (desde 2026-11-28).
   - com a sessão 3 em andamento: "Revisar com questões (1)" abre só a sessão 2 ("durante a sessão 3"); a Revisão de hoje mostra a sessão 1 atrasada e abre só ela ("atrasadas");
   - registrar a atrasada pela Revisão de hoje: ela some; o botão do painel continua com a da vez;
   - posição concluída (o Revisar do painel leva tudo): a Revisão de hoje não repete a disciplina (no rqreopen).
   Uso: node lint/rqatr.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rq;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(200);
const D=await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};const L=actives(),by={};L.forEach(x=>{const b=x.of||x.id;(by[b]=by[b]||[]).push(x.id)});const P=Object.values(by).find(v=>v.length>1);
 const g=id=>S.subjects.find(x=>x.id===id).goal,reg=(id,m,t)=>{S.sel.subj=id;S.sel.groups=[{id:'g'+t,nt:t,rows:[{id:'r'+t,kind:'aula',name:'Aula '+t,link:''}]}];addSession(m)};reg(P[0],g(P[0]),'T1');reg(P[1],g(P[1]),'T2');
 S.cycle++;S.progress={};S.sel.subj=P[0];S.timer={running:true,start:Date.now()-60000,acc:0};hideUndo();save();render();return {p0:P[0],b:srBase({subj:P[0]}).id}});await W(300);
const st=()=>ev(b=>({btn:(document.querySelector('.edp .rqfmb')||{}).textContent||'',hoje:[...document.querySelectorAll('.edrvs .edrv')].map(e=>({t:e.textContent.replace(/\s+/g,' '),a:(e.querySelector('[data-act^=rq]')||{}).dataset?.act}))}),D.b);
let r=await st();ok(/Revisar com questões \(1\)/.test(r.btn),'painel: "Revisar com questões (1)", só a da vez '+r.btn);
ok(r.hoje.some(h=>/sessão 1 · 1ª\s*atrasada/.test(h.t)&&h.a==='rqlate'),'Revisão de hoje: a sessão 1 atrasada '+JSON.stringify(r.hoje));
await ev(()=>document.querySelector('.edp .rqfmb').click());await W(300);
r=await ev(()=>{const d=document.querySelector('[data-f=rqreg]');return d?{s:d.textContent,sub:d.closest('.dlg').querySelector('.trvok .mut').textContent,n:d.querySelectorAll('.rqblk,.rqses').length}:null});
ok(r&&/durante a sessão 3/.test(r.sub)&&/Sessão 2/.test(r.s)&&!/Sessão 1/.test(r.s),'janela do painel: só a sessão 2, "durante a sessão 3" '+JSON.stringify(r));
await ev(()=>document.querySelector('[data-act=rqregx]').click());await W(200);
await ev(()=>document.querySelector('.edrvs [data-act=rqlate]').click());await W(300);
r=await ev(()=>{const d=document.querySelector('[data-f=rqreg]');return d?{s:d.textContent,sub:d.closest('.dlg').querySelector('.trvok .mut').textContent}:null});
ok(r&&/atrasadas/.test(r.sub)&&/Sessão 1/.test(r.s)&&!/Sessão 2/.test(r.s),'janela da Revisão de hoje: só a sessão 1, "atrasadas" '+JSON.stringify(r));
await ev(()=>{const f=document.querySelector('[data-f=rqreg]');f.querySelectorAll('input[name^=qa-]').forEach(i=>{i.value='7';const t=f.querySelector('[name="'+i.name.replace('qa-','qt-')+'"]');t.value='10'});f.requestSubmit()});await W(400);
r=await st();ok(!r.hoje.some(h=>/sessão 1/.test(h.t))&&/Revisar com questões \(1\)/.test(r.btn),'registrada a atrasada: some da Revisão de hoje; o painel continua com a da vez '+JSON.stringify(r));
ok(await ev(b=>rqDue(b).filter(z=>z.late).length===0&&rqDue(b,true).filter(z=>!z.late).length===1,D.b),'fila: nenhuma atrasada, a da vez continua');
/* posição concluída (o Revisar do painel leva tudo e a Revisão de hoje não repete): conferido no rqreopen */
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
