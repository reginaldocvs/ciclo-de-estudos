import puppeteer from 'puppeteer-core';import fs from 'fs';
const [SHOT,OUT]=process.argv.slice(2);
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
for(const W of [320,360,390,1280]){
const d=JSON.parse(fs.readFileSync(SHOT+'/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.trv={start:'2026-07-01',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:W,height:W>600?760:760,deviceScaleFactor:1.25});
await p.goto('http://localhost:8765/');await p.evaluate(d=>{localStorage.clear();for(const k in d)localStorage.setItem(k,d[k])},d);await p.goto('http://localhost:8765/');await new Promise(r=>setTimeout(r,500));
const ev=(f,...a)=>p.evaluate(f,...a),Wt=ms=>new Promise(r=>setTimeout(r,ms));
await ev(W=>document.querySelector(W>600?'[data-tab=rev]':'.tabbar [data-tab=rev]').click(),W);await Wt(300);
await ev(()=>document.querySelector('.rvtoday .trvr:not(.tdg) [data-act=trvok]').click());await Wt(300);
const dl=await ev(()=>{const bs=[...document.querySelectorAll('#modal .trvact > *')].map(e=>e.getBoundingClientRect()),dl=document.querySelector('#modal .trvdlg').getBoundingClientRect();return {umaLinha:new Set(bs.filter(r=>r.width).map(r=>Math.round(r.top+r.height/2))).size===1,dentro:bs.every(r=>r.right<=dl.right-8&&r.left>=dl.left)}});
await p.screenshot({path:`${OUT}/fix-${W}-janela.png`});
await ev(()=>document.querySelector('#modal [data-act=trvend]').click());await Wt(400);
await ev(()=>{const o=trvList().find(o=>!o.fix);S.trv.t[o.k]={h:[1,2,3,4,5].map(i=>addD(today(),-i*3))};save();render()});await ev(()=>document.querySelector('[data-act=rvt][data-id=topicos]').click());await Wt(300);
await ev(()=>{[...document.querySelectorAll('.trvgh')].find(b=>/Finalizados/.test(b.textContent)).click()});await Wt(300);
const fx=await ev(()=>{const s=document.querySelector('.trvx .trvxn');return {inteiro:s.scrollWidth<=s.clientWidth,texto:[...document.querySelectorAll('.trvx')].map(e=>e.innerText.split(String.fromCharCode(10)).join(' | ')).join(' // ').replace(/\n/g,' | ')}});
await ev(()=>document.querySelector('.trvx').scrollIntoView({block:'center'}));await p.screenshot({path:`${OUT}/fix-${W}-fixados.png`});
console.log(W,dl,fx,errs);await p.close()}
await b.close();
