/* Antes de iniciar o foco: as escolhas (Tipo, Meta, Avisar antes/depois) direto na camada, só "Continuar" (sem Registrar);
   Continuar conta 5 s e começa; Cancelar e Esc voltam às escolhas sem sair; clicar no número começa na hora; contagem desligada: "Iniciar" começa direto
   (e fica guardada); retomar uma sessão pausada volta direto, sem escolhas; o foco da revisão (bloco) segue o mesmo.
   Uso: node lint/fcd.mjs <pasta-saida> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);S0.blk=[{id:'m1',pos:2}];S0.paused={};d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:844,cd:true});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const A=await ev(()=>inCycle().map(s=>s.id));
await x.act('rplay',A[0]);await W(300);
let st=await ev(()=>{const m=document.querySelector('#modal .fmd');const L=[...m.querySelectorAll('.fmopt .lb')].map(e=>e.textContent);return {L,reg:!!m.querySelector('[data-act=fmreg]'),pronto:/Pronto para iniciar/.test(m.textContent),btn:(m.querySelector('[data-act=fcd]')||{}).textContent,clock:!!m.querySelector('#fmt'),gear:!!m.querySelector('.fmgear'),run:S.timer.running}});
ok(st.L.join()==='Tipo,Meta,Avisar antes,Avisar depois','as escolhas direto na camada: '+st.L.join(' · '));
ok(st.btn==='Continuar'&&!st.reg&&!st.pronto&&!st.clock&&!st.gear&&!st.run,'só "Continuar" (sem Registrar, relógio, engrenagem nem "Pronto para iniciar") '+JSON.stringify(st));
const ofw=await ev(()=>{const m=document.querySelector('#modal .fmd .fmpre').getBoundingClientRect();return [...document.querySelectorAll('#modal .fmpre .seg,#modal .fmpre .swt,#modal .fmpre .cb')].every(e=>{const r=e.getBoundingClientRect();return r.left>=m.left-1&&r.right<=m.right+1})&&document.documentElement.scrollWidth<=innerWidth});
ok(ofw,'nada cortado nem vazando ("Regressivo" inteiro)');
await p.screenshot({path:`${OUT}/fcd-${w}-escolhas.png`});
/* contagem */
await x.act('fcd','fm');await W(200);
st=await ev(()=>({n:(document.getElementById('fcdn')||{}).textContent,st:(document.querySelector('#modal .fmst')||{}).textContent,a:[...document.querySelectorAll('#modal .fma .btn')].map(b=>b.textContent),run:S.timer.running}));
ok(st.n==='5'&&st.st==='Começando em'&&st.a.join()==='Cancelar,Começar agora'&&!st.run,'Continuar: "Começando em 5", Cancelar e Começar agora '+JSON.stringify(st));
await W(1300);ok(await ev(()=>document.getElementById('fcdn').textContent==='4'),'conta para baixo (4)');
await p.screenshot({path:`${OUT}/fcd-${w}-contagem.png`});
await x.act('fcdx');await W(200);ok(await ev(()=>!ui.fcd&&!!document.querySelector('#modal .fmpre')&&!S.timer.running),'Cancelar volta às escolhas');
await x.act('fcd','fm');await W(200);await ev(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));await W(200);
ok(await ev(()=>S.sx===true&&!ui.fcd&&!!document.querySelector('#modal .fmpre')),'Esc cancela a contagem sem sair do foco');
await W(5200);ok(await ev(()=>!S.timer.running),'cancelada, não começa sozinha');
await x.act('fcd','fm');await W(5400);ok(await ev(()=>S.timer.running&&!ui.fcd&&!!document.getElementById('fmt')&&/Estudando/.test(document.querySelector('#modal .fmst').textContent)),'no fim dos 5 s começa sozinho (Estudando)');
/* pausar e sair; retomar volta contando, sem escolhas */
await ev(()=>{S.timer.start-=60000;save()});await x.act('tpause');await x.act('fmoff');await W(200);await x.act('rplay',A[0]);await W(300);
ok(await ev(()=>S.timer.running&&!document.querySelector('#modal .fmpre')),'retomar sessão pausada: volta contando, sem escolhas nem contagem');
await x.act('tpause');await W(150);ok(await ev(()=>!document.querySelector('#modal .fmpre')&&!!document.querySelector('#modal [data-act=fmreg]')),'pausado com tempo: relógio e Registrar como antes');
await ev(()=>{S.timer={running:false,start:0,acc:0};S.paused={};render()});await W(200);
/* clicar no número começa na hora */
await x.act('fcd','fm');await W(200);await ev(()=>document.querySelector('#fcdn').closest('button').click());await W(200);ok(await ev(()=>S.timer.running),'clicar no número começa na hora');
await ev(()=>{S.timer={running:false,start:0,acc:0};render()});await W(200);
/* contagem desligada: "Iniciar" começa direto, e fica guardado */
await x.act('fmoff');await W(150);await ev(()=>document.querySelector('[data-tab=bk]').click());await W(300);
ok(await ev(()=>{const c=document.querySelector('.cfgfm');return !!c&&/Contagem antes de começar/.test(c.textContent)&&c.querySelector('[data-act=cdtog]').getAttribute('aria-checked')==='true'}),'Configurações › Modo foco: "Contagem antes de começar", ligada');
await p.screenshot({path:`${OUT}/fcd-${w}-config.png`});
await x.act('cdtog');await W(150);await ev(()=>document.querySelector('[data-tab=ciclo]').click());await W(300);await x.act('rplay',A[0]);await W(300);
st=await ev(()=>({off:S.cdOff,b:(document.querySelector('#modal .fma [data-act=tstart]')||{}).textContent,cd:!!document.querySelector('#modal [data-act=fcd]')}));ok(st.off===true&&st.b==='Iniciar'&&!st.cd,'desligada (Configurações): o botão é o "Iniciar" de sempre '+JSON.stringify(st));
await x.act('tstart');await W(150);ok(await ev(()=>S.timer.running&&!ui.fcd),'Iniciar começa direto');
await ev(()=>{S.timer={running:false,start:0,acc:0};S.sx=false;save()});await p.reload();await W(700);await x.act('rplay',A[0]);await W(300);
ok(await ev(()=>S.cdOff===true&&!!document.querySelector('#modal .fma [data-act=tstart]')),'a escolha fica guardada depois de recarregar');
await x.act('fmoff');await W(200);await ev(()=>{S.cdOff=false;save()});
/* foco da revisão (bloco) */
const reg=async(id,k)=>{await x.act('rreg',id);await ev(k=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Tópico F'+k;g.rows[0].name='Aula F'+k;render()},k);await x.submit('#modal form[data-f=man]');await W(250)};
await ev(()=>{S.blk[0].goal=45;save()});await reg(A[0],1);await reg(A[1],2);
const has=await ev(()=>!!document.querySelector('[data-act=bkgo]'));
if(has){await x.act('bkgo');await W(300);
 st=await ev(()=>{const m=document.querySelector('#modal .rvfd');return m?{L:[...m.querySelectorAll('.fmopt .lb')].length,reg:!!m.querySelector('[data-act=rvfreg]'),btn:(m.querySelector('[data-act=fcd]')||{}).textContent,list:!!m.querySelector('.rvfw')}:null});
 ok(st&&st.L===4&&!st.reg&&st.btn==='Continuar'&&st.list,'foco da revisão: escolhas, Continuar e "O que revisar" '+JSON.stringify(st));
 await x.act('fcd','rvf');await W(5400);ok(await ev(()=>!!S.rvf&&S.rvf.run&&!!document.getElementById('rvft')),'revisão: começa no fim dos 5 s');
}else ok(false,'sem bloco para revisar');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
