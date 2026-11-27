/* Simulação de Questões ao longo dos dias (com os dados reais, cópia):
   - dia 1: um caderno para cada uma de 3 disciplinas (CE e ME, comentário do professor, uma sem gabarito) e um avulso (disciplinas pelo nome, uma fora do plano);
   - todo dia: 2 a 3 baterias, no modo "a cada questão" ou "no fim" (sorteado); às vezes sai no meio; no dia seguinte, Continuar ou começa outra (descarta);
     às vezes corrige um gabarito pela bandeira;
   - revisão por questões com caderno ligado à sessão: uma sessão de estudo por dia na disciplina; quando vence uma parte, abre a janela da revisão,
     resolve a parte pelo app (modo sorteado, às vezes sai no meio e volta: o "no fim" retoma), registra; confere a parte fixada, a linha no Desempenho,
     o resultado nos acertos e as erradas das partes anteriores voltando na seguinte;
   - a cada 3 dias: monta um simulado pela janela (quantidades sorteadas, às vezes com 1 minuto de prova) e faz; às vezes deixa o tempo acabar.
   Confere todo dia: respostas guardadas (até 5 por questão, datas, certo/errado), o resultado de cada bateria no Desempenho (uma linha por bateria, sem duplicar),
   rascunhos do "no fim" só onde deve, o caderno de erros (marcador às vezes, entrada automática com 2 erros, saída com 2 acertos, regra rígida), respostas do simulado também na origem, Estatísticas sem contar duas vezes, tela de Questões sem rolagem para o lado e sem erros.
   Uso: node lint/simqz.mjs <dados.json> [dias=14] [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,ND='14',WD='390']=process.argv.slice(2);const w=+WD,ND_=+ND;let bad=0,nok=0;const fails=[];
const ok=(c,m)=>{if(c)nok++;else{bad++;fails.push(m);console.log('FALHA '+m)}};
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},ri=(a,b)=>a+Math.floor(rnd()*(b-a+1)),pick=a=>a[ri(0,a.length-1)];
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qfim;delete S0.qh;S0.rvf=null;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const adv=ms=>ev(ms=>localStorage.setItem('__fkoff',String((+(localStorage.getItem('__fkoff')||0))+ms)),ms);
const click=async(sel,wait=150)=>{const r=await ev(s=>{const e=document.querySelector(s);if(!e)return false;e.click();return true},sel);await W(wait);return r};
/* ---------- dia 1: cadernos ---------- */
const mkJ=(sn,n,dis)=>JSON.stringify(Array.from({length:n},(_,i)=>{const me=i%3===2,g=i===n-1&&sn==='0'?null:me?pick(['A','B','C','D']):pick(['C','E']);
 return {numero:i+1,disciplina:dis?dis(i):'X',topico:'Tópico '+(i%3+1),tipo:me?'ME':'CE',nivel:pick(['fácil','médio','difícil']),texto_base:null,comando:me?'Assinale.':'Julgue o item.',enunciado:`Sim ${sn} questão ${i+1}: enunciado de teste número ${i+1}.`,alternativas:me?{A:'alfa '+i,B:'beta '+i,C:'gama '+i,D:'delta '+i}:null,gabarito:g,comentario:{por_que_certa:'Porque sim.',onde_esta_o_erro:null,o_correto_e:null,alternativas_erradas:null,comentario_do_arquivo:i%4===0?'Comentário do professor '+i:null}}}));
