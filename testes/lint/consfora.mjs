/* Revisão de consolidação com questões de fora do app (sites de questões), sem caderno:
   - o cartão aparece em Revisão → Hoje quando há questões registradas (link ou acertos); sem nenhuma, explica como usar;
   - a janela conta as linhas de fora; "Só as que errei" traz só as abaixo do limite de reforço;
   - na revisão, uma seção "Questões de fora do app" com uma linha por questão (link, acerto anterior, campos de acertos);
   - anotar os acertos grava a linha com o resultado (entra no Para refazer) e o progresso conta a linha.
   Uso: node lint/consfora.mjs <dados.json> [largura=1280] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||1280);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;S0.qcad=[];S0.sessions=[];
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const tab=async t=>{await ev(t=>{[...document.querySelectorAll(`[data-tab="${t}"]`)].find(e=>e.offsetParent).click()},t);await W(400)};
const entry=()=>ev(()=>{const c=document.querySelector('.csent');return c?{txt:c.textContent.replace(/\s+/g,' '),btn:!!c.querySelector('[data-act=csnew]')}:null});
await ev(()=>{S.qlim=50;S.rq={on:true,iv:[1,4,8],b:{},hold:[]};save();render()}); /* como num app novo: a por questões ligada (a aba Revisão precisa de uma revisão ligada) */
await tab('rev');let e=await entry();
ok(e&&!e.btn&&/Para usar, registre questões/.test(e.txt),'sem questões: o cartão explica como usar, sem botão '+JSON.stringify(e));
/* duas sessões com questões de site (uma com link e 2/10, outra com 9/10) e uma só com aula */
const T=await ev(()=>{const s=actives()[0],b=s.of||s.id,B=S.subjects.find(z=>z.id===b);B.topics=B.topics||[];['Tópico Q1','Tópico Q2','Tópico só aula'].forEach((n,i)=>{if(!B.topics[i])B.topics.push({id:'tq'+i,name:n,done:false,links:[]})});const tp=B.topics.slice(0,3).map(t=>t.id),d=today();
 const add=(t,items,h)=>S.sessions.push({id:uid(),ses:uid(),subj:s.id,topic:t,min:60,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',items,date:d,at:h});
 add(tp[0],[{kind:'aula',name:'Aula Q1',link:'',q:'https://questoes.example/caderno-1',tq:10,ac:2}],'08:00');
 add(tp[1],[{kind:'aula',name:'Aula Q2',link:'',tq:10,ac:9}],'09:00');
 add(tp[2],[{kind:'aula',name:'Só aula',link:''}],'10:00');
 add(tp[2],[{kind:'aula',name:'Aula Q3',link:'',q:'https://questoes.example/caderno-3'}],'11:00');save();render();return {b,tp}});
await tab('rev');e=await entry();
ok(e&&e.btn&&/as externas/.test(e.txt),'com questões de site: o cartão aparece com Começar '+JSON.stringify(e&&e.txt));
await x.act('csnew');await W(400);
{const el=await p.$('.csdlg');if(el){fs.mkdirSync('saida',{recursive:true});await el.screenshot({path:`saida/consfora-janela-${w}.png`})}}
let dl=await ev(()=>{const d=document.querySelector('.csdlg');return d?{tot:(d.querySelector('.cstot')||{}).textContent||'',row:(d.querySelector('.csdn')||{}).textContent||'',go:!document.querySelector('[data-act=csgo]').disabled}:null});
ok(dl&&/20 questões externas e 1 sem n.º de questões/.test(dl.tot)&&/20 externas · 1 sem n.º/.test(dl.row)&&dl.go,'janela: conta 20 questões externas e 1 sem n.º de questões, e libera Iniciar '+JSON.stringify(dl));
await x.act('csf','err');await W(300);
dl=await ev(()=>(document.querySelector('.cstot')||{}).textContent||'');ok(/^Vão entrar 10 questões externas de/.test(dl),'"Só as que errei": só a de 20% ('+dl+')');
await x.act('csf','all');await W(300);await x.act('csgo');await W(600);
ok(await ev(()=>consOn()),'consolidação iniciada');
const card=()=>ev(()=>{const c=document.querySelector('.cscard');if(!c)return null;const sec=[...c.querySelectorAll('.cssec')].find(s=>/Questões externas/.test(s.textContent));
 return {now:(c.querySelector('.csnow')||{}).textContent||'',sec:!!sec,forms:sec?sec.querySelectorAll('form[data-f=csac]').length:0,link:!!(sec&&sec.querySelector('a[href*="questoes.example"]')),prev:(sec&&sec.textContent.match(/antes \d+% · \d+ de \d+/g))||[],fim:(c.querySelector('.csall')||{}).textContent||''}});
let c=await card();
fs.mkdirSync('saida',{recursive:true});{const el=await p.$('.cscard');if(el)await el.screenshot({path:`saida/consfora-${w}.png`})}
ok(c&&c.sec&&c.forms===3,'revisão: seção "Questões externas" com 3 aulas para anotar '+JSON.stringify(c));
ok(c&&c.link,'a aula com link de questões abre o site');
ok(c&&c.prev.includes('antes 20% · 2 de 10')&&c.prev.includes('antes 90% · 9 de 10'),'cada aula mostra o acerto anterior '+JSON.stringify(c&&c.prev));
ok(c&&/0 de 20 questões externas · 0 de 1 sem n.º de questões/.test(c.now),'progresso: 0 de 20 questões externas e 0 de 1 sem n.º de questões ('+(c&&c.now)+')');
ok(c&&/abra o link de cada aula, refaça e anote/.test(c.fim),'sem "passou por todas" enquanto faltam questões externas');
const rd=await ev(()=>redoList().map(o=>o.k+' '+o.a+'/'+o.tq));ok(rd.some(k=>/Aula Q1 2\/10/.test(k)),'antes: Aula Q1 (20%) está no Para refazer '+JSON.stringify(rd));
/* anota 8/10 na Aula Q1 */
await ev(()=>{const f=[...document.querySelectorAll('form[data-f=csac]')].find(f=>f.closest('.cstp').textContent.includes('Aula Q1'));f.querySelector('[name=a]').value='8';f.querySelector('[name=t]').value='10';f.querySelector('button').click()});await W(500);
const rec=await ev(()=>{const r=S.sessions.filter(x=>x.rid===S.rv.id);return r.map(x=>({it:(x.items||[]).map(i=>(i.name||'')+' '+i.ac+'/'+i.tq),ac:x.ac,tq:x.tq,qik:!!x.qik}))});
ok(rec.length===1&&rec[0].it[0]==='Aula Q1 8/10'&&rec[0].qik&&rec[0].tq==null,'registro "rev. consolidação" com a linha e os acertos '+JSON.stringify(rec));
const rd2=await ev(()=>redoList().map(o=>o.k+' '+o.a+'/'+o.tq));ok(!rd2.some(k=>/Aula Q1/.test(k)),'depois: Aula Q1 (80%) sai do Para refazer '+JSON.stringify(rd2));
c=await card();ok(c&&/10 de 20 questões externas/.test(c.now)&&c.forms===2,'progresso: 10 de 20 questões externas '+JSON.stringify(c&&c.now));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
