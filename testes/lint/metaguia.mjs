/* A meta é um guia: ao chegar nela, só avisa (uma vez); modo foco fica, cronômetro continua; registro com o tempo todo; reabrir não corta. */
import puppeteer from 'puppeteer-core';import fs from 'fs';const W=ms=>new Promise(r=>setTimeout(r,ms));
const [F,O,WD]=process.argv.slice(2);const DATA=fs.readFileSync(F,'utf8');let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:+(WD||390),height:800});
await p.evaluateOnNewDocument(()=>{window.__notes=[];window.Notification=class{constructor(t,o){window.__notes.push(t+' | '+(o&&o.body))}static get permission(){return 'granted'}static requestPermission(){return Promise.resolve('granted')}}});
await p.goto('http://localhost:8765/');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',d);localStorage.setItem('ciclo-welcome-skip','1')},DATA);await p.reload();await W(700);
const ev=(f,...a)=>p.evaluate(f,...a);
await ev(()=>document.querySelector('.nwplay').click());await W(400);
const sid=await ev(()=>S.sel.subj),goal=await ev(()=>curS().goal-prog(curS().id));
ok(await ev(()=>S.sx===true&&S.timer.running&&FM.on),'Iniciar abre o modo foco');ok(await ev(()=>document.querySelector('#fmb i.gx').getBoundingClientRect().width===0),'antes da meta: sem trecho claro na barra');
// chega na meta
await ev(()=>{const s=curS();S.timer.start=Date.now()-(s.goal-prog(s.id))*60000-1000});await W(1300);
let n=await ev(()=>window.__notes);console.log('    ',JSON.stringify(n));ok(n.length===1&&/^Meta atingida \| .+: 1h30\. O cronômetro continua/.test(n[0]),'notificação ao chegar na meta');
ok(await ev(()=>S.sx===true&&FM.on&&S.timer.running&&!ui.sxo&&!document.querySelector('#modal form[data-f=man]')),'modo foco continua e o registro não abre sozinho');
// passa 12 minutos da meta
await ev(()=>{S.timer.start-=12*60000});await W(1300);
const rb=()=>ev(()=>{const b=document.getElementById('fmb').getBoundingClientRect().width,w=e=>document.getElementById(e).getBoundingClientRect().width;return {gl:document.getElementById('fmgl').textContent,g:+(w('fmbar')/b*100).toFixed(1),x:+(document.querySelector('#fmb i.gx').getBoundingClientRect().width/b*100).toFixed(1),cx:getComputedStyle(document.querySelector('#fmb i.gx')).backgroundColor,t:document.getElementById('fmt').textContent}});const st=await rb();console.log('    ',JSON.stringify(st));
ok(/^1h30 ✓ · \+12min$/.test(st.gl),'texto "1h30 ✓ · +12min"');ok(st.x>10.5&&st.x<12.5&&st.g+st.x>98&&st.g+st.x<=100.1,'barra: meta '+st.g+'% e extra mais claro '+st.x+'%');
ok(await ev(()=>window.__notes.length===1),'avisa uma vez só');
await p.screenshot({path:`${O}/meta-foco.png`});await ev(()=>document.documentElement.dataset.theme='dark');await W(300);await p.screenshot({path:`${O}/meta-foco-escuro.png`});await ev(()=>document.documentElement.dataset.theme='light');
await ev(()=>{S.timer.start-=48*60000});await W(1300);const s60=await rb();console.log('    ',JSON.stringify(s60));ok(/^1h30 ✓ · \+1h$/.test(s60.gl)&&Math.abs(s60.x-33.3)<1,'com +1h, o extra fica limitado a um terço ('+s60.x+'%)');await p.screenshot({path:`${O}/meta-foco-1h.png`});await ev(()=>{S.timer.start+=48*60000});await W(700);
// pausar e retomar depois da meta
await ev(()=>document.querySelector('[data-act=tpause]').click());await W(300);await ev(()=>document.querySelector('[data-act=tstart]').click());await W(300);
ok(await ev(()=>S.timer.running&&FM.on&&window.__notes.length===1),'pausar e retomar depois da meta funciona, sem novo aviso');
// registrar: vem com o tempo todo
await ev(()=>document.querySelector('[data-act=fmreg]').click());await W(500);
const mt=await ev(()=>S.sel.mt);console.log('     tempo no registro:',mt,'(meta',goal,'min)');ok(await ev(g=>regMin()>=g+12,goal),'registro vem com o tempo todo ('+mt+')');
await p.screenshot({path:`${O}/meta-registro.png`});
await ev(()=>{const f=document.querySelector('#modal form[data-f=man]');f.requestSubmit()});await W(500);
const reg=await ev(id=>({p:prog(id),last:S.sessions.filter(x=>x.subj===id).slice(-1)[0]?.min}),sid);console.log('    ',JSON.stringify(reg));
ok(reg.last>=goal+12,'sessão registrada com o tempo a mais ('+reg.last+' min)');
// reabrir com o cronômetro passando da meta: guarda o tempo todo em pausa
const s2=await ev(()=>{const id=inCycle().find(x=>!gDone(x)&&!pzMs(x.id)).id;document.querySelector(`[data-act=rplay][data-id="${id}"]`).click();return id});await W(400);
const g2=await ev(id=>{const s=S.subjects.find(x=>x.id===id);S.timer.start=Date.now()-(s.goal-prog(id)+20)*60000;save();return s.goal-prog(id)},s2);
await p.reload();await W(800);const pz=await ev(id=>pzMs(id)/60000,s2);ok(pz>=g2+19.9,'reabrir guarda o tempo todo em pausa ('+Math.round(pz)+' min, meta '+g2+')');
// retomar esse tempo: não avisa de novo e segue contando
await ev(id=>document.querySelector(`[data-act=rplay][data-id="${id}"]`).click(),s2);await W(1300);
ok(await ev(()=>S.timer.running&&FM.on),'retomar o tempo pausado depois da meta funciona');const n2=await ev(()=>window.__notes);console.log('     avisos depois de recarregar:',JSON.stringify(n2));ok(n2.length===0,'sem novo aviso ao retomar');
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
