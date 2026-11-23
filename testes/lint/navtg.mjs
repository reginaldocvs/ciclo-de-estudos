/* Menu lateral (computador): o botão ao lado do logo e Ctrl+\ recolhem para só os ícones e abrem de novo;
   recolhido, cada aba mostra o nome ao passar o mouse; a escolha volta ao recarregar; nada sobrepõe. Uso: node lint/navtg.mjs [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const w=+(process.argv[2]||1280);const S0=JSON.parse(fs.readFileSync('dados/exemplo.json','utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const st=()=>ev(()=>{const sd=document.querySelector('.side').getBoundingClientRect(),t=document.querySelector('[data-navtg]'),tr=t.getBoundingClientRect(),lg=document.querySelector('.sbrand .logo').getBoundingClientRect(),nm=document.querySelector('.sbrand .bnm').getBoundingClientRect(),
 n1=document.querySelector('.sidenav button').getBoundingClientRect(),hit=(a,c)=>!(a.right<=c.left||c.right<=a.left||a.bottom<=c.top||c.bottom<=a.top),bt=[...document.querySelectorAll('.sidenav button')];
 return {mini:document.documentElement.classList.contains('navmini'),w:Math.round(sd.width),lab:t.getAttribute('aria-label'),exp:t.getAttribute('aria-expanded'),vis:tr.width>0,
  inS:tr.left>=sd.left&&tr.right<=sd.right+0.5,overLogo:hit(tr,lg),overName:getComputedStyle(document.querySelector('.sbrand .bnm')).opacity!=='0'&&hit(tr,nm),overNav:hit(tr,n1),titles:bt.every(b=>!!b.title),main:Math.round(document.querySelector('main').getBoundingClientRect().left)}});
let r=await st();ok(!r.mini&&r.w>=200&&r.vis&&r.inS&&!r.overLogo&&!r.overName&&!r.overNav&&r.lab==='Recolher menu'&&r.exp==='true','aberto: botão dentro do menu, sem cobrir logo, nome ou abas '+JSON.stringify(r));
const m0=r.main;await ev(()=>document.querySelector('[data-navtg]').click());await W(500);
r=await st();ok(r.mini&&r.w<=90&&r.inS&&!r.overLogo&&!r.overNav&&r.lab==='Expandir menu'&&r.exp==='false'&&r.titles&&r.main<m0,'recolhido: só ícones, botão abaixo do logo, nomes no title, conteúdo ganha espaço '+JSON.stringify(r));
await p.reload();await W(900);r=await st();ok(r.mini&&r.titles,'recarregar: continua recolhido '+JSON.stringify(r));
await p.keyboard.down('Control');await p.keyboard.press('Backslash');await p.keyboard.up('Control');await W(500);
r=await st();ok(!r.mini&&r.w>=200&&r.lab==='Recolher menu','Ctrl+\ abre de novo '+JSON.stringify(r));
await p.keyboard.down('Control');await p.keyboard.press('Backslash');await p.keyboard.up('Control');await W(500);r=await st();ok(r.mini,'Ctrl+\ recolhe');
await p.screenshot({path:'saida/navtg-mini.png',clip:{x:0,y:0,width:520,height:500}});
await ev(()=>document.querySelector('[data-navtg]').click());await W(500);await p.screenshot({path:'saida/navtg-open.png',clip:{x:0,y:0,width:520,height:500}});
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));await b.close();process.exit(bad?1:0);
