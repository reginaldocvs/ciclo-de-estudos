import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w:1280,h:900});const x=mk(p);const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
await x.ev(()=>{S.blk=[{id:'m1',pos:2}];save();render()});
let k=0;const reg=async id=>{await x.act('rreg',id);await x.ev(k=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Tópico Z'+k;g.rows[0].name='Aula Z'+k;render()},++k);await x.submit('#modal form[data-f=man]');await W(250)};
const A=await x.ev(()=>inCycle().map(s=>s.id));await reg(A[0]);await reg(A[1]);
await x.act('bkreg',A[0]);await x.fill('#modal [data-f=bkreg] input[name=m]','15');await x.submit('#modal form[data-f=bkreg]');await W(200);
await x.act('blkend');await W(300);
ok(await x.ev(()=>/pulado/.test(document.querySelector('#app .bkrow').innerText)),'bloco pulado normalmente');
// recarregar não mexe num bloco legítimo
await p.reload();await W(600);ok(await x.ev(()=>/pulado/.test(document.querySelector('#app .bkrow').innerText)),'recarregar mantém o bloco legítimo');
// mudar a meta de uma disciplina anterior (não chega mais ao bloco) mantém, porque as sessões existem
await x.ev(a=>{S.subjects.find(s=>s.id===a).goal=999;render()},A[0]);ok(await x.ev(()=>/pulado/.test(document.querySelector('#app .bkrow').innerText)),'aumentar meta anterior mantém o bloco');
await x.ev(a=>{S.subjects.find(s=>s.id===a).goal=90;render()},A[0]);
// excluir os registros de estudo das duas disciplinas (como no Histórico)
const ses=await x.ev(()=>[...new Set(S.sessions.filter(x=>!x.review&&!x.rid&&x.cycle===S.cycle).map(x=>x.ses||x.id))]);
for(const s of ses){await x.ev(s=>{S.sessions=S.sessions.filter(x=>(x.ses||x.id)!==s)},s)}
await x.ev(()=>{S.progress={};save();render()});await W(200);
const r=await x.ev(()=>{const e=document.querySelector('#app .bkrow');return {txt:e.innerText.replace(/\s+/g,' '),act:e.dataset.act||'',done:Object.keys(S.blkDone||{}).length,rev:Object.keys(S.blkRev||{}).length,card:!!document.querySelector('#app .blkc')}});
ok(!/concluído|pulado/.test(r.txt)&&!r.act&&!r.done&&!r.rev&&!r.card,'registros apagados: marcador volta ao normal, sem toque: '+JSON.stringify(r));
ok(await x.ev(()=>S.sessions.some(x=>x.bkr)),'o registro de revisão continua no histórico');
// e o bloco volta a valer quando chegar a vez
await reg(A[0]);await reg(A[1]);ok(await x.ev(()=>!!document.querySelector('#app .blkc')&&/Agora · Revisão de bloco/.test(document.querySelector('#app .blkc').innerText)),'ao chegar a vez de novo, o bloco abre como novo');
log.push('erros: '+JSON.stringify(errs));await b.close();console.log(log.join('\n'));
