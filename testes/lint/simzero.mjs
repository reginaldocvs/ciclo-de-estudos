/* Simulação completa do zero, como uma pessoa usaria:
   boas-vindas → plano com 8 disciplinas (8 tópicos cada) → ponto de revisão no meio do ciclo → liga as revisões.
   Rodada 1: 6 ciclos com revisão por grupos + por tópico + por sessões.  Rodada 2: 6 ciclos com revisão por ciclos (a cada 2) + tópico + sessões.
   Por dia: 2 sessões na ordem do ciclo; cada uma com 1 tópico (às vezes 2) e 2 a 4 aulas/questões com acertos, metade pelo foco (cronômetro)
   e metade por "Registrar". Antes de estudar: revisões por tópico do dia, Para refazer (nova tentativa ou dispensar), atrasadas da revisão
   por sessões; no dia em que um grupo fica disponível, revisa o grupo; ciclo de revisão em 2 dias. No fim: Histórico (editar, excluir,
   desfazer, filtro), Estatísticas, Calendário, Planos e todas as abas. Confere regras a cada passo e a cada dia.
   REP=1: disciplinas repetidas no ciclo (Português 3 vezes, Direito Constitucional 2) e dois pontos de revisão, como num plano real.
   Uso: [REP=1] node lint/simzero.mjs <saída> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD='390']=process.argv.slice(2);const w=+WD;fs.mkdirSync(OUT,{recursive:true});
const log=[],ok=(c,m)=>{log.push((c?'OK    ':'FALHA ')+m);if(!c)console.log('FALHA '+m)},info=m=>{log.push('      '+m)};
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const {b,p,errs}=await open({w,h:w<500?844:860});const x=mk(p);
const ev=(f,...a)=>x.ev(f,...a);
const tabTo=async(t,sub)=>{await ev(t=>{const e=document.querySelector(`nav [data-tab=${t}]`);e&&e.click()},t);await W(250);if(sub){await ev(s=>{const e=document.querySelector(`[data-act=rvt][data-id=${s}]`);e&&e.click()},sub);await W(250)}};
let n=0;const shot=async(nm,full)=>{n++;await ev(()=>scrollTo(0,0));await p.screenshot({path:`${OUT}/${String(n).padStart(2,'0')}-${nm}.png`,fullPage:!!full})};
const shotOnce=new Set(),once=async nm=>{if(shotOnce.has(nm))return;shotOnce.add(nm);await shot(nm)};
const vis=a=>ev(a=>{const e=[...document.querySelectorAll(`[data-act=${a}]`)].filter(e=>e.offsetParent).pop();if(e)e.click();return !!e},a);
const fillAc=async()=>{let c=0;for(let i=0;i<60;i++){const r=await ev((i,s)=>{const rows=[...document.querySelectorAll('#modal .acrow')].filter(e=>e.offsetParent);const row=rows[i];if(!row)return null;const qa=row.querySelector('input[data-qa],input[name^=qa]'),qt=row.querySelector('input[data-qt],input[name^=qt]');if(!qa||!qt)return true;let k=s;const rn=()=>{k=(k*16807)%2147483647;return k/2147483647};
  const set=(e,v)=>{e.focus();e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))};const tq=+qt.value||5+Math.floor(rn()*6);set(qt,tq);set(qa,Math.round(tq*(.45+rn()*.55)));return true},i,ri(1,1e6));if(!r)break;c++;await W(40)}return c};
const st={copia:0,dias:0,estudo:0,foco:0,manual:0,dois:0,itens:0,questoes:0,blocos:0,topicos:0,grupos:0,ciclosRev:0,sessoes:0,sessPul:0,sessMk:0,atras:0,refazer:0,dispensa:0,dupla:0};

/* ===== 1. do zero: boas-vindas, plano, 8 disciplinas com 8 tópicos ===== */
const PLAN=[['Português',['Crase','Regência','Concordância','Pontuação','Colocação pronominal','Interpretação','Ortografia','Semântica']],
 ['Direito Constitucional',['Princípios fundamentais','Direitos fundamentais','Nacionalidade','Direitos políticos','Organização do Estado','Poder Legislativo','Poder Executivo','Poder Judiciário']],
 ['Direito Administrativo',['Princípios','Atos administrativos','Poderes','Licitações','Contratos','Servidores públicos','Improbidade','Responsabilidade civil']],
 ['Raciocínio Lógico',['Proposições','Tabela-verdade','Equivalências','Argumentos','Conjuntos','Contagem','Probabilidade','Sequências']],
 ['Informática',['Hardware','Windows','Word','Excel','Redes','Internet','Segurança','Nuvem']],
 ['Direito Penal',['Aplicação da lei penal','Crime','Tipicidade','Ilicitude','Culpabilidade','Concurso de pessoas','Penas','Crimes contra a pessoa']],
 ['Atualidades',['Economia','Política','Meio ambiente','Tecnologia','Saúde','Educação','Segurança pública','Relações internacionais']],
 ['Ética no Serviço Público',['Código de Ética','Decreto 1.171','Lei 8.112 (deveres)','Conflito de interesses','Lei de Acesso','Assédio','Comissões de ética','Casos práticos']]];
