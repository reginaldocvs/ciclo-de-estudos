/* Dois aparelhos (computador A, celular B) na mesma conta (Firebase de mentira, compartilhado, com atraso de rede), por vários dias:
   alterna quem estuda, abre no dia seguinte ou volta do segundo plano, um dia sem internet, e confere que nenhum registro se perde.
   Sessões com tópico de nome comprido e vários links de questões (alguns com nome, alguns repetidos). Uso: node lint/simsync.mjs <dados> <saída> */
import puppeteer from 'puppeteer-core';import fs from 'fs';const W=ms=>new Promise(r=>setTimeout(r,ms));
const [F,OUT]=process.argv.slice(2);const log=[];let bad=0;const ok=(c,m)=>{log.push((c?'OK    ':'FALHA ')+m);if(!c){bad++;console.log('FALHA '+m)}},info=m=>log.push('      '+m);
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rvf=null;
/* conta compartilhada */
const cloud={},online={A:true,B:true},LAG=250;let writes={A:0,B:0};
const J0=JSON.stringify(S0),T0=Date.now()-3600e3;cloud['users/u1/ciclo/meta']={ts:T0,n:1,dev:'A',size:J0.length};cloud['users/u1/ciclo/c0']={d:J0,ts:T0};
const FAKE=`window.firebase={apps:[],initializeApp(){this.apps.push(1)},auth(){return{getRedirectResult:async()=>null,onAuthStateChanged(cb){setTimeout(()=>cb({uid:'u1',displayName:'T',email:'t@t'}),30)}}},
 firestore(){const off=()=>Object.assign(new Error('offline'),{code:'unavailable'});const doc=p=>({get:async()=>{const r=await window.__cg(p);if(r.off)throw off();return{exists:!!r.d,data:()=>r.d}},
  set:async d=>{const r=await window.__cs(p,d);if(r.off)throw off()},
  onSnapshot(cb){let last=null,dead=false;const tick=async()=>{if(dead)return;const r=await window.__cg(p);if(r.off||dead)return;const k=JSON.stringify(r.d||null);if(k!==last){last=k;cb({exists:!!r.d,data:()=>r.d})}};tick();const iv=setInterval(tick,400);return()=>{dead=true;clearInterval(iv)}}});
 return{collection:c=>({doc:id=>doc(c+'/'+id)})}}};`;
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,protocolTimeout:180000});
async function device(dev,w){const ctx=b.createBrowserContext?await b.createBrowserContext():await b.createIncognitoBrowserContext();const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.setViewport({width:w,height:860});await p.setBypassServiceWorker(true);await p.setRequestInterception(true);
 p.on('request',r=>{if(/gstatic\.com\/firebasejs/.test(r.url()))return r.respond({status:200,contentType:'text/javascript',body:/firebase-app-compat/.test(r.url())?FAKE:''});r.continue()});
 await p.exposeFunction('__cg',async path=>{await W(LAG);return online[dev]?{d:cloud[path]?JSON.parse(JSON.stringify(cloud[path])):null}:{off:true}});
 await p.exposeFunction('__cs',async(path,d)=>{await W(LAG);if(!online[dev])return {off:true};cloud[path]=d;if(path.endsWith('/meta'))writes[dev]++;return {}});
 await p.evaluateOnNewDocument(()=>{const D=Date,o=()=>+(localStorage.getItem('__fkoff')||0);class FD extends D{constructor(...a){if(a.length)super(...a);else super(D.now()+o())}static now(){return D.now()+o()}};window.Date=FD;
  Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>window.__vis||'visible'})});
 await p.goto('http://localhost:8765/');await p.evaluate((d,dev,t)=>{localStorage.clear();localStorage.setItem('ciclo-estudos-v2',d);localStorage.setItem('ciclo-welcome-skip','1');localStorage.setItem('ciclo-dev',dev);localStorage.setItem('ciclo-sync',JSON.stringify({ts:t,dirty:false,lts:t}))},J0,dev,T0);
 await p.reload();const ev=(f,...a)=>p.evaluate(f,...a);return {dev,p,ev,errs}}
