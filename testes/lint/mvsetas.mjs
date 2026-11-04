/* Setinhas de ordem (computador): Editar ciclo (disciplinas, pontos de revisão, fora do ciclo) e tópicos na aba Planos; tablet de toque e celular: ver mvtablet.mjs */
import puppeteer from 'puppeteer-core';import fs from 'fs';const W=ms=>new Promise(r=>setTimeout(r,ms));
const [F,O]=process.argv.slice(2);const DATA=fs.readFileSync(F,'utf8');let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:1280,height:860});
await p.goto('http://localhost:8765/');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',d);localStorage.setItem('ciclo-welcome-skip','1')},DATA);await p.reload();await W(700);
const ev=(f,...a)=>p.evaluate(f,...a);const cdp=await p.createCDPSession();const media=(h,pt)=>cdp.send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:h},{name:'pointer',value:pt}]});{const c3=await p.createCDPSession();await c3.send('Emulation.setEmulatedMedia',{features:[{name:'hover',value:'hover'},{name:'pointer',value:'fine'}]});await p.reload();await W(700)}
const seq=()=>ev(()=>matSeq().on.map(id=>id.startsWith('b:')?'[PR]':S.subjects.find(s=>s.id===id).name.slice(0,10)).join(' > '));
const clk=async(sel)=>{const r=await ev(sel=>{const e=document.querySelector(sel);if(!e||e.disabled||!e.offsetParent)return false;e.click();return true},sel);await W(350);return r};
await ev(()=>document.querySelector('[data-act=edopen]').click());await W(500);
const vis=await ev(()=>{const m=document.querySelector('.medit .mvb');return m&&getComputedStyle(m).display});ok(vis&&vis!=='none','setinhas aparecem no computador ('+vis+')');
const s0=await seq();console.log('    antes:',s0);
const A=await ev(()=>matSeq().on);const first=A.find(x=>!x.startsWith('b:'));
ok(await ev(id=>document.getElementById('mvsu-'+id).disabled,first),'primeira disciplina sem ↑');
await p.screenshot({path:`${O}/setas-editar.png`});
// desce a 1ª disciplina: troca com a 2ª
await clk(`#mvsd-${first}`);const s1=await seq();console.log('    1ª desce:',s1);ok(s1.split(' > ')[1]===s0.split(' > ')[0]&&s1.split(' > ')[0]===s0.split(' > ')[1],'↓ troca com a vizinha');
ok(await ev(id=>document.activeElement&&document.activeElement.id==='mvsd-'+id,first),'foco fica na setinha da disciplina movida');
// sobe de volta
await clk(`#mvsu-${first}`);ok(await seq()===s0,'↑ desfaz');
// disciplina logo depois do ponto de revisão sobe: passa o ponto
const i5=A.findIndex((x,i)=>i>0&&A[i-1].startsWith('b:')&&!x.startsWith('b:'));
if(i5>0){const id=A[i5],pr=A[i5-1];const pos0=await ev(b=>S.blk.find(x=>'b:'+x.id===b).pos,pr);await clk(`#mvsu-${id}`);const s2=await seq();console.log('    passa o ponto:',s2);
 const pos1=await ev(b=>S.blk.find(x=>'b:'+x.id===b).pos,pr);ok(pos1===pos0+1,'disciplina sobe e passa o ponto de revisão (pos '+pos0+'→'+pos1+')');
 await p.screenshot({path:`${O}/setas-passou-ponto.png`});
 // o ponto de revisão sobe com a setinha dele
 await ev(b=>document.getElementById('mvsu-'+b).focus(),pr);await clk(`[id="mvsu-${pr}"]`);ok(await seq()===s0,'↑ do ponto de revisão volta ao lugar');}