const C=await ev(([j0,j1,j2])=>{const L=qSubs().slice(0,3),out=[];[j0,j1,j2].forEach((j,k)=>{const s=L[k%L.length],id=uid(),P=qPrev({txt:j});qcL().push({id,subj:s.id,nome:'Sim caderno '+(k+1),n:P.qs.length,ce:0,me:0,d:today()});qSave(id,{qs:P.qs});out.push(id)});save();return {cads:out,names:L.map(s=>s.name)}},[mkJ('0',8),mkJ('1',8),mkJ('2',6)]);
const avJ=mkJ('av',6,i=>i===5?'Matéria Fora do Plano':C.names[i%C.names.length].toUpperCase());
const AV=await ev(j=>{const id=uid(),P=qPrev({txt:j});qcL().push({id,subj:QAV,nome:'Avulso sim',n:P.qs.length,ce:0,me:0,d:today()});qSave(id,{qs:P.qs});save();return id},avJ);
const cads=[...C.cads,AV];
/* revisão por questões: liga, registra a 1ª sessão da disciplina do caderno 1 e liga o caderno a ela */
const RQS=await ev(c=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};const m=qcM(c),s=S.subjects.find(x=>x.id===m.subj);s.topics=s.topics||[];if(!s.topics.length)s.topics.push({id:'tsq',name:'Tópico da simulação',done:false,links:[]});
 const st=()=>{const t=s.topics[0];S.sel.subj=s.id;S.sel.groups=[{id:uid(),nt:t.name,tid:t.id,rows:[{id:uid(),kind:'aula',name:'Aula '+(S.sessions.length+1),link:''}]}];addSession(30)};st();window.__rqst=st;
 const k=qSesL(s.id)[0];m.ses=k?k.k:null;save();render();return {sid:s.id,cad:c,ses:m.ses}},C.cads[0]);
ok(!!RQS.ses,'revisão por questões: caderno 1 ligado à sessão '+JSON.stringify(RQS));
/* regra de "agora" e "atrasada" (desde 2026-11-27): a revisão é feita durante a sessão; registrada a sessão sem ela, fica atrasada.
   Confere a regra e que a aba Revisão › Questões e a Revisão de hoje dizem o mesmo que a fila */
const RQV={n:0,late:0,ag:0};
async function rqLate(day,fase){const r=await ev(async sid=>{const L=rqSes(sid),O=rqOpen(sid,L),D=rqDue(sid),c=L.length-(O.part?1:0),iv=rqIv(),bad=[];
  D.forEach(z=>z.ks.forEach(i=>{const N=z.m+iv[i],lt=N<=c||(S.rq.hold||[]).some(h=>h.k===z.o.k&&h.i===i);if(lt&&!z.late)bad.push(`sessão ${z.m} ${i+1}ª: devia estar atrasada`)}));
  if(!O.part&&!O.run&&D.some(z=>!z.late))bad.push('sem sessão em andamento, nada pode estar "agora"');
  tab='rev';ui.rvt='questoes';render();await new Promise(r=>setTimeout(r,120));
  const b=srBase({subj:sid}),card=[...document.querySelectorAll('.rqsc')].find(e=>e.textContent.includes(nm(b)));
  if(card)D.forEach(z=>{const row=[...card.querySelectorAll('.rqsr')].find(r=>r.querySelector('b')&&r.querySelector('b').textContent==='Sessão '+z.m);if(!row)return;z.ks.forEach(i=>{const k=[...row.querySelectorAll('.rqk')][i];if(!k)return;const N=z.m+iv[i],lt=N<=c||(S.rq.hold||[]).some(h=>h.k===z.o.k&&h.i===i),t=k.textContent;if(lt?!/atrasada/.test(t):!/agora/.test(t))bad.push(`aba: sessão ${z.m} ${i+1}ª mostra "${t}"`)})}); /* cada vez com a sua etiqueta: a mesma sessão pode ter uma atrasada e outra de agora */
  tab='ciclo';render();await new Promise(r=>setTimeout(r,120));
  const ln=[...document.querySelectorAll('.edrvs .edrvq')].find(e=>e.querySelector('.edrvn').textContent===nm(b)),bt=ln&&ln.closest('.edrv').querySelector('.lnk');
  if(bt&&D.length&&(D.some(z=>z.late)?bt.textContent!=='atrasada':bt.textContent!=='hoje'))bad.push(`Revisão de hoje: "${bt.textContent}"`);
  return {n:D.length,late:D.filter(z=>z.late).length,open:O,bad}},RQS.sid);
 RQV.n+=r.n;RQV.late+=r.late;RQV.ag+=r.n-r.late;ok(!r.bad.length,`dia ${day} (${fase}): revisão por questões ${r.late}/${r.n} atrasadas, aba e Revisão de hoje de acordo `+(r.bad.length?JSON.stringify(r):''));return r}
