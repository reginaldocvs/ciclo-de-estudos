import puppeteer from 'puppeteer-core';import fs from 'fs';
const [SHOT,OUT]=process.argv.slice(2);
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const log=[],ok=(x,m)=>log.push((x?'OK   ':'FALHA ')+m);
for(const W of [1280,390]){
const d=JSON.parse(fs.readFileSync(SHOT+'/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;d['ciclo-estudos-v2']=JSON.stringify(S0);
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:W,height:820,deviceScaleFactor:1.25});
await p.goto('http://localhost:8765/');await p.evaluate(d=>{localStorage.clear();for(const k in d)localStorage.setItem(k,d[k])},d);await p.goto('http://localhost:8765/');await new Promise(r=>setTimeout(r,500));
const ev=(f,...a)=>p.evaluate(f,...a),Wt=ms=>new Promise(r=>setTimeout(r,ms));
// disciplina não concluída
const id=await ev(()=>actives().find(s=>prog(s.id)<s.goal).id);
await ev(id=>document.querySelector(`.srow [data-act=rplay][data-id="${id}"]`).click(),id);await Wt(400);
ok(await ev(()=>S.sx===true&&S.timer.running),W+': Iniciar abre o foco com o cronômetro');
await ev(()=>{S.timer.acc=25*60000+12000;S.timer.start=Date.now();render()});await Wt(200);
await ev(()=>document.querySelector('[data-act=fmoff]').click());await Wt(400);
ok(await ev(id=>!S.sx&&!S.timer.running&&el()===0&&pzMs(id)>=25*60000,id),W+': Sair do foco guarda o tempo como pausado');
ok(await ev(()=>/Sessão pausada com 25min/.test(document.body.innerText)),W+': aviso de pausa');
ok(await ev(id=>{const r=[...document.querySelectorAll('.srow')].find(r=>r.querySelector(`[data-id="${id}"]`));return parseFloat(r.querySelector('.bar i').style.width)>0&&/25min de/.test(r.querySelector('.ctl').innerText)&&r.querySelector('[data-act=rplay]').title==='Retomar'},id),W+': linha com trecho listrado, 25min e Retomar');
ok(await ev(id=>{const c=document.querySelector(`.cbs[data-id="${id}"]`);return !!c.querySelector('.cbl .pz')&&/em pausa/.test(c.dataset.tip)},id),W+': faixa do ciclo com trecho listrado');
const nowTxt=await ev(()=>document.querySelector('.now .mut').innerText);ok(/pausa · 25min/.test(nowTxt),W+': Agora: '+nowTxt);
await Wt(2600);await p.screenshot({path:`${OUT}/pause-${W}.png`});
// recarregar mantém
await p.reload();await Wt(600);ok(await ev(id=>pzMs(id)>=25*60000,id),W+': continua guardado depois de recarregar');
// outra disciplina não perde
const id2=await ev(id=>actives().find(s=>prog(s.id)<s.goal&&s.id!==id).id,id);
await ev(id=>document.querySelector(`.srow [data-act=rplay][data-id="${id}"]`).click(),id2);await Wt(300);
await ev(()=>{S.timer.acc=5*60000;render()});await ev(()=>document.querySelector('[data-act=fmoff]').click());await Wt(300);
ok(await ev(([a,b])=>pzMs(a)>=25*60000&&pzMs(b)>=5*60000,[id,id2]),W+': cada disciplina guarda a sua pausa');
// retomar
await ev(id=>document.querySelector(`.srow [data-act=rplay][data-id="${id}"]`).click(),id);await Wt(300);
ok(await ev(id=>S.sx===true&&el()>=25*60000&&!pzMs(id),id),W+': Retomar continua de onde parou');
await ev(()=>document.querySelector('[data-act=fmoff]').click());await Wt(300);
// registrar usa o tempo pausado
await ev(id=>document.querySelector(`.srow [data-act=rreg][data-id="${id}"]`).click(),id);await Wt(300);
ok(await ev(()=>/25min|0h25/.test(S.sel.mt||'')),W+': Registrar preenche o tempo pausado ('+await ev(()=>S.sel.mt)+')');
log.push(W+' erros: '+JSON.stringify(errs));await p.close()}
console.log(log.join('\n'));await b.close();
