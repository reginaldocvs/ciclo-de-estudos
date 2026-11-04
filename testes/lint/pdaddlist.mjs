/* Adicionar tópicos: mostra os tópicos atuais (só consulta, até 2 linhas cada, rola se for longa) acima do campo vazio; adicionar mantém tudo */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
for(const w of [1280,390]){const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:860});const x=mk(p);
 const sid=await x.ev(()=>{const s=S.subjects.find(s=>!s.off&&!s.of);s.topics=s.topics||[];s.topics.push({id:uid(),name:'1 - Direitos e garantias fundamentais: direitos e deveres individuais e coletivos; direito à vida, à liberdade, à igualdade, à segurança e à propriedade; direitos sociais',done:false,links:[]});for(let i=2;i<=12;i++)s.topics.push({id:uid(),name:i+' - Tópico de teste '+i,done:false,links:[]});save();render();return s.id});
 await x.ev(()=>document.querySelector('nav [data-act=plopen]').click());await W(500);await x.ev(()=>document.querySelector('#modal [data-act=pled]').click());await W(500);
 await x.ev(id=>document.querySelector(`[data-act=pdedit][data-id="${id}"]`).click(),sid);await W(400);
 const n0=await x.ev(()=>ui.pdd.topics.length);await x.ev(id=>document.querySelector(`[data-act=pdaddopen][data-id="${id}"]`).click(),sid);await W(400);
 const r=await x.ev(()=>{const l=document.querySelector('.pdadd .pdcurl'),it=l?[...l.children]:[];const lh=it[0]?parseFloat(getComputedStyle(it[0]).lineHeight):20;return {h:document.querySelector('.pdadd .pdcurh')?.textContent,n:it.length,rola:l&&l.scrollHeight>l.clientHeight,max2:it.every(e=>Math.round(e.getBoundingClientRect().height/lh)<=2),vazio:document.getElementById('pdaddt').value==='',foco:document.activeElement&&document.activeElement.id==='pdaddt',cabe:(()=>{const d=document.querySelector('.pdadd').getBoundingClientRect();return d.bottom<=innerHeight+1&&d.top>=-1})()}});
 console.log('    '+w,JSON.stringify(r));ok(r.n===n0&&r.h==='Tópicos atuais ('+n0+')','lista os '+n0+' tópicos atuais');ok(r.rola&&r.max2,'lista longa rola e cada nome tem até 2 linhas');ok(r.vazio&&r.foco,'campo começa vazio e com o cursor');ok(r.cabe,'janela cabe na tela');
 await p.screenshot({path:`${OUT}/pdadd-${w}.png`});
 await x.fill('#pdaddt','Tópico novo A\n2 - Tópico de teste 2\nTópico novo B');await x.submit('form[data-f=pdadd]');await W(400);
 const n1=await x.ev(()=>ui.pdd.topics.map(t=>t.name));ok(n1.length===n0+2&&n1.includes('Tópico novo A')&&n1.includes('Tópico novo B'),'adiciona os novos e ignora o repetido ('+n0+' → '+n1.length+')');
 ok(!errs.length,w+': sem erros '+JSON.stringify(errs));await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