await x.txt('Usar só neste aparelho');await x.txt('Monte seu plano');
for(const [nm,tops] of PLAN){await x.txt('+ Nova disciplina');await x.fill('#modal input[name=n]',nm);await x.submit('#modal form');
 const sid=await ev(n=>S.subjects.find(s=>s.name===n).id,nm);await x.act('pdedit',sid);await x.act('pdaddopen',sid);await x.fill('#modal textarea[name=t]',tops.join('\n'));await x.txt('Adicionar');await x.act('pdsave',sid)}
await x.act('plclose');
let r0=await ev(()=>S.subjects.map(s=>s.topics.length));ok(r0.length===8&&r0.every(v=>v===8),'plano do zero: 8 disciplinas com 8 tópicos');
await tabTo('ciclo');await shot('inicio-ciclo');
/* ponto de revisão no meio do ciclo (depois da 4ª disciplina), pelo Editar ciclo */
await x.act('edopen');await x.act('blkadd');await ev(()=>{S.blk[0].pos=4;save();render()});await x.act('edclose');
ok(await ev(()=>blkL().length===1&&blkL()[0].pos===4),'ponto de revisão depois da 4ª disciplina');
const REP=!!process.env.REP;
if(REP){/* repetições pelo botão Duplicar do Editar ciclo; a ordem fica: P DC DA RL | P* Inf DPen DC* | P* Atu Ética */
 await x.act('edopen');const id=n=>ev(n=>S.subjects.find(s=>s.name===n&&!s.of).id,n);const P0=await id('Português'),DC=await id('Direito Constitucional');
 for(const z of [P0,P0,DC])await x.act('dup',z);
 await ev(()=>{const by=n=>S.subjects.filter(s=>s.name===n),[p1,p2,p3]=by('Português'),[d1,d2]=by('Direito Constitucional'),o=n=>by(n)[0];
  S.subjects=[p1,d1,o('Direito Administrativo'),o('Raciocínio Lógico'),p2,o('Informática'),o('Direito Penal'),d2,p3,o('Atualidades'),o('Ética no Serviço Público')];save();render()});
 await x.act('blkadd');await ev(()=>{S.blk[1].pos=8;save();render()});await x.act('edclose');
 ok(await ev(()=>actives().length===11&&actives().filter(s=>s.of).length===3&&blkL().length===2),'repetições: 11 posições (3 cópias) e 2 pontos de revisão')}
const NPOS=await ev(()=>actives().length);
/* revisões: grupos, tópico e sessões */
await tabTo('rev');ok(await ev(()=>/desligadas/.test(document.getElementById('app').innerText)),'app novo: revisões desligadas');
await x.act('rvadj');for(const k of ['g','t','s'])await ev(k=>{const e=document.querySelector(`[data-act=rvsys][data-id=${k}]`);if(e.getAttribute('aria-checked')!=='true')e.click()},k);await W(300);
ok(await ev(()=>rgOn()&&tvOn()&&srOn()&&!cyOn()),'ligadas: grupos ('+(await ev(()=>rvInt()+' dias, revisar '+rvWait()+' depois'))+'), tópico e sessões ('+(await ev(()=>srN()+'/'+srY()))+')');
await shot('ajustes-revisao');await ev(()=>{const c=document.querySelector('#modal [data-act=rvadjx]');c&&c.click()});await W(250);

