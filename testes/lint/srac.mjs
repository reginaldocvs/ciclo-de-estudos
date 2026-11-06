/* Revisão por sessões: na janela de registro, cada item marcado tem o seu campo de acertos (aula ou questão, com ou sem acerto anterior),
   e o subtítulo conta as marcadas. Uso: node lint/srac.mjs [largura=390] */
import {open,mk,W} from './lib.mjs';let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};import fs from 'fs';
const S0=JSON.parse(fs.readFileSync('dados/exemplo.json','utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};S0.srvPt=[];S0.srv={on:true,n:2,y:3,start:new Date().toISOString().slice(0,10)};
const w=+(process.argv[2]||390);{const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
await x.ev(()=>{const s=current();s.topics.unshift({id:'cg',name:'Classes Gramaticais',done:false,links:[]});const it=(n,q)=>({kind:'aula',name:n,link:'',...(q?{qo:true,title:'Questões',lbl:n}:{})});
 S.sessions.push({id:'a1',ses:'a1',subj:s.id,topic:'cg',min:30,cycle:S.cycle,set:1,review:false,kind:'aula',date:today(),items:[it('Blocos 1-7'),it('Bloco 1',1),it('Bloco 2',1)]});
 S.sessions.push({id:'a2',ses:'a2',subj:s.id,topic:'cg',min:30,cycle:S.cycle,set:1,review:false,kind:'aula',date:today(),items:[it('Bloco 3',1)]});
 S.srMk={};srTodo(s.id).forEach(t=>t.its.forEach(z=>S.srMk[z.k]=true));ui.srreg=s.id;save();render()});await W(400);
const r=await x.ev(()=>{const f=document.querySelector('#modal form[data-f=srreg]');return {sub:document.querySelector('#modal .trvok .mut').textContent,rows:[...f.querySelectorAll('.acrow .rlb')].map(e=>e.textContent.trim())}});
ok(r.sub==='Revisão por sessões · 1 tópico · 4 marcadas'&&r.rows.join()==='Blocos 1-7,Bloco 1,Bloco 2,Bloco 3','4 marcadas e um campo de acertos para cada uma (inclusive a aula e questões sem acerto anterior) '+JSON.stringify(r));
/* registra com acertos no Bloco 1 e confere que foi gravado no item */
await x.ev(()=>{const f=document.querySelector('#modal form[data-f=srreg]');const a=f.querySelector('input[name$="-0"][data-qa]'),t=f.querySelector('input[name$="-0"][data-qt]');a.value='7';t.value='10'});await x.submit('#modal form[data-f=srreg]');await W(300);
const g=await x.ev(()=>S.sessions.filter(x=>String(x.rid).startsWith('sr-')).flatMap(x=>x.items.map(i=>(i.lbl||i.name)+':'+(i.ac??'')+'/'+(i.tq??''))).join());ok(g==='Blocos 1-7:7/10,Bloco 1:/,Bloco 2:/,Bloco 3:/','acertos gravados no item certo; campo vazio não conta '+g);ok(!errs.length,'sem erros de script');
await b.close()}process.exit(bad?1:0);
