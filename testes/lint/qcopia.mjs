/* Copiar caderno de outro plano (na janela Novo caderno):
   - link "Copiar de outro plano" só quando outro plano tem cadernos; lista por plano, com disciplina e número de questões;
   - escolher um caderno: vai para a mesma disciplina (ou a de mesmo nome); sem ela, para Avulso; o nome vem do original;
   - a cópia começa sem respostas e o original fica intacto no outro plano; "já copiado" na lista;
   - "Colar um bloco JSON em vez disso" volta ao normal; caderno que não está no aparelho não é copiado vazio.
   Uso: node lint/qcopia.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const J=n=>JSON.stringify(Array.from({length:n},(_,i)=>({numero:i+1,disciplina:'X',topico:'T',tipo:'CE',enunciado:'Item '+(i+1)+' para copiar.',gabarito:'C'})));
/* plano A: um caderno da disciplina D (com uma resposta) e um avulso */
const A=await ev(([j3,j2])=>{const s=S.subjects.find(s=>!s.of&&!gone(s)&&!s.off);const mkc=(subj,nome,j)=>{const id=uid(),P=qPrev({txt:j});qcL().push({id,subj,nome,n:P.qs.length,ce:P.qs.length,me:0,d:today()});qSave(id,{qs:P.qs});return id};
 const c1=mkc(s.id,'Crase e regência',j3),c2=mkc(QAV,'Simulado PF',j2);const o=qLoad(c1);S.qa={[c1]:{[o.qs[0].id]:[{d:today(),r:'C',ok:true}]}};save();return {pl:S.plan,pn:S.plans.find(x=>x.id===S.plan).name,d:s.id,dn:s.name,c1,c2}},[J(3),J(2)]);
/* plano B, novo, com a mesma disciplina D */
await ev(D=>{const pl={id:uid(),name:'Plano B'};S.plans.push(pl);S.planData[pl.id]=freshPlan();switchPlan(pl.id);const s=S.subjects.find(x=>x.id===D);delete s.off;delete s.hid;tab='qz';save();render()},A.d);await W(400);
const open_=async()=>{await ev(()=>{const b=document.querySelector('[data-act=qnew]');b.click()});await W(300)};
await open_();
ok(await ev(()=>!!document.querySelector('[data-act=qcp]')),'Novo caderno: link "Copiar de outro plano"');
await x.act('qcp');await W(300);
const lst=()=>ev(()=>({h:[...document.querySelectorAll('.qcpg .qzsh')].map(e=>e.textContent),r:[...document.querySelectorAll('.qcpr')].map(e=>e.innerText.replace(/\s+/g,' ').trim())}));
let r=await lst();
ok(r.h.length===1&&r.h[0]===A.pn&&r.r.length===2&&r.r.some(z=>z.startsWith('Crase e regência')&&z.includes(A.dn+' · 3 questões'))&&r.r.some(z=>z.includes('Avulsos · 2 questões')),'lista do outro plano: os dois cadernos, com disciplina e questões '+JSON.stringify(r));
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'lista sem rolagem para o lado');
await p.screenshot({path:`saida/qcopia-lista-${w}.png`});
const pick=c=>ev(c=>document.querySelector(`[data-act=qcpick][data-id$="|${c}"]`).click(),c).then(()=>W(300));
await pick(A.c1);
const dlg=()=>ev(()=>({sel:(document.querySelector('.sfb[data-id=qzs]')||{}).textContent||'',nome:(document.querySelector('[name=qn]')||{}).value,box:(document.querySelector('.qcpbox')||{innerText:''}).innerText.replace(/\s+/g,' '),ta:!!document.querySelector('[name=qj]'),btn:(document.querySelector('[data-f=qimp] .rvcfa .btn:not(.g)')||{}).textContent,hint:[...document.querySelectorAll('[data-f=qimp] .qzhint')].map(e=>e.textContent).join(' | ')}));
r=await dlg();
ok(r.sel===A.dn&&r.nome==='Crase e regência'&&/Crase e regência/.test(r.box)&&!r.ta&&r.btn==='Copiar caderno'&&/começa sem respostas/.test(r.hint),'escolhido: mesma disciplina, nome do original, sem campo de JSON, botão "Copiar caderno" '+JSON.stringify(r));
await p.screenshot({path:`saida/qcopia-${w}.png`});
await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(400);
r=await ev(c1=>{const m=qcL().find(c=>c.from===c1);return m?{subj:m.subj,n:m.n,a:qSum(m.id).a,open:ui.qcad===m.id,ses:m.ses,nome:m.nome,diff:m.id!==c1}:null},A.c1);
ok(r&&r.subj===A.d&&r.n===3&&r.a===0&&r.open&&!r.ses&&r.diff,'copiado: na disciplina D, 3 questões, sem respostas, aberto '+JSON.stringify(r));
const orig=await ev(([pl,c1])=>{const d=S.planData[pl];return {n:d.qc.length,qa:Object.keys((d.qa||{})[c1]||{}).length}},[A.pl,A.c1]);
ok(orig.n===2&&orig.qa===1,'o original continua no outro plano, com a resposta '+JSON.stringify(orig));
/* de novo: "já copiado"; o avulso vem como Avulso; "Colar um bloco JSON em vez disso" */
await ev(()=>document.querySelector('[data-act=qback]').click());await W(300);
await ev(()=>{ui.qimp={subj:'',cad:null,ses:'',nome:'',txt:''};render()});await W(300);await x.act('qcp');await W(300);
r=await lst();ok(r.r.some(z=>z.startsWith('Crase e regência')&&/já copiado/.test(z))&&r.r.some(z=>z.startsWith('Simulado PF')&&!/já copiado/.test(z)),'"já copiado" só no caderno copiado '+JSON.stringify(r.r));
await pick(A.c2);r=await dlg();ok(/^Avulso/.test(r.sel)&&r.nome==='Simulado PF','caderno avulso: vem como Avulso '+JSON.stringify(r.sel));
await x.act('qcpno');await W(300);r=await dlg();ok(r.ta&&r.nome===''&&r.btn==='Salvar caderno','"Colar um bloco JSON em vez disso": volta ao campo de JSON '+JSON.stringify(r));
/* sem a disciplina de mesmo nome neste plano: Avulso */
await ev(D=>{const s=S.subjects.find(x=>x.id===D);s.off=true;s.hid=true;S.qc=[];render()},A.d);await W(200);
await x.act('qcp');await W(300);await pick(A.c1);r=await dlg();ok(/^Avulso/.test(r.sel),'sem disciplina de mesmo nome neste plano: vem como Avulso '+JSON.stringify(r.sel));
/* conteúdo fora do aparelho: avisa e não copia vazio */
await ev(c1=>{delete QC[c1];localStorage.removeItem(QK+c1);render()},A.c1);await W(300);
r=await dlg();ok(/não está neste aparelho/.test(r.hint),'caderno fora do aparelho: avisa '+JSON.stringify(r.hint));
await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(300);
ok(await ev(()=>!qcL().length&&!!ui.qimp),'e não cria caderno vazio');
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
