/* Revisão por sessões conta as outras revisões: o que foi revisado no ponto de revisão (bloco), na revisão por tópico
   ou na revisão por grupos/ciclos vale como uma revisão do item e sai da rodada atual; desfazer a origem tira o crédito.
   Uso: node lint/srcredito.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};delete S0.srv;S0.srvPt=[];S0.blk=[];S0.blkDone={};S0.blkRev={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
/* duas sessões de estudo da 1ª disciplina, 2 aulas em cada, há 10 dias; revisão por sessões a cada 2, até 3 revisões */
const sid=await ev(()=>{const s=inCycle()[0];['Crase','Regência'].forEach((n,i)=>{if(!s.topics.some(t=>t.name===n))s.topics.push({id:'u'+i,name:n,done:false,links:[]})});
 const d=addD(today(),-10);S.srv={on:true,n:2,y:3,start:addD(today(),-20)};trvInit();delete S.trv.off;S.trv.start=addD(today(),-20);
 ['k1','k2'].forEach((k,i)=>{const t=s.topics.find(t=>t.name===(i?'Regência':'Crase'));[1,2].forEach(j=>S.sessions.push({id:k+j,ses:k,subj:s.id,topic:t.id,min:30,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',date:d,items:[{kind:'aula',name:'Aula '+i+'.'+j,link:''}]}))});
 save();render();return s.id});
const st=()=>ev(sid=>{const T=srTodo(sid),A=srItems(sid);return {due:srDue(sid),todo:srNi(T),n:A.flatMap(t=>t.its).map(z=>z.n).join(','),cr:(S.srvPt||[]).filter(p=>p.cr).length}},sid);
let s0=await st();ok(s0.due&&s0.todo===4,'começo: revisão por sessões disponível com 4 itens '+JSON.stringify(s0));

// 1. revisão por tópico da Crase (dia de estudo) conta para as 2 aulas da Crase
const k=await ev(sid=>{const o=trvList().find(o=>o.s.id===sid&&o.tp.name==='Crase');return o&&o.k},sid);
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(250);await ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=topicos]');e&&e.click()});await W(250);await ev(()=>{ui.pg={...(ui.pg||{}),trvdue:99};render()});await W(150);await x.act('trvok',k);await W(200);
if(await ev(()=>!!document.querySelector('#modal form[data-f=trvok]'))){await x.fill('#modal input[name=m]','0h15');await x.submit('#modal form[data-f=trvok]');await W(300)}
let s1=await st();ok(s1.cr===1&&s1.todo===2&&/1/.test(s1.n),'revisão por tópico da Crase conta (as 2 aulas saem da rodada) '+JSON.stringify(s1));
// a revisão de tópico desfeita tira o crédito
await ev(k=>{const d=S.trv.t[k].h.slice(-1)[0];trvUnmark(k,d);save();render()},k);
let s2=await st();ok(s2.todo===4&&!/1/.test(s2.n),'revisão por tópico desfeita: o crédito some '+JSON.stringify(s2));
await ev(k=>{trvMark(k,today(),15,null,[]);save();render()},k);

// 2. ponto de revisão (bloco) depois da 1ª disciplina, revisando a disciplina inteira
await ev(()=>{S.blk=[{id:'b1',pos:1,goal:30}];S.progress[inCycle()[0].id]=inCycle()[0].goal;save();render()});
const bk=await ev(()=>{const b=blkCur();return b?b.id:null});
if(bk){await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(250);await x.act('bkreg',sid);await W(200);await x.fill('#modal input[name=m]','0h20');await x.submit('#modal form[data-f=bkreg]');await W(300);
 let s3=await st();ok(s3.cr===2&&!s3.due&&s3.todo===0,'bloco revisado: as 4 aulas contam e a rodada fica sem itens '+JSON.stringify(s3));
 if(process.env.SHOT){await ev(sid=>{ui.open.add('srs:'+sid);ui.open.add('src:'+sid);render()},sid);await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(250);await ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=sessoes]');e&&e.click()});await W(300);const t=await ev(sid=>{const c=[...document.querySelectorAll('#app .srsc')].find(c=>c.querySelector('[data-id="src:'+sid+'"]'));if(!c)return 'sem cartão';c.scrollIntoView();return c.innerText},sid);console.log('--- aba Sessões --- '+t);await p.screenshot({path:'saida/srcredito.png'});await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(250)}
 ok(await ev(sid=>{ui.open.add('src:'+sid);render();document.querySelector('nav [data-tab=rev]').click();const e=document.querySelector('[data-act=rvt][data-id=sessoes]');e&&e.click();const c=document.querySelector('[data-id="src:'+sid+'"]');const card=c&&c.closest('.srsc');const ok=!!card&&/Em dia · revisado em outra revisão/.test(card.innerText)&&card.querySelectorAll('.srit').length===4&&!card.querySelector('input[type=checkbox]');document.querySelector('nav [data-tab=ciclo]').click();return ok},sid),'aba Sessões: "Em dia · revisado em outra revisão" e a lista das 4 aulas, sem caixinha');
 ok(/2/.test(s3.n),'a Crase, revisada no tópico e no bloco, já tem 2 revisões '+JSON.stringify(s3));
 /* novas sessões abrem outra rodada: as aulas revisadas voltam como próxima revisão */
 await ev(sid=>{const s=S.subjects.find(x=>x.id===sid),t=s.topics.find(t=>t.name==='Crase');['k3','k4'].forEach(k=>S.sessions.push({id:k,ses:k,subj:sid,topic:t.id,min:30,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',date:today(),items:[{kind:'aula',name:'Aula '+k,link:''}]}));save();render()},sid);
 let s4=await st();ok(s4.due&&s4.todo===2,'novas sessões: só as aulas novas entram nesta rodada (as revisadas no bloco ficam de fora) '+JSON.stringify(s4));
 /* registrar a revisão por sessões fecha a rodada; a próxima traz tudo de volta com a contagem certa */
 await ev(sid=>{srCurT(sid).forEach(t=>t.its.forEach(z=>{S.srMk=S.srMk||{};S.srMk[z.k]=true}));ui.open.add('srs:'+sid);render()},sid);await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(250);await ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=sessoes]');e&&e.click()});await W(250);await x.act('srreg',sid);await W(200);await x.fill('#modal input[name=m]','0h10');await x.submit('#modal form[data-f=srreg]');await W(300);
 const lp=await ev(()=>{const e=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Desfazer revisão');return !!e});
 ok(await ev(sid=>{const P=srPts(sid).filter(p=>!p.cr);return P.length===1},sid),'o ponto real da revisão por sessões não se confunde com os créditos');
 // desfazer o bloco (Desfazer do app) tira o crédito
 await ev(()=>{S.blkRev={};save();render()});
 let s5=await st();ok(s5.cr>=2&&!/2/.test(s5.n.replace(/,/g,'')),'bloco apagado: o crédito dele some '+JSON.stringify(s5));
}else ok(false,'ponto de revisão não ficou da vez');

// 3. revisão por grupos/ciclos: registro com rid conta pelo mesmo caminho
await ev(sid=>{S.srvPt=[];S.blk=[];S.blkRev={};S.trv.t={};save();render()},sid);
await ev(sid=>{const s=S.subjects.find(x=>x.id===sid),t=s.topics.find(t=>t.name==='Regência');const ses='rv1';S.sessions.push({id:'rv1a',ses,rid:'r1',subj:sid,topic:t.id,min:20,cycle:S.cycle,set:S.set||1,review:true,kind:'aula',date:today(),items:[{kind:'aula',name:'Aula 1.1',link:''}]});srCredit(sid,today(),[{tid:t.id,its:[{kind:'aula',name:'Aula 1.1',link:''}]}],'rv',ses);save();render()},sid);
let s6=await st();ok(s6.cr===1&&/1/.test(s6.n),'revisão por grupos/ciclos conta só a aula revisada '+JSON.stringify(s6));
await ev(()=>{S.sessions=S.sessions.filter(x=>x.ses!=='rv1');save();render()});
let s7=await st();ok(!/1/.test(s7.n),'registro da revisão por grupos apagado: o crédito some '+JSON.stringify(s7));

ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
