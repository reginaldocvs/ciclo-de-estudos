/* Para refazer: itens com a última tentativa abaixo do limite aparecem em Revisão → Hoje (3 piores) e na lista completa; abrir questões,
   registrar nova tentativa (sai da lista se passar do limite; entra no Histórico como "refazer") e dispensar (volta se vier outra tentativa baixa) */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
/* dados: uma disciplina com 4 itens, três abaixo de 70% (30%, 44%, 56%) e um acima (90%); um com link de questões */
const s=S0.subjects.find(x=>!x.off&&!x.of);s.topics=[{id:'tR',name:'Direitos e garantias fundamentais: direitos e deveres individuais e coletivos',done:false,links:[]}];
const Q='https://quiz.exemplo.com/q?v=';const d0=new Date(Date.now()-5*864e5).toISOString().slice(0,10);
s.topics[0].name='Direitos e garantias fundamentais: direitos e deveres individuais e coletivos; direitos sociais; nacionalidade; direitos políticos; partidos políticos';S0.sessions=[{id:'r1',ses:'r1',subj:s.id,topic:'tR',min:90,cycle:1,set:1,review:false,kind:'aula',date:d0,items:[
 {kind:'aula',name:'Questões',link:'',qo:true,q:Q+'1',ac:3,tq:10},{kind:'aula',name:'Questões',link:'',qo:true,q:Q+'2',ac:4,tq:9},{kind:'aula',name:'Aula 12',link:'',ac:5,tq:9},{kind:'aula',name:'Aula 13',link:'',ac:9,tq:10}]}];
S0.trv={off:true};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=hoje]');e&&e.click()});await W(300);
const card=await x.ev(()=>{const c=document.querySelector('.rdcard');return c&&{h:c.querySelector('h2').textContent,rows:[...c.querySelectorAll('.rdi')].map(r=>r.querySelector('.tpcl').textContent+' '+r.querySelector('.rdp').textContent)}});
console.log('    cartão:',JSON.stringify(card));ok(card&&card.h==='Para refazer (3)'&&card.rows[0].endsWith('3/10 · 30%')&&card.rows[2].endsWith('5/9 · 56%'),'Revisão → Hoje: cartão "Para refazer (3)", do pior para o melhor, sem o de 90%');
await x.ev(()=>document.querySelector('.rdcard').scrollIntoView({block:'start'}));await W(200);await p.screenshot({path:`${OUT}/refazer-${w}-cartao.png`});
// alinhamento na 1ª linha
const al=await x.ev(()=>[...document.querySelectorAll('.rdcard .rdi')].map(r=>{const n=r.querySelector('.tpcl'),rg=document.createRange();rg.selectNodeContents(n);const f=rg.getClientRects()[0],c=(f.top+f.bottom)/2,dot=r.querySelector('.dot').getBoundingClientRect(),pc=r.querySelector('.rdp').getBoundingClientRect();return [Math.round((dot.top+dot.bottom)/2-c),Math.round((pc.top+pc.bottom)/2-c)]}));
ok(al.every(([a,b])=>Math.abs(a)<=3&&Math.abs(b)<=3),'ponto e porcentagem na altura da 1ª linha '+JSON.stringify(al));
const cl=await x.ev(()=>[...document.querySelectorAll('.rdcard .rdm .rdtp')].map(e=>{const lh=parseFloat(getComputedStyle(e).lineHeight);return [Math.round(e.getBoundingClientRect().height/lh),e.scrollWidth>e.clientWidth+1,!!e.title]}));ok(cl.length===3&&cl.every(([n,o,t])=>n===1&&o&&t),'nome do tópico em 1 linha, com reticências e nome completo no title '+JSON.stringify(cl));
// lista completa, tocando na 1ª linha do cartão: abre com ela expandida
await x.ev(()=>document.querySelector('.rdcard .rdi').click());await W(400);
const L=await x.ev(()=>({n:document.querySelectorAll('.rddlg .rdi').length,open:document.querySelector('.rddlg .rdi.on .tpcl')?.textContent,link:document.querySelector('.rddlg .rdi.on [data-act=redolink]')?.getAttribute('href'),btns:[...document.querySelectorAll('.rddlg .rdi.on .rda .btn')].map(b=>b.textContent)}));
console.log('    lista:',JSON.stringify(L));ok(L.n===3&&L.open==='Questões - 1'&&L.link===Q+'1'&&L.btns.join()==='Abrir questões,Registrar,Dispensar','lista completa abre com o item tocado expandido: Abrir questões (com o link), Registrar, Dispensar');
await p.screenshot({path:`${OUT}/refazer-${w}-lista.png`});
// registrar nova tentativa acima do limite: sai da lista
await x.ev(()=>document.querySelector('.rddlg .rdi.on [data-act=redoreg]').click());await W(400);
const fm=await x.ev(()=>({t:document.querySelector('.rddlg h2')?.textContent,qt:document.querySelector('.rddlg input[name=qt]')?.value,back:!!document.querySelector('.rddlg [data-act=redoback]')}));ok(fm.t==='Nova tentativa'&&fm.qt==='10'&&fm.back,'Registrar abre "Nova tentativa" com o total sugerido (10) e a seta de voltar');
await x.ev(()=>{const a=document.querySelector('.rddlg input[name=qa]');a.value='8';a.dispatchEvent(new Event('input',{bubbles:true}))});await W(200);await p.screenshot({path:`${OUT}/refazer-${w}-registro.png`});
await x.submit('.rddlg form[data-f=redo]');await W(500);
const r1=await x.ev(()=>({n:redoList().length,ses:S.sessions.filter(z=>z.redo).length,tst:document.querySelector('#undo')?.textContent||''}));ok(r1.n===2&&r1.ses===1&&/saiu da lista/.test(r1.tst),'nova tentativa com 80%: sai da lista e o aviso diz isso');
// Histórico mostra "refazer"
await x.ev(()=>{document.querySelector('nav [data-tab=reg]').click()});await W(500);const tag=await x.ev(()=>[...document.querySelectorAll('#app .tag,#app [class*=tag]')].map(e=>e.textContent).find(t=>/refazer/.test(t)));ok(!!tag,'Histórico mostra o registro com a etiqueta "'+tag+'"');
// dispensar
await x.ev(()=>{document.querySelector('nav [data-tab=rev]').click()});await W(300);ok(!(await x.ev(()=>!!document.querySelector('.rdcard .rdall'))),'com 3 ou menos, o cartão mostra todas e não tem "Ver todas"');await x.ev(()=>document.querySelector('.rdcard [data-act=redoall]').click());await W(300);
await x.ev(()=>{if(!document.querySelector('.rddlg .rdi.on'))document.querySelector('.rddlg .rdi').click()});await W(300);await x.ev(()=>document.querySelector('.rddlg .rdi.on [data-act=redoskip]').click());await W(400);
ok(await x.ev(()=>redoList().length)===1,'Dispensar tira da lista');
// nova tentativa baixa do item dispensado (numa revisão): volta
await x.ev(Q=>{const t=S.sessions[0];S.sessions.push({id:'r9',ses:'r9',subj:t.subj,topic:'tR',min:20,cycle:1,set:1,review:true,kind:'aula',date:today(),items:[{kind:'aula',name:'Questões',link:'',qo:true,q:Q+'2',ac:3,tq:9}]});save();render()},Q);
ok(await x.ev(()=>redoList().length)===2,'item dispensado volta se vier outra tentativa abaixo do limite');
// desktop: cartão ao lado de "Para hoje"
ok(!errs.length,'sem erros '+JSON.stringify(errs));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