const A=await device('A',1280),B=await device('B',390);
const created=new Set();const qPool={};let k=0;
/* espera a camada sumir (ou mostra "Sem conexão" e usa mesmo assim, se esperado) */
async function gate(X,offline){for(let i=0;i<80;i++){const g=await X.ev(()=>{const e=document.getElementById('sygate');return e?{on:true,slow:!document.getElementById('sguse').hidden}:{on:false}});
  if(!g.on)return 'livre';if(g.slow&&offline){await X.p.click('#sguse');await W(200);return 'usou mesmo assim'}await W(200)}return 'travou'}
const setDay=(X,d)=>X.ev(d=>localStorage.setItem('__fkoff',String(d*86400000)),d);
async function openNextDay(X,d){await setDay(X,d);await X.p.reload();await W(300)}
async function resume(X,d){await setDay(X,d);await X.ev(()=>{window.__vis='hidden';document.dispatchEvent(new Event('visibilitychange'));GT.hid=Date.now()-5*60000;window.__vis='visible';document.dispatchEvent(new Event('visibilitychange'))});await W(200)}
/* espera o aparelho mandar tudo para a conta */
async function settle(X){for(let i=0;i<60;i++){const s=await X.ev(()=>({st:SY.status,dirty:SY.dirty}));if(s.st==='on'&&!s.dirty)return true;await W(250)}return false}
const ids=X=>X.ev(()=>S.sessions.filter(s=>!s.review).map(s=>s.ses||s.id));
const cloudIds=()=>{const m=cloud['users/u1/ciclo/meta'];let j='';for(let i=0;i<m.n;i++)j+=cloud['users/u1/ciclo/c'+i].d;return new Set(JSON.parse(j).sessions.filter(s=>!s.review).map(s=>s.ses||s.id))};
/* uma sessão: tópico (às vezes comprido), 1 aula e 1–2 "Questões" com links (às vezes repetidos, às vezes com nome) */
async function study(X){const id=await X.ev(()=>{const s=actives().find(s=>!gDone(s));return s&&s.id});if(!id){await X.ev(()=>{const b=document.querySelector('[data-act=next]');b&&b.click()});await W(400);return study(X)}
 await X.ev(()=>document.dispatchEvent(new Event('pointerdown')));await X.ev(id=>{const e=[...document.querySelectorAll(`[data-act=rreg][data-id="${id}"]`)].find(e=>e.offsetParent)||document.querySelector(`[data-act=rreg][data-id="${id}"]`);e.click()},id);await W(300);
 const tn=(rnd()<.5?'Tópico '+ri(1,3):'Direitos e garantias fundamentais: direitos e deveres individuais e coletivos; direito à vida, à liberdade, à igualdade '+ri(1,2)),key=id+'|'+tn;qPool[key]=qPool[key]||[];
 const nq=ri(1,2),qs=[];for(let i=0;i<nq;i++){let q;if(qPool[key].length&&rnd()<.4)q=qPool[key][ri(0,qPool[key].length-1)];else{q='https://quiz.exemplo.com/q?v='+(++k);qPool[key].push(q)}if(!qs.includes(q))qs.push(q)}
 const rows=[{kind:'aula',name:'Aula '+(++k),link:'',q:''},...qs.map((q,i)=>({kind:'aula',name:'',link:'',q,qo:true,ac:String(ri(3,8)),tq:'8',...(rnd()<.25?{lbl:'Quiz '+q.split('=')[1]}:{})}))];
 await X.ev((tn,rows)=>{const g=S.sel.groups[0];g.nt=tn;g.rows=rows.map(r=>({id:uid(),...r}));render()},tn,rows);
 const m=await X.ev(id=>fmt(Math.max(1,S.subjects.find(s=>s.id===id).goal-prog(id))),id);await X.ev(m=>{const e=document.querySelector('#modal input[name=m]');e.value=m;e.dispatchEvent(new Event('input',{bubbles:true}))},m);
 const before=new Set(await ids(X));await X.ev(()=>document.querySelector('#modal form[data-f=man]').requestSubmit());await W(400);
 const after=await ids(X);after.filter(x=>!before.has(x)).forEach(x=>created.add(x))}
