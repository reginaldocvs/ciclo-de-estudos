/* Reação ao acertar: ícone com mola e brilho na alternativa certa só na questão que acabou de ser respondida;
   "N seguidas" a partir de 3 acertos seguidos (some ao errar); vibração curta no celular. Errar continua neutro.
   Uso: node lint/qzreacao.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.qc;delete S0.qa;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:844});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{window.__vib=0;navigator.vibrate=()=>{window.__vib++;return true};const mm=window.matchMedia;window.matchMedia=q=>q==='(pointer:coarse)'?{matches:true}:mm(q)});
await ev(()=>{const s=qSubs()[0],id=uid(),P=qParse(JSON.stringify([...Array(6)].map((_,j)=>({numero:j+1,tipo:'CE',enunciado:'Item '+j,gabarito:'C'}))));qcL().push({id,subj:s.id,nome:'R',n:0,ce:0,me:0,d:today()});qSave(id,{qs:P.qs});save();qStart(id,P.qs.map(q=>q.id),0)});await W(200);
const st=()=>ev(()=>({just:!!document.querySelector('.qzfb.just'),pop:!!document.querySelector('.qzo.pop'),stk:(document.querySelector('.qzstk')||{}).textContent||''}));
const ans=async k=>{await x.act('qans',k)};
await ans('C');let r=await st();ok(r.just&&r.pop&&!r.stk,'acertou a 1ª: ícone com mola e brilho, sem sequência ainda '+JSON.stringify(r));
ok(await ev(()=>window.__vib===1),'celular: vibra ao acertar');
await x.act('qnext');await ans('C');await x.act('qnext');await ans('C');r=await st();await W(500);await p.screenshot({path:'saida/qzreacao-'+w+'.png'});ok(r.stk==='3 seguidas','3 certas seguidas: "3 seguidas" '+JSON.stringify(r));
await x.act('qprev');r=await st();ok(!r.just&&!r.pop&&!r.stk,'voltar a uma já respondida: sem animação e sem sequência '+JSON.stringify(r));
await x.act('qnext');await x.act('qnext');await ans('E');r=await st();ok(!r.pop&&!r.stk&&await ev(()=>window.__vib===3),'errou: neutro, sem sequência e sem vibrar '+JSON.stringify(r));
await x.act('qnext');await ans('C');r=await st();ok(!r.stk,'depois de errar, a sequência recomeça');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
