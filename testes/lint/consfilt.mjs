/* Revisão de consolidação: filtros da janela. Disciplina desmarcada, Todas, Intervalo de sessões, Tópicos (só os com questões; 6 e "Mostrar mais"),
   "Só as resolvidas", acerto até X%, o contador (zero desliga Iniciar) e a revisão começa só com o escolhido. Sem vazar nem quebrar nomes.
   Uso: node lint/consfilt.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.qc;delete S0.qa;delete S0.rq;delete S0.rv;S0.mode='study';
const TN=['Tópico Um','Tópico Dois','Tópico Três','Tópico Quatro','Tópico Cinco','Tópico Seis','Tópico Sete com um nome bem comprido para cortar'];
S0.subjects.push({id:'qx',name:'Teste Q',goal:60,topics:TN.map((n,i)=>({id:'t'+(i+1),name:n,done:false,links:[]}))});
S0.subjects.push({id:'qy',name:'Outra Disciplina',goal:60,topics:[{id:'u1',name:'Assunto Y',done:false,links:[]}]});
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const study=(sj,n,t)=>ev(([sj,n,t])=>{S.sel.subj=sj;S.sel.groups=[{id:'g'+n,nt:t,rows:[{id:'r'+n,kind:'aula',name:'Aula '+n,link:'https://exemplo.test/aula'+n,q:'https://exemplo.test/questoes'}]}];addSession(30);ui.rqreg=null;save();render()},[sj,n,t]);
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};save()});
/* Teste Q: 8 sessões, 7 tópicos (o Um duas vezes); Outra Disciplina: 1 sessão */
const ord=[0,1,2,3,4,5,6,0];for(let i=0;i<ord.length;i++)await study('qx',i+1,TN[ord[i]]);await study('qy',99,'Assunto Y');await W(150);
/* um caderno de 6 questões por sessão, no tópico dela; acerto: Um 40%, Dois 90%; 3 questões resolvidas no caderno da sessão 1 */
await ev(([TN,ord])=>{const Q=t=>JSON.stringify([...Array(6)].map((_,j)=>({numero:j+1,topico:t,tipo:'CE',enunciado:'Item '+(j+1),gabarito:'C'})));
 rqSesAll('qx').forEach((o,i)=>{const id=uid();qcL().push({id,subj:'qx',ses:o.k,nome:'Caderno '+(i+1),n:0,ce:0,me:0,d:today()});qSave(id,{qs:qParse(Q(TN[ord[i]])).qs})});
 const y=rqSesAll('qy')[0],iy=uid();qcL().push({id:iy,subj:'qy',ses:y.k,nome:'Caderno Y',n:0,ce:0,me:0,d:today()});qSave(iy,{qs:qParse(Q('Assunto Y')).qs});
 const acc={t1:[4,10],t2:[9,10]};S.sessions.forEach(s=>{const v=acc[s.topic];if(v&&s.items&&s.items[0]){s.items[0].tq=v[1];s.items[0].ac=v[0]}});
 const c1=qcL().find(c=>c.nome==='Caderno 1'),L=qLoad(c1.id).qs;S.qa=S.qa||{};S.qa[c1.id]={};L.slice(0,3).forEach((q,j)=>{S.qa[c1.id][q.id]=[{ok:j>0,d:today()}]});CU=null;save();render()},[TN,ord]);
await ev(()=>{tab='rev';ui.rvt='hoje';render()});await W(200);await x.act('csnew');
const st=()=>ev(()=>{const D=document.querySelector('.csdlg');const rows=[...D.querySelectorAll('.csdr')].map(r=>({n:r.querySelector('.csdh .snt').textContent,c:r.querySelector('.csdn').textContent,on:r.querySelector('[data-csk]').checked}));
 return {rows,tot:(D.querySelector('.cstot')||{}).textContent||'',go:!D.querySelector('[data-act=csgo]').disabled,tops:[...D.querySelectorAll('.cspi .snt')].map(e=>e.textContent),more:(D.querySelector('.cspk .pgm')||{}).textContent||'',hint:!!D.querySelector('.cspk .qzhint'),per:(D.querySelector('.csper')||{}).textContent}});
