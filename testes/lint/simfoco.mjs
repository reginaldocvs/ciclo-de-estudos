/* Simulação pelo MODO FOCO: como simreal, mas cada sessão começa no ▶, roda até a meta (às vezes passa, às vezes pausa), marca o que revisou no foco e registra pelo foco; confere texto e barra da meta, aviso único e minutos registrados. Base: 2 sessões por dia, cada uma com 1 tópico e 2 a 3 aulas/questões (com acertos),
   pontos de revisão do ciclo, revisões por tópico no dia em que vencem e, conforme o modo:
   ciclos: revisão por ciclos a cada 5 (5 ciclos de estudo + ciclo de revisão);  grupos: revisão por grupos (grupo disponível = feito no dia).
   Uso: node lint/simreal.mjs <dados.json> <saída> <ciclos|grupos> [dias=24] [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,MODE='ciclos',ND='24',WD='390']=process.argv.slice(2);const w=+WD;
const log=[],ok=(c,m)=>{log.push((c?'OK    ':'FALHA ')+m);if(!c)console.log('FALHA '+m)},info=m=>log.push('      '+m);
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rvf=null;if(process.env.CYN){S0.cyrv={...(S0.cyrv||{}),n:+process.env.CYN,d5:1}}
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:860});const x=mk(p);
await p.evaluateOnNewDocument(()=>{window.__notes=[];window.Notification=class{constructor(t,o){window.__notes.push(t+' | '+(o&&o.body))}static get permission(){return 'granted'}static requestPermission(){return Promise.resolve('granted')}}});await p.reload();await W(700);
const tabTo=async t=>{await x.ev(t=>{const e=document.querySelector(`nav [data-tab=${t}]`);e&&e.click()},t);await W(300)};
let n=0;const shot=async(nm,full)=>{n++;await p.screenshot({path:`${OUT}/${String(n).padStart(2,'0')}-${nm}.png`,fullPage:!!full})};
const shotOnce=new Set(),once=async nm=>{if(shotOnce.has(nm))return;shotOnce.add(nm);await x.ev(()=>scrollTo(0,0));await shot(nm)};
const vis=a=>x.ev(a=>{const e=[...document.querySelectorAll(`[data-act=${a}]`)].filter(e=>e.offsetParent).pop();if(e)e.click();return !!e},a);
/* acertos: preenche os pares qa/qt do formulário aberto (o total vem sugerido quando já houve tentativa) */
const fillAc=async()=>{let c=0;for(let i=0;i<40;i++){const r=await x.ev((i,s)=>{const rows=[...document.querySelectorAll('#modal .acrow')].filter(e=>e.offsetParent);const row=rows[i];if(!row)return null;const qa=row.querySelector('input[data-qa]'),qt=row.querySelector('input[data-qt]');let k=s;const rn=()=>{k=(k*16807)%2147483647;return k/2147483647};
  const set=(e,v)=>{e.focus();e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))};const tq=+qt.value||5+Math.floor(rn()*6);set(qt,tq);set(qa,Math.round(tq*(.5+rn()*.5)));return true},i,ri(1,1e6));if(!r)break;c++;await W(60)}return c};