// a última não tem ↓
const last=A[A.length-1];ok(await ev(id=>document.getElementById('mvsd-'+id).disabled,last),'último item sem ↓');
// fecha e confirma que salvou
await ev(()=>document.querySelector('[data-act=edclose]').click());await W(400);await p.reload();await W(700);ok(await seq()===s0,'ordem salva');
{const c3=await p.createCDPSession();await p.evaluate(d=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',d);localStorage.setItem('ciclo-welcome-skip','1')},fs.readFileSync('dados/rico.json','utf8'));await p.reload();await W(700)}
// Planos: tópicos
await ev(()=>document.querySelector('nav [data-act=plopen]').click());await W(500);console.log('    planos:',await ev(()=>[...document.querySelectorAll('#modal [data-act]')].filter(e=>e.offsetParent).map(e=>e.dataset.act+':'+(e.dataset.id||'')).slice(0,20).join(' ')));
const sid=await ev(()=>{const s=S.subjects.find(s=>!s.off);s.topics=s.topics||[];['Princípios','Direitos fundamentais','Organização do Estado','Poder Legislativo'].forEach(nm=>{if(!s.topics.some(t=>t.name===nm))s.topics.push({id:uid(),name:nm,done:false,links:[]})});save();render();return s.id});
if(!sid)ok(false,'sem disciplina com 3 tópicos para testar');else{
 await ev(()=>document.querySelector('#modal [data-act=pled]').click());await W(500);console.log('    pdedit:',await ev(id=>[tab,[...document.querySelectorAll('[data-act=pdedit]')].map(e=>e.dataset.id).join(','),id].join(' / '),sid));await p.screenshot({path:`${O}/dbg-planos.png`});await ev(id=>{const e=document.querySelector(`[data-act=pdedit][data-id="${id}"]`);e&&e.click()},sid);await W(500);
 const tn=()=>ev(()=>[...document.querySelectorAll('.pdrow .pdtn')].map(i=>i.value));const t0=await tn();console.log('    tópicos:',t0.slice(0,4).join(' | '));
 ok(t0.length>=3,'editor de tópicos aberto');const pv=await ev(()=>({mm:matchMedia('(hover:hover) and (pointer:fine)').matches,d:getComputedStyle(document.querySelector('.pdrow .mvb')).display}));ok(pv.d!=='none','setinhas visíveis nos tópicos '+JSON.stringify(pv));await p.screenshot({path:`${O}/setas-planos.png`});
 ok(await ev(()=>document.querySelector('.pdrow [data-act=pdmv][data-dir="-1"]').disabled),'primeiro tópico sem ↑');
 await ev(()=>document.querySelectorAll('.pdrow [data-act=pdmv][data-dir="1"]')[0].click());await W(350);const t1=await tn();ok(t1[0]===t0[1]&&t1[1]===t0[0],'↓ troca o tópico com o de baixo');
 await ev(()=>document.querySelectorAll('.pdrow [data-act=pdmv][data-dir="-1"]')[1].click());await W(350);ok(JSON.stringify(await tn())===JSON.stringify(t0),'↑ volta');
 await ev(()=>document.querySelectorAll('.pdrow [data-act=pdmv][data-dir="1"]')[0].click());await W(350);
 await ev(()=>document.querySelector('[data-act=pdsave]').click());await W(500);const sv=await ev(id=>S.subjects.find(s=>s.id===id).topics.map(t=>t.name),sid);ok(sv[0]===t0[1]&&sv[1]===t0[0],'Salvar grava a nova ordem dos tópicos');}
// toque: escondidas
{const c2=await p.createCDPSession();await c2.send('Emulation.setEmulatedMedia',{features:[]});await p.setViewport({width:1024,height:860,hasTouch:true});await c2.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});await p.reload();await W(700)}await ev(()=>{document.querySelectorAll('#modal [data-act=plclose],#modal [data-act=pdclose]').forEach(b=>b.click())});await W(300);await ev(()=>document.querySelector('[data-act=edopen]').click());await W(500);
const tq=await ev(()=>({mm:matchMedia('(hover:hover) and (pointer:fine)').matches,d:getComputedStyle(document.querySelector('.medit .mvb')).display}));ok(tq.d!=='none','tablet de toque (1024) também mostra as setinhas '+JSON.stringify(tq));await p.screenshot({path:`${O}/setas-toque.png`});
await ev(()=>document.querySelector('[data-act=edclose]').click());await W(400);ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
