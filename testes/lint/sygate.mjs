/* Conferência com a conta antes de liberar o uso (Firebase de mentira servido no lugar do SDK, com atraso de rede):
   ao abrir, aparelho desatualizado fica coberto por "Sincronizando…", não aceita toque e recebe a versão da conta; ao voltar depois de
   1 min em segundo plano, confere de novo; sem conexão, "Usar mesmo assim" depois de 8 s; sem conta, abre direto */
import puppeteer from 'puppeteer-core';import fs from 'fs';const W=ms=>new Promise(r=>setTimeout(r,ms));
const [F,OUT]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const OLD=JSON.parse(fs.readFileSync(F,'utf8'));OLD.timer={running:false,start:0,acc:0};OLD.sx=false;
const mkNew=(o,id)=>{const n=structuredClone(o);n.sessions=[...n.sessions,{id,ses:id,subj:n.subjects[1].id,topic:null,min:90,cycle:n.cycle,set:1,review:false,kind:'aula',items:[],date:'2026-11-04'}];return n};
const NEW=mkNew(OLD,'desk1'),NEW2=mkNew(NEW,'desk2');
/* SDK de mentira: auth com usuário logado; firestore em memória (window.__cloud), respostas com atraso window.__lag (null = sem rede) */
const FAKE=`window.firebase={apps:[],initializeApp(){this.apps.push(1)},auth(){return{getRedirectResult:async()=>null,onAuthStateChanged(cb){setTimeout(()=>cb(window.__nouser?null:{uid:'u1',displayName:'Teste',email:'t@t'}),50)}}},
 firestore(){const C=window.__cloud=window.__cloud||{};const lag=f=>new Promise((ok)=>{if(window.__lag==null)return;setTimeout(()=>ok(f()),window.__lag)});
  const doc=(path)=>({get:(o)=>lag(()=>({exists:!!C[path],data:()=>C[path]})),set:async(d)=>{window.__sets=(window.__sets||0)+1;C[path]=d},
   onSnapshot(cb){lag(()=>cb({exists:!!C[path],data:()=>C[path]}));return()=>{}}});
  return{collection:(p)=>({doc:(id)=>doc(p+'/'+id)})}}};`;
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
async function page({local,cloud,sync,lag,user}){const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:390,height:860});
 await p.setBypassServiceWorker(true);await p.setRequestInterception(true);p.on('request',r=>{const u=r.url();if(/gstatic\.com\/firebasejs/.test(u)){if(lag===undefined&&/never/.test(u))return r.abort();return r.respond({status:200,contentType:'text/javascript',body:/firebase-app-compat/.test(u)?FAKE:''})}r.continue()});
 await p.evaluateOnNewDocument((cloud,lag,user)=>{window.__lag=lag;window.__nouser=user==='nenhum';if(cloud){window.__cloud={'users/u1/ciclo/meta':{ts:cloud.ts,n:1,dev:'desk',size:cloud.j.length},'users/u1/ciclo/c0':{d:cloud.j,ts:cloud.ts}}}
  Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>window.__vis||'visible'})},cloud,lag,user);
 await p.goto('http://localhost:8765/');await p.evaluate((l,s)=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',l);localStorage.setItem('ciclo-welcome-skip','1');localStorage.setItem('ciclo-dev','cel');if(s)localStorage.setItem('ciclo-sync',JSON.stringify(s))},JSON.stringify(local),sync);
 await p.reload();return {p,errs,ev:(f,...a)=>p.evaluate(f,...a)}}