async function rqDay(day){
 /* sessão em andamento: o relógio ligado na posição da disciplina traz as revisões de agora (a meta da posição sobe só durante a conferência, para ela ficar em andamento) */
 const on=await ev(sid=>{const x=actives().find(x=>(srBase({subj:x.id})||{}).id===sid);if(!x)return null;const g0=x.goal;x.goal=prog(x.id)+60;S.sel.subj=x.id;S.timer={running:true,start:Date.now()-60000,acc:0};render();return {id:x.id,g0}},RQS.sid);
 if(on){await rqLate(day,'sessão em andamento');await ev(o=>{S.timer={running:false,start:0,acc:0};actives().find(x=>x.id===o.id).goal=o.g0;render()},on)}
 await ev(()=>{try{window.__rqst()}catch(e){}save();render()});await W(150);await rqLate(day,'sessão registrada');
 const due=await ev(sid=>rqDue(sid).map(z=>({k:z.o.k,i:z.i})),RQS.sid);const mine=due.filter(z=>z.k===RQS.ses);if(!mine.length)return;
 const i=mine[0].i,ck0=await ev(([c,i])=>{const m=qcM(c),T=qTops(m);return `${c}:${i}:${T[0]?T[0].t:''}`},[RQS.cad,i]);
 const prevW=await ev(([c,i])=>{const P=qPartsOf(c);return P.slice(0,i).flat().filter(id=>{const l=qLast(c,id);return l&&!l.ok})},[RQS.cad,i]);
 await ev(sid=>{tab='rev';ui.rqreg=sid;ui.qz=null;render()},RQS.sid);await W(250);
 const go=()=>ev(ck=>{const b=[...document.querySelectorAll('[data-act=rqcadgo]')].find(b=>b.dataset.id===ck);if(!b)return false;b.click();return true},ck0);
 if(!await go()){ok(false,`dia ${day}: janela da revisão sem "Resolver" para a parte ${i+1}`);await ev(()=>{ui.rqreg=null;render()});return}await W(250);
 const ids=await ev(()=>ui.qz?ui.qz.ids.slice():[]);ok(prevW.every(id=>ids.includes(id)),`dia ${day}: ${i+1}ª revisão traz as ${prevW.length} erradas das partes anteriores`);
 const fim=rnd()<0.5;if(await ev(()=>!!document.querySelector('.qzgm [data-act=qzfim]')))await click(`.qzgm [data-act=qzfim][data-id="${fim?1:0}"]`);const F=await ev(()=>!!ui.qz.fim);
 let n=ids.length,quit=F&&n>1&&rnd()<0.4,an=0;
 for(let j=0;j<n;j++){await ev(j=>{ui.qz.i=j;render()},j);await answer();an++;
  if(quit&&j===0){await click('[data-act=qzx]',200);await ev(sid=>{ui.rqreg=sid;render()},RQS.sid);await W(200);await go();await W(250);
   const r=await ev(()=>({fim:!!ui.qz.fim,ans:Object.keys(ui.qz.ans||{}).length}));ok(r.fim&&r.ans===1,`dia ${day}: revisão "no fim": sair e voltar retoma com a resposta marcada `+JSON.stringify(r));quit=false}}
 if(F){await ev(()=>{ui.qz.i=ui.qz.ids.length-1;render()});await click('.qznav [data-act=qzent]',250);if(await ev(()=>!!document.querySelector('.qzentq')))await click('[data-act=qzentok]',250)}
 else{await ev(()=>{ui.qz.i=ui.qz.ids.length-1;render()});await click('.qznav [data-act=qnext]',250)}
 const r0=await recs(RQS.cad);await click('[data-act=qzx]',250);
 const res=await ev(ck=>(ui.rqcad||{})[ck]||null,ck0);ok(!!res,`dia ${day}: resultado da parte ${i+1} esperando na janela `+JSON.stringify(res));
 await ev(sid=>{ui.rqreg=sid;render()},RQS.sid);await W(200);
 const fv=await ev(([k,i])=>{const pre=k+'|'+i+'|',A=[...document.querySelectorAll('[data-f=rqreg] input[name^="qa-"]')].find(e=>(e.dataset.rk||'').startsWith(pre)),T=[...document.querySelectorAll('[data-f=rqreg] input[name^="qt-"]')].find(e=>(e.dataset.rk||'').startsWith(pre));return {a:A&&A.value,t:T&&T.value}},[RQS.ses,i]);
 if(res)ok(+fv.a===res.ok&&+fv.t===res.a,`dia ${day}: o resultado do caderno preenche os acertos da revisão `+JSON.stringify({fv,res}));
 await ev(()=>document.querySelector('[data-f=rqreg]').requestSubmit());await W(400);
 const R=await ev(([c,i,ck])=>{const m=qcM(c),H=((S.qh||{})[c]||[]);return {pd:!!(m.pd&&m.pd[i]),pend:!!(ui.rqcad||{})[ck],rec:H.filter(r=>r.k==='rq'&&r.p===i).length,ses:S.sessions.some(x=>x.qcad===c&&(x.qpart==null||+x.qpart===i)),open:!!ui.rqreg}},[RQS.cad,i,ck0]);
 ok(R.pd&&!R.pend&&R.rec>=1&&R.ses,`dia ${day}: ${i+1}ª revisão registrada: parte fixada, linha "${i+1}ª revisão" no Desempenho, registro ligado ao caderno `+JSON.stringify(R));
 await ev(()=>{ui.rqreg=null;tab='qz';render()});await W(150)}
