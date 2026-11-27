/* Foto da Revisão › Hoje com a linha da revisão por questões atrasada (tabela, cada coisa na sua coluna).
   Uso: node lint/blocoshoje.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rq;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:800});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};const s=qSubs()[0];[30,31].forEach(m=>{S.sel.subj=s.id;S.sel.groups=[{id:'g'+m,nt:'Tópico R',rows:[{id:'r'+m,kind:'aula',name:'Aula R',link:''}]}];addSession(m)});save();render()});await W(300);
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);
const t=await ev(()=>{const r=[...document.querySelectorAll('.rvtoday .tdg')].find(e=>/questões/.test(e.textContent));return r?[...r.querySelectorAll('.tdc')].map(e=>e.textContent):null});console.log(JSON.stringify(t));
await p.screenshot({path:`saida/blocos-hoje-rq-${w}.png`});console.log(errs.length?'erros':'sem erros');await b.close();
