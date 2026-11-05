/* Listas longas em uso: registrar a revisão de um item da 2ª leva (a lista encolhe sem fechar a leva aberta), teclado no "Mostrar mais",
   limites (6 itens: sem botão; 7: "Mostrar mais 1"), busca do Histórico volta ao começo, Para refazer na 2ª leva e Finalizados com leva */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
const dA=n=>{const d=new Date(Date.now()-n*864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const s=S0.subjects.find(x=>!x.off&&!x.of);s.topics=[];S0.sessions=[];S0.trv={start:'2020-01-01',t:{}};
/* 20 vencidos (13 com questões baixas), 8 finalizados (5 revisões feitas) */
for(let i=0;i<28;i++){const id='tp'+i;s.topics.push({id,name:'Tópico de exemplo '+(i+1),done:false,links:[]});const d=dA(60+i);
 S0.sessions.push({id:'s'+i,ses:'s'+i,subj:s.id,topic:id,min:30,cycle:1,set:1,review:false,kind:'aula',date:d,items:i<13?[{kind:'aula',name:'Aula '+(i+1),link:'',ac:2,tq:10}]:[]});
 if(i>=20)S0.trv.t[s.id+'|'+id+'|'+d]={h:[dA(50),dA(40),dA(30),dA(20),dA(10)]}}
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
const cnt=q=>x.ev(q=>document.querySelectorAll(q).length,q);
const pg=k=>x.ev(k=>{const m=document.querySelector('.pgm[data-pgk="'+k+'"]');return m?[...m.querySelectorAll('button')].map(b=>b.textContent.trim()):null},k);
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);
// 1. teclado: Enter no "Mostrar mais" abre a leva e o foco continua num botão da lista
await x.ev(()=>document.querySelector('.pgm[data-pgk=hoje] [data-act=pgmore]').focus());await p.keyboard.press('Enter');await W(300);
const f=await x.ev(()=>{const a=document.activeElement;return {n:document.querySelectorAll('.rvtoday .trvr').length,act:a&&a.dataset.act,in:!!(a&&a.closest('.pgm[data-pgk=hoje]'))}});
ok(f.n===12&&f.in,'teclado: Enter abre a 2ª leva e o foco fica em "'+f.act+'" da mesma lista');
// 2. registrar a revisão do 9º item: a lista encolhe para 19 e continua com 12 à vista
const k9=await x.ev(()=>document.querySelectorAll('.rvtoday .trvr')[8].querySelector('[data-act=trvok]').dataset.id);
await x.act('trvok',k9);await W(300);await x.submit('form[data-f=trvok]');await W(400);
const a=await x.ev(()=>({h:document.querySelector('.rvtoday h2').textContent,n:document.querySelectorAll('.rvtoday .trvr').length}));const m1=await pg('hoje');
ok(a.h==='Para hoje (19)'&&a.n===12&&m1[0]==='Mostrar mais 6 · 7 restantes'&&m1[1]==='Mostrar menos',`depois de registrar o 9º: ${a.h}, ${a.n} à vista, "${m1}"`);
await p.screenshot({path:`${OUT}/paginas2-${w}-registrou.png`});
// 3. Para refazer: 2ª leva, registrar o 9º com 8/10 sai e a leva continua aberta
await x.ev(()=>document.querySelector('.rdcard .rdall').click());await W(300);await x.ev(()=>document.querySelector('.pgm[data-pgk=redo] [data-act=pgmore]').click());await W(200);
const rk=await x.ev(()=>document.querySelectorAll('.rddlg .rdi')[8].dataset.id);await x.ev(k=>document.querySelector(`.rddlg .rdi[data-id="${k}"]`).click(),rk);await W(200);
ok(await x.ev(k=>!!document.querySelector(`.rddlg .rdi.on[data-id="${k}"]`),rk),'Para refazer: item da 2ª leva abre ao tocar');
await x.ev(()=>document.querySelector('.rddlg .rdi.on [data-act=redoreg]').click());await W(300);
await x.ev(()=>{const a=document.querySelector('.rddlg input[name=qa]');a.value='8';a.dispatchEvent(new Event('input',{bubbles:true}))});await x.submit('.rddlg form[data-f=redo]');await W(400);
if(!(await cnt('.rddlg .rdi')))await x.ev(()=>document.querySelector('.rdcard .rdall').click()),await W(300);
const r=await x.ev(()=>({n:document.querySelectorAll('.rddlg .rdi').length,h:document.querySelector('.rddlg h2')?.textContent}));
ok(r.h==='Para refazer (12)'&&r.n===12,`Para refazer depois de registrar: ${r.h}, ${r.n} à vista`);
await x.ev(()=>{const c=document.querySelector('.rddlg [data-act=redoclose]');c&&c.click()});await W(300);
// 4. Finalizados com leva própria
await x.ev(()=>document.querySelector('[data-act=rvt][data-id=topicos]').click());await W(300);await x.ev(()=>document.querySelector('[data-act=trvtog][data-id=trvfx]').click());await W(200);
const fx=await x.ev(()=>{const g=[...document.querySelectorAll('.trvg')].pop();return {n:g.querySelectorAll('.trvli').length,m:g.querySelector('.pgm')?.textContent}});
ok(fx.n===6&&/Mostrar mais 2/.test(fx.m||''),`Finalizados: ${fx.n} de 8 e "${fx.m}"`);
// 5. limites: com 6 itens não há botão; com 7, "Mostrar mais 1"
await x.ev(()=>{S.sessions=S.sessions.filter(z=>!z.review);const L=trvList().filter(o=>!o.fix).slice(6);L.forEach(o=>{S.trv.t[o.k]={h:[today()],end:today()}});save();ui.pg=null;ui.rvt='hoje';render()});await W(200);
ok(await cnt('.rvtoday .trvr')===6&&!(await pg('hoje')),'6 itens: lista inteira sem botão');
await x.ev(()=>{const o=trvList().find(o=>o.end);delete S.trv.t[o.k];save();render()});await W(200);
const m7=await pg('hoje');ok(m7&&m7.join()==='Mostrar mais 1','7 itens: "'+m7+'"');
// 6. Histórico: abre 2ª leva, busca volta ao começo
await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(300);await x.ev(()=>document.querySelector('.pgm[data-pgk=hist] [data-act=hmore]').click());await W(200);
const h1=await cnt('.hlist .ritem');await x.ev(()=>{const q=document.getElementById('hq');q.value='exemplo';q.dispatchEvent(new Event('input',{bubbles:true}))});await W(500);
ok(h1===12&&await cnt('.hlist .ritem')===6,`Histórico: 2ª leva com ${h1}, busca volta a 6`);
ok(!(await x.ev(()=>document.documentElement.scrollWidth>innerWidth)),'sem rolagem para o lado');
ok(!errs.length,'sem erros na página '+JSON.stringify(errs));
await b.close();console.log(bad?'FALHOU':'TUDO OK');process.exit(bad?1:0);
