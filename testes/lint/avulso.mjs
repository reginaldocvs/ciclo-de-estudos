/* Cadernos avulsos (simulado, prova anterior, assuntos diversos):
   - seção "Avulsos" na aba Questões (no fim enquanto vazia, no topo quando tem cadernos);
   - "Novo caderno" com a opção "Avulso", sem "Ligar à sessão";
   - resolver igual; cada questão conta nas Estatísticas da disciplina do plano de mesmo nome (e no tópico de mesmo nome);
     questão de matéria que não está no plano conta só no caderno; avulso fica fora das revisões;
   - plano sem disciplinas: convite para criar um caderno avulso.
   Uso: node lint/avulso.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;S0.qlim=70;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const toTab=async t=>{await ev(t=>{const e=[...document.querySelectorAll(`nav [data-tab=${t}]`)].find(e=>e.getClientRects().length);e.click()},t);await W(350)};
/* a disciplina do plano (com um tópico) que as questões vão citar pelo nome, escrito de outro jeito */
const D=await ev(()=>{const s=S.subjects.find(s=>!s.of&&!gone(s));s.topics=s.topics||[];if(!s.topics.length)s.topics.push({id:'tav',name:'Tópico Avulso',done:false,links:[]});save();return {id:s.id,nm:s.name,tp:s.topics[0].name,tid:s.topics[0].id}});
const up=s=>s.toUpperCase();
const J=[{numero:1,disciplina:up(D.nm),topico:D.tp,tipo:'CE',enunciado:'Item 1 do simulado.',gabarito:'C'},
 {numero:2,disciplina:up(D.nm),topico:D.tp,tipo:'CE',enunciado:'Item 2 do simulado.',gabarito:'E'},
 {numero:3,disciplina:up(D.nm),topico:D.tp,tipo:'CE',enunciado:'Item 3 do simulado.',gabarito:'C'},
 {numero:4,disciplina:'Matéria Fora do Plano',topico:'Qualquer',tipo:'CE',enunciado:'Item 4 do simulado.',gabarito:'C'}];
await toTab('qz');
const secs=()=>ev(()=>[...document.querySelectorAll('.card.qzs')].map(c=>({t:c.querySelector('.qzh .snt').textContent,sm:c.querySelector('.qzsm').textContent,av:c.classList.contains('qzav')})));
let r=await secs();ok(r.length>1&&r[r.length-1].t==='Avulsos'&&/Simulados, provas e assuntos diversos/.test(r[r.length-1].sm),'seção "Avulsos" no fim enquanto vazia '+JSON.stringify(r.slice(-1)));
await ev(()=>document.querySelector('.qzav [data-act=qnew]').click());await W(300);
r=await ev(()=>({sel:document.querySelector('.sfb[data-id=qzs]').textContent,ses:!!document.querySelector('.sfb[data-id=qzse]'),hint:(document.querySelector('.qimpdlg .qzhint')||{}).textContent||''}));
ok(/^Avulso/.test(r.sel)&&!r.ses&&/mesmo nome/.test(r.hint),'Novo caderno: "Avulso" escolhido, sem "Ligar à sessão", com a explicação '+JSON.stringify(r));
await ev(t=>{const a=document.querySelector('[name=qj]');a.value=t;a.dispatchEvent(new Event('input',{bubbles:true}))},JSON.stringify(J));await W(300);
await x.fill('[name=qn]','Simulado 1');await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(400);
const cid=await ev(()=>{const m=qcL().find(c=>c.nome==='Simulado 1');return m&&m.subj===QAV&&!m.ses&&ui.qcad===m.id?m.id:null});
ok(!!cid,'caderno avulso salvo e aberto');
r=await ev(()=>(document.querySelector('.qzcm')||{}).textContent||'');ok(/^Avulso\s·\s4\squestões/.test(r),'cabeçalho: "Avulso · 4 questões" '+JSON.stringify(r));
ok(await ev(()=>!document.querySelector('.qzrv')),'fora das revisões (sem a seção Revisões)');
/* resolve: 1 certa e 2 erradas na disciplina do plano; a 4 (fora do plano) certa */
await ev(c=>{const o=qLoad(c);ui.qz={cad:c,ids:o.qs.map(q=>q.id),i:0,res:{},fix:false};render()},cid);await W(250);
for(const [i,k] of [[0,'C'],[1,'C'],[2,'E'],[3,'C']]){await ev(i=>{ui.qz.i=i;render()},i);await W(120);await ev(k=>qAns(k),k);await W(200)}
await ev(()=>{ui.qz=null;render()});await W(200);
await ev(()=>document.querySelector('[data-act=qback]').click());await W(300);
r=await secs();ok(r[0].t==='Avulsos'&&/1 caderno · 4 questões/.test(r[0].sm),'com caderno, "Avulsos" vai para o topo '+JSON.stringify(r[0]));
/* Estatísticas */
await toTab('st');
r=await ev(n=>{const row=[...document.querySelectorAll('.srow2')].find(e=>e.querySelector('.snt').textContent===n);const rf=[...document.querySelectorAll('.rfr')].map(e=>e.innerText.replace(/\s+/g,' '));return {q:row?(row.querySelector('.qsc.qsub:not(.qrv)')||{}).textContent||'':null,rf,fora:document.body.innerText.includes('Matéria Fora do Plano')}},D.nm);
const base=await ev(id=>{let a=0,t=0;const td=today(),st=addD(td,-29);S.sessions.filter(x=>x.date>=st&&x.date<=td&&x.min>0&&!x.review).forEach(x=>{const s0=subjAny(x.subj);if(!s0||(s0.of||s0.id)!==id)return;(x.items||[]).forEach(i=>{if(+i.tq>0){a+=Math.min(+i.ac||0,+i.tq);t+=+i.tq}})});return {a,t}},D.id);
const want=`${base.a+1}/${base.t+3}`;
ok(r.q&&r.q.startsWith(want),`Tempo por disciplina: os acertos do avulso somam na disciplina de mesmo nome (${want}) `+JSON.stringify(r.q));
ok(r.rf.some(z=>z.includes(D.tp)&&/avulsos/.test(z)),'Tópicos para reforçar: o tópico de mesmo nome entra, marcado "avulsos" '+JSON.stringify(r.rf));
ok(!r.fora,'matéria fora do plano não aparece nas Estatísticas');
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
await p.screenshot({path:`saida/avulso-stats-${w}.png`});
/* editar: sem "Ligar à sessão" */
await toTab('qz');await ev(c=>document.querySelector(`[data-act=qed][data-id="${c}"]`).click(),cid);await W(300);
r=await ev(()=>({ses:!!document.querySelector('.sfb[data-id=qzes]'),t:(document.querySelector('[data-f=qed]')||document.body).innerText}));
ok(!r.ses&&/Avulso/.test(r.t),'Editar caderno: mostra "Avulso", sem ligar à sessão '+JSON.stringify(r.ses));
await ev(()=>{ui.qed=null;render()});await W(200);
await p.screenshot({path:`saida/avulso-${w}.png`});
/* plano sem disciplinas: convite para caderno avulso */
await ev(()=>{S.qc=[];S.subjects=[];S.sessions=[];ui.qcad=null;render()});await W(300);
r=await ev(()=>{const c=document.querySelector('.qzintro');return c?{t:c.innerText,id:(c.querySelector('[data-act=qnew]')||{dataset:{}}).dataset.id}:null});
ok(r&&/caderno avulso/.test(r.t)&&r.id==='_av','plano sem disciplinas: convite com "Novo caderno avulso" '+JSON.stringify(r));
await p.screenshot({path:`saida/avulso-vazio-${w}.png`});
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
