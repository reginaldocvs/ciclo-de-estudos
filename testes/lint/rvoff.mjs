import puppeteer from 'puppeteer-core';import fs from 'fs';
const [SHOT,OUT]=process.argv.slice(2);
const d=JSON.parse(fs.readFileSync(SHOT+'/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.trv={start:'2026-07-01',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:1280,height:800});
await p.goto('http://localhost:8765/');await p.evaluate(d=>{localStorage.clear();for(const k in d)localStorage.setItem(k,d[k])},d);await p.goto('http://localhost:8765/');await new Promise(r=>setTimeout(r,500));
const ev=(f,...a)=>p.evaluate(f,...a),Wt=ms=>new Promise(r=>setTimeout(r,ms)),c=s=>ev(s=>document.querySelector(s).click(),s);
const log=[],ok=(x,m)=>log.push((x?'OK   ':'FALHA ')+m);
await c('[data-tab=rev]');await Wt(300);
// Encerrar
const k=await ev(()=>document.querySelector('.rvtoday [data-act=trvok]').dataset.id);
await c('.rvtoday [data-act=trvok]');await Wt(250);await c('#modal [data-act=trvend]');await Wt(300);
ok(await ev(k=>{const o=trvList().find(x=>x.k===k);return o.fix&&o.end===today()&&!document.querySelector(`.rvtoday [data-id="${k}"]`)},k),'Encerrar tira o tópico de Para hoje e marca encerrado');
await c('[data-act=rvt][data-id=topicos]');await Wt(250);await ev(()=>{const b=[...document.querySelectorAll('.trvgh')].find(b=>/Finalizados/.test(b.textContent));b.click()});await Wt(250);
ok(await ev(()=>/encerrado em/.test(document.querySelector('.trvc').innerText)&&!!document.querySelector('[data-act=trvres]')),'Finalizados mostra "encerrado em" e Retomar');
await c('[data-act=trvres]');await Wt(300);
ok(await ev(k=>{const o=trvList().find(x=>x.k===k);return !o.fix&&o.due===addD(today(),trvIv()[o.n])},k),'Retomar recomeça a agenda a partir de hoje');
// Desligar grupos
await c('[data-act=rvadj]');await Wt(250);
ok(await ev(()=>document.querySelectorAll('#modal .swt').length===4),'Ajustes com quatro interruptores (grupos, ciclos, tópico, sessões)');
await p.screenshot({path:OUT+'/rvoff-adj.png'});
await c('#modal .swt[data-id=g]');await Wt(250);
ok(await ev(()=>S.rvgOff===true&&!document.querySelector('[data-act=rvt][data-id=grupos]')),'Desligar grupos: some a visão Grupos');
await c('#modal [data-act=rvadjx]');await Wt(200);await c('[data-act=rvt][data-id=hoje]');await Wt(250);
ok(await ev(()=>!document.querySelector('.rvtoday .tdg')),'Hoje sem a revisão de grupo');
await c('[data-act=rvcalm]');await Wt(250);ok(await ev(()=>!document.querySelector('#modal .rcy.st')&&!/Dias do grupo/.test(document.querySelector('#modal .rcl').innerText)),'Calendário sem faixas e legenda de grupos');
await c('#modal [data-act=rvcalx]');await Wt(200);
await c('[data-tab=ciclo]');await Wt(250);const ban=await ev(()=>document.querySelector('.rvrem')?.innerText.replace(/\n/g,' | ')||'');ok(!/Grupo/.test(ban),'Ciclo: aviso sem grupos: '+ban);
// Desligar tópicos também
await c('[data-tab=rev]');await Wt(250);await c('[data-act=rvadj]');await Wt(250);await c('#modal .swt[data-id=t]');await Wt(250);await ev(()=>{const b=document.querySelector('#modal [data-act=tvoffok]');b&&b.click()});await Wt(250);await c('#modal [data-act=rvadjx]');await Wt(200);
ok(await ev(()=>!!document.querySelector('.rvoff')&&!document.querySelector('.rvtabs')&&!document.querySelector('.rvcalb')),'Os dois desligados: aviso e sem seletor/calendário');
await p.screenshot({path:OUT+'/rvoff-both.png'});
await c('[data-tab=ciclo]');await Wt(250);ok(await ev(()=>!document.querySelector('.rvrem')),'Ciclo sem cartão azul');
// Religar tópicos: nada vencido hoje
await c('[data-tab=rev]');await Wt(250);await c('.rvoff [data-act=rvadj]');await Wt(250);await c('#modal .swt[data-id=t]');await Wt(250);await c('#modal [data-act=rvadjx]');await Wt(200);
ok(await ev(()=>trvDue().length===0&&tvOn()),'Religar tópicos: atrasados recomeçam de hoje (nenhum vencido)');
// Grupos travado durante revisão
await ev(()=>{delete S.rvgOff;render()});await Wt(200);await c('[data-act=rvt][data-id=grupos]');await Wt(250);await c('[data-act=rvstart]');await Wt(300);
await ev(()=>{ui.rvadj=true;render()});await Wt(200);ok(await ev(()=>document.querySelector('#modal .swt[data-id=g]').disabled),'Interruptor de grupos travado durante a revisão');
console.log(log.join('\n'),'\n',errs);await b.close();