const st={dias:0,estudo:0,blocos:0,topicos:0,acTop:0,ciclosRev:0,grupos:0,acertos:0};
/* ===== modo foco: tudo começa no ▶, roda até a meta (às vezes passa), às vezes pausa e retoma, e registra pelo foco ===== */
const FC={sess:0,extra:0,pausas:0,marcadas:0,falhas:[]};const bad=m=>{if(FC.falhas.length<40)FC.falhas.push(m)};
const xtra=()=>rnd()<.3?0:ri(3,25);
const fmtN=m=>{m=Math.round(m);return m>=60?Math.floor(m/60)+'h'+(m%60?String(m%60).padStart(2,'0'):''):m+'min'};
const expTxt=(m,g)=>m>=g?fmtN(g)+' ✓'+(Math.floor(m-g)>=1?' · +'+fmtN(Math.floor(m-g)):''):null;
const notes=()=>x.ev(()=>(window.__notes||[]).length);
/* confere texto, barra e aviso do foco; gl/bar = ids do texto e da barra; m = minutos rodados; g = meta */
async function chkFoco(tag,gl,bar,m,g,n0){const r=await x.ev((gl,bar)=>{const b=document.getElementById(bar),gx=b&&b.querySelector('i.gx');return {t:(document.getElementById(gl)||{}).textContent,ov:!!(b&&b.classList.contains('fmov')),gx:gx?Math.round(gx.getBoundingClientRect().width):-1,w:b?Math.round(b.getBoundingClientRect().width):0}},gl,bar);
 const e=expTxt(m,g);if(r.t!==e)bad(tag+': texto "'+r.t+'" (esperado "'+e+'")');const xm=m-g>=1;if(xm?(!r.ov||!(r.gx>0)||r.gx>r.w/3+2):(r.ov||r.gx!==0))bad(tag+': barra '+JSON.stringify(r)+' (+'+(m-g).toFixed(2)+' min)');
 const dn=(await notes())-n0;if(dn!==1)bad(tag+': '+dn+' avisos (esperado 1)')}
/* soma dos minutos registrados agora (uma sessão pode virar vários registros, um por tópico) */
const regMinNew=n0=>x.ev(n0=>S.sessions.slice(n0).reduce((a,s)=>a+(+s.min||0),0),n0);const nSes=()=>x.ev(()=>S.sessions.length);
const chkMin=(tag,got,m)=>{if(Math.abs(got-m)>1.05)bad(tag+': registrou '+got.toFixed(1)+' min (rodou '+m.toFixed(1)+')')};
/* cronômetro do estudo (estudo, revisão por ciclos e por grupo) */
async function runStudyTimer(tag,extra){if(rnd()<.25){await vis('tpause');await W(300);await vis('tstart');await W(300);FC.pausas++}
 const n0=await notes();const gm=await x.ev(ex=>{const s=curS();S.timer.acc=0;S.timer.running=true;S.timer.start=Date.now()-((s.goal-prog(s.id))+ex)*60000-1000;return {g:s.goal,p:prog(s.id)}},extra);await W(1400);
 const m=await x.ev(()=>liveMin(curS()));await chkFoco(tag,'fmgl','fmb',m,gm.g,n0);
 if(!await x.ev(()=>FM.on&&S.timer.running&&S.sx===true))bad(tag+': foco saiu ou cronômetro parou depois da meta');FC.sess++;FC.extra+=extra;return m-gm.p}
/* cronômetro da revisão em foco (bloco e tópico) */
async function runRvf(tag,extra){if(rnd()<.25){await vis('rvfpz');await W(300);await vis('rvfrs');await W(300);FC.pausas++}
 const n0=await notes();const g=await x.ev(ex=>{const f=S.rvf;f.acc=0;f.run=true;f.start=Date.now()-(f.goal+ex)*60000-1000;return f.goal},extra);await W(1400);
 const m=await x.ev(()=>rvfMs()/60000);await chkFoco(tag,'rvfgl','rvfb',m,g,n0);if(!await x.ev(()=>!!(S.rvf&&S.rvf.run)))bad(tag+': revisão parou depois da meta');FC.sess++;FC.extra+=extra;return m}
const onceM=async nm=>{if(shotOnce.has(nm))return;shotOnce.add(nm);await shot(nm)};
/* pontos de revisão: cada disciplina pelo foco (▶, roda, Registrar no foco) */
async function blocks(){for(let g=0;g<6;g++){if(await vis('bkback'))await W(300);const ids=await x.ev(()=>blkCur()?[...document.querySelectorAll('#app [data-act=bkgo]')].filter(e=>e.offsetParent).map(e=>e.dataset.id):null);if(!ids)return;
 await once('ponto-de-revisao');
 for(const id of ids){await x.act('bkgo',id);await W(300);await vis('rvfrs');await W(300);const ex=xtra(),m=await runRvf('bloco',ex);if(ex>0)await onceM('foco-bloco-meta');
  const n0=await nSes();await x.act('rvfreg');await W(300);st.acertos+=await fillAc();await onceM('foco-bloco-registro');await x.submit('#modal form[data-f=bkreg]');await W(300);chkMin('bloco',await regMinNew(n0),m);st.blocos++}
 await x.ev(()=>{const e=[...document.querySelectorAll('#app [data-act=blkend]')].find(e=>e.offsetParent);e&&e.click()});await W(300)}}
