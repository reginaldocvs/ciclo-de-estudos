/* Sincronização entre aparelhos (conta simulada): aparelho desatualizado que só é aberto recebe a versão da conta em vez de sobrescrevê-la;
   edição de verdade feita depois vence; versões anteriores guardadas (as 5 últimas) e restauráveis em Configurações */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const OLD=JSON.parse(fs.readFileSync(F,'utf8'));OLD.timer={running:false,start:0,acc:0};OLD.sx=false;
const NEW=structuredClone(OLD);NEW.sessions=[...NEW.sessions,{id:'desk1',ses:'desk1',subj:NEW.subjects[1].id,topic:null,min:90,cycle:NEW.cycle,set:1,review:false,kind:'aula',items:[],date:'2026-11-04'}];NEW.progress={...(NEW.progress||{}),[NEW.subjects[1].id]:90};
const T0=Date.now()-3*3600e3,T1=Date.now()-600e3; /* celular sincronizou há 3 h; computador enviou há 10 min */
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(OLD),'ciclo-welcome-skip':'1','ciclo-sync':JSON.stringify({ts:T0,dirty:false,lts:T0}),'ciclo-dev':'cel'},w:390,h:860});const x=mk(p);
await W(600);
const boot=await x.ev(()=>({lts:SY.localTs,dirty:SY.dirty}));ok(boot.lts<Date.now()-3600e3,'abrir o app não conta como mudança feita agora (localTs ficou '+Math.round((Date.now()-boot.lts)/60000)+' min atrás)');
// conta simulada: meta da versão do computador
const res=await x.ev(async(NEWj,T1)=>{window.__pushes=0;window.syPush=async()=>{window.__pushes++};window.syFetch=async()=>NEWj;SY.db={};SY.status='init';
 await syOnMeta({exists:true,data:()=>({ts:T1,n:1,dev:'desk',size:NEWj.length})});return {n:S.sessions.length,desk:S.sessions.some(s=>s.id==='desk1'),pushes:window.__pushes,st:SY.status}},JSON.stringify(NEW),T1);
console.log('    ',JSON.stringify(res));ok(res.desk&&res.pushes===0,'celular desatualizado recebe a versão da conta e não envia a dele');
await W(500);let L=await x.ev(async()=>(await vhAll()).map(v=>v.why+':'+v.n));ok(L.length===1&&L[0]==='aparelho:'+OLD.sessions.length,'versão do celular ficou guardada em "Versões anteriores" ('+L+')');
// edição de verdade no celular, depois uma versão mais antiga da conta chega: a do celular vence
const r2=await x.ev(async(T1)=>{window.__pushes=0;document.dispatchEvent(new Event('pointerdown'));S.cycle=S.cycle;S.sel.mt='';S.paused=S.paused||{};S.notaTeste=1;save();
 SY.status='init';const nowJ=JSON.stringify(S);window.syFetch=async()=>nowJ.replace('"notaTeste":1','"notaTeste":0');await syOnMeta({exists:true,data:()=>({ts:T1+1,n:1,dev:'desk',size:1})});return {nota:S.notaTeste,pushes:window.__pushes}},T1);
ok(r2.nota===1&&r2.pushes===1,'edição feita no celular depois do envio do computador vence e é enviada ('+JSON.stringify(r2)+')');
// Configurações mostra a versão e restaura
await x.ev(()=>{S.notaTeste=undefined;delete S.notaTeste;save();document.querySelector('nav [data-tab=bk],[data-act=gear],.gear')?.click()});await W(200);await x.ev(()=>{tab='bk';render()});await W(600);
const card=await x.ev(()=>{const c=[...document.querySelectorAll('#app .card')].find(c=>/Versões anteriores/.test(c.textContent));return c&&c.innerText.replace(/\s+/g,' ')});console.log('    card:',card);ok(/antes de chegar a versão de outro aparelho/.test(card||'')&&/Restaurar/.test(card||''),'Configurações → Versões anteriores lista a versão guardada');
await x.ev(()=>{const c=[...document.querySelectorAll('#app .card')].find(c=>/Versões anteriores/.test(c.textContent));c.scrollIntoView({block:'start'})});await W(200);await p.screenshot({path:OUT+'/versoes.png'});
await x.ev(()=>document.querySelector('[data-act=vhres]').click());await W(700);
const r3=await x.ev(async()=>({n:S.sessions.length,desk:S.sessions.some(s=>s.id==='desk1'),lts:Date.now()-SY.localTs<5000,L:(await vhAll()).map(v=>v.why)}));console.log('    ',JSON.stringify(r3));
ok(!r3.desk&&r3.n===OLD.sessions.length&&r3.lts,'Restaurar volta à versão guardada e conta como mudança sua');ok(r3.L[0]==='versao','a versão de antes de restaurar também fica guardada');
// limite de 5
await x.ev(async()=>{for(let i=0;i<7;i++){const o=JSON.parse(JSON.stringify(S));o.marca=i;await vhSave(JSON.stringify(o),'backup');await new Promise(r=>setTimeout(r,5))}});await W(300);
ok(await x.ev(async()=>(await vhAll()).length)===3,'ficam só as 3 últimas versões');
await p.reload();await W(800);ok(await x.ev(async()=>(await vhAll()).length)===3,'versões continuam depois de recarregar');
ok(!errs.length,'sem erros '+JSON.stringify(errs));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
