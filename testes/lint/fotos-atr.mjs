/* Fotos do ajuste: revisão por questões da vez no painel, atrasadas na Revisão de hoje. Uso: node lint/fotos-atr.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rq;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(200);
/* a disciplina repetida no ciclo: registra a sessão 1 e a 2 (a 1ª revisão da 1 vencia na 2 e ficou atrasada); a 3 começa com o relógio */
const r=await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};const L=actives(),by={};L.forEach(x=>{const b=x.of||x.id;(by[b]=by[b]||[]).push(x.id)});const P=Object.values(by).find(v=>v.length>2)||Object.values(by).find(v=>v.length>1);
 const reg=(id,m,t)=>{S.sel.subj=id;S.sel.groups=[{id:'g'+m,nt:t,rows:[{id:'r'+m,kind:'aula',name:'Aula '+m,link:''}]}];addSession(m)};const g=id=>S.subjects.find(x=>x.id===id).goal;reg(P[0],g(P[0]),'Tópico 1');reg(P[1],g(P[1]),'Tópico 2');
 S.cycle++;S.progress={};const nx=P[0];S.sel.subj=nx;S.timer={running:true,start:Date.now()-60000,acc:0};save();render();const b=srBase({subj:nx}).id;return {D:rqDue(b).map(z=>({m:z.m,i:z.i,late:z.late})),btn:(document.querySelector('.edp .rqfmb')||{}).textContent,hoje:[...document.querySelectorAll('.edrvs .edrv')].map(e=>e.textContent)}});
console.log(JSON.stringify(r));await W(300);await p.screenshot({path:`saida/atr-painel-${w}.png`});
await ev(()=>document.querySelector('.edp .rqfmb').click());await W(400);await p.screenshot({path:`saida/atr-janela-vez-${w}.png`});
await ev(()=>{ui.rqreg=null;ui.rqlt=null;render()});await W(200);await ev(()=>{const e=document.querySelector('.edrvs [data-act=rqlate]');e&&e.click()});await W(400);await p.screenshot({path:`saida/atr-janela-atrasadas-${w}.png`});
console.log(errs.length?'ERROS '+errs[0]:'sem erros');await b.close();
