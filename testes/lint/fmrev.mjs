/* Foco da revisão por grupo: título "Revisão · Grupo N", "O que revisar" com caixinhas que marcam sem sair do foco, e lista longa rola */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const S=JSON.parse(fs.readFileSync('dados/rico.json','utf8'));S.timer={running:false,start:0,acc:0};S.sx=false;S.rvf=null;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S),'ciclo-welcome-skip':'1'},w:390,h:860});const x=mk(p);
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);
const g=await x.ev(()=>rgInfo().list.find(o=>o.st==='disponivel').g.id);await x.act('rvstart',g);await W(400);
const id=await x.ev(()=>actives().find(s=>!gDone(s)).id);await x.ev(id=>document.querySelector(`[data-act=rplay][data-id="${id}"]`).click(),id);await W(600);
const before=await x.ev(()=>Object.keys(S.checked||{}).length);
await x.ev(()=>document.querySelector('#modal .fmd input[type=checkbox]').click());await W(500);
const r=await x.ev(()=>{const cb=document.querySelector('#modal .fmd input[type=checkbox]');return {fm:FM.on,ck:cb&&cb.checked,n:Object.keys(S.checked||{}).length}});console.log('marcar:',JSON.stringify(r),'antes',before);const hd=await x.ev(()=>document.querySelector('#modal .fmd .fmc>.mut').textContent);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};ok(/^Revisão · Grupo \d+$/.test(hd),'título: '+hd);ok(r.fm&&r.ck&&r.n===before+1,'marcar a caixinha no foco marca a aula e o foco continua');
// lista longa: 30 aulas no tópico da disciplina
await x.ev(()=>{const s=curS();const tid=winTopics(s.id)[0];const ses=CS().find(x=>x.subj===s.id&&x.topic===tid&&!x.review&&inSrc(x));for(let i=0;i<25;i++)ses.items.push({kind:'aula',name:'Aula extra '+i,link:''});render()});await W(400);
const rl=JSON.parse(await x.ev(()=>{const d=document.querySelector('#modal .fmd');const cs=getComputedStyle(d);const before=d.scrollTop;d.scrollTop=99999;return JSON.stringify({sh:d.scrollHeight,ch:d.clientHeight,oy:cs.overflowY,rolou:d.scrollTop>before})}));ok(rl.rolou,'lista longa rola ('+rl.sh+'px)');
if(process.argv[2])await p.screenshot({path:process.argv[2]+'/grupo-lista-longa.png'});
console.log(await x.ev(()=>{let e1;try{fmHtml()}catch(e){e1=e.message+' | '+e.stack.split('\n')[1]}return JSON.stringify({sx:S.sx,FM:FM.on,run:S.timer.running,e1,type:S.type,rv:!!S.rv})}));ok(!errs.length,'sem erros '+JSON.stringify(errs));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
