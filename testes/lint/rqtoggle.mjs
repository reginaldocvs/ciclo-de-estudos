/* Revisão por questões: desligar e religar sem querer não perde a fila.
   - religar sem registrar sessão no meio: as pendentes voltam como estavam;
   - religar depois de estudar com ela desligada: a contagem recomeça (pendentes de antes saem);
   - ligar a por sessões (que desliga a por questões) e voltar para a por questões também devolve a fila.
   Uso: node lint/rqtoggle.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rq;if(S0.srv)S0.srv.on=false;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
/* duas sessões da mesma disciplina: a 1ª revisão da sessão 1 chega com a sessão 2 e fica pendente */
const B=await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};const s=actives()[0],b=s.of||s.id;
 [1,2].forEach(i=>S.sessions.push({id:uid(),ses:uid(),subj:s.id,topic:null,min:30,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',items:[{kind:'aula',name:'Aula '+i}],date:today()}));save();render();return b});
const due=()=>ev(b=>rqOn()?rqDue(b).length:-1,B);
ok(await due()===1,'antes: 1 revisão pendente');
const tog=async()=>{await ev(()=>document.querySelector('nav [data-tab=rev]')?.click());await W(200);if(!await ev(()=>!!document.querySelector('[data-act=rvsys][data-id=q]')))await x.act('rvadj');await W(200);await x.act('rvsys','q');await W(250)};
await tog();ok(await ev(()=>!rqOn()&&!!S.rq.sv),'desligada: a fila fica guardada');
await tog();ok(await due()===1&&await ev(()=>rqOn()&&!S.rq.sv),'religada sem sessão no meio: a pendente volta');
await tog();await ev(()=>{const s=actives()[0];S.sessions.push({id:uid(),ses:uid(),subj:s.id,topic:null,min:30,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',items:[],date:today()});save();render()});
await tog();ok(await due()===0&&await ev(b=>S.rq.b[b]===3,B),'religada depois de estudar com ela desligada: a contagem recomeça');
/* a por sessões desliga a por questões; voltar para a por questões devolve a fila */
await ev(b=>{S.sessions.push({id:uid(),ses:uid(),subj:b,topic:null,min:30,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',items:[],date:today()});save();render()},B);
const d0=await due();ok(d0===1,'sessão 4: a revisão da sessão 3 fica pendente ('+d0+')');
await x.act('rvsys','s');await W(250);ok(await ev(()=>srOn()&&!rqOn()&&!!S.rq.sv),'ligar a por sessões desliga a por questões e guarda a fila');
await x.act('rvsys','q');await W(250);ok(await due()===1&&await ev(()=>!srOn()),'voltar para a por questões: a pendente volta');
await p.reload();await W(800);ok(await due()===1,'recarregar mantém');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
