/* Revisão por sessões com a disciplina repetida no ciclo (ex.: Português na 1ª, 5ª e 9ª posição, as repetições são cópias da original):
   na vez da cópia, o cartão "Revise as sessões anteriores" aparece no Ciclo, com a revisão da original.
   Uso: node lint/srligar.mjs <dados.json> <saída> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};delete S0.srv;S0.srvPt=[];
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{const s=current();if(!s.topics.length)s.topics.push({id:'tA',name:'Crase',done:false,links:[]});const t=s.topics[0],y=addD(today(),-1);
 [['a1',y,Math.max(1,S.cycle-1)],['a2',today(),S.cycle]].forEach(([k,d,c])=>S.sessions.push({id:k,ses:k,subj:s.id,topic:t.id,min:30,cycle:c,set:S.set||1,review:false,kind:'aula',date:d,items:[{kind:'aula',name:'Aula '+k,link:'',ac:7,tq:10}]}));
 S.sessions.find(z=>z.id==='a1').cycle=S.cycle;save();render()});
/* liga hoje pelos Ajustes de revisão (as duas sessões são de hoje) */
await ev(()=>{S.sessions.find(z=>z.id==='a1').date=today();save();render()});
await ev(()=>document.querySelector('nav [data-tab="rev"]').click());await W(250);await x.act('rvadj');await W(200);
await ev(()=>document.querySelector('[data-act=rvsys][data-id=s]').click());await W(250);await ev(()=>document.querySelector('[data-act=rvadjx]').click());await W(200);
await ev(()=>document.querySelector('nav [data-tab="ciclo"]').click());await W(300);
/* a disciplina repetida no ciclo (cópia, como Português na 1ª, 5ª e 9ª posição): na vez da cópia, o cartão aparece */
await ev(()=>{const s=current();S.progress[s.id]=s.goal;S.subjects.forEach(y=>S.progress[y.id]=y.goal);
 S.subjects.push({id:'cp',name:s.name,goal:s.goal,topics:s.topics,of:s.id});if(S.sel)S.sel.subj='cp';save();render()});await W(300);
const c2=await ev(()=>({due:srDue(current().of),nw:srNew(current().of).length,sel:selId(),bk:!!blkCur(),bv:!!blkView(),cur:current()&&current().id,card:!!document.querySelector('.srvc'),reg:!!document.querySelector('.srvc [data-act=srreg][data-id="'+(current().of||'')+'"]')}));
ok(c2.cur==='cp'&&c2.card&&c2.reg,'repetição da disciplina no ciclo: na vez da cópia, o cartão aparece (com a revisão da original) '+JSON.stringify(c2));
await p.screenshot({path:`${OUT}/srligar-${w}.png`,fullPage:true});
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
