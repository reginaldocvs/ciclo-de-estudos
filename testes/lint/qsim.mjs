/* Simulado (etapa 1):
   - "+ Simulado" nos Avulsos; janela com quantas questões de cada disciplina (todos os cadernos dela) e dos avulsos, total ao vivo;
   - quais (sorteadas, primeiro as que nunca fiz, primeiro as que errei) e ordem (por disciplina, misturada);
   - o simulado fica nos Avulsos ("Simulado · N questões"), começa em "gabarito no fim", resultado por disciplina;
   - cada resposta vale também no caderno de origem; nas Estatísticas conta uma vez, pela disciplina da questão.
   Uso: node lint/qsim.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qfim;delete S0.qh;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const J=(pre,n,dis)=>JSON.stringify(Array.from({length:n},(_,i)=>({numero:i+1,disciplina:dis||'X',topico:'T',tipo:'CE',enunciado:pre+' item '+(i+1)+'.',gabarito:'C'})));
const D=await ev(([ja,jb])=>{const L=qSubs(),A=L[0],B=L[1];const mkc=(subj,nome,j)=>{const id=uid(),P=qPrev({txt:j});qcL().push({id,subj,nome,n:P.qs.length,ce:P.qs.length,me:0,d:today()});qSave(id,{qs:P.qs});return id};
 const ca=mkc(A.id,'Caderno A',ja),cb=mkc(B.id,'Caderno B',jb);const o=qLoad(ca);S.qa={[ca]:{[o.qs[2].id]:[{d:addD(today(),-1),r:'E',ok:false}]}};save();return {A:A.id,An:A.name,B:B.id,Bn:B.name,ca,cb,wq:o.qs[2].id}},[J('A',4),J('B',3)]);
const cav=await ev(([j,dn])=>{const id=uid(),P=qPrev({txt:j.replace(/"disciplina":"X"/g,'"disciplina":"'+dn.toUpperCase()+'"')});qcL().push({id,subj:QAV,nome:'Avulso X',n:P.qs.length,ce:P.qs.length,me:0,d:today()});qSave(id,{qs:P.qs});tab='qz';ui.qcad=null;save();render();return id},[J('V',2),D.An]);await W(300);
ok(await ev(()=>!!document.querySelector('.qzav [data-act=qsim]')),'Avulsos: "+ Simulado" ao lado de "+ Caderno"');
await x.act('qsim');await W(300);
let r=await ev(()=>[...document.querySelectorAll('.qsimr')].map(e=>e.innerText.replace(/\s+/g,' ').trim()));
ok(r.length===3&&r[0].includes(D.An)&&/de 4/.test(r[0])&&r[1].includes(D.Bn)&&/de 3/.test(r[1])&&/Avulsos/.test(r[2])&&/de 2/.test(r[2]),'janela: cada disciplina com o total disponível, e os avulsos '+JSON.stringify(r));
const fill=(g,v)=>x.fill(`.qsimdlg input[data-g="${g}"]`,v);
await fill(D.A,'2');await fill(D.B,'1');await fill('_av','1');await W(200);
ok(/^4 questões no simulado$/.test(await ev(()=>$('qsimt').textContent)),'total ao vivo: 4 questões');
await x.act('qsimpol','wrong');await W(200);ok(await ev(()=>document.querySelector('[data-act=qsimpol][data-id=wrong]').classList.contains('on')&&document.querySelector('.qsimdlg input[data-g]').value==='2'),'"Primeiro as que errei" escolhido; as quantidades continuam');
await p.screenshot({path:`saida/qsim-janela-${w}.png`});
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'janela sem rolagem para o lado');
await x.fill('.qsimdlg [name=qsnome]','Simulado teste');await ev(()=>document.querySelector('[data-f=qsim]').requestSubmit());await W(400);
r=await ev(()=>{const m=qcM(ui.qcad),o=m&&qLoad(m.id);return m?{sim:m.sim,nome:m.nome,n:o.qs.length,src:o.qs.map(q=>q.src[0]),hd:(document.querySelector('.qzcm')||{}).textContent,more:!!document.querySelector('[data-act=qmore]')}:null});
ok(r&&r.sim&&r.nome==='Simulado teste'&&r.n===4&&/^Simulado\s·\s4\squestões/.test(r.hd)&&!r.more,'simulado montado e aberto: "Simulado · 4 questões", sem "Acrescentar" '+JSON.stringify(r));
ok(r.src[0]===D.ca&&r.src[1]===D.ca&&r.src[2]===D.cb&&r.src[3]===cav,'ordem por disciplina: A, A, B, avulsos');
const sim=await ev(()=>ui.qcad);
ok(await ev(([s,wq])=>qLoad(s).qs.some(q=>q.src[1]===wq),[sim,D.wq]),'"primeiro as que errei": a errada de A entrou');
/* resolver: começa em "No fim" */
await x.act('qall',sim);await W(300);
ok(await ev(()=>!!document.querySelector('.qzgm [data-act=qzfim][data-id="1"].on')),'o simulado começa em "No fim"');
for(let i=0;i<4;i++){await ev(i=>{ui.qz.i=i;render()},i);await ev(k=>qAns(k),i===1?'E':'C');await W(100)}
await ev(()=>{ui.qz.i=3;render()});await ev(()=>document.querySelector('.qznav [data-act=qzent]').click());await W(400);
r=await ev(()=>[...document.querySelectorAll('.qsrr')].map(e=>e.innerText.replace(/\s+/g,' ').trim()));
ok(r.length===2&&r[0].startsWith(D.An)&&/2 de 3 67%/.test(r[0])&&r[1].startsWith(D.Bn)&&/1 de 1 100%/.test(r[1]),'resultado por disciplina (o avulso de mesmo nome conta em A) '+JSON.stringify(r));
await p.screenshot({path:`saida/qsim-resultado-${w}.png`});
/* a resposta vale também na origem; nas Estatísticas, uma vez só */
r=await ev(([s,ca,cav])=>{const o=qLoad(s),q0=o.qs[0],L=((S.qa||{})[ca]||{})[q0.src[1]]||[],q3=o.qs[3],La=((S.qa||{})[cav]||{})[q3.src[1]]||[];const R=qAvRes(today(),today());return {orig:L.length&&L[L.length-1].sim===1,av:La.length===1&&La[0].sim===1,st:R.reduce((a,z)=>a+z.t,0)}},[sim,D.ca,cav]);
ok(r.orig&&r.av&&r.st===4,'a resposta vai também ao caderno de origem, e nas Estatísticas conta só uma vez (4) '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