const qn=t=>+((t.match(/(\d+) quest/)||[])[1]||-1);
let r=await st();
ok(r.rows.length===2&&r.rows.every(o=>o.on)&&qn(r.rows[0].c+r.rows[1].c)>=0&&/Vão entrar 54 questões do app e 30 questões externas de 2 disciplinas/.test(r.tot)&&r.go,'abre com as duas disciplinas marcadas, todas as sessões, e o total '+JSON.stringify(r));
ok(/^Do Ciclo|^Todos os ciclos|^Só o Ciclo/.test(r.per),'período: frase do que entra '+JSON.stringify(r.per));
await p.screenshot({path:'saida/consfilt-janela-'+w+'.png'});
/* desmarcar uma disciplina */
await ev(()=>document.querySelector('[data-csk=qy]').click());r=await st();
ok(/Vão entrar 48 questões do app e 30 questões externas de 1 disciplina\b/.test(r.tot)&&!r.rows.find(o=>o.n==='Outra Disciplina').on,'desmarcar Outra Disciplina: sai do total '+JSON.stringify(r.tot));
/* Tópicos */
await x.act('csm','qx:top');r=await st();
ok(r.tops.length===6&&/Mostrar mais/.test(r.more)&&r.hint&&/Nenhuma questão/.test(r.tot)&&!r.go,'Tópicos: 6 tópicos, Mostrar mais, aviso para marcar; nada marcado: contador zero e Iniciar desligado '+JSON.stringify(r));
await x.act('pgmore','cst-qx');r=await st();ok(r.tops.length===7&&r.tops.indexOf('Tópico Um')===0,'Mostrar mais: os 7 tópicos, um por nome (Um aparece uma vez) '+JSON.stringify(r.tops));
const um=await ev(()=>document.querySelector('.cspi').textContent);ok(/2 sessões · 12 questões/.test(um),'Tópico Um: 2 sessões e 12 questões '+JSON.stringify(um));
await ev(()=>document.querySelector('[data-cst="qx|t1"]').click());r=await st();
ok(/Vão entrar 12 questões do app e 20 questões externas de 1 disciplina\b/.test(r.tot)&&r.go&&!r.hint,'marcar Tópico Um: 12 questões, Iniciar ligado '+JSON.stringify(r.tot));
const geo=await ev(()=>{const D=document.querySelector('.csdlg'),d=D.getBoundingClientRect();return {sw:document.documentElement.scrollWidth,iw:innerWidth,out:[...D.querySelectorAll('*')].filter(e=>{const z=e.getBoundingClientRect();return z.width&&z.right>d.right+1}).length,
 tall:[...D.querySelectorAll('.cspi .snt,.csdh .snt')].filter(e=>e.getBoundingClientRect().height>30).length,cut:[...D.querySelectorAll('.cspi .snt')].some(e=>e.scrollWidth>e.clientWidth&&e.title.length>20),
 box:(()=>{const l=D.querySelector('.cspi'),i=l.querySelector('input').getBoundingClientRect(),n=l.querySelector('.snt').getBoundingClientRect();return Math.abs((i.top+i.height/2)-(n.top+n.height/2))})()}});