/* blocos de revisão que aparecerem: registra para o ciclo andar */
async function blocks(X){for(let g=0;g<4;g++){await X.ev(()=>{const e=[...document.querySelectorAll('#app [data-act=bkback]')].find(e=>e.offsetParent);e&&e.click()});const bk=await X.ev(()=>blkCur()?[...document.querySelectorAll('#app [data-act=bkreg]')].filter(e=>e.offsetParent).map(e=>e.dataset.id):null);if(!bk)return;
 for(const id of bk){await X.ev(()=>document.dispatchEvent(new Event('pointerdown')));await X.ev(id=>document.querySelector(`[data-act=bkreg][data-id="${id}"]`).click(),id);await W(200);await X.ev(()=>document.querySelector('#modal form[data-f=bkreg]').requestSubmit());await W(300)}}}
/* variações de conflito, cada uma com o celular sem internet enquanto o computador usa a conta */
const day=async(X,d,como,off)=>{if(como==='abre')await openNextDay(X,d);else await resume(X,d);return gate(X,!!off)};
const act=(X,f,...a)=>X.ev(async(f,...a)=>{document.dispatchEvent(new Event('pointerdown'));const r=await (new Function('return '+f)())(...a);save();render();return r},f.toString(),...a);
const reconnect=async()=>{online.B=true;await W(9000);await settle(B);await resume(A,dd);await gate(A);await settle(A);await settle(B)};
const same=async()=>{const a=JSON.stringify([...await ids(A)].sort()),b=JSON.stringify([...await ids(B)].sort()),c=JSON.stringify([...cloudIds()].sort());return a===b&&b===c};
let dd=1;await day(A,dd,'abre');await blocks(A);await study(A);await settle(A);await day(B,dd,'abre');await settle(B);
const allS=X=>X.ev(()=>S.sessions.filter(s=>!s.review).map(s=>({id:s.id,min:s.min})));
// 1. computador apaga um registro; celular sem internet cria outro
dd++;const base1=await allS(A);const X0=base1[0].id;online.B=false;await day(B,dd,'abre',true);const nb0=new Set(await ids(B));await blocks(B);await study(B);const novoB=[...await ids(B)].filter(x=>!nb0.has(x));
await day(A,dd,'volta');await act(A,id=>{S.sessions=S.sessions.filter(s=>s.id!==id)},X0);await settle(A);await reconnect();
let cl=cloudIds();ok(!cl.has(X0)&&novoB.every(x=>cl.has(x))&&await same(),'1. apagado no computador continua apagado; o novo do celular entrou; aparelhos e conta iguais');
// 2. os dois editam o mesmo registro (vale a edição mais recente) e o celular cria outro
dd++;const X1=(await allS(A))[0].id;await day(A,dd,'volta');await act(A,id=>{S.sessions.find(s=>s.id===id).min=50},X1);await settle(A);
online.B=false;await day(B,dd,'abre',true);const nb1=new Set(await ids(B));await act(B,id=>{S.sessions.find(s=>s.id===id).min=70},X1);await blocks(B);await study(B);const novoB2=[...await ids(B)].filter(x=>!nb1.has(x));await reconnect();
const x1=await A.ev(id=>S.sessions.filter(s=>s.id===id).map(s=>s.min),X1);cl=cloudIds();
ok(x1.length===1&&x1[0]===70&&novoB2.every(x=>cl.has(x))&&await same(),'2. mesmo registro editado nos dois: fica um só, com a edição mais recente ('+x1+' min); o novo do celular entrou');
// 3. revisões por tópico dos dois lados
dd++;await day(A,dd,'volta');const K=await A.ev(()=>{const L=trvList();return L.length>1?[L[0].k,L[1].k]:null});
if(K){await act(A,k=>{trvMark(k,today(),20,null,[],null)},K[0]);await settle(A);online.B=false;await day(B,dd,'abre',true);await act(B,k=>{trvMark(k,today(),25,null,[],null)},K[1]);await reconnect();
 const h=await A.ev(K=>K.map(k=>((S.trv.t[k]||{}).h||[]).length),K);ok(h.every(n=>n>=1)&&await same(),'3. revisões por tópico feitas nos dois lados ficam as duas ('+h+')')}else info('3. sem revisões por tópico para testar');
