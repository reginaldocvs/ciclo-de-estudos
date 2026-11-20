/* Cronômetro avulso (ícone no topo, em todas as abas): para qualquer tarefa, sem registro.
   - abre parado ("Pronto para iniciar"), sem Registrar; engrenagem abre a janela com Tipo (Progressivo/Regressivo/Pomodoro), Meta e Avisar antes (próprio);
   - meta atingida e aviso antes: som, notificação e mensagem, uma vez; fechar (X ou Esc) pausa e guarda o tempo, que o topo mostra;
   - Pomodoro: foco → pausa → … → pausa longa depois de N focos, sozinho, avisando em cada troca; tempos editáveis; Pular;
   - só um relógio por vez: com o estudo contando não abre, e começar o estudo pausa o avulso; nada vai para os registros.
   Uso: node lint/crono.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.cr;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{window.__nt=[];window.Notification=class{constructor(t,o){window.__nt.push(t+' | '+(o&&o.body||''))}static get permission(){return 'granted'}static requestPermission(){return Promise.resolve('granted')}}});
const nS=await ev(()=>S.sessions.length);
const vbtn=()=>ev(()=>{const e=[...document.querySelectorAll('[data-act=cropen]')].find(e=>e.getClientRects().length);return e?{n:document.querySelectorAll('[data-act=cropen]').length,t:(e.querySelector('.crbt')||{}).textContent||''}:null});
const openCr=()=>ev(()=>[...document.querySelectorAll('[data-act=cropen]')].find(e=>e.getClientRects().length).click());
const setT=(f,v)=>ev(([f,v])=>{const i=document.querySelector(`.crcfg [data-crf=${f}]`);i.value=v;i.dispatchEvent(new Event('change',{bubbles:true}))},[f,v]);
const back=m=>ev(m=>{S.cr.start=Date.now()-m*60000;S.cr.acc=0;save()},m);
/* 1. ícone no topo, em todas as abas */
for(const t of ['ciclo','rev','reg','st','bk']){await ev(t=>document.querySelector(`nav [data-tab="${t}"]`).click(),t);await W(200);const v=await vbtn();if(!v){ok(false,'aba '+t+': sem o ícone do cronômetro');break}}
ok(!!(await vbtn()),'ícone do cronômetro no topo em todas as abas');
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(200);
/* 2. abre parado, sem Registrar */
await openCr();await W(300);
let o=await ev(()=>{const d=document.querySelector('.crd');return d?{st:d.querySelector('.fmst').textContent,reg:!!d.querySelector('[data-act*=reg]'),gear:!!d.querySelector('.fmgear'),rz:!!d.querySelector('.fmrz'),gl:document.getElementById('crgl').textContent,sw:document.documentElement.scrollWidth<=innerWidth}:null});
ok(o&&o.st==='Pronto para iniciar'&&!o.reg&&o.gear&&!o.rz&&o.gl==='00:00:00 de 00:25:00'&&o.sw,'abre parado, meta de 25min, sem Registrar e sem reiniciar '+JSON.stringify(o));
/* 3. opções */
await x.act('crotog');await W(300);
o=await ev(()=>{const d=document.querySelector('.crcfg');return d?{lb:[...d.querySelectorAll('.fmopt .lb')].map(e=>e.textContent).join(),seg:[...d.querySelectorAll('[data-act=crk]')].map(b=>b.textContent+':'+b.getAttribute('aria-pressed')).join(),sw:d.querySelector('[data-act=crwtog]').getAttribute('aria-checked'),fit:d.scrollWidth<=d.clientWidth+1}:null});
ok(o&&o.lb==='Tipo,Meta,Avisar antes,Avisar depois'&&o.seg==='Progressivo:true,Regressivo:false,Pomodoro:false'&&o.sw==='false'&&o.fit,'engrenagem: Tipo, Meta e Avisar antes (desligado) '+JSON.stringify(o));
await p.screenshot({path:'saida/crono-opcoes-'+w+'.png'});
await setT('g','0h10');await W(200);ok(await ev(()=>S.cr.g===10&&/de 00:10:00$/.test(document.getElementById('crgl').textContent)),'Meta 0h10: o "de …" muda na hora');
await x.act('crwtog');ok(await ev(()=>S.cr.w===5),'Avisar antes: liga em 5 min');
await x.act('crwstep','1');ok(await ev(()=>S.cr.w===6),'+ passa para 6 (de 1 em 1 até 10)');
await ev(()=>{const i=document.querySelector('[data-crwv]');i.value='30';i.dispatchEvent(new Event('change',{bubbles:true}))});await W(200);ok(await ev(()=>S.cr.w===9),'aviso maior que a meta: fica 1 min antes dela (9)');
await ev(()=>{const i=document.querySelector('[data-crwv]');i.value='3';i.dispatchEvent(new Event('change',{bubbles:true}))});await W(200);
ok(await ev(()=>S.warnM===undefined||S.warnM!==3),'o aviso do avulso não mexe no do estudo');
await p.keyboard.press('Escape');await W(200);ok(await ev(()=>!ui.cro&&!!document.querySelector('.crd')),'Esc fecha só as opções');
/* 4. regressivo, aviso e meta atingida */
await x.act('crclk');ok(await ev(()=>S.cr.k==='down'&&document.getElementById('crt').textContent==='00:10:00'),'tocar no relógio: regressivo, mostra o que falta');
await x.act('crgo');await W(200);ok(await ev(()=>S.cr.run&&!document.querySelector('.crd .fmgear')&&!!document.querySelector('.crd .fmrz')),'Iniciar: conta, engrenagem some, reiniciar aparece');
await back(5);await W(800);let n=await ev(()=>window.__nt.slice());ok(n.length===0,'faltando 5 min: ainda sem aviso (aviso em 3)');
await back(7.2);await W(900);n=await ev(()=>window.__nt.slice());ok(n.length===1&&/Faltam 3min para a meta/.test(n[0]),'faltando 3 min: aviso '+JSON.stringify(n));
await back(10.1);await W(900);n=await ev(()=>window.__nt.slice());ok(n.length===2&&/Meta atingida/.test(n[1])&&/^\+00:00:0\d$/.test(await ev(()=>document.getElementById('crt').textContent)),'meta atingida: avisa e continua contando com "+" '+JSON.stringify(n));
await back(11);await W(900);ok(await ev(()=>window.__nt.length===2),'não repete os avisos');
/* 5. fechar pausa e guarda o tempo; o topo mostra o tempo pausado (apagado) */
await x.act('crx');await W(700);let v=await vbtn();const ms1=await ev(()=>crMs());await W(1200);
ok(await ev(m=>!S.cr.run&&crMs()===m&&!document.querySelector('.crd')&&!document.querySelector('.crbtn.run'),ms1)&&/^\+0[01]:\d\d$/.test(v.t),'fechar: pausa, guarda o tempo e o topo mostra o tempo pausado '+JSON.stringify(v));
await openCr();await W(300);ok(await ev(()=>document.querySelector('.crd .fmst').textContent==='Pausado'&&!!document.querySelector('.crd [data-act=crgo]')),'reabrir: Pausado, com Retomar');
await x.act('crgo');await W(300);await p.keyboard.press('Escape');await W(300);ok(await ev(()=>!S.cr.run&&!ui.cr),'Esc também pausa e fecha');
await p.screenshot({path:'saida/crono-topo-'+w+'.png',clip:{x:0,y:0,width:w,height:160}});
/* 6. só um relógio por vez */
await ev(()=>{const s=curS();S.sel.subj=s.id;S.timer={running:true,start:Date.now(),acc:0,d0:today()};S.sx=true;save();render()});await W(300);
await ev(()=>{S.cr.run=true;S.cr.start=Date.now();save()});await x.act('cropen');await W(200);
ok(await ev(()=>!ui.cr&&!document.querySelector('.crd')&&/Pause o estudo/.test(document.body.innerText)),'com o estudo contando: o avulso não abre e explica');
await ev(()=>{S.timer={running:false,start:0,acc:0};S.sx=false;S.paused={};save();render()});
await ev(()=>document.querySelector('.nwplay').click());await W(300);await ev(()=>document.querySelector('.fmd [data-act=tstart]').click());await W(300);
ok(await ev(()=>!S.cr.run&&S.timer.running),'começar o estudo pausa o avulso');
await ev(()=>{const e=[...document.querySelectorAll('[data-act=fmoff]')].find(e=>e.offsetParent);e&&e.click()});await W(300);await ev(()=>{S.paused={};S.timer={running:false,start:0,acc:0};save();render()});
/* 7. Pomodoro */
await openCr();await W(300);await x.act('crrz');await x.act('crotog');await x.act('crk','pomo');await W(200);
o=await ev(()=>({lb:[...document.querySelectorAll('.crcfg .fmopt .lb')].map(e=>e.textContent).join(),ph:document.querySelector('.crd .fmc>.mut').textContent,pular:!!document.querySelector('.crd [data-act=crskip]')}));
ok(o.lb==='Tipo,Foco,Pausa,Pausa longa,Pausa longa a cada'&&o.ph==='Pomodoro · Foco · 1 de 4'&&o.pular,'Pomodoro: Foco, Pausa, Pausa longa e "a cada"; sem Avisar antes '+JSON.stringify(o));
await p.screenshot({path:'saida/crono-pomodoro-'+w+'.png'});
await setT('pf','0h20');await x.act('crpn','-1');await x.act('crpn','-1');await x.act('crpn','-1');ok(await ev(()=>S.cr.pf===20&&S.cr.pn===2),'tempos editáveis; "a cada" vai até 2 no mínimo');
await x.act('crox');await ev(()=>{window.__nt=[]});await x.act('crgo');await W(200);ok(await ev(()=>/^00:(20:00|19:59)$/.test(document.getElementById('crt').textContent)),'foco de 20min: o relógio mostra o que falta');
await back(20.05);await W(900);o=await ev(()=>({ph:S.cr.ph,lbl:document.querySelector('.crd .fmc>.mut').textContent,n:window.__nt.slice()}));
ok(o.ph==='p'&&/Pausa/.test(o.lbl)&&o.n.some(t=>/Hora da pausa/.test(t)),'fim do foco: pausa sozinha, com aviso '+JSON.stringify(o));
await back(5.05);await W(900);o=await ev(()=>({ph:S.cr.ph,lbl:document.querySelector('.crd .fmc>.mut').textContent}));ok(o.ph==='f'&&/Foco · 2 de 2/.test(o.lbl),'fim da pausa: volta ao foco (2 de 2) '+JSON.stringify(o));
await back(20.05);await W(900);ok(await ev(()=>S.cr.ph==='l'&&window.__nt.some(t=>/pausa longa/.test(t))),'depois de 2 focos: pausa longa');
await x.act('crskip');ok(await ev(()=>S.cr.ph==='f'&&S.cr.n===0&&/Foco · 1 de 2/.test(document.querySelector('.crd .fmc>.mut').textContent)),'Pular: começa a volta de novo');
/* 8. nada vai para os registros */
await x.act('crpz');await x.act('crx');ok(await ev(n=>S.sessions.length===n,nS),'nenhum registro criado');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