/* estudo pelo foco: ▶, roda até a meta (+ extra), Registrar no foco com tópico e 2 a 3 aulas/questões */
const tpN={};
async function study(){await tabTo('ciclo');await blocks();
 const id=await x.ev(()=>{if(S.type==='review'||S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)return false;
 await x.ev(id=>{const e=[...document.querySelectorAll(`[data-act=rplay][data-id="${id}"]`)].find(e=>e.offsetParent)||document.querySelector(`[data-act=rplay][data-id="${id}"]`);e.click()},id);await W(400);
 if(!await x.ev(()=>FM.on&&S.timer.running))bad('estudo: ▶ não abriu o foco rodando');
 const ex=xtra(),m=await runStudyTimer('estudo',ex);if(ex>0)await onceM('foco-estudo-meta');
 await vis('fmreg');await W(300);const k=tpN[id]=(tpN[id]||0)+1,nr=ri(2,3),qrow=rnd()<.5,acs=[...Array(nr)].map(()=>{const tq=ri(5,10);return {tq,ac:ri(Math.ceil(tq/2),tq)}});
 await x.ev((k,nr,qrow,acs)=>{const s=curS(),g=(S.sel.groups||grps())[0],t=Math.ceil(k/2);g.nt=s.name.split(' ')[0]+' · Assunto '+t;g.rows=[];
  for(let i=0;i<nr;i++){const last=i===nr-1&&qrow;g.rows.push({id:uid(),kind:'aula',name:last?'':'Aula '+((k-1)*3+i+1),link:'',q:'',...(last?{qo:true}:{}),...(i>0||last?{ac:String(acs[i].ac),tq:String(acs[i].tq)}:{})})}render()},k,nr,qrow,acs);
 await onceM('foco-estudo-registro');const n0=await nSes();await x.submit('#modal form[data-f=man]');await W(300);chkMin('estudo',await regMinNew(n0),m);
 if(await x.ev(()=>FM.on||!!S.sx))bad('estudo: foco continua aberto depois de registrar');st.estudo++;await blocks();return true}
/* revisões por tópico que vencem hoje, pelo foco */
async function topicReviews(){for(let i=0;i<30;i++){const k=await x.ev(()=>{const d=trvDue();return d[0]?d[0].k:null});if(!k)return;
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=topicos]');b&&b.click()});await W(250);await once('revisao-topicos');
 await x.ev(k=>[...document.querySelectorAll('#app [data-act=rvfgo]')].find(e=>e.dataset.id===k).click(),k);await W(300);await vis('rvfrs');await W(300);
 const m=await runRvf('tópico',ri(0,1)?0:ri(2,10));await onceM('foco-topico-meta');
 const n0=await nSes();await x.act('rvfreg');await W(300);const c=await fillAc();st.acTop+=c;await onceM('foco-topico-registro');await x.submit('#modal form[data-f=trvok]');await W(300);chkMin('tópico',await regMinNew(n0),m);st.topicos++;
 if(await x.ev(k=>trvDue().some(o=>o.k===k),k)){ok(false,'revisão de tópico registrada continua vencida: '+k);return}}}
/* uma disciplina da revisão por ciclos ou por grupo, pelo foco: ▶, marca as aulas no "O que revisar" do foco, roda, Registrar */
async function rvFocus(tag){const id=await x.ev(()=>{if(!S.rv)return null;const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)return null;
 await x.ev(id=>{const e=[...document.querySelectorAll(`[data-act=rplay][data-id="${id}"]`)].find(e=>e.offsetParent)||document.querySelector(`[data-act=rplay][data-id="${id}"]`);e.click()},id);await W(400);
 const hd=await x.ev(()=>{const e=document.querySelector('#modal .fmd .fmc>.mut');return e&&e.textContent});if(!/^Revisão · (Ciclos? |Grupo )/.test(hd||''))bad(tag+': título do foco "'+hd+'"');
 const c0=await x.ev(()=>Object.values(S.checked||{}).filter(Boolean).length);let n=0;
 for(let i=0;i<60;i++){const okc=await x.ev(()=>{const c=[...document.querySelectorAll('#modal .fmd .rvlist input[type=checkbox]')].find(c=>!c.checked&&!c.disabled);if(!c)return false;c.click();return true});if(!okc)break;n++;await W(120)}
 const c1=await x.ev(()=>Object.values(S.checked||{}).filter(Boolean).length);if(c1-c0!==n)bad(tag+': marcou '+n+' no foco, estado mudou '+(c1-c0));if(!await x.ev(()=>FM.on))bad(tag+': marcar fechou o foco');FC.marcadas+=n;
 await onceM('foco-'+tag+'-marcado');const ex=xtra(),m=await runStudyTimer(tag,ex);if(ex>0)await onceM('foco-'+tag+'-meta');
 await vis('fmreg');await W(300);st.acertos+=await fillAc();await onceM('foco-'+tag+'-registro');const n0=await nSes();await x.submit('#modal form[data-f=man]');await W(300);chkMin(tag,await regMinNew(n0),m);return id}
async function cycleReview(perDay){let j=0;for(let i=0;i<30;i++){await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=ciclos]');b&&b.click()});await W(250);
 const id=await rvFocus('ciclos');if(!id)break;if(++j>=perDay&&await x.ev(()=>actives().some(s=>!gDone(s))))return false}
 await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=ciclos]');b&&b.click()});await W(250);await x.ev(()=>scrollTo(0,0));await once('revisao-ciclos-concluir');
 if(await vis('rvend')){await W(400);st.ciclosRev++;return true}return false}
