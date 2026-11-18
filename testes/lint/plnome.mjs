/* Nome de plano longo sem espaços não pode causar rolagem lateral (360px), em nenhuma aba nem na janela Planos */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const D=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const NM=process.argv[3]||'qconcursos.com/questoes-de-direito-administrativo';
D.plans[0].name=NM;
const {b,p,errs}=await open({w:360,h:740,data:{'ciclo-estudos-v2':JSON.stringify(D),'ciclo-welcome-skip':'1'}});const x=mk(p);
const chk=async t=>{const r=await x.ev(()=>{const W=innerWidth,bad=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>W+1&&!e.closest('[style*="overflow"]')}).slice(-3).map(e=>e.tagName+'#'+e.id+'.'+e.className+' →'+Math.round(e.getBoundingClientRect().right));return {sw:document.documentElement.scrollWidth,bad}});console.log((r.sw>360?'FALHA ':'OK    ')+t+' largura '+r.sw+(r.bad.length?' '+r.bad.join(' | '):''))};
for(const t of ['ciclo','rev','reg','st','bk']){await x.ev(t=>document.querySelector(`nav [data-tab="${t}"]`).click(),t);await W(300);await chk('aba '+t)}
await x.ev(()=>(()=>{document.querySelector('nav [data-tab=ciclo]').click();document.querySelector('#mtt .plsel').click()})());await W(300);await chk('janela Planos');
await x.act('pled').catch(()=>{});await chk('Planos editando');
/* Planos sai do menu: abre pelo nome do plano no Ciclo (com a seta); nas outras abas o título é o nome da aba */
await x.ev(()=>{const c=document.querySelector('#modal [data-act=plclose]');c&&c.click()});await W(300);await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300);
const pm=await x.ev(nm=>{const b=document.querySelector('#mtt .plsel'),v=document.querySelector('#mtt .plsel .chv'),r=v&&v.getBoundingClientRect();return {menu:[...document.querySelectorAll('nav button')].some(e=>/Planos/.test(e.textContent)),btn:!!b&&b.textContent.includes(nm),seta:!!r&&r.width>0&&r.right<=innerWidth,exp:b&&b.getAttribute('aria-expanded')}},NM);
console.log((!pm.menu&&pm.btn&&pm.seta&&pm.exp==='false'?'OK    ':'FALHA ')+'menu sem Planos; no Ciclo, o nome do plano é o botão, com a seta à vista '+JSON.stringify(pm));
await x.ev(()=>document.querySelector('#mtt .plsel').click());await W(300);const ab=await x.ev(()=>({m:!!document.querySelector('#modal .plrow'),exp:document.querySelector('#mtt .plsel').getAttribute('aria-expanded')}));
console.log((ab.m&&ab.exp==='true'?'OK    ':'FALHA ')+'tocar no nome abre os Planos de estudo '+JSON.stringify(ab));await x.ev(()=>{const c=document.querySelector('#modal [data-act=plclose]');c&&c.click()});await W(300);
for(const t of ['rev','reg','st']){await x.ev(t=>document.querySelector(`nav [data-tab="${t}"]`).click(),t);await W(250);const r=await x.ev(()=>!document.querySelector('#mtt .plsel'));console.log((r?'OK    ':'FALHA ')+'aba '+t+': o título não é o botão de planos')}
console.log(errs.join('\n'));await b.close();
