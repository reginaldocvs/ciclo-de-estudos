import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [WD]=process.argv.slice(2);const w=+(WD||390);
const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.trv={start:'2026-09-25',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:w<500?844:900});const x=mk(p);try{
/* estado logo depois do clique: a janela de cima tem "enter"? há algo saindo? */
const st=()=>x.ev(()=>{const L=[...document.querySelectorAll('#modal .dlg')];const top=L[L.length-1];return {n:L.length,enter:!!top&&top.classList.contains('enter'),out:document.querySelectorAll('#modalOut>.dlg').length,lbl:top?top.getAttribute('aria-label'):''}});
const click=async(sel)=>{await x.ev(s=>document.querySelector(s).click(),sel);await W(30)};
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(400);
await click('[data-act=rvadj]');let s=await st();ok(s.enter&&s.out===0,'abrir Ajustes a partir da tela: entra animado '+JSON.stringify(s));await W(400);
await click('#modal [data-act=trvcfg]');s=await st();ok(!s.enter&&s.out===0&&/tópico/i.test(s.lbl),'Ajustar: troca sem entrar nem sair '+JSON.stringify(s));await W(400);
await click('#modal .chead [data-act=cfgback]');s=await st();ok(!s.enter&&s.out===0&&/Ajustes de revisão/.test(s.lbl),'seta de voltar: troca sem animação '+JSON.stringify(s));await W(400);
await click('#modal [data-act=rvcfg]');await W(400);await x.submit('#modal form');s=await st();ok(!s.enter&&s.out===0,'Salvar volta para Ajustes sem animação '+JSON.stringify(s));await W(400);
await click('#modal [data-act=rvcfg]');await W(400);await click('#modal [data-act=rvcfgx]');s=await st();ok(s.n===0&&s.out>0,'X na janela filho fecha tudo com saída animada '+JSON.stringify(s));await W(500);
// ajuda por cima de outra janela
await click('[data-act=rvadj]');await W(400);await x.ev(()=>{ui.info='trv';render()});s=await st();ok(s.enter&&s.n===2,'ajuda por cima: entra animada '+JSON.stringify(s));await W(400);
await x.ev(()=>{ui.info=null;render()});s=await st();ok(s.out>0&&s.n===1,'fechar a ajuda: sai animada, Ajustes fica '+JSON.stringify(s));await W(400);
await x.ev(()=>{ui.rvadj=null;render()});await W(500);
// Ver registro → Editar → Cancelar
await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300);
await x.ev(()=>{const s=inCycle().find(s=>S.sessions.some(x=>pkey(x)===s.id&&x.cycle===S.cycle&&!x.review));ui.rview=s.id;render()});await W(400);
await click('#modal [data-act=edit]');s=await st();ok(!s.enter&&s.out===0,'Ver registro → Editar: troca sem animação '+JSON.stringify(s));await W(400);
await click('#modal [data-act=canceledit]');s=await st();ok(!s.enter&&s.out===0,'Cancelar volta ao registro sem animação '+JSON.stringify(s));await W(400);
await click('#modal [data-act=rvclose]');s=await st();ok(s.n===0&&s.out>0,'fechar o registro: sai animado '+JSON.stringify(s));
log.push('erros: '+JSON.stringify(errs));
}catch(e){log.push('EXCEÇÃO '+e.message)}await b.close();console.log(log.join('\n'));
