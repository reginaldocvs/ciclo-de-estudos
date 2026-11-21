/* Questões: sessão com dois tópicos, um caderno só.
   - importar: cada assunto do Gemini vai para um tópico da sessão (o app acha pelo nome; dá para trocar);
   - acrescentar: só os assuntos novos perguntam;
   - divisão: cada tópico se divide pelas revisões (30 de A + 30 de B → partes de 10 + 10);
   - janela "Revise com questões": um bloco por tópico, com as aulas (link, sem acerto antigo), Resolver só do tópico e os acertos do tópico;
     resolver preenche os acertos; o que se digita no outro tópico não se perde;
   - Registrar: um registro por tópico, os dois ligados à parte; a etiqueta da parte soma os dois;
   - caderno: lista agrupada por tópico; Editar com a seção Tópicos (fixa depois da revisão).
   Uso: node lint/qztop.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.qc;delete S0.qa;delete S0.rq;
S0.subjects.push({id:'qx',name:'Teste Q',goal:60,topics:[{id:'ta',name:'Classes Gramaticais',done:false,links:[]},{id:'tb',name:'Concordância Verbal',done:false,links:[]}]});
const mkQ=(tp,n,o)=>[...Array(n)].map((_,j)=>({numero:o+j+1,topico:tp,tipo:'CE',comando:'Julgue.',enunciado:`${tp}: item ${o+j+1}.`,gabarito:j%2?'E':'C',comentario:{por_que_certa:'Ok.'}}));
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const study=n=>ev(n=>{S.sel.subj='qx';S.sel.groups=[{id:'ga'+n,nt:'Classes Gramaticais',rows:[{id:'ra'+n,kind:'aula',name:'Aula A'+n,link:'https://exemplo.test/a'+n,q:'https://exemplo.test/questoes-a'+n}]},{id:'gb'+n,nt:'Concordância Verbal',rows:[{id:'rb'+n,kind:'aula',name:'Aula B'+n,link:''}]}];addSession(30);save();render()},n);
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};if(S.srv)S.srv.on=false;save()});await study(1);await W(150);
ok(await ev(()=>rqParts(rqSesAll('qx')[0]).length===2),'sessão 1 com dois tópicos');
/* importar pela janela: Gemini chama de "Classes de palavras" e "Concordância" */
await ev(()=>{[...document.querySelectorAll('nav [data-tab=qz]')].find(e=>e.getClientRects().length).click()});await W(200);
await x.act('qnew','qx');const k1=await ev(()=>rqSesAll('qx')[0].k);
await x.pick('qzse',k1);
await ev(j=>{const t=document.querySelector('[name=qj]');t.value=j;t.dispatchEvent(new Event('input',{bubbles:true}))},JSON.stringify([...mkQ('Classes de palavras',30,0),...mkQ('Concordância',30,30)]));await W(400);
let r=await ev(()=>[...document.querySelectorAll('#qzmap .qzmr')].map(e=>e.querySelector('.snt').textContent+'→'+e.querySelector('.sfb').textContent));
ok(r.length===2&&r[0]==='Classes de palavras (30)→Classes Gramaticais'&&r[1]==='Concordância (30)→Concordância Verbal','importar: cada assunto já vai para o tópico de nome parecido '+JSON.stringify(r));
await ev(()=>{const d=document.querySelector('.qimpdlg');d.scrollTop=d.scrollHeight});await W(150);await p.screenshot({path:'saida/qztop-importar-'+w+'.png'});
await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(300);
const cid=await ev(()=>qcL().find(c=>c.subj==='qx').id);
r=await ev(id=>{const m=qcM(id),o=qLoad(id),T=qTops(m);return qPartsOf(id).map(L=>T.map(t=>L.filter(k=>qTopOf(m,o.qs.find(q=>q.id===k),T)===t.t).length).join('+'))},cid);
ok(r.join()==='10+10,10+10,10+10','divisão: cada parte com 10 de cada tópico '+JSON.stringify(r));
/* acrescentar: assunto novo pergunta; o já conhecido não */
await x.act('qmore',cid);await ev(j=>{const t=document.querySelector('[name=qj]');t.value=j;t.dispatchEvent(new Event('input',{bubbles:true}))},JSON.stringify([...mkQ('Concordância',3,60),...mkQ('Crase',3,63)]));await W(400);
r=await ev(()=>({h:document.querySelector('#qzbh .sfb').textContent,m:[...document.querySelectorAll('#qzmap .qzmr')].map(e=>e.querySelector('.snt').textContent+'→'+e.querySelector('.sfb').textContent)}));ok(r.h==='Vários tópicos'&&r.m.join('|')==='Concordância (3)→Concordância Verbal|Crase (3)→Classes Gramaticais','acrescentar: bloco misturado vira "Vários tópicos", o assunto já conhecido segue o caderno '+JSON.stringify(r));
await x.pick('qtm-crase','tb');await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(300);
r=await ev(id=>{const m=qcM(id),o=qLoad(id),T=qTops(m);return T.map(t=>o.qs.filter(q=>qTopOf(m,q,T)===t.t).length)},cid);ok(r.join()==='30,36','Crase escolhida para Concordância Verbal: 30 e 36 '+JSON.stringify(r));
/* caderno agrupado */
r=await ev(()=>[...document.querySelectorAll('.qzgh')].map(e=>e.textContent));ok(r.length>=1&&/^Classes Gramaticais30$/.test(r[0]),'caderno: lista agrupada pelo tópico da sessão '+JSON.stringify(r));
r=await ev(()=>({g:document.querySelectorAll('.qzg').length,q:document.querySelectorAll('.qzcad .qzq').length}));ok(r.g===2&&r.q===0,'dois tópicos: os grupos começam recolhidos '+JSON.stringify(r));
r=await ev(()=>{const t=document.querySelector('.qzgt'),c=getComputedStyle(t);return {bg:c.backgroundColor,over:document.documentElement.scrollWidth>innerWidth}});ok(r.bg==='rgba(0, 0, 0, 0)'&&!r.over,'título do grupo sem fundo e a página sem rolagem lateral '+JSON.stringify(r));
await ev(()=>document.querySelector('[data-act=qgtog]').click());await W(150);r=await ev(()=>({q:document.querySelectorAll('.qzcad .qzq').length,more:!!document.querySelector('.qzg [data-act=pgmore]'),exp:document.querySelector('[data-act=qgtog]').getAttribute('aria-expanded')}));
ok(r.q===6&&r.more&&r.exp==='true','tocar no tópico: abre com 6 questões e o Mostrar mais dele '+JSON.stringify(r));
await ev(()=>document.querySelector('[data-act=qgtog]').click());await W(150);ok(await ev(()=>document.querySelectorAll('.qzcad .qzq').length===0),'tocar de novo: recolhe');
r=await ev(()=>document.querySelector('.qzrr .qzrrn .mut').textContent);ok(/\(10 \+ 12\)/.test(r),'Revisões: a parte mostra a divisão por tópico '+JSON.stringify(r));
/* sessão 2: janela com um bloco por tópico */
await study(2);await W(150);await ev(()=>{const b=document.querySelector('#undo [data-act=rqreg]');b&&b.click()});await W(300);
r=await ev(()=>[...document.querySelectorAll('[data-f=rqreg] .actp')].map(e=>({n:e.querySelector('.rvtn').textContent,aulas:e.querySelectorAll('.rqit').length,link:!!e.querySelector('.rqit a[href*="exemplo.test/a"]'),ql:!!e.querySelector('.rqit a[href*="questoes-a"]'),old:/%/.test(e.querySelector('.rqit')?.textContent||''),btn:(e.querySelector('[data-act=rqcadgo]')||{}).textContent||'',ac:e.querySelectorAll('input[name^=qa-]').length})));
ok(r.length===2&&r[0].n==='Classes Gramaticais'&&r[0].aulas===1&&r[0].link&&r[0].ql&&!r[0].old&&r[0].btn==='Resolver (10)'&&r[1].btn==='Resolver (12)'&&r.every(t=>t.ac===1),'janela: um bloco por tópico, aula com link da aula e das questões, sem acerto antigo, Resolver do tópico e um campo de acertos '+JSON.stringify(r));
await p.screenshot({path:'saida/qztop-janela-'+w+'.png'});
/* digita à mão no tópico B; resolve o A pelo app */
await ev(()=>{const f=document.querySelector('[data-f=rqreg]');for(const [n,v] of [['qa-0-1','9'],['qt-0-1','12']]){const i=f.querySelector(`[name="${n}"]`);i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}))}});
await ev(()=>document.querySelectorAll('[data-f=rqreg] [data-act=rqcadgo]')[0].click());await W(250);
r=await ev(()=>{const o=qLoad(ui.qz.cad),m=qcM(ui.qz.cad),T=qTops(m);return {n:ui.qz.ids.length,a:ui.qz.ids.every(k=>qTopOf(m,o.qs.find(q=>q.id===k),T)==='ta')}});ok(r.n===10&&r.a,'Resolver do tópico A: só as 10 de A '+JSON.stringify(r));
for(let i=0;i<10;i++){await ev(i=>{const o=qLoad(ui.qz.cad),q=o.qs.find(x=>x.id===ui.qz.ids[ui.qz.i]),g=qGab(q);qAns(i<2?(g==='C'?'E':'C'):g)},i);await ev(()=>document.querySelector('.qzd [data-act=qnext]').click())}
await ev(()=>{[...document.querySelectorAll('.qzd .btn')].find(b=>/Voltar à revisão/.test(b.textContent)).click()});await W(300);
r=await ev(()=>{const f=document.querySelector('[data-f=rqreg]'),v=n=>f.querySelector(`[name="${n}"]`).value;return {a:v('qa-0-0')+'/'+v('qt-0-0'),b:v('qa-0-1')+'/'+v('qt-0-1'),btn:[...f.querySelectorAll('.actp')].map(e=>(e.querySelector('[data-act=rqcadgo]')||{}).textContent).join('|')}});
ok(r.a==='8/10'&&r.b==='9/12'&&r.btn==='Refazer|Resolver (12)','de volta: A preenchido com 8/10; B continua com o que foi digitado (9/12) '+JSON.stringify(r));
await p.screenshot({path:'saida/qztop-resolvido-'+w+'.png'});
await ev(()=>document.querySelector('[data-f=rqreg]').requestSubmit());await W(300);
r=await ev(id=>{const R=S.sessions.filter(x=>String(x.rid||'').startsWith('rq-'));return {R:R.map(x=>x.topic+':'+x.ac+'/'+x.tq+(x.qcad?'*':'')).join(),pd:Object.keys(qcM(id).pd||{}).join(),its:R.map(x=>x.items.length).join()}},cid);
ok(r.R==='ta:8/10*,tb:9/12'&&r.pd==='0'&&r.its==='1,1','Registrar: um registro por tópico (A ligado ao caderno), aulas no registro, a parte 1 fica feita '+JSON.stringify(r));
await ev(id=>{tab='qz';ui.qcad=id;render()},cid);await W(200);
r=await ev(()=>document.querySelector('.qzrr .rqk').textContent);ok(r==='8/10 ✓','caderno: a 1ª revisão com o acerto do registro do caderno '+JSON.stringify(r));
/* Editar: Tópicos fixos depois da revisão */
await x.act('qed',cid);r=await ev(()=>{const d=document.querySelector('[data-f=qed]');return {sel:d.querySelectorAll('.sfb[data-id^=qetm-]').length,rows:[...d.querySelectorAll('.qzmap .qzmr')].map(e=>e.textContent).join('|')}});
ok(r.sel===0&&/Classes de palavras \(30\)→ Classes Gramaticais/.test(r.rows)&&/Crase \(3\)→ Concordância Verbal/.test(r.rows),'Editar: Tópicos fixos depois da revisão '+JSON.stringify(r));
await p.screenshot({path:'saida/qztop-editar-'+w+'.png',fullPage:true});await x.act('qedx');
/* outro caderno sem revisão: Tópicos com escolha, e salvar muda a divisão */
const c2=await ev(j=>{const k=rqSesAll('qx')[1].k,id=uid(),P=qParse(j);qcL().push({id,subj:'qx',ses:k,nome:'Caderno 2',n:0,ce:0,me:0,d:today()});qSave(id,{qs:P.qs});save();ui.qcad=id;render();return id},JSON.stringify(mkQ('Pronomes',4,0)));
await x.act('qed',c2);await x.pick('qetm-pronomes','tb');await ev(()=>document.querySelector('[data-f=qed]').requestSubmit());await W(200);
r=await ev(id=>{const m=qcM(id),o=qLoad(id);return o.qs.every(q=>qTopOf(m,q)==='tb')},c2);ok(r,'Editar sem revisão: troca o tópico de um assunto');
/* ▶ por tópico no caderno: resolve só as questões daquele tópico */
await ev(id=>{ui.qcad=id;render()},cid);await W(150);
await ev(()=>document.querySelector('.qzsec .qzql').scrollIntoView());await W(100);await p.screenshot({path:'saida/qztop-caderno-'+w+'.png'});
r=await ev(()=>{const b=document.querySelector('.qzgh [data-act=qtopgo]');b.click();const o=qLoad(ui.qz.cad),m=qcM(ui.qz.cad),T=qTops(m);return {n:ui.qz.ids.length,a:ui.qz.ids.every(k=>qTopOf(m,o.qs.find(q=>q.id===k),T)==='ta'),rq:!!ui.qz.rq}});
ok(r.n===30&&r.a&&!r.rq,'▶ no grupo: resolve as 30 de Classes Gramaticais (treino) '+JSON.stringify(r));await p.keyboard.press('Escape');await W(200);
/* embaralhar alternativas (múltipla escolha) */
const ME=[...Array(6)].map((_,j)=>({numero:j+1,topico:'Pronomes',tipo:'ME',enunciado:'Qual? '+j,alternativas:{A:'alfa',B:'beta',C:'gama',D:'delta',E:'épsilon'},gabarito:'B',comentario:{por_que_certa:'A alternativa B está correta.',alternativas_erradas:{A:'a letra A erra',C:'não',D:'não',E:'não'}}}));
const c3=await ev(j=>{const id=uid(),P=qParse(j);qcL().push({id,subj:'qx',nome:'ME',n:0,ce:0,me:0,d:today()});qSave(id,{qs:P.qs});save();ui.qcad=id;render();return id},JSON.stringify(ME));
await x.act('qall',c3);
r=await ev(()=>{const L=[...document.querySelectorAll('.qzme .qzo')].map(b=>({k:b.dataset.id,l:b.querySelector('.qzol').textContent,t:b.textContent.slice(1)}));return L});
const shown=r.map(o=>o.l).join(''),beta=r.find(o=>o.k==='B');ok(shown==='ABCDE'&&r.map(o=>o.k).join('')!==''&&beta&&beta.t==='beta','letras na tela seguem A–E; o conteúdo vai junto '+JSON.stringify(r.map(o=>o.l+'='+o.t)));
let mixed=0;for(let i=0;i<6;i++){const ks=await ev(()=>[...document.querySelectorAll('.qzme .qzo')].map(b=>b.dataset.id).join(''));if(ks!=='ABCDE')mixed++;
 const L=await ev(()=>document.querySelector('.qzme .qzo[data-id=B] .qzol').textContent);await p.keyboard.press(L.toLowerCase());await W(120);
 const f=await ev(()=>({ok:ui.qz.res[ui.qz.ids[ui.qz.i]].ok,pq:document.querySelector('.qzfb p').textContent,ae:[...document.querySelectorAll('.qzme .qzo')].filter(b=>b.querySelector('.qzoe')).map(b=>b.querySelector('.qzol').textContent+' '+b.querySelector('.qzoe').textContent)}));
 if(i===0)ok(f.ok&&f.pq.includes('alternativa '+L)&&f.ae.length===4&&f.ae.some(t=>t.includes('a letra '+t[0]+' erra')),'teclado: a letra da tela responde; o comentário cita a letra da tela '+JSON.stringify({L,...f}));
 await ev(()=>document.querySelector('.qzd [data-act=qnext]').click())}
ok(mixed>=3,'as alternativas mudam de lugar ('+mixed+' de 6 embaralhadas)');
await ev(()=>{[...document.querySelectorAll('.qzd .btn')].find(b=>/Voltar ao caderno/.test(b.textContent)).click()});await W(200);
await x.act('qed',c3);ok(await ev(()=>!!document.querySelector('[data-act=qmix][aria-checked=true]')),'Editar: "Embaralhar alternativas" ligado de início');await x.act('qmix',c3);await x.act('qedx');
await x.act('qall',c3);r=await ev(()=>[...document.querySelectorAll('.qzme .qzo')].map(b=>b.dataset.id).join(''));ok(r==='ABCDE','desligado: alternativas na ordem original '+r);await p.keyboard.press('Escape');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
