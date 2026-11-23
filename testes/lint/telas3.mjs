/* As três telas especiais da aba Ciclo no visual novo (tabela + painel), e nunca o layout antigo (.c2):
   1) a vez de um ponto de revisão de bloco: painel com o cartão do bloco, nenhuma linha grifada;
   2) o ciclo de revisão (revisão por ciclos): painel "Revisando/Agora", tópicos para revisar, Cancelar e Editar revisão;
   3) a janela de editar um registro aberta: o fundo continua na tabela nova.
   Uso: node lint/telas3.mjs <dados.json> [largura=1366] [pasta de prints] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD,OUT]=process.argv.slice(2);const w=+(WD||1366);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};S0.sessions=[];S0.progress={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
const shot=n=>OUT?p.screenshot({path:`${OUT}/telas3-${n}-${w}.png`}):null;
const tab=t=>x.ev(t=>[...document.querySelectorAll(`[data-tab="${t}"]`)].find(e=>e.offsetParent).click(),t).then(()=>W(300));
const reg=i=>x.ev(i=>{const s=current();if(!s)return false;const t=s.topics[0];S.sel.subj=s.id;S.sel.groups=[{id:'g'+i,nt:t?t.name:'Tópico',rows:[{id:'r'+i,kind:'aula',name:'Aula '+(i+1),link:''}]}];addSession(s.goal);save();render();return true},i).then(r=>W(200).then(()=>r));
const st=()=>x.ev(()=>({edx:!!document.querySelector('.edx'),old:!!document.querySelector('.c2'),lbl:(document.querySelector('.edp')||{getAttribute:()=>null}).getAttribute('aria-label'),blk:!!document.querySelector('.edp .blkc'),hi:document.querySelectorAll('.edt .edr.srow.cur').length,ov:document.documentElement.scrollWidth>innerWidth}));
await tab('ciclo');
/* 1) revisão de bloco: um ponto depois da 1ª disciplina */
await x.ev(()=>{S.blk=[{id:'bk1',pos:1,goal:30}];save();render()});await reg(0);
let r=await st();ok(r.edx&&!r.old&&r.lbl==='Revisão de bloco'&&r.blk&&r.hi===0&&!r.ov,'vez do bloco: tabela nova, painel com o cartão do bloco, nenhuma linha grifada '+JSON.stringify(r));
ok(await x.ev(()=>!!document.querySelector('.edt .bkrow.cur')),'o ponto de revisão aparece na tabela, marcado como a vez');
await shot('bloco');
await x.ev(()=>{const b=document.querySelector('.edp [data-act=blkend]');b&&b.click()});await W(300);
r=await st();ok(r.edx&&!r.old&&r.lbl==='Sessão da vez'&&r.hi===1,'pular o bloco: volta a sessão da vez '+JSON.stringify(r));
/* 3) janela de editar um registro aberta sobre a tabela */
await x.ev(()=>{const b=[...document.querySelectorAll('[data-act=edit]')].find(b=>b.offsetParent)||null;if(b)b.click();else{const s=S.sessions[0];ui.rview=null;document.dispatchEvent(new Event('x'))}});await W(300);
if(!(await x.ev(()=>!!S.edit))){await tab('reg');await x.ev(()=>{const b=[...document.querySelectorAll('[data-act=edit]')].find(b=>b.offsetParent);b&&b.click()});await W(300);await tab('ciclo')}
r=await st();ok((await x.ev(()=>!!S.edit&&edPop()))&&r.edx&&!r.old,'editar registro aberto: o fundo continua na tabela nova '+JSON.stringify(r));
await shot('editar');
await x.ev(()=>{S.edit=null;S.sel.groups=null;save();render()});await W(200);
/* 2) ciclo de revisão: revisão por ciclos a cada 1 ciclo */
await x.ev(()=>{S.blk=[];S.cyrv={on:true,n:1,last:0};S.rvgOff=true;save();render()});
for(let i=1;i<10;i++){if(!(await reg(i)))break}
await x.ev(()=>{const b=document.querySelector('[data-act=next]');b&&b.click()});await W(400);
/* a revisão pode abrir na aba Revisão: procura a tela com S.type==='review' */
const inRev=await x.ev(()=>S.type==='review');
if(!inRev){await x.ev(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/Iniciar ciclo de revisão|Iniciar revisão/.test(b.textContent));b&&b.click()});await W(400)}
const tabNow=await x.ev(()=>({type:S.type,tab:typeof tab!=='undefined'?tab:null}));
r=await st();ok(tabNow.type==='review'&&r.edx&&!r.old&&/Revisão da vez/.test(r.lbl||''),'ciclo de revisão: tabela nova, painel da revisão '+JSON.stringify({...r,...tabNow}));
ok(await x.ev(()=>!!document.querySelector('.edfoot [data-act=rvcancel]')&&/Editar revisão/.test((document.querySelector('.edfoot [data-act=edopen]')||{}).textContent||'')),'Cancelar revisão e Editar revisão embaixo da tabela');
await shot('revisao');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
