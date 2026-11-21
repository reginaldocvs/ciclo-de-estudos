/* Meta só desta sessão, no foco do estudo:
   - Iniciar abre o foco parado ("Pronto para iniciar"); a engrenagem ao lado do "de …" abre a janela Cronômetro (Tipo, Meta e Avisar antes); correndo, a engrenagem some;
   - trocar a meta muda o "de …", a barra, o relógio "para a meta" e o aviso "Meta atingida", sem mexer na meta da disciplina no ciclo;
   - não aceita meta que não passa do já estudado; registrar a sessão encerra a meta trocada.
   Uso: node lint/fsgmeta.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};S0.blk=[];delete S0.clkDown;delete S0.warnM;delete S0.fg;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{window.__nt=[];window.Notification=class{constructor(t,o){window.__nt.push(t+' | '+(o&&o.body||''))}static get permission(){return 'granted'}static requestPermission(){return Promise.resolve('granted')}}});
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300);
const g0=await ev(()=>curS().goal),sid=await ev(()=>curS().id);
await ev(()=>document.querySelector('.nwplay').click());await W(300);
let o=await ev(()=>({run:S.timer.running,pre:!!document.querySelector('.fmd .fmpre'),gear:!!document.querySelector('.fmd .fmgear'),sw:document.documentElement.scrollWidth<=innerWidth}));
ok(await ev(()=>!document.querySelector('.fmd .fmrz')&&!/Reiniciar cronômetro/.test(document.querySelector('.fmd').innerText)),'sessão nova: sem reiniciar (nada para zerar)');
ok(!o.run&&o.pre&&!o.gear&&o.sw,'Iniciar abre o foco parado, com as escolhas na camada (sem engrenagem) '+JSON.stringify(o));
let d=await ev(()=>{const d=document.querySelector('.fmd .fmpre');return d?{lb:[...d.querySelectorAll('.fmopt .lb')].map(e=>e.textContent).join(),seg:[...d.querySelectorAll('[data-act=clkset]')].map(b=>b.textContent+':'+b.getAttribute('aria-pressed')).join()}:null});
ok(d&&d.lb==='Tipo,Meta,Avisar antes,Avisar depois'&&d.seg==='Progressivo:true,Regressivo:false','escolhas: Tipo, Meta e avisos '+JSON.stringify(d));
await x.act('clkset','down');ok(await ev(()=>S.clkDown===true&&document.querySelector('.fmpre [data-id=down]').getAttribute('aria-pressed')==='true'),'Regressivo: fica marcado e guardado');
await x.act('clkset','up');ok(await ev(()=>!S.clkDown),'Progressivo: volta ao tempo corrido');
await ev(()=>document.querySelector('.fmd [data-act=tstart]').click());await W(300);
ok(await ev(()=>S.timer.running&&!document.querySelector('.fmd .fmgear')),'Iniciar no foco: começa a contar e a engrenagem some');
await ev(()=>document.querySelector('[data-act=tpause]').click());await W(300);
ok(await ev(()=>!!document.querySelector('.fmd .fmgear')&&!document.querySelector('.fmcfg')),'pausado: a engrenagem volta, janela fechada');
ok(await ev(()=>{const r=document.querySelector('.fmd .fmtl .fmrz'),t=document.getElementById('fmt').getBoundingClientRect(),q=r&&r.getBoundingClientRect();return !!r&&r.getAttribute('aria-label')==='Reiniciar cronômetro'&&q.top>=t.bottom&&Math.abs((q.left+q.right)/2-(t.left+t.right)/2)<3}),'pausado: ícone de reiniciar embaixo do relógio, centralizado');
await x.act('fmotog');await W(300);
let f=await ev(()=>{const i=document.querySelector('.fmcfg [data-fsg]');return i?{v:i.value,vis:!!i.offsetParent}:null});
ok(f&&f.vis&&f.v===await ev(g=>tmFmt(g),g0),'janela: Meta com a meta da disciplina '+JSON.stringify(f));
const setF=v=>ev(v=>{const i=document.querySelector('[data-fsg]');i.value=v;i.dispatchEvent(new Event('change',{bubbles:true}))},v);
await setF('0h30');await W(300);
let st=await ev(()=>({g:curS().goal,G:fgG(curS()),gl:document.getElementById('fmgl').textContent}));
ok(st.G===30&&st.g===g0&&/de 00:30:00$/.test(st.gl),'meta 0h30: "de 00:30:00", a da disciplina continua '+g0+' '+JSON.stringify(st));
await p.screenshot({path:'saida/fsgmeta-'+w+'.png'});
await ev(()=>{S.clkDown=true;save();render()});await W(600);{const t=await ev(()=>document.getElementById("fmt").textContent);ok(/^00:(30:00|29:5\d)$/.test(t),'relógio "para a meta" usa a meta desta sessão '+t)}
await ev(()=>{delete S.clkDown;save();render()});
/* aviso de meta atingida com a meta nova */
await ev(()=>document.querySelector('[data-act=tstart]').click());await W(200);
await ev(()=>{S.timer.start=Date.now()-31*60000;save()});await W(1300);
let n=await ev(()=>window.__nt.slice());ok(n.some(t=>/Meta atingida/.test(t)&&/30min/.test(t)),'aos 31 min: "Meta atingida" com 30min '+JSON.stringify(n));
/* meta que não passa do já estudado */
await ev(()=>document.querySelector('[data-act=tpause]').click());await W(300);
await x.act('fmotog');
await ev(s=>{S.progress[s]=40;save();render()},sid);await W(200);await ev(s=>{S.fg.p=40;save();render()},sid);
await setF('0h20');await W(300);ok(await ev(()=>fgG(curS())===30)&&/passar do que já foi estudado/.test(await ev(()=>document.body.innerText)),'meta abaixo do já estudado: não aceita e explica');
await ev(s=>{S.progress[s]=0;S.fg.p=0;save();render()},sid);
/* registrar encerra a meta trocada */
await ev(()=>{S.timer={running:false,start:0,acc:0};S.sel.subj=curS().id;addSession(31);save();render()});await W(300);
ok(await ev(()=>fgG(curS())===curS().goal),'depois de registrar: volta a valer a meta da disciplina');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
