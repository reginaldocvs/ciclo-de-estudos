/* Padrão da revisão por ciclos = 5; quem tinha 3 guardado com ela desligada passa a 5; ligada com 3 continua 3 */
import puppeteer from 'puppeteer-core';import fs from 'fs';const W=ms=>new Promise(r=>setTimeout(r,ms));
const [F,O]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const errs=[];
const run=async(mod,label)=>{const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:390,height:844});
 const S0=JSON.parse(fs.readFileSync(F,'utf8'));mod(S0);await p.goto('http://localhost:8765/');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',d);localStorage.setItem('ciclo-welcome-skip','1')},JSON.stringify(S0));await p.reload();await W(700);
 await p.evaluate(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await p.evaluate(()=>document.querySelector('[data-act=rvadj]').click());await W(400);
 const r=await p.evaluate(()=>({n:cyN(),txt:[...document.querySelectorAll('#modal *')].map(e=>e.childNodes.length===1&&e.textContent).find(t=>t&&/ciclos de estudo/.test(t))}));console.log('    '+label,JSON.stringify(r));
 if(label==='sem ajuste'){r.off=await p.evaluate(()=>({aj:[...document.querySelectorAll('#modal [data-act=rgcfg],#modal [data-act=rvcfg],#modal [data-act=cycfg],#modal [data-act=trvcfg]')].filter(e=>e.offsetParent).length,des:/Desligada/.test(document.getElementById('modal').innerText)}));await p.screenshot({path:O+'/ajustes-desligada.png'});
  await p.evaluate(()=>document.querySelector('#modal [data-act=cycfg]').click());await W(300);await p.evaluate(()=>{const f=document.querySelector('form[data-f=cycfg]');f.querySelector('.rvstep[data-k=cn][data-d="1"]').click();f.requestSubmit()});await W(400);r.adj=await p.evaluate(()=>({n:cyN(),on:cyOn()}));console.log('    ajustar desligada:',JSON.stringify(r.off),JSON.stringify(r.adj));await p.evaluate(()=>{const f=document.querySelector('form[data-f=cycfg]');if(f)f.requestSubmit()});
  await p.evaluate(()=>{S.cyrv.n=5;save();render()});await W(200);await p.evaluate(()=>document.querySelector('[data-act=rvsys][data-id=c]').click());await W(300);r.on=await p.evaluate(()=>({n:S.cyrv.n,on:S.cyrv.on,txt:[...document.querySelectorAll('#modal *')].map(e=>e.childNodes.length===1&&e.textContent).find(t=>t&&/ciclos de estudo/.test(t))}));console.log('    ligada:',JSON.stringify(r.on))}
 await p.close();return r};
let r=await run(S=>{delete S.cyrv},'sem ajuste');ok(/A cada 5 ciclos/.test(r.txt)&&!r.off.des&&r.off.aj===3,'desligada: mostra a regra e os 3 Ajustar, sem "Desligada"');ok(r.adj.n===6&&!r.adj.on,'Ajustar com ela desligada salva e não liga');ok(r.n===5&&r.on.n===5&&r.on.on&&/A cada 5 ciclos/.test(r.on.txt),'sem ajuste: padrão 5, e ligar guarda 5');
r=await run(S=>{S.cyrv={n:3,on:false,last:0}},'3 desligada');ok(r.n===5,'3 guardado com ela desligada vira 5');
r=await run(S=>{S.cyrv={n:3,on:true,last:0};S.rvgOff=true},'3 ligada');ok(r.n===3,'ligada com 3 continua 3');
r=await run(S=>{S.cyrv={n:4,on:false,last:0}},'4 desligada');ok(r.n===4,'outro valor escolhido continua');
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
