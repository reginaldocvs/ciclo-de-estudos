/* Questões em dois aparelhos (Firebase de mentira, compartilhado): o caderno importado no computador A vai para a conta em documentos
   próprios (q-ID), fora do bloco principal; o celular B traz o conteúdo ao abrir o caderno, resolve, e as respostas voltam para A;
   corrigir o gabarito em B atualiza o caderno em A. Resolver não reenvia o caderno. Uso: node lint/qzsync.mjs <dados> <saída> */
import puppeteer from 'puppeteer-core';import fs from 'fs';const W=ms=>new Promise(r=>setTimeout(r,ms));
const [F]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rvf=null;delete S0.qc;delete S0.qa;
const QJ=fs.readFileSync(new URL('../dados/questoes-exemplo.json',import.meta.url),'utf8');
const cloud={},LAG=120;const qWrites={A:0,B:0};
const J0=JSON.stringify(S0),T0=Date.now()-3600e3;cloud['users/u1/ciclo/meta']={ts:T0,n:1,dev:'A',size:J0.length};cloud['users/u1/ciclo/c0']={d:J0,ts:T0};
const FAKE=`window.firebase={apps:[],initializeApp(){this.apps.push(1)},auth(){return{getRedirectResult:async()=>null,onAuthStateChanged(cb){setTimeout(()=>cb({uid:'u1',displayName:'T',email:'t@t'}),30)}}},
 firestore(){const doc=p=>({get:async()=>{const r=await window.__cg(p);return{exists:!!r.d,data:()=>r.d}},set:async d=>{await window.__cs(p,d)},
  onSnapshot(cb){let last=null,dead=false;const tick=async()=>{if(dead)return;const r=await window.__cg(p);if(dead)return;const k=JSON.stringify(r.d||null);if(k!==last){last=k;cb({exists:!!r.d,data:()=>r.d})}};tick();const iv=setInterval(tick,300);return()=>{dead=true;clearInterval(iv)}}});
 return{collection:c=>({doc:id=>doc(c+'/'+id)})}}};`;
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,protocolTimeout:180000});
async function device(dev,w){const ctx=b.createBrowserContext?await b.createBrowserContext():await b.createIncognitoBrowserContext();const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.setViewport({width:w,height:860});await p.setBypassServiceWorker(true);await p.setRequestInterception(true);
 p.on('request',r=>{if(/gstatic\.com\/firebasejs/.test(r.url()))return r.respond({status:200,contentType:'text/javascript',body:/firebase-app-compat/.test(r.url())?FAKE:''});r.continue()});
 await p.exposeFunction('__cg',async path=>{await W(LAG);return {d:cloud[path]?JSON.parse(JSON.stringify(cloud[path])):null}});
 await p.exposeFunction('__cs',async(path,d)=>{await W(LAG);cloud[path]=d;if(/\/q-[^/]+$/.test(path))qWrites[dev]++;return {}});
 await p.goto('http://localhost:8765/');await p.evaluate((d,dev,t)=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',d);localStorage.setItem('ciclo-welcome-skip','1');localStorage.setItem('ciclo-dev',dev);localStorage.setItem('ciclo-sync',JSON.stringify({ts:t,dirty:false,lts:t}))},J0,dev,T0);
 await p.reload();const ev=(f,...a)=>p.evaluate(f,...a);return {dev,p,ev,errs}}
async function settle(X){for(let i=0;i<60;i++){const s=await X.ev(()=>({st:SY.status,dirty:SY.dirty,qp:qPend().length}));if(s.st==='on'&&!s.dirty&&!s.qp)return true;await W(250)}return false}
async function gate(X){for(let i=0;i<60;i++){if(!(await X.ev(()=>!!document.getElementById('sygate'))))return;await W(200)}}
const A=await device('A',1280),B=await device('B',390);await gate(A);await gate(B);await settle(A);await settle(B);
const toQz=X=>X.ev(()=>[...document.querySelectorAll('nav [data-tab=qz]')].find(e=>e.getClientRects().length).click());
/* A importa */
await toQz(A);await W(200);await A.ev(()=>document.querySelector('[data-act=qnew]').click());await W(200);
await A.ev(t=>{const a=document.querySelector('[name=qj]');a.value=t;a.dispatchEvent(new Event('input',{bubbles:true}))},QJ);await W(300);
await A.ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(300);await settle(A);
const cid=await A.ev(()=>qcL()[0].id);
const main=()=>{const m=cloud['users/u1/ciclo/meta'];let j='';for(let i=0;i<m.n;i++)j+=cloud['users/u1/ciclo/c'+i].d;return j};
ok(!!cloud['users/u1/ciclo/q-'+cid]&&!!cloud['users/u1/ciclo/q-'+cid+'-0']&&!main().includes('exemplificativo')&&main().includes(cid),'A importa: o caderno vai para a conta em documentos próprios; o bloco principal leva só a lista');
/* B recebe a lista e traz o conteúdo ao abrir */
for(let i=0;i<40&&!(await B.ev(id=>!!qcM(id),cid));i++)await W(250);
ok(await B.ev(id=>!!qcM(id)&&!localStorage.getItem('ciclo-q-'+id),cid),'B recebe a lista (ainda sem o conteúdo)');
await toQz(B);await W(200);await B.ev(id=>document.querySelector(`[data-act=qopen][data-id="${id}"]`).click(),cid);
for(let i=0;i<40&&!(await B.ev(()=>!!document.querySelector('.qzcad .qzcm')));i++)await W(250);
ok(await B.ev(id=>qLoad(id)&&qLoad(id).qs.length===3&&/3\squestões/.test((document.querySelector('.qzcad .qzcm')||{}).textContent||''),cid),'B abre o caderno: o conteúdo vem da conta');
/* B resolve: as respostas voltam para A, sem reenviar o caderno */
const qw0=qWrites.B;await B.ev(id=>document.querySelector(`[data-act=qall][data-id="${id}"]`).click(),cid);await W(200);
for(const k of ['E','C','B']){await B.ev(k=>document.querySelector(`.qzd [data-act=qans][data-id="${k}"]`).click(),k);await W(150);await B.ev(()=>document.querySelector('.qzd [data-act=qnext]').click());await W(150)}
await settle(B);ok(qWrites.B===qw0,'resolver não reenvia o caderno ('+(qWrites.B-qw0)+' gravações do caderno)');
for(let i=0;i<40&&!(await A.ev(id=>qSum(id).a===3,cid));i++)await W(250);
ok(await A.ev(id=>{const z=qSum(id);return z.a===3&&z.ok===3},cid),'A recebe as respostas de B: 3 de 3');
/* B corrige um gabarito: A recebe o caderno atualizado */
await B.ev(id=>{ui.qz=null;qStart(id,qLoad(id).qs.map(q=>q.id),1)},cid);await W(200);await B.ev(()=>{const o=qLoad(ui.qz.cad);delete ui.qz.res[o.qs[1].id]});
await B.ev(()=>document.querySelector('.qzd [data-act=qans][data-id="E"]').click());await W(150);await B.ev(()=>document.querySelector('.qzd [data-act=qfix]').click());await W(100);await B.ev(()=>document.querySelector('.qzd [data-act=qfixset][data-id="E"]').click());await W(200);await settle(B);
for(let i=0;i<40&&!(await A.ev(id=>{const o=qLoad(id);return o&&o.qs[1].gf==='E'},cid));i++){await A.ev(()=>render());await W(300)}
ok(await A.ev(id=>qLoad(id).qs[1].gf==='E',cid),'B corrige o gabarito: A recebe o caderno atualizado');
ok(!A.errs.length&&!B.errs.length,'sem erros de script '+A.errs.concat(B.errs).slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