ok(geo.sw<=geo.iw&&!geo.out&&!geo.tall&&geo.box<=3,'nada vaza, nomes numa linha só, caixa de marcar na altura da 1ª linha '+JSON.stringify(geo));
await ev(()=>document.querySelector('.cspk').scrollIntoView({block:'center'}));await p.screenshot({path:'saida/consfilt-topicos-'+w+'.png'});
/* Intervalo: sessões 2 a 3 */
await x.act('csm','qx:rng');await x.act('sdd','csqa-qx');await x.act('spick','csqa-qx:2');await x.act('sdd','csqb-qx');await x.act('spick','csqb-qx:3');r=await st();
const lbl=await ev(()=>document.querySelector('.sfb[data-id="csqa-qx"]').textContent);
ok(/Vão entrar 12 questões/.test(r.tot)&&/^Sessão 2 · \d\d\/\d\d · Tópico Dois$/.test(lbl),'Intervalo da sessão 2 à 3: 12 questões; a lista mostra número, data e tópico '+JSON.stringify([r.tot,lbl]));
/* acerto até 70%: só o Tópico Um (40%); o Dois (90%) e os sem acerto saem */
await x.act('csm','qx:all');await x.act('csacc');r=await st();
ok(/Vão entrar 12 questões/.test(r.tot),'acerto até 70%: só os tópicos com acerto conhecido até 70% (Um) '+JSON.stringify(r.tot));
await x.act('csstep','5');await x.act('csstep','5');await x.act('csstep','5');await x.act('csstep','5');r=await st();
ok(/Vão entrar 18 questões/.test(r.tot)&&await ev(()=>document.querySelector('[data-csv]').value==='90'),'subir para 90%: entra também o Dois '+JSON.stringify(r.tot));
await x.act('csacc');
/* só as resolvidas: 3 questões do caderno da sessão 1 */
await x.act('csf','done');r=await st();ok(/Vão entrar 3 questões do app e 30 questões externas de 1 disciplina\b/.test(r.tot),'Só as resolvidas: só as 3 já respondidas '+JSON.stringify(r.tot));
await x.act('csf','err');r=await st();ok(/Vão entrar 1 questão do app e 30 questões externas de 1 disciplina\b/.test(r.tot),'Só as que errei: 1 do app e as externas com pelo menos um erro (4/10 e 9/10) '+JSON.stringify(r.tot));
/* a errada do caderno é refeita e acertada: sai da última vez; "Incluir erros anteriores" traz de volta; uma externa corrigida (10/10 depois de 4/10) também */
ok(await ev(()=>!!document.querySelector('.csdlg [data-act=csea]')&&document.querySelector('.csdlg [data-act=csea]').getAttribute('aria-checked')==='false'),'com "Só as que errei": aparece "Incluir erros anteriores", desligada');
await ev(()=>{const c1=qcL().find(c=>c.nome==='Caderno 1'),q=qLoad(c1.id).qs[0];S.qa[c1.id][q.id].push({ok:true,d:today()});
 S.sessions.filter(s=>s.topic==='t1'&&s.items&&s.items[0]).forEach(s=>{s.items[0].ac=10});const s=S.sessions.find(s=>s.topic==='t1'&&s.items&&s.items[0]);
 S.sessions.push({...s,id:uid(),ses:uid(),items:[{...s.items[0],ac:4,tq:10}],date:addD(today(),-30)});CU=null;save();render()});await W(200);
r=await st();ok(/Vão entrar 10 questões externas de 1 disciplina\b/.test(r.tot),'última vez: a do caderno e o Tópico Um (agora 10/10) saem '+JSON.stringify(r.tot));
await x.act('csea');r=await st();ok(/Vão entrar 1 questão do app e 30 questões externas de 1 disciplina\b/.test(r.tot)&&await ev(()=>document.querySelector('.csdlg [data-act=csea]').getAttribute('aria-checked')==='true'),'Incluir erros anteriores: voltam a do caderno e o Tópico Um '+JSON.stringify(r.tot));
await x.act('csea');
await x.act('csf','all');
ok(await ev(()=>!document.querySelector('.csdlg [data-act=csea]')),'com "Todas": a opção some');
/* começar com Tópicos › Um: a revisão só tem o Um */
await x.act('csm','qx:top');await x.act('csgo');await W(300);
r=await ev(()=>({rv:!!(S.rv&&S.rv.cons),sel:S.rv&&S.rv.cons.sel&&S.rv.cons.sel.qx,tks:uniq(consUnits('qx').map(u=>u.tk)),y:consUnits('qy').length,lbl:S.rv&&S.rv.lbl}));
ok(r.rv&&r.tks.join()==='t1'&&r.y===0&&r.sel&&r.sel.m==='top','Iniciar: a revisão guarda as escolhas e só tem o Tópico Um, sem Outra Disciplina '+JSON.stringify(r));
await ev(()=>{window.confirm=()=>true});await x.act('rvcancel');await W(200);
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
