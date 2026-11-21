/* Configurações › Aparência › "Textos de ajuda": desligado, somem os subtítulos fixos das páginas e as explicações (.hlp); o ⓘ fica;
   a escolha fica guardada. Notificações bloqueadas: no foco, uma linha curta com ícone (o texto todo ao tocar), só com aviso ligado.
   Avisar antes/depois: minutos sempre à vista; desligado, apagados; religar volta ao último valor.
   Uso: node lint/ajuda.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.warnM;delete S0.overM;delete S0.hlpOff;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:844});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{Object.defineProperty(Notification,'permission',{get:()=>'denied',configurable:true})});
const tab=t=>ev(t=>document.querySelector(`nav [data-tab=${t}]`).click(),t).then(()=>W(300));
const sub=()=>ev(()=>(document.getElementById('msub')||{}).textContent||'');
await tab('bk');
ok(await ev(()=>{const r=document.querySelector('.cfghl');return !!r&&r.querySelector('[data-act=hlptog]').getAttribute('aria-checked')==='true'}),'Aparência: "Textos de ajuda", ligado');
ok(/Aparência e preferências/.test(await sub())&&await ev(()=>[...document.querySelectorAll('#app .hlp')].some(e=>e.offsetParent)),'ligado: subtítulo e explicações à vista');
await x.act('hlptog');
ok((await sub())===''&&await ev(()=>S.hlpOff===true&&[...document.querySelectorAll('#app .hlp')].every(e=>!e.offsetParent)&&!!document.querySelector('#app [data-act=info]')),'desligado: some o subtítulo e as explicações; o ⓘ fica');
await p.screenshot({path:'saida/ajuda-'+w+'.png'});
for(const t of ['reg','st'])await tab(t).then(async()=>ok((await sub())==='','sem subtítulo em '+t));
await p.reload();await W(700);await tab('bk');ok(await ev(()=>S.hlpOff===true&&document.documentElement.classList.contains('nohlp')),'fica guardado depois de recarregar');
await x.act('hlptog');ok(/Aparência e preferências/.test(await sub()),'religar: voltam');
/* foco: avisos e notificações bloqueadas */
await tab('ciclo');await ev(()=>document.querySelector('.nwplay').click());await W(300);
let r=await ev(()=>{const d=document.querySelector('.fmd .fmpre');return {wn:(i=>i&&i.disabled)(d.querySelector('[data-wnv]')),ov:(i=>i&&i.disabled)(d.querySelector('[data-ovv]')),nb:!!d.querySelector('.fmwnb'),al:(()=>{const R=[...d.querySelectorAll('.fmwn')].map(e=>e.getBoundingClientRect());return R.length===2&&Math.abs(R[0].left-R[1].left)<1&&Math.abs(R[0].width-R[1].width)<1})()}});
ok(r.wn&&r.ov&&!r.nb&&r.al,'desligados: minutos à vista e apagados, linhas alinhadas, sem aviso de bloqueio '+JSON.stringify(r));
await x.act('warntog');await x.act('wnstep','5');ok(await ev(()=>warnM()===25),'ligar e +5: 25');
r=await ev(()=>{const n=document.querySelector('.fmd .fmpre .fmwnb');return n?{t:n.textContent,h:Math.round(n.getBoundingClientRect().height)}:null});
ok(r&&r.t==='Notificações bloqueadas'&&r.h<=44,'bloqueadas: uma linha curta com ícone '+JSON.stringify(r));
await x.act('nbinfo');ok(/aparecem só dentro do app/.test(await ev(()=>(document.getElementById('undo')||{}).textContent||'')),'tocar: explica por inteiro');
await x.act('warntog');ok(await ev(()=>!warnM()&&document.querySelector('[data-wnv]').value==='25'&&document.querySelector('[data-wnv]').disabled),'desligar: 25 fica à vista, apagado');
await x.act('warntog');ok(await ev(()=>warnM()===25),'religar: volta a 25');
await x.act('ovtog');await x.act('ovstep','5');await x.act('ovtog');await x.act('ovtog');ok(await ev(()=>overM()===15),'Avisar depois: religar volta ao último valor (15)');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