/* ===== rotinas ===== */
const tpN={};let aulaN=0;
async function blocks(){for(let g=0;g<4;g++){if(await vis('bkback'))await W(250);const ids=await ev(()=>blkCur()?[...document.querySelectorAll('#app [data-act=bkreg]')].filter(e=>e.offsetParent).map(e=>e.dataset.id):null);if(!ids)return;
 await once('ponto-de-revisao');const n0=ids.length;
 for(const id of ids){await x.act('bkreg',id);await fillAc();await x.fill('#modal input[name=m]','0h'+ri(10,20));await x.submit('#modal form[data-f=bkreg]');await W(250);st.blocos++}
 if(!(await ev(()=>!blkCur()||blkIsDone(blkCur()))))await ev(()=>{const e=[...document.querySelectorAll('#app [data-act=blkend]')].find(e=>e.offsetParent);e&&e.click()});await W(250);
 if(n0===0)ok(false,'ponto de revisão sem disciplinas')}}
async function srvReview(id){const a=await ev(id=>({due:srDue(id),nw:srNew(id).length,n:srN(),y:srY(),cnt:Object.fromEntries((({todo,fin})=>todo.concat(fin))(srSplit(id)).flatMap(t=>t.its.map(z=>[z.k,z.n]))),todo:srTodo(id).flatMap(t=>t.its.map(z=>z.k)),card:!!document.querySelector('#app .srvc')}),id);
 if(a.due!==(a.nw>=a.n&&a.todo.length>0))ok(false,'sessões: disponível fora da regra');if(Object.values(a.cnt).some(v=>v>a.y))ok(false,'sessões: item passou de '+a.y);
 if(!a.due){if(a.card)ok(false,'sessões: cartão sem revisão disponível');return}if(!a.card){ok(false,'sessões: disponível sem cartão no Ciclo');return}
 await once('sessoes-cartao');
 if(rnd()<.15){await ev(()=>document.querySelector('#app .srvc [data-act=srskip]').click());await W(250);st.sessPul++;return}
 if(rnd()<.35){await ev(()=>document.querySelector('#app .srvc [data-act=srall]').click());await W(200)}else{const nb=await ev(()=>document.querySelectorAll('#app .srvc input[data-srk]').length);for(let i=0;i<nb;i++)if(rnd()<.6||i===0){await ev(i=>{const e=document.querySelectorAll('#app .srvc input[data-srk]')[i];e&&e.click()},i);await W(80)}}
 const mk=await ev(id=>srMkT(id).flatMap(t=>t.its.map(z=>z.k)),id);st.sessMk+=mk.length;
 await ev(()=>document.querySelector('#app .srvc [data-act=srreg]').click());await W(250);await x.fill('#modal input[name=m]','0h'+ri(10,25));await fillAc();await once('sessoes-registro');
 await x.submit('#modal form[data-f=srreg]');await W(250);st.sessoes++;
 const z=await ev(id=>({due:srDue(id),cnt:Object.fromEntries((({todo,fin})=>todo.concat(fin))(srSplit(id)).flatMap(t=>t.its.map(z=>[z.k,z.n])))}),id);
 const M=new Set(mk),bad=a.todo.filter(k=>z.cnt[k]!==a.cnt[k]+(M.has(k)?1:0));if(bad.length)ok(false,'sessões: contagem errada');if(z.due)ok(false,'sessões: continua na vez depois de registrar')}
async function lateReviews(){if(rnd()>.3)return;const id=await ev(()=>{const s=srSubs().find(s=>!srDue(s.id)&&srLate(s.id).length);return s&&s.id});if(!id)return;
 await tabTo('rev','sessoes');const a=await ev(id=>({nw:srNew(id).length,late:srLate(id).flatMap(t=>t.its.map(z=>z.k))}),id);
 if(!(await ev(id=>!!document.querySelector(`.srlate [data-act=srreg][data-id="${id}"]`),id))){ok(false,'atrasadas: sem botão Registrar');return}await once('sessoes-atrasadas');
 await ev(id=>{const e=document.querySelector(`.srlate [data-act=srall][data-id="${id}"]`);e&&e.click()},id);await W(200);
 await ev(id=>document.querySelector(`.srlate [data-act=srreg][data-id="${id}"]`).click(),id);await W(250);await x.submit('#modal form[data-f=srreg]');await W(250);st.atras++;
 const z=await ev(id=>({nw:srNew(id).length,late:srLate(id).length}),id);if(z.nw!==a.nw||z.late)ok(false,'atrasadas: pôr em dia não zerou ou mexeu nas sessões')}
