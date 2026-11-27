/* Caderno de erros:
   - entra pelo marcador (guardada) ou sozinha depois de errar N vezes (automática, padrão 2; os erros contam a partir do recurso);
   - fica no topo dos Avulsos (só com questões), sem lixeira; cada questão diz de onde veio;
   - a automática sai com K acertos seguidos (padrão 2), aqui ou na origem, com Desfazer no resultado; a guardada só sai pelo marcador;
   - o marcador tira também a automática (e zera a contagem dela);
   - filtros: disciplina, tópico, como entrou e nível; Resolver só as filtradas; Limpar filtros;
   - lápis: entrada automática, "Entra quando errar" e "Sai depois de";
   - cada resposta vale também na origem e conta uma vez só nas Estatísticas.
   Uso: node lint/qzerr.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qh;delete S0.qerr;S0.qfim={cad:false,sim:false};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const J=(pre,n,tp)=>JSON.stringify(Array.from({length:n},(_,i)=>({numero:i+1,disciplina:'X',topico:tp(i),tipo:'CE',enunciado:pre+' item '+(i+1)+'.',gabarito:'C',nivel:i%2?'difícil':'fácil'})));
const D=await ev(([ja,jb])=>{const L=qSubs(),A=L[0],B=L[1];const mkc=(subj,nome,j)=>{const id=uid(),P=qPrev({txt:j});qcL().push({id,subj,nome,n:P.qs.length,ce:P.qs.length,me:0,d:today()});qSave(id,{qs:P.qs});return id};
 const ca=mkc(A.id,'Caderno A',ja),cb=mkc(B.id,'Caderno B',jb);tab='qz';ui.qcad=null;save();render();return {A:A.id,An:A.name,B:B.id,Bn:B.name,ca,cb,qa:qLoad(ca).qs.map(q=>q.id),qb:qLoad(cb).qs.map(q=>q.id)}},[J('A',4,i=>i<2?'Tema Um':'Tema Dois'),J('B',3,()=>'Tema Três')]);
await W(300);
/* uma bateria: as respostas (C/E) na ordem; mk: índices em que tocar o marcador; termina no resultado */
let shot=0;const run=async(cid,ids,ans,mkI=[])=>{await ev(([c,L])=>qStart(c,L,0),[cid,ids]);await W(150);
 for(let i=0;i<ans.length;i++){await ev(k=>qAns(k),ans[i]);await W(60);if(mkI.includes(i)){await ev(()=>document.querySelector('.qzd [data-act=qerrm]').click());await W(80);if(!shot){shot=1;await p.screenshot({path:`saida/qzerr-marcador-${w}.png`})}}await ev(()=>document.querySelector('.qznav [data-act=qnext]').click());await W(80)}};
