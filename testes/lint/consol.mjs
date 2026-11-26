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
await x.act('csnew');let r=await ev(()=>({t:document.querySelector('.csdlg h2').textContent,segs:[...document.querySelectorAll('.csdlg [data-act=csper],.csdlg .sfb[data-id=csr]')].length,de:!!document.querySelector('.csdlg .sfb[data-id=csa]'),rows:[...document.querySelectorAll('.csdlg .csdr')].map(e=>e.textContent)}));
ok(r.t==='Revisão de consolidação'&&r.segs===0&&r.de&&r.rows.length===1&&/Teste Q.*3 sess\. · 18 quest\./.test(r.rows[0]),'janela: período De/Até (sem rodada com uma rodada só) e o tamanho por disciplina '+JSON.stringify(r));
await p.screenshot({path:'saida/consol-janela-'+w+'.png'});
await x.act('csf','pend');r=await ev(()=>document.querySelector('.csdlg .csdr .csdn').textContent);ok(/^\d+ sess\. · \d+ quest\.( · .+)?$/.test(r),'"Só as que faltam": só as partes que contam (e a linha de fora que conta) '+JSON.stringify(r));
/* uma tentativa anterior da 1ª revisão da sessão 1 (1 de 3), para o "antes" */
await ev(()=>{const c=qcL().find(x=>x.ses===rqSesAll('qx')[0].k);S.sessions.push({id:uid(),ses:uid(),rid:'rq-ant',subj:'qx',topic:'t1',min:0,cycle:S.cycle,set:S.set||1,review:true,kind:'aula',items:[],date:addD(today(),-1),ac:1,tq:3,qcad:c.id,qpart:0});save()});
await x.act('csf','all');await x.act('csgo');await W(300);
r=await ev(()=>({rv:!!(S.rv&&S.rv.cons),act:actives().map(s=>s.id).join(),card:!!document.querySelector('.cscard'),secs:[...document.querySelectorAll('.cscard .cssec .qzgt')].map(e=>e.getAttribute('aria-expanded')+':'+e.querySelector('.snt').textContent).join('|')}));
ok(r.rv&&r.act==='qx'&&r.card&&r.secs==='true:1ª revisão|false:2ª revisão|false:3ª revisão|false:Questões externas','iniciar: ciclo só com Teste Q; 1ª revisão aberta, as outras (e as questões externas) recolhidas '+JSON.stringify(r));
r=await ev(()=>[...document.querySelectorAll('.cscard .cssess')].map(e=>e.querySelector('b').textContent.slice(0,8)+'|'+(e.querySelector('.csh .rqk,.csh .csref')||{}).textContent+'|'+e.querySelectorAll('.csal .csai').length+(e.querySelector('.csal')||{textContent:''}).textContent.replace(/\s+/g,'')+e.querySelectorAll('.csal a.lic').length+'|'+!!e.querySelector('form.csac')));
ok(r.length===2&&/agora|atrasada/.test(r[0]+r[1])&&r.every(t=>/\|1Aula\d2\|false$/.test(t)),'1ª revisão: as duas sessões com caderno, o que conta primeiro, cada uma com a aula pelo nome e os links da aula e de questões '+JSON.stringify(r));
await x.act('cstog','qx:x');await W(250);
r=await ev(()=>{const s=[...document.querySelectorAll('.cscard .cssec')].find(e=>/Questões externas/.test(e.textContent));return s?[...s.querySelectorAll('.cssess')].map(e=>e.querySelector('b').textContent.slice(0,8)+'|'+e.querySelectorAll('.csal .csai').length+(e.querySelector('.csal')||{textContent:''}).textContent.replace(/\s+/g,'')+e.querySelectorAll('.csal a.lic').length+'|'+!!e.querySelector('.csac input[data-csd]')):null});
ok(r&&r.length===1&&/\|1Aula32\|true$/.test(r[0]),'questões externas: a sessão sem caderno, com a aula, os links e Acertos '+JSON.stringify(r));
await x.act('cstog','qx:x');await W(250);
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
r=await ev(()=>({chip:[...document.querySelectorAll('.cscard .cstp .csdn')].map(e=>e.textContent).join(),cur:((document.querySelector('.cscard .cscur')||{closest:()=>null}).closest('.cssess')||{querySelector:()=>({})}).querySelector('b').textContent,now:(document.querySelector('.csnow')||{}).textContent}));
r.sum=await ev(()=>document.querySelector('.cscard .cssec .qzgn').textContent);
/* o placar com o antes → agora fica na janela de registro ("Revisado nesta sessão") */
await ev(()=>{const b=document.querySelector('.edp [data-act=rreg]');b&&b.click()});await W(400);r.antes=await ev(()=>[...document.querySelectorAll('#modal .csrv')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' | '));
await ev(()=>{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))});await W(300);
ok(/antes 33%/.test(r.antes)&&/2\/3 · 67%/.test(r.antes)&&/ · 67%$/.test(r.sum),'acerto no padrão do app: na janela de registro, "antes 33% → 2/3 · 67%"; o % no resumo da revisão '+JSON.stringify(r));
await ev(()=>{const e=document.querySelector('.cscard .cssec');e.scrollIntoView({block:'start'});scrollBy(0,-80)});await W(150);await p.screenshot({path:'saida/consol-feito-'+w+'.png'});ok(r.chip==='✓ feita'&&/Sessão/.test(r.cur||'')&&/^3 de 18 questões/.test(r.now),'de volta: a parte fica "✓ feita", a próxima destacada, 3 de 18 '+JSON.stringify(r));
/* sessão sem caderno: na seção das questões de fora do app, digitar os acertos feitos fora */
await x.act('cstog','qx:x');await W(250);
r=await ev(()=>{const a=document.querySelector('.csac input[data-csd][name=a]'),k=a.dataset.csd,tq=document.querySelector(`.csac input[data-csd][name=t]`);a.value='7';a.dispatchEvent(new Event('input',{bubbles:true}));tq.value='10';tq.dispatchEvent(new Event('input',{bubbles:true}));consCommit('qx');render();return k});await W(300); /* digitar e registrar (o mesmo que o Registrar da sessão faz) */
r=await ev(k=>{const R=S.sessions.filter(x=>x.rid===S.rv.id&&((x.items||[])[0]||{}).tq==10),u=consUnits('qx').find(u=>u.key===k);return {done:S.rv.cons.done[k],rec:R.length,dn:!!u&&rqDn(u.k,0),chip:[...document.querySelectorAll('.cscard .cstp .csdn')].map(e=>e.textContent).join(),form:document.querySelectorAll('.cscard .csac input[data-csd]').length}},r);
ok(r.done&&r.done.ok===7&&r.rec===1&&r.dn&&/✓ registrada/.test(r.chip)&&r.form===0,'sem caderno: 7 de 10 vira registro, fica "✓ registrada" e conta na revisão por questões '+JSON.stringify(r));
/* ▶ de uma parte recolhida: abre a seção e resolve */
await x.act('cstog',await ev(()=>'qx:1'));r=await ev(()=>document.querySelectorAll('.cscard .cssec')[1].querySelectorAll('.cssess').length);ok(r===2,'tocar na 2ª revisão: abre as duas sessões com caderno');
/* cancelar desfaz o crédito na revisão por questões */
const k0=await ev(k=>{const [c,i]=k.split(':');return [qcL().find(x=>x.id===c).ses,+i]},nx);
await ev(()=>{window.confirm=()=>true});await x.act('rvcancel');await W(300);
r=await ev(([k,i])=>({rv:!!S.rv,dn:rqDn(k,i),recs:S.sessions.filter(x=>recTag(x).t==='rev. consolidação').length}),k0);ok(!r.rv&&!r.dn&&r.recs===0,'cancelar: volta ao estudo, desfaz o crédito e os registros '+JSON.stringify(r));
/* rodada */
await ev(()=>{tab='rev';ui.rvt='hoje';render()});await ev(()=>{S.set=2;save()});await x.act('csnew');r=await ev(()=>({rd:(document.querySelector('.sfb[data-id=csr]')||{}).textContent,rows:document.querySelectorAll('.csdlg .csdr').length}));ok(/Rodada 2 · atual/.test(r.rd||'')&&r.rows===0,'com duas rodadas: escolhe a rodada, começa na atual (sem questões nela) '+JSON.stringify(r));
await x.act('sdd','csr');await x.act('spick','csr:1');r=await ev(()=>({rd:(document.querySelector('.sfb[data-id=csr]')||{}).textContent,rows:document.querySelectorAll('.csdlg .csdr').length,per:document.querySelector('.csper').textContent}));ok(/Rodada 1/.test(r.rd||'')&&r.rows===1&&/^Rodada 1 inteira/.test(r.per),'rodada 1: os ciclos dela voltam a valer inteiros '+JSON.stringify(r));
await x.act('csx');await ev(()=>{S.set=1;save()});
await ev(()=>{tab='rev';ui.rvt='hoje';render()});await W(150);await x.act('info','cons');r=await ev(()=>{const d=document.querySelector('.infodlg');return d?d.textContent:''});ok(/Revisão de consolidação/.test(r)&&/atrasada/.test(r)&&/adiantá-la/.test(r)&&/rev\. consolidação/.test(r),'ⓘ da consolidação explica período, ordem e o que conta');await p.screenshot({path:'saida/consol-info-'+w+'.png'});await x.act('infox');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