/* Para refazer: nova tentativa (às vezes ainda baixa) ou dispensar */
async function redo(){if(rnd()>.4)return;const L0=await ev(()=>redoList().map(o=>o.k));if(!L0.length)return;
 await tabTo('rev','hoje');if(!(await ev(()=>!!document.querySelector('.rdcard [data-act=redoall]')))){ok(false,'Para refazer com itens e sem o cartão');return}
 await once('para-refazer');await ev(()=>document.querySelector('.rdcard [data-act=redoall]').click());await W(300);
 const k=await ev(()=>{const e=document.querySelector('.rddlg .rdi.on')||document.querySelector('.rddlg .rdi');if(e&&!e.classList.contains('on'))e.click();return e&&e.dataset.id});await W(200);if(!k){ok(false,'Para refazer: janela sem itens');return}
 if(rnd()<.2){await ev(()=>document.querySelector('.rddlg .rdi.on [data-act=redoskip]').click());await W(300);st.dispensa++;if(await ev(k=>redoList().some(o=>o.k===k),k))ok(false,'Para refazer: dispensado continua na lista')}
 else{await ev(()=>document.querySelector('.rddlg .rdi.on [data-act=redoreg]').click());await W(300);const good=rnd()<.75;
  await ev(g=>{const a=document.querySelector('.rddlg input[name=qa]'),t=document.querySelector('.rddlg input[name=qt]');const tq=+t.value||10;t.value=String(tq);a.value=String(g?Math.ceil(tq*.85):Math.floor(tq*.4));[a,t].forEach(e=>e.dispatchEvent(new Event('input',{bubbles:true})))},good);
  await x.submit('.rddlg form[data-f=redo]');await W(300);st.refazer++;
  const still=await ev(k=>redoList().some(o=>o.k===k),k);if(good===still)ok(false,'Para refazer: acerto '+(good?'alto continua':'baixo saiu')+' da lista')}
 await ev(()=>{const c=document.querySelector('.rddlg [data-act=redoclose]');c&&c.click()});await W(200);
 const bad=await ev(()=>{const lim=qLim();return redoList().filter(o=>!(o.p*100<lim)).length});if(bad)ok(false,'Para refazer: item com acerto acima do limite na lista')}
async function topicReviews(){for(let i=0;i<40;i++){const k=await ev(()=>{const d=trvDue();return d[0]?d[0].k:null});if(!k)return;
 await tabTo('rev','topicos');await once('revisao-topicos');
 await x.act('trvok',k);await x.fill('#modal input[name=m]','0h'+ri(10,20));await fillAc();await x.submit('#modal form[data-f=trvok]');await W(250);st.topicos++;
 if(await ev(k=>trvDue().some(o=>o.k===k),k)){ok(false,'revisão de tópico registrada continua vencida');return}}}
