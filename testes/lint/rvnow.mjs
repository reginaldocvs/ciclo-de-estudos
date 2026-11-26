/* Revisão em andamento:
   - com as revisões por ciclos e por grupos desligadas, a consolidação tem a aba "Consolidação" (dá para sair e voltar);
   - "Concluir agora" só aparece quando já há algo registrado; pede confirmação (avisa acertos anotados e não registrados);
     concluir mantém o que foi registrado e encerra a revisão;
   - selo "reforçar" nos tópicos do cartão da consolidação e no "Revise antes de começar".
   Uso: node lint/rvnow.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;S0.sessions=[];delete S0.cyrv;S0.rvgOff=true;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const tab=async t=>{await ev(t=>{[...document.querySelectorAll(`[data-tab="${t}"]`)].find(e=>e.offsetParent).click()},t);await W(350)};
const rvt=async l=>{await ev(l=>{const b=[...document.querySelectorAll('[data-act=rvt]')].find(b=>b.offsetParent&&b.textContent.trim()===l);b&&b.click()},l);await W(350)};
const T=await ev(()=>{S.qlim=50;S.rq={on:true,iv:[1,4,8],b:{},hold:[]};if(S.cyrv)S.cyrv.on=false;S.rvgOff=true;
 const s=actives()[0],b=s.of||s.id,B=S.subjects.find(z=>z.id===b);B.topics=B.topics||[];['Tópico Q1','Tópico Q2'].forEach((n,i)=>{if(!B.topics[i])B.topics.push({id:'tr'+i,name:n,done:false,links:[]})});
 const tp=B.topics.slice(0,2).map(t=>t.id),d=addD(today(),-1);const add=(t,it,h)=>S.sessions.push({id:uid(),ses:uid(),subj:s.id,topic:t,min:60,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',items:[it],date:d,at:h});
 add(tp[1],{kind:'aula',name:'Aula Q2',link:'',q:'https://questoes.example/2',tq:10,ac:9},'08:00');
 add(tp[0],{kind:'aula',name:'Aula Q1',link:'',q:'https://questoes.example/1',tq:10,ac:2},'09:00');
 save();render();return {b,tp,cy:cyOn(),rg:rgOn()}});
ok(!T.cy&&!T.rg,'revisões por ciclos e por grupos desligadas');
/* começar a consolidação */
await tab('rev');await x.act('csnew');await W(300);await x.act('csgo');await W(500);
const tabs=()=>ev(()=>[...document.querySelectorAll('[data-act=rvt]')].filter(b=>b.offsetParent).map(b=>b.textContent.trim()));
let r=await tabs();ok(r.includes('Consolidação')&&!r.includes('Ciclos'),'aba "Consolidação" enquanto ela roda '+JSON.stringify(r));
await rvt('Hoje');await rvt('Consolidação');ok(await ev(()=>!!document.querySelector('.cscard')),'sair para Hoje e voltar pela aba "Consolidação"');
ok(await ev(()=>!document.querySelector('[data-act=rvnow]')),'sem nada registrado, não aparece "Concluir agora"');
/* selo reforçar no cartão da consolidação (Q1: 2 de 10) */
await ev(b=>{if(!document.querySelector('.cscard .csac input[data-csd]')){const e=document.querySelector(`[data-act=cstog][data-id="${b}:x"]`);e&&e.click()}},T.b);await W(250);
r=await ev(()=>[...document.querySelectorAll('.cscard .cstp')].map(e=>({t:(e.querySelector('.cssub .snt')||{}).textContent,rf:(e.querySelector('.tagrf')||{}).textContent||''})));
ok(r.some(z=>z.t==='Tópico Q1'&&/reforçar · 20%/.test(z.rf))&&r.some(z=>z.t==='Tópico Q2'&&!z.rf),'selo "reforçar · 20%" no Tópico Q1 do cartão (e não no Q2, com 90%) '+JSON.stringify(r));
/* registra a Q2 e deixa a Q1 só anotada */
const type=(aula,a,tq)=>ev(([aula,a,tq])=>{const r=[...document.querySelectorAll('.cscard .cstp')].find(e=>e.textContent.includes(aula)&&e.querySelector('input[data-csd]'));[['a',a],['t',tq]].forEach(([n,v])=>{const i=r.querySelector(`input[data-csd][name=${n}]`);i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}))})},[aula,a,tq]);
await type('Aula Q2','10','10');await ev(()=>document.querySelector('.edp [data-act=rreg]').click());await W(400);await ev(()=>{S.sel.mt='0h30';render()});await W(200);await x.submit('#modal form[data-f=man]');await W(500);
await tab('rev');await rvt('Consolidação');await ev(()=>{const c=current();const b=c&&document.querySelector(`[data-act=pickrow][data-id="${c.id}"]`);b&&b.click()});await W(300);
await ev(b=>{if(!document.querySelector('.cscard .csac input[data-csd]')){const e=document.querySelector(`[data-act=cstog][data-id="${b}:x"]`);e&&e.click()}},T.b);await W(250);
await type('Aula Q1','3','10');
ok(await ev(()=>!!document.querySelector('[data-act=rvnow]')),'com algo registrado, aparece "Concluir agora"');
await x.act('rvnow');await W(300);
r=await ev(()=>(document.querySelector('.rvnq')||{}).innerText||'');
ok(/Concluir a consolidação agora\?/.test(r)&&/fica salvo/.test(r)&&/ainda não foram registrados/.test(r),'confirmação: explica o que fica salvo e avisa os acertos anotados e não registrados '+JSON.stringify(r));
await x.act('rvnowx');await W(200);ok(await ev(()=>!document.querySelector('.rvnq')&&consOn()),'Voltar: a revisão continua');
await x.act('rvnow');await W(200);await x.act('rvnowok');await W(500);
r=await ev(()=>({on:consOn(),rv:!!S.rv,rec:S.sessions.filter(x=>x.qik).map(x=>(x.items||[])[0].name+' '+(x.items||[])[0].ac+'/'+(x.items||[])[0].tq),rev:(S.reviews||[]).filter(r=>r.cons).length,tabs:[...document.querySelectorAll('[data-act=rvt]')].filter(b=>b.offsetParent).map(b=>b.textContent.trim())}));
ok(!r.on&&!r.rv&&r.rec.length===1&&r.rec[0]==='Aula Q2 10/10'&&r.rev===1&&!r.tabs.includes('Consolidação'),'Concluir agora: a revisão termina, o registrado fica (Q2 10/10), o anotado sem registrar não entra, e a aba some '+JSON.stringify(r));
/* selo reforçar no "Revise antes de começar" (a última sessão da disciplina foi o Tópico Q1, 2 de 10) */
await tab('ciclo');await ev(b=>{const s=actives().find(x=>(x.of||x.id)===b);const e=s&&document.querySelector(`[data-act=pickrow][data-id="${s.id}"]`);e&&e.click()},T.b);await W(300);
r=await ev(()=>{const e=document.querySelector('.edp .edrb');return e?e.innerText.replace(/\s+/g,' '):null});
ok(r&&/Tópico Q1/.test(r)&&/reforçar · 20%/.test(r),'"Revise antes de começar" com o selo "reforçar · 20%" '+JSON.stringify(r));
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await p.screenshot({path:`saida/rvnow-${w}.png`});
await b.close();process.exit(bad?1:0);
