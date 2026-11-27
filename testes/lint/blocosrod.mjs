/* Foto do cartão Rodadas (edição do plano), fechado e aberto. Uso: node lint/blocosrod.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{ui.pl=true;ui.ple=S.plan;S.rodOpen=false;render()});await W(1200);
const sh=async n=>{const r=await ev(()=>{const e=document.querySelector('.rodh');if(!e)return null;const c=e.closest('.card').getBoundingClientRect();e.closest('.card').scrollIntoView({block:'center'});return 1});if(!r){console.log('sem cartão Rodadas');return}await W(700);const c=await ev(()=>{const r=document.querySelector('.rodh').closest('.card').getBoundingClientRect();return {x:r.left-8,y:r.top-8,width:r.width+16,height:r.height+16}});await p.screenshot({path:`saida/blocos-rodadas-${n}-${w}.png`,clip:c})};
await sh('fechado');await ev(()=>document.querySelector('.rodh').click());await W(250);await sh('aberto');
console.log(errs.length?'erros '+errs[0]:'sem erros');await b.close();
