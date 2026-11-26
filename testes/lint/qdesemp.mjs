/* Desempenho do caderno:
   - cabeçalho "33% → 100% de acerto" (antes: a vez anterior de cada questão); tocar explica;
   - seção "Desempenho": uma linha por bateria (tipo, data, gabarito no fim, acertos); respostas antigas viram uma linha por dia;
   - rever o resultado de novo não duplica a linha; "Zerar respostas" zera também o desempenho.
   Uso: node lint/qdesemp.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qfim;delete S0.qh;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const J=JSON.stringify([1,2,3].map(i=>({numero:i,disciplina:'X',topico:'T'+i,tipo:'CE',enunciado:'Item '+i+' do desempenho.',gabarito:i===2?'E':'C'})));
/* respostas antigas (de dois dias atrás): 1 de 3 */
const cad=await ev(j=>{const s=actives()[0],id=uid(),P=qPrev({txt:j});qcL().push({id,subj:s.of||s.id,nome:'Caderno desempenho',n:3,ce:3,me:0,d:today()});qSave(id,{qs:P.qs});const o=qLoad(id),d=addD(today(),-2);
 S.qa={[id]:{[o.qs[0].id]:[{d,r:'C',ok:true}],[o.qs[1].id]:[{d,r:'C',ok:false}],[o.qs[2].id]:[{d,r:'E',ok:false}]}};tab='qz';ui.qcad=id;save();render();return id},J);await W(300);
const view=()=>ev(()=>({cp:(document.querySelector('.qzcp')||{}).innerText||'',rows:[...document.querySelectorAll('.qzhr')].map(e=>e.innerText.replace(/\s+/g,' ').trim())}));
let r=await view();ok(/^33% de acerto$/.test(r.cp)&&r.rows.length===1&&/^Questões resolvidas/.test(r.rows[0])&&/1 de 3 33%/.test(r.rows[0]),'respostas antigas: "33% de acerto" (sem antes) e uma linha do dia '+JSON.stringify(r));
/* Resolver tudo, acertando todas */
const solve=async ks=>{for(let i=0;i<ks.length;i++){await ev(i=>{ui.qz.i=i;render()},i);await ev(k=>qAns(k),ks[i]);await W(100)}await ev(()=>{ui.qz.i=ui.qz.ids.length-1;render()});};
await x.act('qall',cad);await W(250);await solve(['C','E','C']);await x.act('qnext');await W(250);await x.act('qzx');await W(300);
r=await view();ok(/^33% → 100% de acerto$/.test(r.cp),'cabeçalho: "33% → 100% de acerto" '+JSON.stringify(r.cp));
ok(r.rows.length===2&&/^Resolver tudo/.test(r.rows[0])&&/3 de 3 100%/.test(r.rows[0])&&/^Questões resolvidas/.test(r.rows[1]),'Desempenho: a bateria nova em cima, a antiga embaixo '+JSON.stringify(r.rows));
await x.act('qzant');await W(200);r=await ev(()=>(document.querySelector('.qzcpt')||{}).innerText||'');
ok(/Na vez anterior: 1 de 3 \(33%\)/.test(r)&&/Agora: 3 de 3 \(100%\)/.test(r),'tocar explica o antes e o agora '+JSON.stringify(r));
/* no fim: entrega e revisão do resultado não duplicam */
await x.act('qall',cad);await W(250);await x.act('qzfim','1');await W(150);await solve(['E','E','C']);await ev(()=>document.querySelector('.qznav [data-act=qzent]').click());await W(300);
await x.act('qzrev');await W(200);await x.act('qgoto','2');await W(150);await x.act('qnext');await W(250);await x.act('qzx');await W(300);
r=await view();ok(r.rows.length===3&&/^Resolver tudo/.test(r.rows[0])&&/gabarito no fim/.test(r.rows[0])&&/2 de 3 67%/.test(r.rows[0]),'no fim: uma linha "gabarito no fim · 2 de 3", sem duplicar ao rever '+JSON.stringify(r.rows));
ok(/^100% → 67% de acerto$/.test(r.cp),'cabeçalho acompanha: "100% → 67%" '+JSON.stringify(r.cp));
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
await p.screenshot({path:`saida/qdesemp-${w}.png`,fullPage:true});
/* zerar respostas zera o desempenho */
await ev(c=>document.querySelector(`[data-act=qed]`)?document.querySelector(`[data-act=qed]`).click():null,cad);await W(300);
await ev(()=>document.querySelector('[data-act=qzero]').click());await W(300);await ev(()=>{ui.qed=null;render()});await W(200);
r=await ev(c=>({h:!!((S.qh||{})[c]),sec:!!document.querySelector('.qzhs'),cp:!!document.querySelector('.qzcp')}),cad);
ok(!r.h&&!r.sec&&!r.cp,'Zerar respostas: some o desempenho e o acerto '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