// 4a. celular sem internet renomeia um tópico ANTES; computador registra depois: o registro do computador fica
dd++;const T1=await A.ev(()=>{const s=S.subjects.find(s=>(s.topics||[]).length);return [s.id,s.topics[0].id]});
online.B=false;await day(B,dd,'abre',true);await act(B,([s,t])=>{S.subjects.find(x=>x.id===s).topics.find(x=>x.id===t).name='Renomeado no celular'},T1);
await day(A,dd,'volta');const na=new Set(await ids(A));await blocks(A);await study(A);await settle(A);const novoA=[...await ids(A)].filter(x=>!na.has(x));await reconnect();
cl=cloudIds();const nm4=await A.ev(([s,t])=>S.subjects.find(x=>x.id===s).topics.find(x=>x.id===t).name,T1);ok(novoA.every(x=>cl.has(x))&&nm4==='Renomeado no celular'&&await same(),'4a. renomear no celular antes e registrar no computador depois: ficam os dois ('+nm4+')');
// 4b. computador registra ANTES; celular sem internet renomeia depois: ficam os dois
dd++;await day(A,dd,'volta');const na2=new Set(await ids(A));await blocks(A);await study(A);await settle(A);const novoA2=[...await ids(A)].filter(x=>!na2.has(x));
online.B=false;await day(B,dd,'abre',true);await act(B,([s,t])=>{S.subjects.find(x=>x.id===s).topics.find(x=>x.id===t).name='Renomeado de novo'},T1);await reconnect();
cl=cloudIds();const nm=await A.ev(([s,t])=>S.subjects.find(x=>x.id===s).topics.find(x=>x.id===t).name,T1);
ok(novoA2.every(x=>cl.has(x))&&nm==='Renomeado de novo'&&await same(),'4b. registro do computador e nome novo do celular ficam os dois ('+nm+')');
// 5. celular sem internet muda a meta de uma disciplina; computador renomeia outro tópico: ficam as duas mudanças
dd++;const [S5,T5]=await A.ev(()=>{const s=S.subjects.filter(s=>!s.off&&!s.of)[1];s.topics=s.topics||[];if(!s.topics.length)s.topics.push({id:'t5',name:'Tópico 5',done:false,links:[]});save();return [s.id,s.topics[0].id]});await settle(A);await resume(B,dd);await gate(B);await settle(B);
online.B=false;await day(B,dd,'volta',true);await act(B,id=>{S.subjects.find(x=>x.id===id).goal=120},S5);
await day(A,dd,'volta');await act(A,([s,t])=>{S.subjects.find(x=>x.id===s).topics.find(x=>x.id===t).name='Nome novo no computador'},[S5,T5]);await settle(A);await reconnect();
const r5=await A.ev(([s,t])=>{const x=S.subjects.find(z=>z.id===s);return {g:x.goal,n:x.topics.find(z=>z.id===t).name}},[S5,T5]);ok(r5.g===120&&r5.n==='Nome novo no computador'&&await same(),'5. meta mudada no celular e tópico renomeado no computador: ficam as duas ('+JSON.stringify(r5)+')');
// 6. os dois mudam a mesma meta: vale a mais recente
dd++;online.B=false;await day(B,dd,'abre',true);await act(B,id=>{S.subjects.find(x=>x.id===id).goal=100},S5);await W(300);
await day(A,dd,'volta');await act(A,id=>{S.subjects.find(x=>x.id===id).goal=75},S5);await settle(A);await reconnect();
const g6=await B.ev(id=>S.subjects.find(x=>x.id===id).goal,S5);ok(g6===75&&await same(),'6. mesma meta mudada nos dois: vale a mais recente ('+g6+' min)');
// 7. computador reordena as disciplinas; celular sem internet cria um tópico: ficam as duas
dd++;online.B=false;await day(B,dd,'abre',true);await act(B,id=>{S.subjects.find(x=>x.id===id).topics.push({id:'t7',name:'Tópico novo do celular',done:false,links:[]})},S5);
await day(A,dd,'volta');const ord0=await A.ev(()=>S.subjects.map(s=>s.id));await act(A,()=>{const a=S.subjects.filter(s=>!s.off);const x=a[0],y=a[2];const i=S.subjects.indexOf(x),j=S.subjects.indexOf(y);S.subjects[i]=y;S.subjects[j]=x});await settle(A);const ordA=await A.ev(()=>S.subjects.map(s=>s.id));await reconnect();
const r7=await B.ev(id=>({ord:S.subjects.map(s=>s.id),tp:S.subjects.find(x=>x.id===id).topics.some(t=>t.id==='t7')}),S5);ok(r7.tp&&JSON.stringify(r7.ord)===JSON.stringify(ordA)&&JSON.stringify(ordA)!==JSON.stringify(ord0)&&await same(),'7. ordem nova do computador e tópico novo do celular: ficam os dois');
// 8. computador apaga um tópico; celular sem internet acrescenta aula em outro: o apagado continua apagado e a aula entra
dd++;online.B=false;await day(B,dd,'abre',true);await act(B,id=>{S.subjects.find(x=>x.id===id).topics.find(t=>t.id==='t7').name='Renomeado no celular (8)'},S5);
await day(A,dd,'volta');await act(A,([s,t])=>{const x=S.subjects.find(z=>z.id===s);x.topics=x.topics.filter(z=>z.id!==t)},[S5,T5]);await settle(A);await reconnect();
const r8=await A.ev(([s,t])=>{const x=S.subjects.find(z=>z.id===s);return {apagado:!x.topics.some(z=>z.id===t),aula:x.topics.find(z=>z.id==='t7').name==='Renomeado no celular (8)'}},[S5,T5]);
ok(r8.apagado&&r8.aula&&await same(),'8. tópico apagado no computador continua apagado; outro tópico renomeado no celular fica com o nome novo');
const vh={A:await A.ev(async()=>(await vhAll()).map(v=>v.why)),B:await B.ev(async()=>(await vhAll()).map(v=>v.why))};info('versões anteriores guardadas: computador '+JSON.stringify(vh.A)+', celular '+JSON.stringify(vh.B));
ok(vh.A.length<=3&&vh.B.length<=3,'versões anteriores: no máximo 3 em cada aparelho');
info('envios para a conta: computador '+writes.A+', celular '+writes.B);
await A.p.screenshot({path:OUT+'/sync-computador-fim.png'});await B.ev(()=>{document.querySelector('nav [data-tab=reg]').click()});await W(400);await B.p.screenshot({path:OUT+'/sync-celular-historico.png'});
ok(!A.errs.length&&!B.errs.length,'sem erros na página '+JSON.stringify([...A.errs,...B.errs].slice(0,3)));
fs.writeFileSync(OUT+'/simsync.txt',log.join('\n'));console.log(log.join('\n'));console.log(bad?'COM FALHAS':'TUDO OK');await b.close();