/* ---------- uma bateria pelo resolver ---------- */
const answer=()=>ev(pr=>{const z=ui.qz,o=qLoad(z.cad),q=o.qs.find(x=>x.id===z.ids[z.i]),G=qGab(q);const ks=q.t==='CE'?['C','E']:Object.keys(q.al);const k=!G||Math.random()<pr?(G||'C'):ks.filter(x=>x!==G)[0];qAns(k)},0.7);
const recs=c=>ev(c=>((S.qh||{})[c]||[]).length,c);
async function battery(cad,{fim,quit,fix,cont}){const r0=await recs(cad);
 await ev(c=>{tab='qz';ui.qcad=c;ui.qz=null;render()},cad);await W(150);
 if(cont){await click('.qzdr [data-act=qzcont]',250)}else{await click(`[data-act=qall][data-id="${cad}"]`,250)}
 const st=await ev(()=>ui.qz?{n:ui.qz.ids.length,i:ui.qz.i,fim:!!ui.qz.fim,sel:!!document.querySelector('.qzgm [data-act=qzfim]')}:null);if(!st)return {skip:1};
 if(!cont&&st.sel&&st.fim!==fim){await click(`.qzgm [data-act=qzfim][data-id="${fim?1:0}"]`)}
 const F=await ev(()=>!!ui.qz.fim);let ans=0;
 for(let i=st.i;i<st.n;i++){await ev(i=>{ui.qz.i=i;render()},i);if(rnd()<0.88){await answer();ans++;if(!F&&rnd()<0.08){await click('.qzd [data-act=qerrm]',80);ERV.man++}if(fix&&i===st.i&&!F){await click('.qzd [data-act=qfix]');await ev(()=>{const L=[...document.querySelectorAll('.qzd [data-act=qfixset].g')];if(L.length)L[0].click()});await W(150)}}
  if(quit&&i===st.i+1){await click('[data-act=qzx]',200);return {quit:1,F,ans}}}
 if(F){await ev(()=>{ui.qz.i=ui.qz.ids.length-1;render()});await click('.qznav [data-act=qzent]',200);if(await ev(()=>!!document.querySelector('.qzentq')))await click('[data-act=qzentok]',250)}
 else{await ev(()=>{ui.qz.i=ui.qz.ids.length-1;render()});await click('.qznav [data-act=qnext]',250)}
 const done=await ev(()=>!!(ui.qz&&ui.qz.done));await click('[data-act=qzx]',200);const r1=await recs(cad);
 return {done,F,ans,dr:r1-r0}}
