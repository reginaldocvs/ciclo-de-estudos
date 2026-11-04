/* Nome de tópico comprido: no máximo 2 linhas com reticências em todas as telas onde aparece; a data ao lado continua visível */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const LONG='Direitos e garantias fundamentais: direitos e deveres individuais e coletivos; direito à vida, à liberdade, à igualdade, à segurança e à propriedade; direitos sociais; nacionalidade; cidadania';
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
for(const w of [1280,390]){const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
 // liga a revisão por tópico se estiver desligada
 if(!await x.ev(()=>tvOn())){await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.act('rvadj');await x.ev(()=>document.querySelector('[data-act=rvsys][data-id=t]').click());await W(300);await x.ev(()=>{const c=document.querySelector('#modal [data-act=rvadjx]');c&&c.click()});await W(300);await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300)}
 // registra uma sessão com o tópico longo
 const id=await x.ev(()=>actives().find(s=>!gDone(s)).id);await x.act('rreg',id);
 await x.ev(L=>{const g=S.sel.groups[0];g.nt=L;g.rows=[{id:uid(),kind:'aula',name:'Aula 1',link:'',q:''}];render()},LONG);await x.fill('#modal input[name=m]','1h30');await x.submit('#modal form[data-f=man]');await W(400);
 const chk=async lugar=>{for(let i=0;i<20&&!await x.ev(()=>[...document.querySelectorAll('.tpcl')].some(e=>e.offsetParent&&/Direitos e garantias/.test(e.textContent)));i++)await W(150);const r=await x.ev(()=>[...document.querySelectorAll('.tpcl')].filter(e=>e.offsetParent&&/Direitos e garantias/.test(e.textContent)).map(e=>{const lh=parseFloat(getComputedStyle(e).lineHeight)||20,h=e.getBoundingClientRect().height,par=e.closest('.rvtnf');const sib=par?[...par.children].filter(c=>c!==e).map(c=>{const r=c.getBoundingClientRect(),pr=par.getBoundingClientRect();return c.offsetWidth>0&&r.right<=pr.right+1}):[];return {linhas:Math.round(h/lh),corta:e.scrollHeight>e.clientHeight+1,title:!!(e.title||e.closest('[title]')),lado:sib.every(Boolean)}}));
  console.log('    '+w+' '+lugar+':',JSON.stringify(r));ok(r.length>0&&r.every(z=>z.linhas<=2&&z.title&&z.lado),w+' '+lugar+': nome em até 2 linhas com reticências'+(r.some(z=>z.lado!==undefined)?', data/etiqueta ao lado visível':''))};
 // Registrado neste ciclo
 await x.ev(id=>{const e=[...document.querySelectorAll(`[data-act=rview][data-id="${id}"]`)].find(e=>e.offsetParent);e.click()},id);await W(400);await chk('Registrado neste ciclo');await p.screenshot({path:`${OUT}/tpclamp-${w}-registrado.png`});
 await x.ev(()=>document.querySelector('#modal [data-act=rvclose]').click());await W(300);
 // Histórico
 await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(500);await chk('Histórico');
 await x.ev(()=>{const e=[...document.querySelectorAll('.tpcl')].find(e=>/Direitos e garantias/.test(e.textContent));e&&e.scrollIntoView({block:'center'})});await W(200);await p.screenshot({path:`${OUT}/tpclamp-${w}-historico.png`});
 // lista de tópicos ao registrar (escolher tópico)
 await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300);
 const id2=await x.ev(()=>actives().find(s=>!gDone(s)).id);await x.ev(id=>{const s=S.subjects.find(z=>z.id===id),s0=S.subjects.find(z=>(z.topics||[]).some(t=>t.name.startsWith('Direitos e garantias')));s.topics.push({id:uid(),name:s0.topics.find(t=>t.name.startsWith('Direitos e garantias')).name,done:false,links:[]});save();render()},id2);
 await x.act('rreg',id2);await x.ev(()=>{const g=S.sel.groups[0];ui.dd=g.id;render()});await W(300);await chk('lista de tópicos do registro');await x.ev(()=>{ui.dd=null;document.querySelector('#modal [data-act=xcancel],#modal .x')?.click()});await W(300);
 // Próximas: quadradinho e data na altura da 1ª linha do nome
 await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=topicos]');e&&e.click()});await W(400);
 const al=await x.ev(()=>[...document.querySelectorAll('.trvx')].filter(e=>e.offsetParent).map(r=>{const n=r.querySelector('.trvxn')||r.querySelector('.tpcl'),d=r.querySelector(':scope>.dot'),t=r.querySelector(':scope>.trvd'),nb=n.getBoundingClientRect(),lh=parseFloat(getComputedStyle(n).lineHeight),db=d.getBoundingClientRect(),tb=t.getBoundingClientRect();return {l:Math.round(nb.height/lh),dc:Math.round((db.top+db.bottom)/2-(nb.top+lh/2)),dt:Math.round(tb.top-nb.top)}}));
 console.log('    '+w+' Próximas:',JSON.stringify(al));ok((w>600||al.some(a=>a.l===2))&&al.every(a=>Math.abs(a.dc)<=2&&a.dt>=-2&&a.dt<=4),w+' Próximas: quadradinho e data na altura da primeira linha');
 // revisão por tópico: 7 dias depois, lista e registro
 await x.days(7);await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=topicos]');e&&e.click()});await W(300);
 await chk('Revisão por tópico');const k=await x.ev(()=>{const o=trvDue().find(o=>o.tp.name.startsWith('Direitos e garantias'));return o&&o.k});
 if(k){await x.act('trvok',k);await W(300);await chk('registro da revisão por tópico');await p.screenshot({path:`${OUT}/tpclamp-${w}-revisao.png`});await x.ev(()=>document.querySelector('#modal [data-act=trvx],#modal .x')?.click());await W(300)}
 // calendário
 await x.ev(()=>{const b=document.querySelector('[data-act=rvcalm]');b&&b.click()});await W(400);await x.ev(()=>{const d=[...document.querySelectorAll('[data-act=rcday]')].find(e=>e.querySelector('.rcq,.rcn')||/\d+\s*\d/.test(e.textContent));d&&d.click()});await W(300);
 const cal=await x.ev(()=>[...document.querySelectorAll('.tdn.tpcl')].filter(e=>e.offsetParent).length);if(cal)await chk('calendário');
 ok(!errs.length,w+': sem erros '+JSON.stringify(errs));await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
