/* Depois de responder, a tela rola até o resultado aparecer acima do rodapé (tela baixa); o que é maior que a tela começa do topo; se já cabe, não rola.
   Uso: node lint/qzrola.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.qc;delete S0.qa;
const L='Explicação longa do gabarito. '.repeat(140);
const Q=[{numero:1,tipo:'CE',comando:'Julgue o item a seguir.',enunciado:'O rol dos direitos fundamentais previstos na Constituição Federal limita-se estritamente àqueles já reconhecidos no âmbito dos direitos humanos internacionais.',gabarito:'E',comentario:{onde_esta_o_erro:'O rol é exemplificativo.',o_correto_e:'Há outros direitos.'}},{numero:2,tipo:'CE',enunciado:'Curta.',gabarito:'C',comentario:{por_que_certa:L}},{numero:3,tipo:'CE',enunciado:'Curta.',gabarito:'C'}];
const run=async(h,i,k)=>{const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h});const ev=(f,...a)=>p.evaluate(f,...a);
 await ev(j=>{const s=qSubs()[0],id=uid(),P=qParse(j);qcL().push({id,subj:s.id,nome:'R',n:0,ce:0,me:0,d:today()});qSave(id,{qs:P.qs});save();qStart(id,P.qs.map(q=>q.id),0)},JSON.stringify(Q));await W(200);
 await ev(i=>{ui.qz.i=i;render()},i);await W(150);await ev(k=>qAns(k),k);await W(900);
 const r=await ev(()=>{const d=document.querySelector('.qzd'),f=d.querySelector('.qzfb').getBoundingClientRect(),n=d.querySelector('.qznav').getBoundingClientRect(),o=d.querySelector('.qzo').getBoundingClientRect();return {st:Math.round(d.scrollTop),fb:Math.round(f.bottom),nav:Math.round(n.top),ft:Math.round(f.top),opt:Math.round(o.top)}});await b.close();return {...r,errs}};
let r=await run(500,0,'E');ok(r.st>0&&r.fb<=r.nav&&r.opt>0,'tela baixa: rola até o resultado ficar acima do rodapé, e as alternativas continuam à vista '+JSON.stringify(r));
r=await run(640,1,'C');ok(r.st>0&&r.ft>=0&&r.ft<=40,'resultado maior que a tela: o topo dele fica no alto '+JSON.stringify(r));
r=await run(1100,2,'C');ok(r.st===0,'resultado já à vista: não rola '+JSON.stringify(r));
ok(!r.errs.length,'sem erros de script');process.exit(bad?1:0);
