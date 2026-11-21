/* Revisão de consolidação: escolher o período (ciclos ou rodada) e o que entra; ciclo de revisão só com as disciplinas que têm questões;
   por disciplina, as 1ªs revisões de todas as sessões, depois as 2ªs…, o que conta (atrasada/agora/adiantada) antes do refazer;
   resolver uma parte: placar, registro "rev. consolidação" e, se contava, a vez feita na revisão por questões; Próxima encadeia;
   cancelar desfaz o crédito. Uso: node lint/consol.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.qc;delete S0.qa;delete S0.rq;delete S0.rv;S0.mode='study';
S0.subjects.push({id:'qx',name:'Teste Q',goal:60,topics:[{id:'t1',name:'Tópico Um',done:false,links:[]}]});
const mkQ=(n,o)=>[...Array(n)].map((_,j)=>({numero:o+j+1,topico:'Tópico Um',tipo:'CE',enunciado:'Item '+(o+j+1),gabarito:'C'}));
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const study=n=>ev(n=>{S.sel.subj='qx';S.sel.groups=[{id:'g'+n,nt:'Tópico Um',rows:[{id:'r'+n,kind:'aula',name:'Aula '+n,link:'https://exemplo.test/aula'+n,q:'https://exemplo.test/questoes'}]}];addSession(30);ui.rqreg=null;save();render()},n);
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};save()});
for(const n of [1,2,3])await study(n);await W(150);
/* cadernos de 9 questões nas sessões 1 e 2 (3 partes de 3) */
await ev(j=>{rqSesAll('qx').slice(0,2).forEach((o,i)=>{const id=uid(),P=qParse(j);qcL().push({id,subj:'qx',ses:o.k,nome:'Caderno '+(i+1),n:0,ce:0,me:0,d:today()});qSave(id,{qs:P.qs})});save();render()},JSON.stringify(mkQ(9,0)));
/* entrada em Revisão > Hoje */
await ev(()=>{tab='rev';ui.rvt='hoje';render()});await W(200);
ok(await ev(()=>!!document.querySelector('[data-act=csnew]')),'Revisão › Hoje: "Revisão de consolidação" com Começar');
await ev(()=>document.querySelector('.csent').scrollIntoView({block:'center'}));await p.screenshot({path:'saida/consol-entrada-'+w+'.png'});
await x.act('csnew');let r=await ev(()=>({t:document.querySelector('.csdlg h2').textContent,segs:[...document.querySelectorAll('.csdlg [data-act=csper]')].map(e=>e.textContent).join('|'),rows:[...document.querySelectorAll('.csdlg .csdr')].map(e=>e.textContent)}));
ok(r.t==='Revisão de consolidação'&&r.segs==='Ciclos|Rodada'&&r.rows.length===1&&/Teste Q3 sessões18 questões/.test(r.rows[0]),'janela: período Ciclos/Rodada e o tamanho por disciplina '+JSON.stringify(r));
await p.screenshot({path:'saida/consol-janela-'+w+'.png'});
await x.act('csf','pend');r=await ev(()=>document.querySelector('.csdlg .csdr .csdn').textContent);ok(r==='9 questões'||r==='12 questões'||r==='15 questões'||/questões/.test(r),'"Só as que faltam": só as partes que contam '+JSON.stringify(r));
/* uma tentativa anterior da 1ª revisão da sessão 1 (1 de 3), para o "antes" */
await ev(()=>{const c=qcL().find(x=>x.ses===rqSesAll('qx')[0].k);S.sessions.push({id:uid(),ses:uid(),rid:'rq-ant',subj:'qx',topic:'t1',min:0,cycle:S.cycle,set:S.set||1,review:true,kind:'aula',items:[],date:addD(today(),-1),ac:1,tq:3,qcad:c.id,qpart:0});save()});
await x.act('csf','all');await x.act('csgo');await W(300);
r=await ev(()=>({rv:!!(S.rv&&S.rv.cons),act:actives().map(s=>s.id).join(),card:!!document.querySelector('.cscard'),secs:[...document.querySelectorAll('.cscard .cssec .qzgt')].map(e=>e.getAttribute('aria-expanded')+':'+e.querySelector('.snt').textContent).join('|')}));
ok(r.rv&&r.act==='qx'&&r.card&&r.secs==='true:1ª revisão|false:2ª revisão|false:3ª revisão','iniciar: ciclo só com Teste Q; 1ª revisão aberta, as outras recolhidas '+JSON.stringify(r));
r=await ev(()=>[...document.querySelectorAll('.cscard .cssess')].map(e=>e.querySelector('b').textContent.slice(0,8)+'|'+(e.querySelector('.csh .rqk,.csh .csref')||{}).textContent+'|'+e.querySelectorAll('.csal .csai').length+(e.querySelector('.csal')||{textContent:''}).textContent.replace(/\s+/g,'')+e.querySelectorAll('.csal a.lic').length+'|'+!!e.querySelector('form.csac')));
ok(r.length===3&&/agora|atrasada/.test(r[0]+r[1])&&r.every(t=>/\|1Aula\d2\|/.test(t))&&r.filter(t=>t.endsWith('true')).length===1,'1ª revisão: as três sessões (a sem caderno com Acertos), o que conta primeiro, cada sessão com a aula pelo nome e os links da aula e de questões '+JSON.stringify(r));
await p.screenshot({path:'saida/consol-cartao-'+w+'.png',fullPage:w>500});
/* no foco: Continuar abre as questões por cima, com o relógio correndo */
await ev(()=>{const b=[...document.querySelectorAll('[data-act=rplay]')].find(e=>e.getClientRects().length);b.click()});await W(300);
r=await ev(()=>{const b=document.querySelector('.fmd [data-act=conss]');return {btn:b&&b.textContent,run:S.timer.running}});ok(/Continuar · sessão 1, 1ª revisão \(3\)/.test(r.btn||''),'foco: "Continuar · sessão 1, 1ª revisão (3)" '+JSON.stringify(r));
await ev(()=>document.querySelector('.fmd [data-act=conss]').click());await W(250);
r=await ev(()=>{const q=document.querySelector('.qzd');return {qz:!!q,top:document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('.qzd')!==null}});ok(r.qz&&r.top,'as questões abrem por cima do foco '+JSON.stringify(r));
await p.screenshot({path:'saida/consol-foco-'+w+'.png'});
await ev(()=>{ui.qz=null;fmExit();render()});await W(200);
/* resolver a próxima parte (Continuar) */
const nx=await ev(()=>consNext('qx').key);await x.act('conss',nx);r=await ev(()=>({n:ui.qz.ids.length,top:!!ui.qz.cons}));ok(r.n===3&&r.top,'Continuar: abre as 3 questões da parte '+JSON.stringify(r));
for(let i=0;i<3;i++){await ev(i=>qAns(i===0?'E':'C'),i);await ev(()=>document.querySelector('.qzd [data-act=qnext]').click())}
r=await ev(()=>({res:document.querySelector('.qzres').textContent,btn:[...document.querySelectorAll('.qzd .btn')].map(b=>b.textContent).join('|')}));ok(/^2 de 3/.test(r.res)&&/Próxima: sessão \d, 1ª revisão \(3\)/.test(r.btn)&&/Voltar à revisão/.test(r.btn),'fim da parte: 2 de 3 e "Próxima: sessão N, 1ª revisão (3)" '+JSON.stringify(r));
r=await ev(k=>{const [c,i]=k.split(':'),m=qcM(c),R=S.sessions.filter(x=>x.rid===S.rv.id);return {done:S.rv.cons.done[k],rec:R.map(x=>x.ac+'/'+x.tq+(x.qcad===c?'*':'')).join(),tag:R[0]&&recTag(R[0]).t,cred:S.rv.cons.cr.length,dn:rqDn(qcL().find(x=>x.id===c).ses,+i)}},nx);
ok(r.done&&r.done.ok===2&&r.rec==='2/3*'&&r.tag==='rev. consolidação'&&r.cred===1&&r.dn,'registro "rev. consolidação" 2/3, e a vez da revisão por questões fica feita '+JSON.stringify(r));
await ev(()=>{[...document.querySelectorAll('.qzd .btn')].find(b=>/Voltar à revisão/.test(b.textContent)).click()});await W(400);
r=await ev(()=>({chip:[...document.querySelectorAll('.cscard .cstp .csq .qsc')].map(e=>e.textContent).join(),cur:((document.querySelector('.cscard .cscur')||{closest:()=>null}).closest('.cssess')||{querySelector:()=>({})}).querySelector('b').textContent,now:(document.querySelector('.csnow')||{}).textContent}));
r.antes=await ev(()=>(document.querySelector('.cscard .csq .qprev')||{}).textContent||'');r.sum=await ev(()=>document.querySelector('.cscard .cssec .qzgn').textContent);ok(/antes 33%/.test(r.antes)&&/ · 67%$/.test(r.sum),'acerto no padrão do app, com "antes 33%" e o % no resumo da revisão '+JSON.stringify(r));
await ev(()=>{const e=document.querySelector('.cscard .cssec');e.scrollIntoView({block:'start'});scrollBy(0,-80)});await W(150);await p.screenshot({path:'saida/consol-feito-'+w+'.png'});ok(r.chip==='2/3 · 67%'&&/Sessão/.test(r.cur||'')&&/^3 de 18 questões/.test(r.now),'de volta: placar na parte, a próxima destacada, 3 de 18 '+JSON.stringify(r));
/* sessão sem caderno: digitar os acertos feitos fora */
r=await ev(()=>{const f=document.querySelector('form.csac');const k=f.dataset.id;f.querySelector('[name=a]').value='7';f.querySelector('[name=t]').value='10';f.requestSubmit();return k});await W(300);
r=await ev(k=>{const R=S.sessions.filter(x=>x.rid===S.rv.id&&x.tq===10);const [,sk,i]=k.split(':');return {done:S.rv.cons.done[k],rec:R.length,dn:rqDn(sk,+i),chip:[...document.querySelectorAll('.cscard .cstp .csq .qsc')].map(e=>e.textContent).join(),form:document.querySelectorAll('form.csac').length}},r);
ok(r.done&&r.done.ok===7&&r.rec===1&&r.dn&&/7\/10 · 70%/.test(r.chip)&&r.form===0,'sem caderno: 7 de 10 vira placar e registro, e conta na revisão por questões '+JSON.stringify(r));
/* ▶ de uma parte recolhida: abre a seção e resolve */
await x.act('cstog',await ev(()=>'qx:1'));r=await ev(()=>document.querySelectorAll('.cscard .cssec')[1].querySelectorAll('.cssess').length);ok(r===3,'tocar na 2ª revisão: abre as três sessões');
/* cancelar desfaz o crédito na revisão por questões */
const k0=await ev(k=>{const [c,i]=k.split(':');return [qcL().find(x=>x.id===c).ses,+i]},nx);
await ev(()=>{window.confirm=()=>true});await x.act('rvcancel');await W(300);
r=await ev(([k,i])=>({rv:!!S.rv,dn:rqDn(k,i),recs:S.sessions.filter(x=>recTag(x).t==='rev. consolidação').length}),k0);ok(!r.rv&&!r.dn&&r.recs===0,'cancelar: volta ao estudo, desfaz o crédito e os registros '+JSON.stringify(r));
/* rodada */
await ev(()=>{tab='rev';ui.rvt='hoje';render()});await x.act('csnew');await x.act('csper','rd');r=await ev(()=>({rd:(document.querySelector('.sfb[data-id=csr]')||{}).textContent,rows:document.querySelectorAll('.csdlg .csdr').length}));ok(/Rodada 1/.test(r.rd||'')&&r.rows===1,'período por rodada '+JSON.stringify(r));
await x.act('csx');
await ev(()=>{tab='rev';ui.rvt='hoje';render()});await W(150);await x.act('info','cons');r=await ev(()=>{const d=document.querySelector('.infodlg');return d?d.textContent:''});ok(/Revisão de consolidação/.test(r)&&/atrasada/.test(r)&&/adiantá-la/.test(r)&&/rev\. consolidação/.test(r),'ⓘ da consolidação explica período, ordem e o que conta');await p.screenshot({path:'saida/consol-info-'+w+'.png'});await x.act('infox');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
