/* Lembrete de backup: sem backup e com registros de mais de 30 dias, pontinho na engrenagem e linha em destaque em Configurações;
   salvar backup apaga o lembrete; passados 30 dias do último, volta; sem registros antigos, nada aparece */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
const old=new Date(Date.now()-40*864e5).toISOString().slice(0,10);
S0.sessions=[{id:'b1',ses:'b1',subj:S0.subjects[0].id,topic:null,min:90,cycle:1,set:1,review:false,kind:'aula',items:[],date:old}];
for(const w of [390,1280]){const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:860});const x=mk(p);
 const dot=()=>x.ev(()=>[...document.querySelectorAll('[data-tab=bk]')].some(e=>e.offsetParent&&e.classList.contains('bkdue')&&getComputedStyle(e,'::after').content!=='none'));
 ok(await dot(),w+': sem backup e com registro de 40 dias atrás: pontinho na engrenagem');await p.screenshot({path:`${OUT}/bk-${w}-pontinho.png`,clip:{x:0,y:0,width:w,height:w<600?80:900}});
 await x.ev(()=>[...document.querySelectorAll('[data-tab=bk]')].find(e=>e.offsetParent).click());await W(400);
 let t=await x.ev(()=>{const e=document.querySelector('.bkinfo');return e&&{t:e.textContent,due:e.classList.contains('due')}});ok(t&&t.due&&/ainda não salvou/.test(t.t),w+': Configurações: "'+(t&&t.t)+'" em destaque');
 await x.ev(()=>document.querySelector('.bkinfo').scrollIntoView({block:'center'}));await p.screenshot({path:`${OUT}/bk-${w}-config.png`});
 await x.ev(()=>{document.dispatchEvent(new Event('pointerdown'));document.querySelector('[data-act=bkout]').click()});await W(500);
 t=await x.ev(()=>{const e=document.querySelector('.bkinfo');return {t:e.textContent,due:e.classList.contains('due')}});ok(!t.due&&/^Último backup: hoje \(\d\d\/\d\d\/\d{4}\)$/.test(t.t)&&!(await dot()),w+': salvou: "'+t.t+'" e o pontinho some');
 await x.days(31);await x.ev(()=>[...document.querySelectorAll('[data-tab=bk]')].find(e=>e.offsetParent).click());await W(400);
 t=await x.ev(()=>{const e=document.querySelector('.bkinfo');return {t:e.textContent,due:e.classList.contains('due')}});ok(t.due&&/há 31 dias.*Vale salvar um novo\./.test(t.t)&&await dot(),w+': 31 dias depois: "'+t.t+'" e o pontinho volta');
 ok(!errs.length,w+': sem erros '+JSON.stringify(errs));await b.close()}
// sem registros antigos: nada
{const S1=JSON.parse(JSON.stringify(S0));S1.sessions[0].date=new Date().toISOString().slice(0,10);const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S1),'ciclo-welcome-skip':'1'},w:390,h:860});const x=mk(p);
 ok(!(await x.ev(()=>[...document.querySelectorAll('[data-tab=bk]')].some(e=>e.classList.contains('bkdue')))),'registros recentes e sem backup: ainda sem pontinho');await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