async function groupReview(){const g=await ev(()=>{const o=rgOn()&&rgInfo().list.find(o=>o.st==='disponivel');return o?o.g.id:null});if(!g)return false;
 await tabTo('rev','hoje');await once('grupo-disponivel');await x.act('rvstart',g);
 for(let i=0;i<12;i++){const id=await ev(()=>{if(!S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)break;
  await ev(id=>{const s=S.subjects.find(z=>z.id===id);rvRows(s).forEach(o=>o.rows.forEach(r=>S.checked[r.k]=true));render()},id);await once('grupo-revisando');
  await x.act('rreg',id);await fillAc();await x.fill('#modal input[name=m]',await ev(id=>fmt(Math.max(1,S.subjects.find(s=>s.id===id).goal-prog(id))),id));await x.submit('#modal form[data-f=man]');await W(250)}
 if(await ev(()=>!!S.rv)){await vis('rvend');await W(300)}
 const done=await ev(g=>!S.rv&&S.reviewed&&!!S.reviewed[g],g);ok(done,'grupo revisado ('+(await ev(g=>rgLabel(rgInfo().list.find(o=>o.g.id===g)||{g:{idx:0}}),g)).replace(/<[^>]+>/g,'')+')');if(done)st.grupos++;return done}
async function cycleReview(perDay){let j=0;for(let i=0;i<30;i++){const id=await ev(()=>{if(!S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)break;
 await tabTo('rev','ciclos');await ev(id=>{const s=S.subjects.find(z=>z.id===id);rvRows(s).forEach(o=>o.rows.forEach(r=>S.checked[r.k]=true));render()},id);await once('revisao-ciclos');
 await x.act('rreg',id);await fillAc();await x.fill('#modal input[name=m]',await ev(id=>fmt(Math.max(1,S.subjects.find(s=>s.id===id).goal-prog(id))),id));await x.submit('#modal form[data-f=man]');await W(250);
 if(++j>=perDay&&await ev(()=>actives().some(s=>!gDone(s))))return false}
 await tabTo('rev','ciclos');if(await vis('rvend')){await W(300);st.ciclosRev++;await once('ciclo-revisao-fim');return true}return false}
/* uma sessão: 1 tópico (10%: 2) com 2 a 4 aulas/questões, todas com acertos; metade pelo foco, metade por Registrar */
async function study(){await tabTo('ciclo');await blocks();
 const s=await ev(()=>{if(S.type==='review'||S.rv)return null;const c=current();if(!c)return null;const b=c.of?S.subjects.find(y=>y.id===c.of):c;return {id:c.id,base:b.id,cp:!!c.of,goal:c.goal,prog:prog(c.id),tops:b.topics.map(t=>t.name)}});if(!s)return false;
 await ev(id=>{S.sel.subj=id;save();render()},s.id);await srvReview(s.base);if(s.cp)st.copia++;await tabTo('ciclo');
 const foco=rnd()<.5,n0=await ev(()=>S.sessions.length);
 if(foco){await ev(id=>{S.sel.subj=id;save();render()},s.id);await ev(()=>document.querySelector('.nwplay').click());await W(250);
  if(!(await ev(()=>S.sx===true&&S.timer.running))){ok(false,'Iniciar não abriu o foco');return false}await once('foco');
  await ev(m=>{S.timer.start=Date.now()-m*60000},Math.max(1,s.goal-s.prog));await x.act('fmreg');st.foco++}
 else{await x.act('rreg',s.id);st.manual++}
 const k=tpN[s.base]=(tpN[s.base]||0),two=rnd()<.1;tpN[s.base]+=two?2:1;const T=[s.tops[k%8]].concat(two?[s.tops[(k+1)%8]]:[]);if(two)st.dois++;
 const G=T.map((t,j)=>{const nr=ri(2,4);return {t,rows:[...Array(j?ri(1,2):nr)].map(()=>{const q=rnd()<.4,tq=ri(5,20);aulaN++;return {q,name:q?'':'Aula '+aulaN,tq,ac:ri(Math.floor(tq*.45),tq)}})}});
 await ev(G=>{const gs=S.sel.groups;gs.length=0;G.forEach(g0=>{const g=newG();g.nt=g0.t;g.rows=g0.rows.map(r=>({id:uid(),kind:'aula',name:r.name,link:'',q:'',...(r.q?{qo:true}:{}),ac:String(r.ac),tq:String(r.tq)}));gs.push(g)});render()},G);
 st.itens+=G.reduce((a,g)=>a+g.rows.length,0);st.questoes+=G.reduce((a,g)=>a+g.rows.filter(r=>r.q).length,0);
 if(!foco)await x.fill('#modal input[name=m]',await ev(id=>fmt(Math.max(1,S.subjects.find(s=>s.id===id).goal-prog(id))),s.id));
 await once(foco?'registro-pelo-foco':'registro-manual');
 await x.submit('#modal form[data-f=man]');await W(250);
 const r=await ev((n0,id)=>{const R=S.sessions.slice(n0);return {n:R.length,its:R.reduce((a,x)=>a+(x.items||[]).length,0),tq:R.reduce((a,x)=>a+(x.items||[]).reduce((b,i)=>b+(+i.tq||0),0),0),done:gDone(S.subjects.find(x=>x.id===id)),sx:S.sx,msg:ui.msg}},n0,s.id);
 const tqW=G.reduce((a,g)=>a+g.rows.reduce((b,r)=>b+r.tq,0),0),itW=G.reduce((a,g)=>a+g.rows.length,0);
 if(r.n!==G.length||r.its!==itW||r.tq!==tqW||!r.done||r.sx)ok(false,`registro de estudo: esperado ${G.length} tópico(s), ${itW} itens, ${tqW} questões; gravou ${JSON.stringify(r)}`);
 st.estudo++;await blocks();return true}
/* regras do dia */
async function check(d){const c=await ev(()=>{const ids=S.sessions.map(s=>s.id),t=document.body.innerText;
  return {dup:ids.length-new Set(ids).size,late:trvDue().filter(o=>o.due<today()).length,neg:Object.values(S.progress||{}).some(v=>v<0),txt:(t.match(/\bNaN\b|\bundefined\b|\[object Object\]/g)||[]).length,ovf:document.documentElement.scrollWidth>innerWidth+1,
   over:srSubs().some(s=>srItems(s.id).some(T=>T.its.some(z=>z.n>srY()))),hoje:(()=>{const h=document.querySelector('.rvtoday h2');return h?h.textContent:''})()}});
 if(c.dup||c.neg||c.txt||c.ovf||c.over||c.late)ok(false,'dia '+d+': '+JSON.stringify(c));if(errs.length){ok(false,'dia '+d+' erros: '+errs.splice(0).join(' | ').slice(0,300))}}
async function nextCycle(){await tabTo('ciclo');const nx=await ev(()=>{const b=document.querySelector('[data-act=next]');return b&&b.offsetParent?b.textContent.trim():null});if(!nx)return null;await once('fim-de-ciclo');await x.act('next');await W(300);return nx}

/* ===== 2. as duas rodadas ===== */
let d=0,round=1;const cyDone={1:0,2:0};
while(round<=2&&d<130){d++;st.dias=d;
 await topicReviews();await redo();await lateReviews();
 if(round===1&&await groupReview()){await check(d);await x.days(1);continue}
 if(round===2&&await ev(()=>!!(S.rv&&S.rv.cy))){await cycleReview(2);await check(d);await x.days(1);continue}
 for(let k=0;k<2;k++){const did=await study();if(did)continue;
  const nx=await nextCycle();if(!nx)break;
  const rvNext=/revisão/i.test(nx),wasRv=await ev(()=>false);
  cyDone[round]++;info(`rodada ${round}: ciclo ${cyDone[round]} concluído no dia ${d}`+(rvNext?' → começa o ciclo de revisão':''));
  if(rvNext&&cyDone[round]<6)break;
  if(cyDone[round]===6){
   if(round===1){/* nova rodada: revisão por ciclos (a cada 2) no lugar dos grupos */
    await tabTo('rev');await x.act('rvadj');await ev(()=>{const e=document.querySelector('[data-act=rvsys][data-id=c]');if(e.getAttribute('aria-checked')!=='true')e.click()});await W(300);
    await x.act('cycfg');await x.fill('#modal input[name=cn]','2');await x.submit('#modal form[data-f=cycfg]');await ev(()=>{const c=document.querySelector('#modal [data-act=rvadjx]');c&&c.click()});await W(250);
    ok(await ev(()=>cyOn()&&cyN()===2&&!rgOn()&&tvOn()&&srOn()),'rodada 2: revisão por ciclos (a cada 2) no lugar dos grupos; tópico e sessões seguem');
    await ev(()=>document.querySelector('nav [data-nav=pl]').click());await W(300);const pid=await ev(()=>S.plan);await x.act('plset',pid);await W(300);await ev(()=>{const c=document.querySelector('#modal [data-act=plclose]');c&&c.click()});await W(250);
    ok(await ev(()=>(S.set||1)===2&&S.cycle===1&&actives().every(s=>!gDone(s))),'Nova rodada: rodada 2 no ciclo 1');await shot('rodada-2');round=2;break}
   round=3;break}
  k--}
 await check(d);if(d===8)await once('dia-8');await x.days(1)}
const fim=await ev(()=>({set:S.set||1,cy:S.cycle,est:S.sessions.filter(s=>!s.review).length,rev:S.sessions.filter(s=>s.review).length,refazer:redoList().length,trv:trvList().length,trvFin:trvList().filter(o=>o.fix).length}));
info('fim: '+JSON.stringify(fim));info('contagem: '+JSON.stringify(st));
ok(cyDone[1]===6&&cyDone[2]===6,'6 ciclos em cada rodada ('+cyDone[1]+' e '+cyDone[2]+')');
ok(st.estudo===NPOS*12,NPOS*12+' sessões de estudo ('+NPOS+' posições × 6 ciclos × 2 rodadas): '+st.estudo+(REP?' ('+st.copia+' em cópias)':''));
ok(st.foco>20&&st.manual>20,'registros pelo foco ('+st.foco+') e por Registrar ('+st.manual+')');
ok(st.grupos>=2,'revisões por grupos na rodada 1 (grupos de '+(await ev(()=>rvInt()))+' dias, revisão '+(await ev(()=>rvWait()))+' depois): '+st.grupos);ok(st.ciclosRev>=2,'ciclos de revisão na rodada 2: '+st.ciclosRev);
ok(st.topicos>0,'revisões por tópico: '+st.topicos);ok(st.blocos>0,'revisões de bloco (por disciplina): '+st.blocos);
ok(st.sessoes>0,'revisões por sessões: '+st.sessoes+' (puladas '+st.sessPul+', atrasadas postas em dia '+st.atras+')');ok(st.refazer>0,'Para refazer: '+st.refazer+' novas tentativas, '+st.dispensa+' dispensadas');
/* ===== 3. Histórico, Estatísticas, Calendário, Planos ===== */
await tabTo('reg');await shot('historico');
const kinds=await ev(()=>uniq(S.sessions.map(kindOf)).sort().join(''));ok(['b','c','e','f','g','s','t'].every(k=>kinds.includes(k)),'Histórico com todos os tipos (estudo, bloco, grupos, ciclos, tópico, sessões, refazer): '+kinds);
const nS=await ev(()=>S.sessions.length),e1=await ev(()=>{const b=document.querySelector('#app [data-act=edit]');return b?b.dataset.id:null});
if(e1){await x.act('edit',e1);await x.fill('#modal [data-em]','0h45');await x.act('saveedit');ok(await ev(()=>!S.edit),'Histórico: editar e salvar')}
const e2=await ev(()=>{const b=document.querySelector('#app [data-act=edit]');return b?b.dataset.id:null});
if(e2){await x.act('edit',e2);await x.act('delreg');ok(await ev(n=>S.sessions.length<n,nS),'Histórico: excluir');await ev(()=>{const u=[...document.querySelectorAll('button')].find(b=>/Desfazer/.test(b.textContent));u&&u.click()});await W(300);ok(await ev(n=>S.sessions.length===n,nS),'Histórico: desfazer devolve')
 ok(await ev(()=>!S.edit&&!document.querySelector('#modal [data-em]')),'desfazer a exclusão não reabre a edição do registro')}
await tabTo('st');await shot('estatisticas',true);const pers=await ev(()=>[...document.querySelectorAll('#app [data-act=sper]')].map(b=>b.dataset.id));for(const pr of pers)await x.act('sper',pr);
ok(!(await ev(()=>/\bNaN\b|undefined/.test(document.body.innerText))),'Estatísticas sem texto quebrado nos períodos '+pers.join(','));
await tabTo('rev');await ev(()=>{const b=document.querySelector('[data-act=rvcalm]');b&&b.click()});await W(300);await shot('calendario');await ev(()=>{const c=document.querySelector('#modal [data-act=rvcalx]');c&&c.click()});
for(const sub of ['hoje','ciclos','topicos','sessoes']){await tabTo('rev',sub);await shot('revisao-'+sub,true);
 if(sub==='sessoes'||sub==='topicos'){const dn=await ev(()=>{const c={};document.querySelectorAll('#app .srsc .bknl b.snt, #app .trvsh b.snt').forEach(e=>{const t=e.textContent.trim();c[t]=(c[t]||0)+1});return Object.entries(c).filter(([k,v])=>v>1).map(([k])=>k)});ok(!dn.length,'aba '+sub+': cada disciplina aparece uma vez '+JSON.stringify(dn))}}
for(const t of ['ciclo','reg','st','bk']){await tabTo(t);ok(!(await ev(()=>document.documentElement.scrollWidth>innerWidth+1)),'aba '+t+' sem rolagem lateral')}
await p.reload();await W(800);ok(await ev(n=>S.sessions.length===n,nS),'recarregar mantém os dados');
ok(!errs.length,'sem erros na página '+JSON.stringify(errs.slice(0,3)));fs.writeFileSync(OUT+'/estado-final.json',await ev(()=>JSON.stringify(S)));
await b.close();console.log(log.filter(l=>l.trim()).join('\n'));console.log(log.some(l=>l.startsWith('FALHA'))?'COM FALHAS':'TUDO OK');
