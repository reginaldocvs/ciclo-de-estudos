/* Excluir a disciplina selecionada no plano: a seleção passa para a disciplina da vez (e o cartão Agora mostra uma que existe) */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const DATA=fs.readFileSync(process.argv[2],'utf8');let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const {b,p,errs}=await open({w:390,h:844,data:{'ciclo-estudos-v2':DATA,'ciclo-welcome-skip':'1'}});const x=mk(p);
const sel=await x.ev(()=>{const c=current();S.sel.subj=c.id;save();render();return {id:c.id,name:c.name}});console.log('  selecionada:',sel.name);
await p.evaluate(()=>[...document.querySelectorAll('[data-tab="bk"]')].find(e=>e.getClientRects().length).click());await W(300); /* fora da aba Ciclo, que reescolhe sozinha ao redesenhar */
await x.act('plopen');await x.act('pled');await x.act('pdedit',sel.id);await x.act('sdel',sel.id);
const r=await x.ev(id=>({gone:!S.subjects.some(s=>s.id===id),sel:S.sel.subj,ok:S.subjects.some(s=>s.id===S.sel.subj),cur:(current()||{}).id}),sel.id);
ok(r.gone,'disciplina excluída');ok(r.ok&&r.sel===r.cur,'seleção passou para a disciplina da vez ('+r.sel+')');
await x.act('plclose').catch(()=>{});await p.evaluate(()=>[...document.querySelectorAll('[data-tab="ciclo"]')].find(e=>e.getClientRects().length).click());await W(300);
const nw=await x.ev(()=>(document.querySelector('#app .nwn')||{}).textContent||'');ok(nw&&!nw.includes(sel.name),'cartão Agora mostra outra disciplina: '+nw.trim());
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
