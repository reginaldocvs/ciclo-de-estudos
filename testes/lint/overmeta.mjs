/* Avisar depois da meta: na engrenagem do foco (estudo e revisão) e no cronômetro avulso.
   Desligado de início; liga em 10 min; avisa uma vez quando o tempo além da meta chega a 10 min (som, notificação e mensagem);
   com o botão de repetir ligado, avisa de novo a cada 10 min (20, 30…); retomar já passado não avisa de cara; no Pomodoro a linha não aparece.
   Uso: node lint/overmeta.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};S0.blk=[];S0.paused={};delete S0.overM;delete S0.overR;delete S0.warnM;delete S0.cr;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{window.__nt=[];window.Notification=class{constructor(t,o){window.__nt.push(t+' | '+(o&&o.body||''))}static get permission(){return 'granted'}static requestPermission(){return Promise.resolve('granted')}}});
const nts=()=>ev(()=>window.__nt.filter(t=>/além da meta/.test(t)));
const fmOff=()=>ev(()=>{const e=[...document.querySelectorAll('[data-act=fmoff]')].find(e=>e.offsetParent);if(e)e.click()});
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300);const g=await ev(()=>curS().goal);
/* 1. ligar na engrenagem */
await ev(()=>document.querySelector('.nwplay').click());await W(300);
let r=await ev(()=>{const d=document.querySelector('.fmd .fmpre');return {lb:[...d.querySelectorAll('.fmopt .lb')].map(e=>e.textContent).join(),sw:d.querySelector('[data-act=ovtog]').getAttribute('aria-checked'),rep:(b=>!!b&&b.disabled)(d.querySelector('[data-act=ovrep]'))}});
ok(r.lb==='Tipo,Meta,Avisar antes,Avisar depois'&&r.sw==='false'&&r.rep,'antes de iniciar, na camada: "Avisar depois", desligado (minutos e repetir à vista, apagados) '+JSON.stringify(r));
await x.act('ovtog');r=await ev(()=>({m:overM(),v:document.querySelector('[data-ovv]').value,rep:document.querySelector('[data-act=ovrep]').getAttribute('aria-pressed')}));
ok(r.m===10&&r.v==='10'&&r.rep==='false','ligar: 10 min, repetir desligado (uma vez) '+JSON.stringify(r));
await p.screenshot({path:'saida/overmeta-opcoes-'+w+'.png'});
await x.act('ovstep','5');ok(await ev(()=>overM()===15),'+ passa para 15');await x.act('ovstep','-5');
await ev(()=>{ui.fmo=false;render()});
/* 2. uma vez */
await ev(()=>document.querySelector('.fmd [data-act=tstart]').click());await W(200);
const at=m=>ev(([g,m])=>{S.timer.start=Date.now()-(g+m)*60000;save()},[g,m]);
await at(5);await W(800);ok((await nts()).length===0,'5 min além: sem aviso');
await at(10.2);await W(900);let n=await nts();
ok(n.length===1&&/^10min além da meta/.test(n[0])&&/além da meta · .*\(meta de/.test(await ev(()=>(document.getElementById('undo')||{}).textContent||'')),'10 min além: som, notificação e mensagem '+JSON.stringify(n));
await at(21);await W(900);ok((await nts()).length===1,'uma vez: aos 20 min além não repete');
/* 3. repetir */
await ev(()=>{S.overR=true;save()});await at(30.3);await W(900);n=await nts();ok(n.length===2&&/^30min além da meta/.test(n[1]),'repetir ligado: avisa de novo no próximo múltiplo (30 min) '+JSON.stringify(n));
await at(35);await W(800);ok((await nts()).length===2,'entre os múltiplos não avisa');
await at(40.2);await W(900);n=await nts();ok(n.length===3&&/^40min além/.test(n[2]),'aos 40 min além: de novo');
/* 4. retomar já passado não avisa de cara */
await fmOff();await W(300);
await ev(()=>{window.__nt=[];S.paused={};S.timer={running:false,start:0,acc:0};S.progress={};save();render()});
await ev(g=>{S.sel.subj=curS().id;S.timer={running:true,start:Date.now()-(g+25)*60000,acc:0,d0:today()};S.sx=true;save();render()},g);await W(900);
ok((await nts()).length===0,'sessão que já começa 25 min além: não avisa de cara');
await ev(()=>{S.timer={running:false,start:0,acc:0};S.sx=false;delete S.overM;delete S.overR;window.__nt=[];save();render()});
/* 5. desligado: nada */
await ev(()=>document.querySelector('.nwplay').click());await W(200);await ev(()=>document.querySelector('.fmd [data-act=tstart]').click());await W(200);await at(10.5);await W(900);
ok((await nts()).length===0,'desligado: nada');
await fmOff();await W(300);await ev(()=>{S.paused={};S.timer={running:false,start:0,acc:0};save();render()});
/* 6. avulso: próprio, e some no Pomodoro */
await ev(()=>[...document.querySelectorAll('[data-act=cropen]')].find(e=>e.getClientRects().length).click());await W(300);await x.act('crotog');await W(200);
ok(await ev(()=>[...document.querySelectorAll('.crcfg .fmopt .lb')].map(e=>e.textContent).join()==='Tipo,Meta,Avisar antes,Avisar depois'),'avulso: "Avisar depois" próprio');
await x.act('crovtog');await x.act('crovrep');ok(await ev(()=>S.cr.ow===10&&S.cr.or===true&&!overM()),'avulso: liga em 10, repetir ligado, sem mexer no do estudo');
await p.screenshot({path:'saida/overmeta-avulso-'+w+'.png'});
await x.act('crk','pomo');await W(200);ok(await ev(()=>!document.querySelector('.crcfg [data-act=crovtog]')),'Pomodoro: sem "Avisar depois"');await x.act('crk','up');await x.act('crox');
await x.act('crgo');await ev(()=>{S.cr.start=Date.now()-(25+5)*60000;save()});await W(900);await ev(()=>{S.cr.start=Date.now()-(25+10.3)*60000;save()});await W(900);
n=await nts();ok(n.length===1&&/^10min além da meta/.test(n[0])&&/Cronômetro/.test(n[0]),'avulso: 10 min além da meta de 25 '+JSON.stringify(n));
await ev(()=>{S.cr.start=Date.now()-(25+20.3)*60000;save()});await W(900);ok((await nts()).length===2,'avulso com repetir: de novo aos 20 min além');
await x.act('crpz');await x.act('crx');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