const close=async()=>{await ev(()=>{ui.qz=null;render()});await W(200)};
const E=()=>ev(()=>JSON.parse(JSON.stringify(qErr())));
const kA=i=>D.ca+'|'+D.qa[i],kB=i=>D.cb+'|'+D.qb[i];
/* 1) um erro só não entra; o marcador guarda */
await run(D.ca,D.qa,['E','C','C','C'],[1]);
let e=await E();ok(e.q[kA(0)]&&e.q[kA(0)].e===1&&!e.q[kA(0)].a,'1 erro: conta, mas ainda não entra '+JSON.stringify(e.q[kA(0)]));
ok(e.q[kA(1)]&&e.q[kA(1)].m===1,'marcador: guardada no caderno de erros');
await close();
let r=await ev(()=>{const c=document.querySelector('.qzav .qzr');return c?{t:c.innerText.replace(/\s+/g,' '),del:!!c.querySelector('[data-act=qdel]')}:null});
ok(r&&/^Caderno de erros/.test(r.t)&&/1 questão/.test(r.t)&&!r.del,'Avulsos: "Caderno de erros" no topo, 1 questão, sem lixeira '+JSON.stringify(r));
/* 2) o 2º erro faz entrar sozinha */
await run(D.ca,[D.qa[0]],['E']);await close();
e=await E();ok(e.q[kA(0)].a===1&&e.q[kA(0)].e===2,'2º erro: entrou sozinha');
const err=await ev(()=>qErrM().id);
r=await ev(c=>qLoad(c).qs.map(q=>q.src.join('|')),err);ok(r.length===2&&r.includes(kA(0))&&r.includes(kA(1)),'o caderno tem as 2 (cópias com a origem) '+JSON.stringify(r));
/* 3) abrir: filtros */
await x.act('qopen',err);await W(300);
r=await ev(()=>({h:document.querySelector('.qzcm').textContent,f:[...document.querySelectorAll('.qzef .lb')].map(e=>e.textContent),more:!!document.querySelector('[data-act=qmore]')}));
ok(/^2\squestões/.test(r.h)&&r.f.join()==='Como entrou,Nível'&&!r.more,'tela: "2 questões", filtros Como entrou e Nível (uma disciplina só), sem Acrescentar '+JSON.stringify(r));
await x.pick('qefw','a');await W(200);
r=await ev(()=>({n:(document.querySelector('.qzefn')||{}).textContent||'',q:document.querySelectorAll('.qzql .qzq').length}));
ok(/^1 de 2 questões com estes filtros/.test(r.n)&&r.q===1,'Como entrou: Automáticas → 1 de 2 '+JSON.stringify(r));
await x.act('qall',err);await W(200);ok(await ev(()=>ui.qz&&ui.qz.ids.length===1),'Resolver tudo resolve só as filtradas');
r=await ev(()=>(document.querySelector('.qzd .qzorg')||{}).textContent||'');ok(r.includes('Caderno A'),'a questão diz de onde veio ('+r+')');
await p.screenshot({path:`saida/qzerr-questao-${w}.png`});
await close();await x.act('qefx');await W(200);ok(await ev(()=>!document.querySelector('.qzefn')&&document.querySelectorAll('.qzql .qzq').length===2),'Limpar filtros: as 2 de volta');
await p.screenshot({path:`saida/qzerr-caderno-${w}.png`});
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
/* 4) sair com 2 acertos seguidos: 1 aqui, 1 na origem; Desfazer no resultado */
const eid=await ev(([c,k])=>qLoad(c).qs.find(q=>q.src.join('|')===k).id,[err,kA(0)]);
await run(err,[eid],['C']);await close();e=await E();ok(e.q[kA(0)].a===1&&e.q[kA(0)].h===1,'1 acerto no caderno de erros: ainda dentro');
r=await ev(([c,q])=>{const L=S.qa[c][q];return L[L.length-1].er===1},[D.ca,D.qa[0]]);ok(r,'a resposta foi também para o caderno de origem (conta por lá)');
await run(D.ca,[D.qa[0]],['C']);
r=await ev(()=>(document.querySelector('.qzeo')||{}).textContent||'');ok(/1 questão saiu do caderno de erros \(2 acertos seguidos\)/.test(r),'2º acerto (na origem): saiu, com aviso no resultado ('+r+')');
await ev(()=>document.querySelector('.qzeo [data-act=qerrundo]').click());await W(200);e=await E();ok(e.q[kA(0)].a===1,'Desfazer: voltou para o caderno de erros');
await run(D.ca,[D.qa[0]],['C']);await close();e=await E();ok(e.q[kA(0)]&&!e.q[kA(0)].a&&e.q[kA(0)].e===2,'saiu de novo pelos acertos, e os erros continuam contados '+JSON.stringify(e.q[kA(0)]||null));
await run(D.ca,[D.qa[0]],['E']);await close();e=await E();ok(e.q[kA(0)].a===1,'saiu pelos acertos: o próximo erro a traz de volta');
/* 5) a guardada não sai com acertos */
await run(D.ca,[D.qa[1]],['C']);await run(D.ca,[D.qa[1]],['C']);await run(D.ca,[D.qa[1]],['C']);await close();e=await E();ok(e.q[kA(1)].m===1,'guardada: 3 acertos e continua');
/* 6) o marcador tira a automática e zera a contagem */
await run(D.cb,[D.qb[0]],['E']);await run(D.cb,[D.qb[0]],['E'],[0]);await close();e=await E();ok(e.q[kB(0)]&&!e.q[kB(0)].a&&!e.q[kB(0)].m&&e.q[kB(0)].e===2,'marcador numa automática: tirada, e os 2 erros continuam contados '+JSON.stringify(e.q[kB(0)]||null));
await run(D.cb,[D.qb[0]],['E']);await close();e=await E();ok(e.q[kB(0)].a===1&&e.q[kB(0)].e===3,'tirada à mão: o próximo erro a traz de volta');
await run(D.cb,[D.qb[0]],['E'],[0]);await close();
/* 7) lápis: entra com 1 erro → as que já têm 1 erro entram */
await run(D.cb,[D.qb[1]],['E']);await close();
await ev(()=>{ui.qcad=null;render()});await W(200);await x.act('qopen',err);await W(200);await x.act('qed',err);await W(300);
r=await ev(()=>{const d=document.querySelector('[aria-label="Caderno de erros"]');return d?{nome:!!d.querySelector('[name=qen]'),sw:!!d.querySelector('[data-act=qerron]'),n:!!d.querySelector('.sfb[data-id=qerrn]'),k:!!d.querySelector('.sfb[data-id=qerrk]')}:null});
ok(r&&!r.nome&&r.sw&&r.n&&r.k,'lápis: "Caderno de erros", sem nome, com entrada automática e os dois números '+JSON.stringify(r));
await p.screenshot({path:`saida/qzerr-lapis-${w}.png`});
await x.pick('qerrn','1');await W(200);e=await E();ok(e.n===1&&e.q[kB(1)]&&e.q[kB(1)].a===1,'Entra quando errar: 1 vez → a questão com 1 erro entrou');ok(!e.q[kB(0)].a,'a tirada à mão não volta só por mudar o número');
await ev(()=>{ui.qed=null;render()});await W(200);
r=await ev(()=>[...document.querySelectorAll('.qzef .lb')].map(e=>e.textContent));ok(r[0]==='Disciplina','com duas disciplinas, aparece o filtro Disciplina '+JSON.stringify(r));
await x.pick('qefs',D.B);await W(200);ok(await ev(()=>document.querySelectorAll('.qzql .qzq').length===1),'Disciplina B: 1 questão');
await x.act('qefx');await W(200);
/* 8) Estatísticas: a resposta no caderno de erros conta uma vez só */
r=await ev(()=>qAvRes(today(),today()).reduce((a,z)=>a+z.t,0));ok(r===0,'Estatísticas: o caderno de erros não conta como avulso (a resposta conta pela origem, aqui cadernos de disciplina) '+r);
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