/* ---------- simulado pela janela ---------- */
async function simulado(day){await ev(()=>{tab='qz';ui.qcad=null;ui.qz=null;render()});await W(150);
 if(!await click('[data-act=qsim]',250)){ok(false,`dia ${day}: sem "+ Simulado"`);return null}
 const G=await ev(()=>[...document.querySelectorAll('.qsimdlg input[data-g]')].map(e=>({g:e.dataset.g,max:+(e.closest('.qsimr').querySelector('.qsimd').textContent.replace(/\D/g,''))})));
 for(const g of G){const n=ri(0,Math.min(4,g.max));if(n)await x.fill(`.qsimdlg input[data-g="${g.g}"]`,String(n))}
 await click(`[data-act=qsimpol][data-id=${pick(['rand','new','wrong'])}]`);await click(`[data-act=qsimord][data-id=${pick(['grp','mix'])}]`);
 const tl=rnd()<0.5;if(tl)await x.fill('.qsimdlg [name=qstl]','1');
 const before=await ev(()=>qcL().filter(c=>c.sim).length);await ev(()=>document.querySelector('[data-f=qsim]').requestSubmit());await W(350);
 const sim=await ev(n=>qcL().filter(c=>c.sim).length>n?ui.qcad:null,before);
 if(!sim){const tot=await ev(()=>($('qsimt')||{}).textContent||'');ok(/^0 /.test(tot),`dia ${day}: simulado não montado com ${tot}`);await click('[data-act=qsimx]');return null}
 const sq=await ev(s=>qLoad(s).qs.map(q=>({src:q.src,sd:q.sd})),sim);ok(sq.every(q=>q.src&&q.src.length===2&&q.sd),`dia ${day}: questões do simulado com origem e disciplina`);
 /* fazer: às vezes o tempo acaba */
 const r0=await recs(sim);await click(`[data-act=qall][data-id="${sim}"]`,300);
 ok(await ev(()=>!!(ui.qz&&ui.qz.fim)),`dia ${day}: simulado começa em "no fim" (ou na escolha lembrada)`);
 if(tl&&rnd()<0.5){await answer();await adv(70000);await W(1800);ok(await ev(()=>!!(ui.qz&&ui.qz.done&&ui.qz.sub)),`dia ${day}: tempo esgotado entrega o simulado`)}
 else{const n=await ev(()=>ui.qz.ids.length);for(let i=0;i<n;i++){await ev(i=>{ui.qz.i=i;render()},i);await answer()}await ev(()=>{ui.qz.i=ui.qz.ids.length-1;render()});await click('.qznav [data-act=qzent]',200);if(await ev(()=>!!document.querySelector('.qzentq')))await click('[data-act=qzentok]',250)}
 const rs=await ev(()=>({res:!!document.querySelector('.qzd .qzres'),by:document.querySelectorAll('.qsrr').length}));ok(rs.res&&rs.by>=1,`dia ${day}: resultado do simulado com "Por disciplina" `+JSON.stringify(rs));
 await click('[data-act=qzx]',200);ok((await recs(sim))===r0+1,`dia ${day}: uma linha nova no Desempenho do simulado`);
 return sim}
/* ---------- caderno de erros (desde 2026-11-27) ----------
   todo dia: o conteúdo é o conjunto das marcadas (guardada ou automática); automática só com 2+ erros e menos de 2 acertos seguidos;
   fora do caderno só com menos de 2 erros, ou porque saiu (regra rígida: o próximo erro a traz de volta); topo dos Avulsos sem lixeira; fora das Estatísticas */
