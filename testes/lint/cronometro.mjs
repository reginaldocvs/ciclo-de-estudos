/* Relógio do foco e aviso antes da meta:
   - tocar no relógio alterna entre o tempo corrido e o que falta para a meta ("para a meta"; passou dela: "+…" e "além da meta");
     a escolha fica guardada (vale depois de recarregar) e vale também no foco da revisão;
   - Configurações › Cronômetro do foco: "Avisar antes da meta" (liga em 20 min; − e + de 5 em 5; campo de 1 a 180);
   - o aviso (som, notificação e mensagem) vem uma vez por sessão, quando faltar o tempo escolhido, e não vem se a sessão já começou
     com menos tempo que isso pela frente; vale para o foco do estudo e o da revisão.
   Uso: node lint/cronometro.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};S0.blk=[];delete S0.clkDown;delete S0.warnM;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
/* notificação de mentira: registra o que o app mostraria */
const stub=()=>ev(()=>{window.__nt=[];window.Notification=class{constructor(t,o){window.__nt.push(t+' | '+(o&&o.body||''))}static get permission(){return 'granted'}static requestPermission(){return Promise.resolve('granted')}}});
await stub();
const tab=async t=>{await ev(t=>document.querySelector(`nav [data-tab=${t}]`).click(),t);await W(300)};
const clk=id=>ev(id=>({t:(document.getElementById(id)||{}).textContent,l:(document.getElementById(id+'l')||{}).textContent}),id);
const toasts=()=>ev(()=>document.body.innerText.match(/Faltam? \d+min para a meta[^\n]*/g)||[]);
/* 1. foco do estudo: corrido → falta → passou da meta */
await tab('ciclo');const goal=await ev(()=>curS().goal);
await ev(()=>document.querySelector('.nwplay').click());await W(300);
await ev(()=>{S.timer.start=Date.now()-10*60000;save()});await W(700);
let c=await clk('fmt');ok(/^00:10:0\d$/.test(c.t)&&!c.l,'foco: mostra o tempo corrido, sem legenda '+JSON.stringify(c));
await ev(()=>document.querySelector('[data-act=clkdown]').click());await W(700);
c=await clk('fmt');const rem=goal*60-10*60,hh=String(Math.floor(rem/3600)).padStart(2,'0'),mm=String(Math.floor(rem%3600/60)-1).padStart(2,'0');
ok(c.t.startsWith(hh+':'+mm)&&c.l==='para a meta','tocar no relógio: mostra o que falta para a meta de '+goal+' min '+JSON.stringify(c));
await p.screenshot({path:'saida/cronometro-falta-'+w+'.png'});
await ev(g=>{S.timer.start=Date.now()-(g+3)*60000;save()},goal);await W(700);
c=await clk('fmt');ok(/^\+00:0[23]:\d\d$/.test(c.t)&&c.l==='além da meta','passou da meta: "+" o tempo além e "além da meta" '+JSON.stringify(c));
/* escolha guardada: recarregar */
await ev(()=>{const e=[...document.querySelectorAll('[data-act=fmoff]')].find(e=>e.offsetParent);e&&e.click()});await W(300);
await p.reload();await W(900);await stub();ok(await ev(()=>S.clkDown===true),'a escolha fica guardada depois de recarregar');
await ev(()=>{S.paused={};S.timer={running:false,start:0,acc:0};save();render()});
/* 2. Configurações: liga o aviso (20 min), − e + de 5, campo */
await tab('bk');let cfg=await ev(()=>{const c=[...document.querySelectorAll('#app .card')].find(c=>/Cronômetro do foco/.test(c.textContent));return c?{sw:c.querySelector('[data-act=warntog]').getAttribute('aria-checked'),inp:!!c.querySelector('[data-wnv]')}:null});
ok(cfg&&cfg.sw==='false'&&!cfg.inp,'Configurações: "Cronômetro do foco" com o aviso desligado '+JSON.stringify(cfg));
await x.act('warntog');let wv=await ev(()=>({w:warnM(),v:(document.querySelector('[data-wnv]')||{}).value}));ok(wv.w===20&&wv.v==='20','ligar: avisa quando faltar 20 min '+JSON.stringify(wv));
await x.act('wnstep','5');ok(await ev(()=>warnM()===25),'+ passa para 25');await x.act('wnstep','-5');await x.act('wnstep','-5');ok(await ev(()=>warnM()===15),'− duas vezes: 15');
await ev(()=>{const i=document.querySelector('[data-wnv]');i.value='20';i.dispatchEvent(new Event('change',{bubbles:true}))});await W(200);ok(await ev(()=>warnM()===20),'campo: 20');
await ev(()=>{const i=document.querySelector('[data-wnv]');i.value='500';i.dispatchEvent(new Event('change',{bubbles:true}))});await W(200);ok(await ev(()=>warnM()===20),'valor fora de 1 a 180 não vale');
await p.screenshot({path:'saida/cronometro-ajustes-'+w+'.png'});
/* 3. aviso no foco do estudo: uma vez, quando faltar 20 min */
await tab('ciclo');await ev(()=>document.querySelector('.nwplay').click());await W(300);
await ev(g=>{S.timer.start=Date.now()-(g-25)*60000;save()},goal);await W(800);ok((await toasts()).length===0&&await ev(()=>window.__nt.length===0),'faltando 25 min: ainda sem aviso');
await ev(g=>{S.timer.start=Date.now()-(g-19.5)*60000;save()},goal);await W(800);
let t=await toasts(),n=await ev(()=>window.__nt.slice());ok(t.length===1&&n.length===1&&/Faltam 20min para a meta/.test(n[0]),'faltando 20 min: aviso na tela e notificação '+JSON.stringify({t,n}));
await ev(g=>{S.timer.start=Date.now()-(g-10)*60000;save()},goal);await W(800);ok(await ev(()=>window.__nt.length===1),'continua: o aviso não se repete');
await ev(()=>{const e=[...document.querySelectorAll('[data-act=fmoff]')].find(e=>e.offsetParent);e&&e.click()});await W(300);await ev(()=>{S.paused={};S.timer={running:false,start:0,acc:0};window.__nt=[];save();render()});
/* sessão que já começa com menos de 20 min pela frente: sem aviso */
await ev(g=>{S.progress[curS().id]=g-15;save();render()},goal);await W(200);await ev(()=>document.querySelector('.nwplay').click());await W(300);
await ev(()=>{S.timer.start=Date.now()-5*60000;save()});await W(800);ok(await ev(()=>window.__nt.length===0),'sessão que começa faltando 15 min: sem aviso');
await ev(()=>{const e=[...document.querySelectorAll('[data-act=fmoff]')].find(e=>e.offsetParent);e&&e.click()});await W(300);await ev(()=>{S.paused={};S.timer={running:false,start:0,acc:0};S.progress={};window.__nt=[];save();render()});
/* 4. foco da revisão: relógio que falta e aviso (meta 30, aviso aos 20) */
const sid=await ev(()=>curS().id);await ev(sid=>{const s=S.subjects.find(x=>x.id===sid);if(!s.topics.length)s.topics.push({id:'tz',name:'Crase',done:false,links:[]});S.sessions.push({id:'q1',ses:'q1',subj:sid,topic:s.topics[0].id,min:30,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',date:addD(today(),-8),items:[{kind:'aula',name:'Aula 1',link:''}]});trvInit();delete S.trv.off;S.trv.start=addD(today(),-30);save();render()},sid);
const k=await ev(()=>{const d=trvDue();return d[0]?d[0].k:null});
if(k){await ev(k=>{rvfStart('tp',k);S.rvf.goal=30;S.rvf.run=true;S.rvf.start=Date.now()-5*60000;save();render()},k);await W(800);
 c=await clk('rvft');ok(/^00:2[45]:\d\d$/.test(c.t)&&c.l==='para a meta','foco da revisão: também mostra o que falta '+JSON.stringify(c));
 await ev(()=>{S.rvf.start=Date.now()-10.5*60000;save()});await W(800);n=await ev(()=>window.__nt.slice());ok(n.length===1&&/Faltam 20min para a meta/.test(n[0]),'foco da revisão: aviso quando faltar 20 min '+JSON.stringify(n));
 await p.screenshot({path:'saida/cronometro-revisao-'+w+'.png'});
 await ev(()=>document.querySelector('.rvfd [data-act=clkdown]').click());await W(700);c=await clk('rvft');ok(/^00:10:\d\d$/.test(c.t)&&!c.l,'tocar de novo: volta ao tempo corrido '+JSON.stringify(c))}
else ok(false,'sem revisão de tópico vencida para o teste');
/* 5. desligado: sem aviso */
await ev(()=>{S.rvf=null;delete S.warnM;window.__nt=[];save();render()});await tab('ciclo');await ev(()=>document.querySelector('.nwplay').click());await W(300);
await ev(g=>{S.timer.start=Date.now()-(g-25)*60000;save()},goal);await W(700);await ev(g=>{S.timer.start=Date.now()-(g-19)*60000;save()},goal);await W(800);ok(await ev(()=>window.__nt.length===0),'aviso desligado: nada');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