const T0=Date.now()-3*3600e3,T1=Date.now()-600e3;
// 1. celular desatualizado, conta com versão nova, rede com 1,5 s de atraso
{const {p,errs,ev}=await page({local:OLD,cloud:{ts:T1,j:JSON.stringify(NEW)},sync:{ts:T0,dirty:false,lts:T0},lag:1500});
 await W(500);console.log('    estado:',await ev(()=>JSON.stringify({st:SY.status,err:SY.err,ready:SY.ready,fb:!!window.firebase,cloud:Object.keys(window.__cloud||{}),body:[...document.body.children].map(e=>e.id+':'+e.inert)})));const g=await ev(()=>({on:!!document.getElementById('sygate'),txt:document.querySelector('#sygate h2')?.textContent,inert:!!document.getElementById('app').closest('[inert]')}));
 console.log('    g',JSON.stringify(g));ok(g.on&&/Sincronizando/.test(g.txt)&&g.inert,'ao abrir: "Sincronizando com a sua conta…" cobre o app');await p.screenshot({path:OUT+'/gate-abrir.png'});
 const n0=await ev(()=>S.sessions.length);await p.mouse.click(195,300);await p.mouse.click(195,500);await W(200);
 ok(await ev(n=>S.sessions.length===n&&!S.sx,n0),'tocar no app durante a conferência não faz nada');
 for(let i=0;i<40&&await ev(()=>!!document.getElementById('sygate'));i++)await W(200);const r=await ev(()=>({gate:!!document.getElementById('sygate'),desk:S.sessions.some(s=>s.id==='desk1'),meta:window.__cloud['users/u1/ciclo/meta'].dev,inert:!!document.getElementById('app').closest('[inert]')}));
 console.log('    ',JSON.stringify(r));ok(!r.gate&&!r.inert&&r.desk&&r.meta==='desk','a versão da conta chega, a camada some e a conta não foi sobrescrita');
 // 2. volta ao app depois de 2 min em segundo plano; enquanto isso o computador mandou outra versão
 await ev(j=>{window.__cloud['users/u1/ciclo/meta']={ts:Date.now()-1000,n:1,dev:'desk',size:j.length};window.__cloud['users/u1/ciclo/c0']={d:j,ts:Date.now()-1000}},JSON.stringify(NEW2));
 await ev(()=>{window.__vis='hidden';document.dispatchEvent(new Event('visibilitychange'));GT.hid=Date.now()-120000;window.__vis='visible';document.dispatchEvent(new Event('visibilitychange'))});await W(300);
 ok(await ev(()=>!!document.getElementById('sygate')),'ao voltar depois de 2 min: confere de novo antes de liberar');
 for(let i=0;i<40&&await ev(()=>!!document.getElementById('sygate'));i++)await W(200);ok(await ev(()=>!document.getElementById('sygate')&&S.sessions.some(s=>s.id==='desk2')),'recebe a versão nova do computador e libera');
 // volta rápida (menos de 1 min) não cobre
 await ev(()=>{window.__vis='hidden';document.dispatchEvent(new Event('visibilitychange'));window.__vis='visible';document.dispatchEvent(new Event('visibilitychange'))});await W(200);ok(await ev(()=>!document.getElementById('sygate')),'voltar logo em seguida não mostra a camada');
 ok(!errs.length,'sem erros '+JSON.stringify(errs));await p.close()}
// 3. sem conexão: depois de 8 s, "Usar mesmo assim"
{const {p,errs,ev}=await page({local:OLD,cloud:{ts:T1,j:JSON.stringify(NEW)},sync:{ts:T0,dirty:false,lts:T0},lag:null});
 await W(3000);ok(await ev(()=>document.getElementById('sguse').hidden),'nos primeiros segundos sem resposta, ainda sem botão');
 await W(6000);const t=await ev(()=>({h:document.querySelector('#sygate h2').textContent,btn:!document.getElementById('sguse').hidden}));ok(t.btn&&/Sem conexão/.test(t.h),'sem resposta em 8 s: "Sem conexão" e "Usar mesmo assim"');await p.screenshot({path:OUT+'/gate-sem-conexao.png'});
 await p.click('#sguse');await W(300);ok(await ev(()=>!document.getElementById('sygate')&&!!!document.getElementById('app').closest('[inert]')),'"Usar mesmo assim" libera o app');
 ok(!errs.length,'sem erros '+JSON.stringify(errs));await p.close()}
// 4. aparelho que nunca sincronizou: abre direto
{const {p,errs,ev}=await page({local:OLD,cloud:null,sync:null,lag:300,user:'nenhum'});await W(400);ok(await ev(()=>!document.getElementById('sygate')),'sem conta conectada: abre direto, sem a camada');ok(!errs.length,'sem erros');await p.close()}
// 5. sincronizou antes mas saiu da conta: a camada some quando o login responde
{const {p,errs,ev}=await page({local:OLD,cloud:null,sync:{ts:T0,dirty:false,lts:T0},lag:300,user:'nenhum'});await W(1200);ok(await ev(()=>!document.getElementById('sygate')),'sem login agora: a camada some sozinha');ok(!errs.length,'sem erros');await p.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