async function groupReview(){await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=hoje]');b&&b.click()});await W(250);
 const g=await x.ev(()=>{const o=rgInfo().list.find(o=>o.st==='disponivel');return o?o.g.id:null});if(!g)return false;
 await once('grupo-disponivel');await x.act('rvstart',g);ok(await x.ev(()=>S.type==='review'&&!!S.rv),'grupo '+g+': revisão iniciada');
 for(let i=0;i<12;i++){if(!await rvFocus('grupo'))break}
 if(await x.ev(()=>!!S.rv)){await tabTo('rev');await vis('rvend');await W(400)}
 const done=await x.ev(g=>!S.rv&&S.reviewed&&!!S.reviewed[g],g);ok(done,'grupo '+g+' revisado');if(done)st.grupos++;return done}
/* coerência a cada dia */
async function check(d){const c=await x.ev(()=>{const ids=S.sessions.map(s=>s.id),dup=ids.length-new Set(ids).size,late=trvDue().filter(o=>o.due<today()).length,neg=Object.values(S.progress||{}).some(v=>v<0),orf=S.sessions.filter(s=>s.topic&&!S.subjects.some(x=>x.id===s.subj&&(x.topics||[]).some(t=>t.id===s.topic))&&!s.trv&&!s.tdel).length;return {dup,late,neg,orf,cy:S.cycle,mode:S.mode,type:S.type}});
 if(c.dup||c.neg)ok(false,'dia '+d+': '+JSON.stringify(c));return c}
