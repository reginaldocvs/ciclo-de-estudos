/* Revisões que já vêm ligadas. App vazio: só a revisão por ciclos e a por questões. Plano novo: as mesmas revisões e ajustes do plano atual,
   sem o histórico delas. Backup antigo sem esses campos continua como estava (nada liga sozinho). Uso: node lint/padroes.mjs */
import {open,mk,W} from './lib.mjs';
let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
/* app vazio */
let {b,p,errs}=await open({w:1280,h:900,data:{'ciclo-welcome-skip':'1'}});let x=mk(p);
let r=await x.ev(()=>({c:cyOn(),q:rqOn(),g:rgOn(),t:tvOn(),s:srOn(),n:cyN()}));
ok(r.c&&r.q&&!r.g&&!r.t&&!r.s&&r.n===5,'app vazio: ligadas só a por ciclos (a cada 5) e a por questões '+JSON.stringify(r));
await x.ev(()=>{tab='rev';ui.rvadj=true;render()});await W(300);
r=await x.ev(()=>[...document.querySelectorAll('.rvsys .swt[data-act=rvsys]')].map(e=>e.getAttribute('aria-label')+':'+e.getAttribute('aria-checked')));
ok(r.length>=4&&r.filter(v=>/:true$/.test(v)).map(v=>v.split(':')[0]).sort().join()==='Revisão por ciclos,Revisão por questões','Ajustes de revisão mostram as duas ligadas '+JSON.stringify(r));
/* plano novo herda do atual: liga tópico e sessões (desliga questões), ciclos a cada 3, intervalos do tópico próprios */
await x.ev(()=>{S.cyrv={n:3,on:true,last:4};S.trv={start:'2026-01-01',iv:[2,9,30],t:{a:{h:['2026-01-02']}}};S.srv={n:4,y:2,on:true,start:'2026-01-01'};S.rq={iv:[2,5],on:false,b:{zz:7},hold:['x']};S.rvgOff=true;S.rvint=9;S.rvwait=12;save()});
r=await x.ev(()=>{const f=freshPlan();return {cy:f.cyrv,trv:f.trv,srv:f.srv,rq:f.rq,g:f.rvgOff,int:f.rvint,w:f.rvwait}});
ok(r.cy.on&&r.cy.n===3&&r.cy.last===0&&!r.trv.off&&r.trv.iv.join()==='2,9,30'&&!r.trv.t&&r.srv.on&&r.srv.n===4&&r.srv.y===2&&r.rq.on===false&&r.rq.iv.join()==='2,5'&&!Object.keys(r.rq.b).length&&!r.rq.hold.length&&r.g&&r.int===9&&r.w===12,
 'plano novo: mesmas revisões e ajustes, sem o histórico (agenda dos tópicos, contagens) '+JSON.stringify(r));
/* pelo menu: criar o plano e trocar para ele */
await x.ev(()=>{const pl={id:'pnovo',name:'Plano Novo Teste'};S.plans.push(pl);S.planData[pl.id]=freshPlan();switchPlan(pl.id);save();render()}).catch(e=>null);
r=await x.ev(()=>({plan:S.plan,c:cyOn(),n:cyN(),t:tvOn(),s:srOn(),q:rqOn(),subs:S.subjects.length,ses:S.sessions.length}));
ok(r.plan==='pnovo'&&r.c&&r.n===3&&r.t&&r.s&&!r.q&&r.ses===0,'trocar para o plano novo: começa sem sessões e com as revisões do anterior '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));await b.close();
/* backup antigo, sem os campos: nada liga sozinho */
({b,p,errs}=await open({w:1280,h:900,data:{'ciclo-welcome-skip':'1','ciclo-estudos-v2':JSON.stringify({subjects:[{id:'a',name:'A',goal:60,topics:[]}],cycle:2,type:'regular',progress:{},sessions:[],checked:{}})}}));x=mk(p);
r=await x.ev(()=>({c:cyOn(),q:rqOn(),s:srOn()}));ok(!r.c&&!r.q&&!r.s,'dados já existentes sem esses campos: continuam desligadas '+JSON.stringify(r));
await b.close();process.exit(bad?1:0);
