/* Ciclo concluído no visual novo: a tabela continua, e o painel mostra "Ciclo concluído ✓", o resumo (período, dias, tópicos),
   o botão do próximo ciclo e a revisão de hoje; o cartão antigo não aparece. Uso: node lint/cfin.mjs <dados.json> [largura=1366] [saída.png] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD,OUT]=process.argv.slice(2);const w=+(WD||1366);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};S0.sessions=[];S0.progress={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
await x.ev(()=>document.querySelector('[data-tab=ciclo]')&&[...document.querySelectorAll('[data-tab=ciclo]')].find(e=>e.offsetParent).click());await W(200);
/* registra todas as disciplinas da vez até fechar o ciclo */
const ids=await x.ev(()=>actives().map(s=>s.id));
for(let i=0;i<ids.length;i++){await x.ev(([id,i])=>{const s=S.subjects.find(x=>x.id===id),t=s.topics[0];S.sel.subj=id;S.sel.groups=[{id:'g'+i,nt:t?t.name:'Tópico',rows:[{id:'r'+i,kind:'aula',name:'Aula '+(i+1),link:''}]}];addSession(s.goal);save();render()},[ids[i],i]);await W(150)}
const r=await x.ev(()=>{const p=document.querySelector('.edp');return {cur:!!current(),edx:!!document.querySelector('.edx'),old:!!document.querySelector('.cfin'),lbl:p&&p.getAttribute('aria-label'),h:p&&p.querySelector('.edpn')&&p.querySelector('.edpn').textContent.trim(),dt:p?[...p.querySelectorAll('.edfin dt')].map(e=>e.textContent):[],go:p&&p.querySelector('[data-act=next]')&&p.querySelector('[data-act=next]').textContent.trim(),rv:!!(p&&p.querySelector('.edrvs')),rows:document.querySelectorAll('.edt .edr.srow').length,hi:document.querySelectorAll('.edt .edr.srow.cur').length,ov:document.documentElement.scrollWidth>innerWidth}});
ok(!r.cur&&r.edx&&!r.old,'ciclo concluído usa a tabela nova, sem o cartão antigo '+JSON.stringify({cur:r.cur,edx:r.edx,old:r.old}));
ok(r.lbl==='Ciclo concluído'&&/^Ciclo concluído/.test(r.h)&&r.dt.join()==='Dias,Período,Tópicos'&&/^Iniciar ciclo 2$/.test(r.go)&&r.rv,'painel: título, resumo, próximo ciclo e revisão de hoje '+JSON.stringify(r));
ok(r.rows===ids.length&&r.hi===0&&!r.ov,'todas as disciplinas na tabela, nenhuma grifada, sem rolagem lateral');
/* resumo numa linha só: o período não quebra */
ok(await x.ev(()=>{const d=document.querySelector('.edp .edf-p dd');return d&&d.scrollWidth<=d.clientWidth+1&&d.getBoundingClientRect().height<40}),'período numa linha só');
if(OUT)await p.screenshot({path:OUT});
await x.ev(()=>document.querySelector('.edp [data-act=next]').click());await W(300);
ok(await x.ev(()=>S.cycle===2&&!!current()&&!!document.querySelector('.edp .nwplay')&&document.querySelectorAll('.edt .edr.srow.cur').length===1),'Iniciar ciclo 2: volta a sessão da vez, com a linha grifada');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
