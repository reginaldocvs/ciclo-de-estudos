/* Revisão por sessões, casos de borda: dados antigos (sem S.srv), frente contando na disciplina principal, estudo antes de ligar,
   tópico apagado, disciplina removida do ciclo, mudar N e Y depois de usar, desfazer pelo aviso, foco pausado (Retomar),
   "Para hoje" com várias disciplinas, plano guarda a configuração, e o limite de reforço na janela principal.
   Uso: node lint/sessoes2.mjs <dados.json> <saída> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};delete S0.srv;delete S0.srvPt;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const goTab=async(t,r)=>{await ev(t=>document.querySelector(`nav [data-tab="${t}"]`).click(),t);await W(250);if(r){await ev(r=>{const e=document.querySelector(`[data-act=rvt][data-id="${r}"]`);e&&e.click()},r);await W(250)}};
// 1. dados antigos: sem S.srv, nada muda
await goTab('rev');
ok(await ev(()=>!srOn()&&!document.querySelector('.rvtabs [data-id=sessoes]')&&srN()===2&&srY()===3),'dados antigos: desligada, sem aba, padrão 2 e 3');
/* estudo de ontem (antes de ligar) não conta */
await ev(()=>{const s=inCycle()[0];s.topics.push({id:'ta',name:'Tópico A',done:false,links:[]},{id:'tb',name:'Tópico B',done:false,links:[]});S.sessions.push({id:'old',ses:'old',subj:s.id,topic:'ta',min:30,cycle:1,set:1,review:false,kind:'aula',date:addD(today(),-1),items:[{kind:'aula',name:'Aula antiga',link:''}]});save();render()});
await x.act('rvadj');await ev(()=>document.querySelector('[data-act=rvsys][data-id=s]').click());await W(200);await ev(()=>document.querySelector('[data-act=rvadjx]').click());await W(200);
const add=(subj,topic,k,name)=>ev((subj,topic,k,name)=>{S.sessions.push({id:k,ses:k,subj,topic,min:30,cycle:1,set:1,review:false,kind:'aula',date:today(),items:[{kind:'aula',name,link:''}]});save();render()},subj,topic,k,name);
const A=await ev(()=>inCycle()[0].id),B=await ev(()=>inCycle().find(s=>!s.of&&s.id!==inCycle()[0].id).id);
ok(await ev(A=>srNew(A).length===0&&!srItems(A).length,A),'estudo de antes de ligar não conta');
// 2. frente conta na disciplina principal
await ev(A=>{S.subjects.push({id:'fr',name:'Frente da A',goal:30,of:A,topics:[]});save()},A);
await add(A,'ta','s1','Aula 1');await add('fr','tb','s2','Aula 2');
ok(await ev(A=>srNew(A).length===2&&srDue(A)&&srItems(A).map(t=>t.t.name).join()==='Tópico A,Tópico B',A),'frente conta na disciplina principal: 2 sessões, disponível');
// 3. Para hoje com duas disciplinas
await ev(B=>{const s=S.subjects.find(x=>x.id===B);s.topics.push({id:'tc',name:'Tópico C',done:false,links:[]});save()},B);await add(B,'tc','s3','Aula 3');await add(B,'tc','s4','Aula 4');
await goTab('rev','hoje');
ok(await ev(()=>/Para hoje \(2\)/.test(document.querySelector('.rvtoday h2').textContent)&&document.querySelectorAll('.rvtoday [data-act=srreg]').length===2),'Para hoje (2): uma linha por disciplina');
await p.screenshot({path:`${OUT}/sessoes2-${w}-hoje.png`});
// 4. tópico apagado: sai da lista; sem nada para revisar, deixa de estar disponível
await ev(B=>{const s=S.subjects.find(x=>x.id===B);s.topics=s.topics.filter(t=>t.id!=='tc');save();render()},B);
ok(await ev(B=>!srItems(B).length&&!srDue(B)&&/Para hoje \(1\)/.test(document.querySelector('.rvtoday h2').textContent),B),'tópico apagado sai da lista e a disciplina deixa de estar disponível');
// 5. foco pausado: "Retomar" e o tempo na linha
await ev(()=>document.querySelector('.rvtoday [data-act=srgo]').click());await W(300);await ev(()=>{S.rvf.acc=7*60000;save();render()});await ev(()=>document.querySelector('[data-act=rvfoff]').click());await W(300);
ok(await ev(()=>{const r=document.querySelector('.rvtoday [data-act=srgo]');return r&&/Retomar/.test(r.textContent)&&/7min de 30min/.test(document.querySelector('.rvtoday').innerText)}),'foco pausado: "Retomar" e "7min de 30min"');
// 6. registrar e desfazer pelo aviso
await ev(A=>{S.srMk=S.srMk||{};srTodo(A).forEach(t=>t.its.forEach(z=>S.srMk[z.k]=true));save();render()},A);await ev(()=>document.querySelector('.rvtoday [data-act=srreg]').click());await W(300);
ok(await ev(()=>document.querySelector('#modal form[data-f=srreg] [name=m]').value==='0h07'),'Registrar traz o tempo do foco (0h07)');
await x.submit('#modal form[data-f=srreg]');await W(300);
ok(await ev(A=>!srDue(A)&&(S.srvPt||[]).length===1&&!(S.rvp||{})['sr~'+A],A),'registrado: sai da vez e o tempo em pausa some');
const und=await ev(()=>{const u=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/Desfazer/.test(b.textContent));if(u){u.click();return true}return false});await W(300);
ok(und&&await ev(A=>srDue(A)&&!(S.srvPt||[]).length,A),'Desfazer no aviso volta a revisão');
// 7. N e Y depois de usar: registrar, baixar Y para 1 → itens com 1 revisão vão para ✓
await ev(A=>{S.srMk=S.srMk||{};srTodo(A).forEach(t=>t.its.forEach(z=>S.srMk[z.k]=true));save();render()},A);await ev(()=>document.querySelector('.rvtoday [data-act=srreg]').click());await W(300);await x.submit('#modal form[data-f=srreg]');await W(300);
await ev(()=>{S.srv.y=1;save();render()});
ok(await ev(A=>srSplit(A).fin.length===2&&!srTodo(A).length,A),'Y baixou para 1: os itens com 1 revisão vão para Concluídos ✓');
await ev(()=>{S.srv.y=3;S.srv.n=1;save();render()});await add(A,'ta','s5','Aula 5');
ok(await ev(A=>srDue(A)&&srNew(A).length===1,A),'N baixou para 1: uma sessão nova já deixa disponível');
// 8. disciplina removida do ciclo continua na aba (tem sessões); a excluída de vez, não
await ev(B=>{const s=S.subjects.find(x=>x.id===B);s.off=true;save();render()},B);await goTab('rev','sessoes');
ok(await ev(()=>document.querySelectorAll('.srsc').length===1),'aba Sessões: só disciplinas com algo contado (a de tópico apagado some)');
await p.screenshot({path:`${OUT}/sessoes2-${w}-aba.png`,fullPage:true});
// 9. plano guarda a configuração
ok(await ev(()=>{const P=snapPlan();return P.srv&&P.srv.on&&Array.isArray(P.srvPt)}),'o plano guarda a revisão por sessões');
// 10. limite de reforço na janela principal, e o selo acompanha
await ev(A=>{const s=S.subjects.find(x=>x.id===A);S.sessions.push({id:'q1',ses:'q1',subj:A,topic:'ta',min:30,cycle:1,set:1,review:false,kind:'aula',date:today(),items:[{kind:'aula',name:'Aula Q',link:'',ac:7,tq:10}]});save();render()},A);
await x.act('rvadj');await x.fill('#modal [data-qlv]','75');await W(200);
ok(await ev(()=>S.qlim===75),'limite 75% na janela principal');
await ev(()=>document.querySelector('[data-act=rvadjx]').click());await W(200);await goTab('rev','sessoes');
ok(await ev(()=>/reforçar · 70%/.test(document.querySelector('.srsc').innerText)),'selo "reforçar · 70%" aparece com o limite em 75%');
// 11. atrasadas: marcar só uma; as outras ficam em "Atrasadas" na aba e dá para pôr em dia fora da vez
const C=await ev(()=>{const s=inCycle().find(s=>s.name==='Disciplina C');s.topics.push({id:'tz',name:'Tópico Z',done:false,links:[]});S.srv.n=2;S.srv.y=3;save();return s.id});
const add3=(k,names)=>ev((C,k,names)=>{S.sessions.push({id:k,ses:k,subj:C,topic:'tz',min:30,cycle:1,set:1,review:false,kind:'aula',date:today(),items:names.map(n=>({kind:'aula',name:n,link:''}))});save();render()},C,k,names);
await add3('c1',['Aula a','Aula b']);await add3('c2',['Aula c']);
const cnt=()=>ev(C=>Object.fromEntries((({todo,fin})=>todo.concat(fin))(srSplit(C)).flatMap(t=>t.its.map(z=>[z.l.title||z.l.name,z.n+(z.late?'L':'')]))),C);
ok(await ev(C=>srDue(C),C),'Disciplina C disponível (2 sessões, 3 aulas)');
await ev(C=>{S.srMk=S.srMk||{};const z=srTodo(C)[0].its.find(z=>z.l.title==='Aula a');S.srMk[z.k]=true;ui.srreg=C;save();render()},C);await W(300);await x.submit('#modal form[data-f=srreg]');await W(300);
let k1=await cnt();ok(k1['Aula a']==='1'&&k1['Aula b']==='0L'&&k1['Aula c']==='0L'&&!(await ev(C=>srDue(C),C)),'marcou só a "Aula a": ela conta 1; b e c ficam atrasadas '+JSON.stringify(k1));
await goTab('rev','sessoes');
let L=await ev(C=>{const c=[...document.querySelectorAll('.srsc')].find(e=>e.querySelector(`[data-act=srall][data-id="${C}"]`));if(!c)return null;const l=c.querySelector('.srlate');return {h:l&&l.querySelector('h3').textContent,ck:l?l.querySelectorAll('input[data-srk]').length:0,dis:l&&l.querySelector('[data-act=srreg]').disabled,rest:/Em revisão \(1\)/.test(c.innerText)}},C);
ok(L&&L.h==='Atrasadas (2)'&&L.ck===2&&L.dis&&L.rest,'aba Sessões: "Atrasadas (2)" com caixinhas e Registrar desativado; "Em revisão (1)" com a outra '+JSON.stringify(L));
await p.screenshot({path:`${OUT}/sessoes2-${w}-atrasadas.png`,fullPage:true});
await ev(C=>{const c=[...document.querySelectorAll('.srlate')].find(e=>e.querySelector(`[data-id="${C}"]`));c.querySelector('input[data-srk]').click()},C);await W(250);
await ev(C=>document.querySelector(`.srlate [data-act=srreg][data-id="${C}"]`).click(),C);await W(300);
ok(await ev(()=>/atrasadas · 1 tópico · 1 marcado/.test(document.getElementById('modal').innerText)),'janela de registro das atrasadas, só com a marcada');
await x.submit('#modal form[data-f=srreg]');await W(300);
k1=await cnt();ok(k1['Aula b']==='1'&&k1['Aula c']==='0L'&&await ev(C=>{const P=srPts(C),l=P[P.length-1];return l.late&&!l.ses.length&&!srDue(C)},C),'pôs em dia a "Aula b" fora da vez, sem gastar sessões '+JSON.stringify(k1));
ok(await ev(C=>{const c=[...document.querySelectorAll('.srsc')].find(e=>e.querySelector(`[data-id="${C}"]`));return /Atrasadas \(1\)/.test(c.innerText)&&/Última revisão: \d\d\/\d\d \(atrasadas\)/.test(c.innerText)},C),'fica "Atrasadas (1)" e a última revisão diz "(atrasadas)"');
// na vez seguinte: a atrasada entra na lista com a etiqueta em destaque; a seção some
await add3('c3',['Aula d']);await add3('c4',['Aula e']);
ok(await ev(C=>{const c=[...document.querySelectorAll('.srsc')].find(e=>e.querySelector(`[data-id="${C}"]`));return srDue(C)&&!c.querySelector('.srlate')&&c.querySelectorAll('.srn.late').length===1&&/1 atrasada\b/.test(srSub(S.subjects.find(x=>x.id===C)))},C),'na vez: sem a seção Atrasadas; a "Aula c" vem destacada e o resumo diz "1 atrasada" '+JSON.stringify(await ev(C=>{const c=[...document.querySelectorAll('.srsc')].find(e=>e.querySelector(`[data-id="${C}"]`));return {due:srDue(C),sec:!!c.querySelector('.srlate'),late:c.querySelectorAll('.srn.late').length,t:c.innerText.slice(0,160)}},C)));
// pular: tudo o que já foi coberto e não revisado vira atrasada
await ev(C=>document.querySelector(`.srsc [data-act=srall][data-id="${C}"]`)&&0,C);
await ev(C=>{const P=(S.srvPt||[]);P.push({id:'skp',s:C,d:today(),ses:srNew(C).map(o=>o.k),its:[],skip:true});save();render()},C);await W(200);
k1=await cnt();ok(Object.values(k1).every(v=>String(v).endsWith('L')),'depois de pular, todas as que faltam ficam atrasadas '+JSON.stringify(k1));
ok(!(await ev(()=>document.documentElement.scrollWidth>innerWidth)),'sem rolagem para o lado');
ok(!errs.length,'sem erros na página '+JSON.stringify(errs));
await b.close();console.log(bad?'FALHOU':'TUDO OK');process.exit(bad?1:0);
