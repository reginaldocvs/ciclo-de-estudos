/* "Revise antes de começar" no painel do Ciclo: entre o nome da disciplina e o relógio, até 2 tópicos à vista e "Mostrar mais N";
   no ciclo de revisão, o cartão "Tópicos para revisar" fica acima da tabela (fora do painel).
   Uso: node lint/rbantes.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;S0.sessions=[];S0.progress={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
/* a disciplina da vez estudou 3 tópicos na última sessão dela (no ciclo anterior) */
await ev(()=>{const s=current(),b=S.subjects.find(z=>z.id===(s.of||s.id));b.topics=b.topics||[];['Tópico A','Tópico B','Tópico C'].forEach((n,i)=>{if(!b.topics[i])b.topics.push({id:'rb'+i,name:n,done:false,links:[]})});
 const ses=uid(),d=addD(today(),-3);b.topics.slice(0,3).forEach((t,i)=>S.sessions.push({id:uid(),ses,subj:s.id,topic:t.id,min:20,cycle:Math.max(1,S.cycle-1),set:S.set||1,review:false,kind:'aula',items:[{kind:'aula',name:'Aula '+(i+1),link:''}],date:d}));S.sel.subj=s.id;save();render()});await W(300);
const st=()=>ev(()=>{const p=document.querySelector('.edp');const o=[...p.children].map(e=>e.className.split(' ')[0]);const rb=p.querySelector('.edrb');return {o,tops:rb?[...rb.querySelectorAll('.rvtn')].map(e=>e.textContent):[],more:(rb&&rb.querySelector('[data-act=rbmore]')||{}).textContent||'',card:!!document.querySelector('.edm .rvcard')}});
let r=await st();
ok(r.o.indexOf('edrb')===r.o.indexOf('edpn')+1&&r.o.indexOf('edrb')<r.o.indexOf('edtime'),'"Revise antes de começar" logo abaixo do nome, antes do relógio '+JSON.stringify(r.o));
ok(r.tops.length===2&&r.more==='Mostrar mais 1','até 2 tópicos à vista e "Mostrar mais 1" '+JSON.stringify(r));
await x.act('rbmore');r=await st();ok(r.tops.length===3&&r.more==='Mostrar menos','Mostrar mais: os 3 tópicos e "Mostrar menos" '+JSON.stringify(r));
await x.act('rbmore');r=await st();ok(r.tops.length===2,'Mostrar menos: volta a 2');
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
