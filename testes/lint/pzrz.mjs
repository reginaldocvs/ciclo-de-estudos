/* Painel da sessão: com o estudo em pausa, um ícone ao lado de "Retomar sessão" reinicia o cronômetro (com Desfazer).
   Sem pausa, o ícone não aparece. Uso: node lint/pzrz.mjs [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const w=+(process.argv[2]||1280);const S0=JSON.parse(fs.readFileSync('dados/exemplo.json','utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};S0.sessions=[];S0.progress={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>document.querySelector('nav [data-tab=ciclo]')?.click());await W(250);
const st=()=>ev(()=>{const d=document.querySelector('.edp');const r=d&&d.querySelector('[data-act=pzrz]'),pl=d&&d.querySelector('.nwplay');const a=r&&r.getBoundingClientRect(),c=pl&&pl.getBoundingClientRect();
 return {rz:!!r,play:pl&&pl.textContent.trim(),row:!!(a&&c&&Math.abs(a.top-c.top)<2&&Math.abs(a.height-c.height)<2&&a.left>c.right),fit:!!(a&&a.right<=d.getBoundingClientRect().right+1),el:el(),pz:pzMs(current().id)}});
let r=await st();ok(!r.rz&&r.play==='Iniciar sessão','sem pausa: sem o ícone '+JSON.stringify(r));
/* estudo pausado com 12 min no cronômetro */
await ev(()=>{S.paused={[current().id]:{ms:12*60000,d0:today()}};save();render()});await W(300);
r=await st();ok(r.rz&&r.play==='Retomar sessão'&&r.row&&r.fit,'em pausa: ícone na mesma linha de "Retomar sessão", mesma altura '+JSON.stringify(r));
await ev(()=>document.querySelector('.edp [data-act=pzrz]').click());await W(300);
r=await st();ok(!r.rz&&r.pz===0&&r.play==='Iniciar sessão','clicar: cronômetro zerado, volta a "Iniciar sessão" '+JSON.stringify(r));
const u=await ev(()=>{const e=[...document.querySelectorAll('button')].find(b=>/Desfazer/.test(b.textContent));const t=document.body.textContent.includes('Cronômetro reiniciado');e&&e.click();return {u:!!e,t}});await W(300);
r=await st();ok(u.u&&u.t&&r.pz===12*60000&&r.rz,'Desfazer devolve os 12 min '+JSON.stringify([u,r]));
/* pausa guardada em S.paused (sessão estacionada) */
await ev(()=>{const s=current();S.timer={running:false,start:0,acc:0};S.paused={[s.id]:{ms:5*60000,d0:today()}};save();render()});await W(300);
r=await st();ok(r.rz&&r.pz===5*60000,'pausa guardada: ícone aparece '+JSON.stringify(r));
await ev(()=>document.querySelector('.edp [data-act=pzrz]').click());await W(300);
r=await st();ok(!r.rz&&r.pz===0,'clicar: pausa guardada apagada '+JSON.stringify(r));
await p.screenshot({path:'saida/pzrz.png'});ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