const info0=await x.ev(()=>({cy:S.cycle,n:inCycle().length,nomes:inCycle().map(s=>s.name),blk:blkL().length,tv:tvOn(),rg:rgOn(),cyo:cyOn()}));
info('início: ciclo '+info0.cy+', '+info0.n+' sessões no ciclo ('+info0.nomes.join(', ')+'), '+info0.blk+' pontos de revisão; tópico '+(info0.tv?'ligada':'desligada'));
/* liga o sistema do modo e a revisão por tópico */
await tabTo('rev');await x.act('rvadj');
await x.ev(m=>{const sw=k=>document.querySelector(`[data-act=rvsys][data-id=${k}]`),on=k=>sw(k).getAttribute('aria-checked')==='true';if(m==='ciclos'&&!on('c'))sw('c').click();if(m==='grupos'&&!on('g'))sw('g').click()},MODE);await W(300);
await x.ev(()=>{const sw=document.querySelector('[data-act=rvsys][data-id=t]');if(sw.getAttribute('aria-checked')!=='true')sw.click()});await W(300);
if(MODE==='ciclos'){ok(await x.ev(n=>cyOn()&&cyN()===n&&!rgOn()&&tvOn(),+(process.env.CYN||5)),'por ciclos (a cada '+(await x.ev(()=>cyN()))+') e por tópico ligadas')}
else ok(await x.ev(()=>rgOn()&&!cyOn()&&tvOn()),'por grupos ('+(await x.ev(()=>rvInt()+' dias, revisar '+rvWait()+' depois'))+') e por tópico ligadas');
await shot('ajustes');await x.ev(()=>{const c=document.querySelector('#modal [data-act=rvadjx]');c&&c.click()});await W(300);
const c00=info0.cy;let crDone=false;
for(let d=1;d<=+ND;d++){st.dias=d;
 await topicReviews();
 if(MODE==='grupos'&&await groupReview()){await check(d);await x.days(1);continue}
 if(MODE==='ciclos'&&await x.ev(()=>!!(S.rv&&S.rv.cy))){if(await cycleReview(2))crDone=true;await check(d);await x.days(1);continue}
 for(let s=0;s<2;s++){const did=await study();if(!did){await tabTo('ciclo');const nx=await x.ev(()=>{const b=document.querySelector('[data-act=next]');return b&&b.offsetParent?b.textContent:null});
   if(nx){if(/revisão/.test(nx))await once('ciclo-pede-revisao');await x.act('next');await W(400);if(/revisão/.test(nx)){info('dia '+d+': começa o ciclo de revisão '+JSON.stringify(await x.ev(()=>S.rv&&S.rv.src)));break}s--}else break}}
 const c=await check(d);if(d===3)await once('ciclo-dia3');if(d===10){await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=hoje]');b&&b.click()});await W(250);await once('revisao-hoje-dia10')}
 await x.days(1)}
const fim=await x.ev(()=>({cy:S.cycle,ses:S.sessions.filter(s=>!s.review).length,rev:S.sessions.filter(s=>s.review).length,trvAg:trvList().length,due:trvDue().length,late:trvDue().filter(o=>o.due<today()).length,cyLast:S.cyrv&&S.cyrv.last,rv:!!S.rv}));
info('fim: '+JSON.stringify(fim));info('contagem: '+JSON.stringify(st));info('foco: '+FC.sess+' sessões pelo foco, '+FC.extra+' min a mais no total, '+FC.pausas+' pausas, '+FC.marcadas+' aulas marcadas no foco');ok(!FC.falhas.length,'foco: texto da meta, barra, aviso único e minutos registrados'+(FC.falhas.length?' | '+FC.falhas.length+' falhas: '+FC.falhas.join(' || '):''));
if(MODE==='ciclos'){const NN=+(process.env.CYN||5);ok(crDone,'fez o ciclo de revisão (ciclos '+(c00)+' a '+(c00+NN-1)+')');ok(fim.cyLast>=c00+NN-1,'última revisão por ciclos cobre até o ciclo '+fim.cyLast)}else ok(st.grupos>=1,'fez '+st.grupos+' revisão(ões) de grupo');
ok(st.topicos>0,'fez '+st.topicos+' revisões por tópico ('+st.acTop+' com acertos por aula)');ok(fim.late===0,'nenhuma revisão por tópico atrasada');
await tabTo('reg');await once('historico');await x.ev(()=>{const b=[...document.querySelectorAll('#app button')].find(b=>b.offsetParent&&b.textContent.trim()==='Ciclos');b&&b.click()});await W(300);await shot('historico-ciclos');
await tabTo('st');await once('estatisticas');await shot('estatisticas-pagina',true);
await tabTo('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvcalm]');b&&b.click()});await W(400);await shot('calendario');
ok(!errs.length,'sem erros na página '+JSON.stringify(errs.slice(0,3)));fs.writeFileSync(OUT+'/estado-final.json',await x.ev(()=>JSON.stringify(S)));
await b.close();console.log(log.join('\n'));console.log(log.some(l=>l.startsWith('FALHA'))?'COM FALHAS':'TUDO OK');