const ERV={man:0,auto:0,out:0,back:0,n:0};let errPrev={};
async function errDay(day){await ev(()=>{tab='qz';ui.qcad=null;ui.qz=null;render()});await W(150);
 const r=await ev(prev=>{const E=qErr(),m=qErrM(),bad=[],K=Object.keys(E.q).filter(k=>qErrIn(E.q[k]));const o=m&&qLoad(m.id),have=new Set((o?o.qs:[]).map(q=>q.src.join('|')));
  K.forEach(k=>{const [c]=k.split('|');if(qcM(c)&&qLoad(c)&&!have.has(k))bad.push('marcada fora do caderno: '+k)});have.forEach(k=>{if(!qErrIn(E.q[k]))bad.push('no caderno sem marca: '+k)});
  Object.entries(E.q).forEach(([k,x])=>{if(x.a&&(x.e||0)<E.n)bad.push('automática com '+x.e+' erros');if(x.a&&(x.h||0)>=E.k)bad.push('automática com '+x.h+' acertos seguidos');if(!x.a&&!x.m&&!x.o&&(x.e||0)>=E.n)bad.push('não entrou com '+x.e+' erros: '+k)});
  const row=document.querySelector('.qzav .qzr');if(m&&m.n&&!(row&&/^Caderno de erros/.test(row.innerText)&&!row.querySelector('[data-act=qdel]')))bad.push('não está no topo dos Avulsos (sem lixeira)');
  const st={auto:0,out:0,back:0};Object.entries(E.q).forEach(([k,x])=>{const p=prev[k]||{};if(x.a&&!p.a){st.auto++;if(p.o)st.back++}if(p.a&&!x.a&&x.o)st.out++});
  return {bad,n:m?m.n:0,st,snap:JSON.parse(JSON.stringify(E.q))}},errPrev);
 errPrev=r.snap;ERV.auto+=r.st.auto;ERV.out+=r.st.out;ERV.back+=r.st.back;ERV.n=r.n;
 ok(!r.bad.length,`dia ${day}: caderno de erros com ${r.n} questões `+r.bad.slice(0,3).join(' | '));
 if(r.n&&rnd()<0.5){const em=await ev(()=>qErrM().id);const b2=await battery(em,{fim:rnd()<0.3});if(!b2.skip)ok(b2.done,`dia ${day}: bateria no caderno de erros termina `+JSON.stringify(b2))}}
/* ---------- conferências do dia ---------- */
async function check(day){const R=await ev(()=>{const out=[],td=today();qcL().forEach(m=>{const o=qLoad(m.id);if(!o){out.push('sem conteúdo: '+m.nome);return}const A=(S.qa||{})[m.id]||{},ids=new Set(o.qs.map(q=>q.id));
  Object.entries(A).forEach(([qid,L])=>{if(!ids.has(qid)&&!m.err)out.push(`${m.nome}: resposta de questão que não existe`);if(L.length>5)out.push(`${m.nome}: mais de 5 respostas guardadas`);L.forEach(e=>{if(!e.d||e.d>td)out.push(`${m.nome}: resposta com data ${e.d}`);if(typeof e.ok!=='boolean')out.push(`${m.nome}: resposta sem certo/errado`)})});
  const z=qSum(m.id);if(z.a>z.n||z.ok>z.a)out.push(`${m.nome}: soma ${JSON.stringify(z)}`);
  ((S.qh||{})[m.id]||[]).forEach(r=>{if(!(r.a>=1&&r.ok<=r.a&&r.a<=r.n))out.push(`${m.nome}: linha do desempenho ${JSON.stringify(r)}`)});
  if(m.sim||m.err)o.qs.forEach(q=>{const L=(A[q.id]||[]);if(!L.length)return;const e=L[L.length-1],LO=(((S.qa||{})[q.src[0]]||{})[q.src[1]]||[]);if(qcM(q.src[0])&&!LO.some(x=>(m.err?x.er:x.sim)&&x.d===e.d&&x.r===e.r)&&LO.length<5)out.push(`${m.nome}: resposta não chegou à origem`)})});
  Object.keys(S.qzp||{}).forEach(k=>{if(!qcM(k.split('|')[0]))out.push('rascunho de caderno que não existe: '+k)});
  /* Estatísticas: cada resposta dos avulsos e simulados conta uma vez (a cópia na origem, marcada sim, não conta); o caderno de erros conta pela origem (marcada er) */
  let esp=0;qcL().filter(m=>qIsAv(m)&&!m.err).forEach(m=>{const o=qLoad(m.id),A=(S.qa||{})[m.id]||{};(o?o.qs:[]).forEach(q=>{const s=(q.ss&&S.subjects.find(x=>x.id===q.ss&&!x.of&&!gone(x)))||qAvSubj(q.dis);if(!s)return;(A[q.id]||[]).forEach(e=>{if(e.ok!=null&&!e.sim)esp++})})});
  const got=qAvRes('0000-00-00',td).reduce((a,z)=>a+z.t,0);if(got!==esp)out.push(`Estatísticas dos avulsos: ${got} contadas, esperado ${esp}`);
  return out});
 R.forEach(m=>ok(false,`dia ${day}: ${m}`));if(!R.length)nok++;
 /* telas */
 await ev(()=>{tab='qz';ui.qcad=null;ui.qz=null;render()});await W(200);ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),`dia ${day}: aba Questões sem rolagem para o lado`);
 for(const c of await ev(()=>qcL().map(c=>c.id))){await ev(c=>{ui.qcad=c;render()},c);await W(80);const v=await ev(c=>({h:document.documentElement.scrollWidth<=innerWidth,rows:document.querySelectorAll('.qzhr').length,more:!!document.querySelector('.qzhs [data-act]')}),c);if(!v.h)ok(false,`dia ${day}: caderno com rolagem para o lado`);if(v.rows>6&&!v.more)ok(false,`dia ${day}: Desempenho com ${v.rows} linhas sem "Mostrar mais"`)}
 await ev(()=>{tab='st';render()});await W(200);ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),`dia ${day}: Estatísticas sem rolagem para o lado`);
 if(errs.length){ok(false,`dia ${day}: erros de script `+errs.slice(0,2).join(' | '));errs.length=0}}
