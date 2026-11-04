/* Notificação do sistema ao atingir a meta (sem a janelinha flutuante): permissão pedida uma vez ao iniciar; aviso na meta */
import puppeteer from 'puppeteer-core';import fs from 'fs';const W=ms=>new Promise(r=>setTimeout(r,ms));
const DATA=fs.readFileSync(process.argv[2],'utf8');let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:1280,height:800});
await p.evaluateOnNewDocument(()=>{window.__notes=[];window.__asks=0;let perm='default';window.Notification=class{constructor(t,o){window.__notes.push(t+' | '+(o&&o.body))}static get permission(){return perm}static requestPermission(){window.__asks++;perm='granted';return Promise.resolve(perm)}}});
await p.goto('http://localhost:8765/');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',d);localStorage.setItem('ciclo-welcome-skip','1')},DATA);await p.reload();await W(700);
const ev=(f,...a)=>p.evaluate(f,...a);
await ev(()=>document.querySelector('.nwplay').click());await W(400);
ok(await ev(()=>S.sx===true&&S.timer.running),'Iniciar abre o modo foco');ok(await ev(()=>!document.querySelector('.fmpip,[data-act=pipon]')),'sem o botão "Destacar cronômetro"');
ok(await ev(()=>window.__asks===1),'permissão de notificação pedida uma vez ao iniciar');
await ev(()=>{const s=curS();S.timer.start=Date.now()-(s.goal-prog(s.id))*60000-1000});await W(1200);
const n=await ev(()=>window.__notes);console.log('   ',JSON.stringify(n));ok(n.length===1&&/^Meta atingida \| .+: 1h30. O cronômetro continua; registre quando quiser.$/.test(n[0]),'notificação "Meta atingida" ao chegar na meta');
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
