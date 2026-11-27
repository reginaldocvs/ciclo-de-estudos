/* Fotos dos blocos de abrir e fechar (cabeçalho com a setinha na ponta direita) em cada aba da Revisão.
   Uso: node lint/blocos.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);
const T=await ev(()=>[...document.querySelectorAll('[data-act=rvt]')].map(e=>e.dataset.id));console.log('abas: '+T.join(','));
for(const t of T){await ev(t=>document.querySelector(`[data-act=rvt][data-id="${t}"]`).click(),t);await W(300);
 /* abre tudo o que estiver fechado */
 for(let k=0;k<6;k++){const n=await ev(()=>{const L=[...document.querySelectorAll('main [aria-expanded=false].trvgh,main [aria-expanded=false].srtg')];L.slice(0,1).forEach(e=>e.click());return L.length});await W(150);if(!n)break}
 const n=await ev(()=>document.querySelectorAll('main .trvgh,main .srtg').length);
 await p.screenshot({path:`saida/blocos-${t}-${w}.png`,fullPage:true});console.log(t+': '+n+' blocos')}
console.log(errs.length?'erros: '+errs.slice(0,2).join(' | '):'sem erros');await b.close();