/* ---------- os dias ---------- */
let pend=null;
for(let day=1;day<=ND_;day++){
 if(pend){const cont=rnd()<0.6,r=await battery(pend,{fim:true,cont});if(cont)ok(r.done&&r.dr===1,`dia ${day}: Continuar a bateria "no fim" e entregar registra uma linha `+JSON.stringify(r));else ok(await ev(c=>!(S.qzp||{})[c+'|cad'],pend),`dia ${day}: começar outra bateria descarta a não entregue`);pend=null}
 const nb=ri(2,3);for(let k=0;k<nb;k++){const cad=pick(cads),fim=rnd()<0.5,quit=fim&&rnd()<0.3,fix=!fim&&rnd()<0.25;if(cad===pend)pend=null;const r=await battery(cad,{fim,quit,fix});
  if(r.quit){const d=await ev(c=>!!(S.qzp||{})[c+'|cad'],cad);if(r.F&&r.ans)ok(d,`dia ${day}: sair no meio do "no fim" guarda o rascunho`);if(d)pend=cad}
  else if(!r.skip){const ag=r.ans>0;ok(r.done&&(ag?r.dr<=1:r.dr===0),`dia ${day}: bateria ${fim?'no fim':'a cada questão'} termina com no máximo uma linha no Desempenho `+JSON.stringify(r))}}
 await rqDay(day);
 if(day%3===0)await simulado(day);
 await errDay(day);
 await check(day);
 console.log(`dia ${day}: ok ${nok}, falhas ${bad}`);
 await adv(86400000);await ev(()=>render());await W(200)}
const fin=await ev(()=>({cad:qcL().length,sim:qcL().filter(c=>c.sim).length,resp:Object.values(S.qa||{}).reduce((a,o)=>a+Object.values(o).reduce((b,L)=>b+L.length,0),0),linhas:Object.values(S.qh||{}).reduce((a,L)=>a+L.length,0)}));
console.log('fim: '+JSON.stringify(fin));console.log('revisão por questões vista: '+JSON.stringify(RQV));console.log('caderno de erros visto: '+JSON.stringify(ERV));if(!ERV.auto||!ERV.out||!ERV.man){bad++;console.log('FALHA a simulação não passou por entrada automática, saída e marcador '+JSON.stringify(ERV))}if(!RQV.late||!RQV.ag){bad++;console.log('FALHA a simulação não passou por revisões "agora" e "atrasada" '+JSON.stringify(RQV))}console.log(bad?`FALHA ${bad} conferências falharam`:`OK    ${nok} conferências`);
await p.screenshot({path:'saida/simqz-'+w+'.png',fullPage:true});await b.close();process.exit(bad?1:0);
