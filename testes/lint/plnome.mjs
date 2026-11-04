/* Nome de plano longo sem espaços não pode causar rolagem lateral (360px), em nenhuma aba nem na janela Planos */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const D=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const NM=process.argv[3]||'qconcursos.com/questoes-de-direito-administrativo';
D.plans[0].name=NM;
const {b,p,errs}=await open({w:360,h:740,data:{'ciclo-estudos-v2':JSON.stringify(D),'ciclo-welcome-skip':'1'}});const x=mk(p);
const chk=async t=>{const r=await x.ev(()=>{const W=innerWidth,bad=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>W+1&&!e.closest('[style*="overflow"]')}).slice(-3).map(e=>e.tagName+'#'+e.id+'.'+e.className+' →'+Math.round(e.getBoundingClientRect().right));return {sw:document.documentElement.scrollWidth,bad}});console.log((r.sw>360?'FALHA ':'OK    ')+t+' largura '+r.sw+(r.bad.length?' '+r.bad.join(' | '):''))};
for(const t of ['ciclo','rev','reg','st','bk']){await x.ev(t=>document.querySelector(`nav [data-tab="${t}"]`).click(),t);await W(300);await chk('aba '+t)}
await x.act('plopen');await chk('janela Planos');
await x.act('pled').catch(()=>{});await chk('Planos editando');
console.log(errs.join('\n'));await b.close();
