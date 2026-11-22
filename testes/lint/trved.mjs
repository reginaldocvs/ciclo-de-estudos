/* Histórico › revisão por tópico: lápis abre "Editar revisão" (só tempo e acertos; a data fica, ela é a âncora da agenda).
   Salvar muda o registro e a agenda do tópico (S.trv.t[k].q[data]) juntos; Esc e Cancelar fecham sem mudar nada.
   Uso: node lint/trved.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const D=fs.readFileSync(F,'utf8');
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':D,'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
/* um registro de revisão por tópico, com acertos numa aula */
const id=await ev(()=>{let r=S.sessions.find(x=>x.trv&&(x.items||[]).some(i=>+i.tq>0));if(!r){r=S.sessions.find(x=>x.trv);if(r){r.items=r.items&&r.items.length?r.items:[{kind:'aula',name:'Aula X',link:''}];r.items[0].ac=5;r.items[0].tq=10;save()}}return r&&r.id});
ok(!!id,'há um registro de revisão por tópico');
const before=await ev(id=>{const r=S.sessions.find(x=>x.id===id);return {date:r.date,trvd:r.trvd,k:r.trv,min:r.min}},id);
await ev(()=>[...document.querySelectorAll('[data-tab=reg]')].find(e=>e.getClientRects().length).click());await W(400);
await ev(()=>{ui.hq='';render()});
/* o registro pode estar além da primeira página: abre a lista toda */
for(let i=0;i<10;i++){const has=await ev(id=>!!document.querySelector(`[data-act=trved][data-id="${id}"]`),id);if(has)break;await ev(()=>{const m=[...document.querySelectorAll('#hres [data-act]')].find(e=>/Mostrar mais/.test(e.textContent));m&&m.click()});await W(250)}
ok(await ev(id=>!!document.querySelector(`[data-act=trved][data-id="${id}"]`),id),'Histórico: lápis na revisão por tópico');
await ev(id=>document.querySelector(`[data-act=trved][data-id="${id}"]`).click(),id);await W(400);
let r=await ev(()=>{const d=document.querySelector('.dlg[aria-label="Editar revisão"]');return d?{date:!d.querySelector('input[type=date]'),m:!!d.querySelector('[name=m]'),qa:d.querySelectorAll('input[name^=qa]').length,note:/A data não muda aqui/.test(d.textContent)}:null});
ok(r&&r.date&&r.m&&r.qa>=1&&r.note,'janela Editar revisão: tempo e acertos, sem campo de data '+JSON.stringify(r));
await p.keyboard.press('Escape');await W(300);ok(await ev(()=>!ui.trved&&!document.querySelector('.dlg[aria-label="Editar revisão"]')),'Esc fecha');
await ev(id=>document.querySelector(`[data-act=trved][data-id="${id}"]`).click(),id);await W(400);
await ev(()=>{const d=document.querySelector('.dlg[aria-label="Editar revisão"]');const set=(n,v)=>{const i=d.querySelector(`[name="${n}"]`);i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}))};set('m','0h35');const a=d.querySelector('input[name^=qa]'),t=d.querySelector('input[name^=qt]');a.value='8';t.value='10';a.dispatchEvent(new Event('input',{bubbles:true}));t.dispatchEvent(new Event('input',{bubbles:true}));d.querySelector('form').requestSubmit()});await W(400);
r=await ev(id=>{const r=S.sessions.find(x=>x.id===id),q=(r.items||[]).find(i=>+i.tq>0)||r,T=S.trv.t[r.trv]||{};return {min:r.min,ac:q.ac,tq:q.tq,date:r.date,trvd:r.trvd,tq2:(T.q||{})[r.trvd||r.date],open:!!ui.trved}},id);
ok(r.min===35&&r.ac===8&&r.tq===10&&!r.open,'salvar: tempo 35min e 8 de 10 no registro '+JSON.stringify(r));
ok(r.tq2&&r.tq2.a===8&&r.tq2.t===10,'agenda do tópico com os mesmos acertos '+JSON.stringify(r.tq2));
ok(r.date===before.date&&r.trvd===before.trvd,'a data não mudou');
ok(await ev(()=>/Revisão atualizada/.test((document.getElementById('undo')||document.body).textContent)),'aviso "Revisão atualizada"');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
