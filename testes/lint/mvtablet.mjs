/* Setinhas no tablet de toque (768 e 1024): aparecem lado a lado, 40px, sem estourar a linha; no celular de toque (390) ficam escondidas */
import puppeteer from 'puppeteer-core';import fs from 'fs';const W=ms=>new Promise(r=>setTimeout(r,ms));
const [F,O]=process.argv.slice(2);const DATA=fs.readFileSync(F,'utf8'),RICO=fs.readFileSync('dados/rico.json','utf8');let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const errs=[];
for(const [w,h] of [[768,1024],[1024,768],[390,844]]){
 const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));const c=await p.createCDPSession();
 await p.setViewport({width:w,height:h,hasTouch:true,isMobile:w<600});await c.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
 await p.goto('http://localhost:8765/');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',d);localStorage.setItem('ciclo-welcome-skip','1')},DATA);await p.reload();await W(700);
 const ev=(f,...a)=>p.evaluate(f,...a);
 await ev(()=>document.querySelector('[data-act=edopen]').click());await W(600);
 const r=await ev(()=>{const m=document.querySelector('.medit .mvb'),bt=m.querySelector('.x').getBoundingClientRect();const rows=[...document.querySelectorAll('.medit .card .row')];const over=rows.filter(r=>r.scrollWidth>r.clientWidth+1).length;const nm=[...document.querySelectorAll('.medit .mname')].map(e=>Math.round(e.getBoundingClientRect().width));return {d:getComputedStyle(m).display,bw:Math.round(bt.width),bh:Math.round(bt.height),over,nmin:Math.min(...nm),mm:matchMedia('(pointer:coarse)').matches}});
 console.log('    '+w+'x'+h,JSON.stringify(r));
 if(w>=768){ok(r.d!=='none'&&r.bw>=40&&r.bh>=40,w+': setinhas visíveis com 40px');ok(!r.over,w+': nenhuma linha estoura');ok(r.nmin>=90,w+': nome da disciplina com espaço ('+r.nmin+'px)');
  // toque na setinha move
  const A=await ev(()=>matSeq().on);const first=A.find(x=>!x.startsWith('b:'));await p.tap(`[id="mvsd-${first}"]`);await W(400);const B=await ev(()=>matSeq().on);ok(B.indexOf(first)===A.indexOf(first)+1,w+': tocar ↓ desce a disciplina');
  await p.screenshot({path:`${O}/tablet-${w}-editar.png`});
  await ev(()=>document.querySelector('[data-act=edclose]').click());await W(400);
  await ev(d=>{localStorage.setItem('ciclo-estudos-v2',d)},RICO);await p.reload();await W(700);
  await ev(()=>{const s=S.subjects.find(s=>!s.off);s.topics=s.topics||[];['Princípios','Direitos fundamentais','Organização do Estado','Poder Legislativo'].forEach(nm=>{if(!s.topics.some(t=>t.name===nm))s.topics.push({id:uid(),name:nm,done:false,links:[]})});save();render()});
  await ev(()=>document.querySelector('nav [data-act=plopen]').click());await W(500);await ev(()=>document.querySelector('#modal [data-act=pled]').click());await W(500);
  await ev(()=>{const s=S.subjects.find(s=>!s.off);document.querySelector(`[data-act=pdedit][data-id="${s.id}"]`).click()});await W(500);
  const q=await ev(()=>{const r=document.querySelector('.pdrow');const m=r.querySelector('.mvb');const inp=r.querySelector('.pdtn').getBoundingClientRect().width;r.scrollIntoView({block:'center'});return {d:getComputedStyle(m).display,over:r.scrollWidth>r.clientWidth+1,inp:Math.round(inp)}});console.log('    planos',JSON.stringify(q));
  ok(q.d!=='none'&&!q.over&&q.inp>=150,w+': setinhas nos tópicos, campo do tópico com '+q.inp+'px');await W(300);await p.screenshot({path:`${O}/tablet-${w}-planos.png`});
 } else ok(r.d==='none','celular: setinhas escondidas');
 await p.close()}
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
