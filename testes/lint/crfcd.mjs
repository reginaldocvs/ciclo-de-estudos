/* Cronômetro avulso antes de iniciar: as escolhas na tela (Tipo, Meta, avisos; no Pomodoro, Foco, Pausa e Pausa longa) e "Continuar",
   que conta 5 s e começa; pausado com tempo, volta o relógio e a engrenagem. Uso: node lint/crfcd.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':fs.readFileSync(F,'utf8'),'ciclo-welcome-skip':'1'},w,h:844,cd:true});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{S.cr=null;S.cdOff=false;save();render()});await W(200);
await ev(()=>[...document.querySelectorAll('[data-act=cropen]')].find(e=>e.getClientRects().length).click());await W(400);
let r=await ev(()=>({pre:!!document.querySelector('.crd .fmpre'),lb:[...document.querySelectorAll('.crd .fmopt .lb')].map(e=>e.textContent).join(),btn:(document.querySelector('.crd [data-act=fcd]')||{}).textContent,clock:!!document.getElementById('crt')}));
ok(r.pre&&r.lb==='Tipo,Meta,Avisar antes,Avisar depois'&&r.btn==='Continuar'&&!r.clock,'abre com as escolhas e Continuar, sem relógio '+JSON.stringify(r));
await x.act('crk','pomo');ok(await ev(()=>[...document.querySelectorAll('.crd .fmopt .lb')].map(e=>e.textContent).join()==='Tipo,Foco,Pausa,Pausa longa,Pausa longa a cada'),'Pomodoro: Foco, Pausa, Pausa longa e "a cada" na tela');
await x.act('crk','up');
await x.act('fcd','cr');r=await ev(()=>({n:(document.getElementById('fcdn')||{}).textContent,run:crS().run}));ok(r.n==='5'&&!r.run,'Continuar: conta 5 '+JSON.stringify(r));
await x.act('fcdx');ok(await ev(()=>!ui.fcd&&!!document.querySelector('.crd .fmpre')),'Cancelar volta às escolhas');
await x.act('fcd','cr');await W(5400);ok(await ev(()=>crS().run&&!!document.getElementById('crt')&&!document.querySelector('.crd .fmpre')),'no fim dos 5 s começa');
await x.act('crpz');ok(await ev(()=>!document.querySelector('.crd .fmpre')&&!!document.querySelector('.crd .fmgear')),'pausado com tempo: relógio e engrenagem, sem escolhas');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
