/* "antes" na janela "Revise com questões": a 2ª revisão de uma sessão compara com a 1ª (mesmo tópico); a 1ª, com os acertos do próprio estudo;
   só aparece com a porcentagem preenchida. Uso: node lint/rqantes.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.rq;delete S0.qc;delete S0.qa;
S0.subjects.push({id:'qx',name:'Teste Q',goal:60,topics:[{id:'t1',name:'Tópico Um',done:false,links:[]}]});
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:844});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
/* sessão 1 com 2 de 5 no próprio estudo; as outras sem questões */
const study=(n,q)=>ev(([n,q])=>{S.sel.subj='qx';S.sel.groups=[{id:'g'+n,nt:'Tópico Um',rows:[{id:'r'+n,kind:'aula',name:'Aula '+n,link:''}]}];addSession(30);if(q){const L=S.sessions.filter(x=>x.subj==='qx'&&!x.review);const r=L[L.length-1];r.items[0].ac=q[0];r.items[0].tq=q[1]}ui.rqreg=null;save();render()},[n,q]);
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};save()});
await study(1,[2,5]);await study(2);await W(150);
const open1=()=>ev(()=>{ui.rqreg='qx';render()}).then(()=>W(250));
const fill=(bi,a,t)=>ev(([bi,a,t])=>{const f=document.querySelector('[data-f=rqreg]');for(const [n,v] of [[`qa-${bi}-0`,a],[`qt-${bi}-0`,t]]){const i=f.querySelector(`[name="${n}"]`);i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}))}},[bi,a,t]);
const antes=()=>ev(()=>[...document.querySelectorAll('[data-f=rqreg] .rqb')].map(b=>{const q=b.querySelector('.rqtn .qprev');return (b.querySelector('.rqh b')||{}).textContent+':'+(q?q.textContent:'')}));
await open1();let r=await antes();ok(r.join()==='Sessão 1:antes 40%','1ª revisão: "antes 40%" (2 de 5 no estudo) já ao abrir '+JSON.stringify(r));
await fill(0,'6','10');await ev(()=>{ui.rqreg='qx';render()});await W(200);r=await antes();ok(/^Sessão 1:antes 40%$/.test(r[0]),'preencher não muda o "antes" '+JSON.stringify(r));
await ev(()=>document.querySelector('[data-f=rqreg]').requestSubmit());await W(300);
/* sessões 3, 4 e 5: na 5 chega a 2ª revisão da sessão 1 (5−4) */
for(const n of [3,4]){await study(n);await W(100);await ev(()=>{const b=document.querySelector('#undo [data-act=rqskip]');ui.rqreg='qx';render()});await W(150);await ev(()=>{const f=document.querySelector('[data-f=rqreg]');if(f){const s=document.querySelector('[data-f=rqreg] [data-act=rqskip]');s&&s.click()}});await W(200)}
await study(5);await open1();await ev(()=>{const f=document.querySelector('[data-f=rqreg]');f.querySelectorAll('input[name^=qa-]').forEach(i=>{i.value='8';i.dispatchEvent(new Event('input',{bubbles:true}))});f.querySelectorAll('input[name^=qt-]').forEach(i=>{i.value='10';i.dispatchEvent(new Event('input',{bubbles:true}))})});await ev(()=>{ui.rqreg='qx';render()});await W(200);
r=await antes();const s1=r.find(t=>t.startsWith('Sessão 1:'));ok(s1==='Sessão 1:antes 60%','2ª revisão da sessão 1: "antes 60%" (a 1ª revisão) '+JSON.stringify(r));
await ev(()=>{try{hideUndo()}catch(e){}});await W(150);await p.screenshot({path:'saida/rqantes-'+w+'.png'});
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
