/* Caderno na revisão por tópico (etapa 2) e o motor das fatias por tipo:
   - o caderno da sessão se divide em uma fatia por intervalo (5); cada tipo (por questões e por tópico) tem a sua divisão;
   - a linha do tópico e a janela Registrar revisão mostram "N desta revisão", o número com − e + (menos, ou mais com as de fora) e Resolver;
   - ao terminar, o placar aparece na janela; ao registrar, vira um registro (qcad, qpart, qtipo 't') e a fatia fica fixa (com as que entraram a mais);
   - na vez seguinte voltam as erradas e as que ficaram sem resposta; apagar o registro solta a fatia;
   - engrenagem: "Quantas entram" (total) e "Como dividir" (por igual, mais no começo, mais no fim, %), por tipo;
   - aviso ao acrescentar questões num caderno cuja revisão por tópico já fez todas as fatias.
   Uso: node lint/qzrvt.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qh;delete S0.qnow;S0.qfim={rv:false,cad:false};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const J=n=>JSON.stringify(Array.from({length:n},(_,i)=>({numero:i+1,disciplina:'X',topico:i%2?'Regência':'Crase',tipo:'CE',enunciado:'Tópico item '+(i+1)+'.',gabarito:'C'})));
const D=await ev(j=>{const s=qSubs()[0];S.trv={...(S.trv||{}),off:false,start:addD(today(),-30),t:{},iv:[7,15,30,30,60]};S.rq={on:true,iv:[1,4,8],b:{},hold:[]};
 const t=(s.topics=s.topics||[])[0]||(s.topics.push({id:'te1',name:'Crase e regência',done:false,links:[]}),s.topics[0]);
 S.sessions.push({id:'ts1',ses:'ts1',subj:s.id,topic:t.id,min:40,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',date:addD(today(),-7),items:[{kind:'aula',name:'Aula de crase',link:''}]});
 const P=qPrev({txt:j}),id=uid();qcL().push({id,subj:s.id,ses:'ts1',nome:'Caderno de crase',n:P.qs.length,ce:P.qs.length,me:0,d:today()});qSave(id,{qs:P.qs});save();render();
 const o=trvList().find(o=>o.sd===addD(today(),-7));return {sid:s.id,cid:id,k:o&&o.k}},J(20));
ok(!!D.k,'há uma revisão por tópico vencendo hoje');
let r=await ev(c=>({t:qPartsOf(c,'t').map(L=>L.length),q:qPartsOf(c,'q').map(L=>L.length)}),D.cid);
ok(JSON.stringify(r.t)==='[4,4,4,4,4]'&&JSON.stringify(r.q)==='[7,7,6]','cada tipo tem a sua divisão: por tópico 4·4·4·4·4, por questões 7·7·6 '+JSON.stringify(r));
/* engrenagem: Quantas entram e Como dividir */
await ev(c=>{tab='qz';ui.qcad=c;ui.qdv=c;render()},D.cid);await W(300);
const dv=async v=>{await ev(([c,v])=>document.querySelector(`[data-act=qdvk][data-id="${c}:t:${v}"]`).click(),[D.cid,v]);await W(200)};
await dv('ini');r=await ev(c=>qPartsOf(c,'t').map(L=>L.length),D.cid);ok(JSON.stringify(r)==='[7,5,4,3,1]','Mais no começo: 7·5·4·3·1 '+JSON.stringify(r));
await dv('fim');r=await ev(c=>qPartsOf(c,'t').map(L=>L.length),D.cid);ok(JSON.stringify(r)==='[1,3,4,5,7]','Mais no fim: 1·3·4·5·7 '+JSON.stringify(r));
await dv('pct');await ev(c=>{const set=(i,v)=>{const e=document.querySelector(`[data-dvp="${c}:t:${i}"]`);e.value=v;e.dispatchEvent(new Event('change',{bubbles:true}))};set(0,'40')},D.cid);await W(250);
r=await ev(()=>({w:(document.querySelector('.qzpcw')||{}).textContent||''}));ok(/120%/.test(r.w),'Personalizar: aviso quando a soma não dá 100% ('+r.w+')');
await dv('num');await ev(c=>{const e=document.querySelector(`[data-dvt="${c}:t"]`);e.value='10';e.dispatchEvent(new Event('change',{bubbles:true}))},D.cid);await W(250);await dv('eq');
r=await ev(c=>({L:qPartsOf(c,'t').map(L=>L.length),out:qOut(c,'t').length,q:qPartsOf(c,'q').map(L=>L.length),txt:(document.querySelector('.qzdvt .qzdvq')||{}).textContent}),D.cid);
ok(JSON.stringify(r.L)==='[2,2,2,2,2]'&&r.out===10&&JSON.stringify(r.q)==='[7,7,6]','Quantas entram = 10, por igual: 2·2·2·2·2 e 10 fora; a revisão por questões não muda '+JSON.stringify(r));
ok(await ev(()=>/2 · 2 · 2 · 2 · 2 questões · 10 fora das revisões/.test(document.querySelector('.qzdvp').textContent)),'a engrenagem mostra a conta');
await p.screenshot({path:`saida/qzrvt-engrenagem-${w}.png`});
/* linha do tópico: N desta revisão, número com − e + até desta vez + de fora */
await ev(k=>{tab='rev';ui.qcad=null;ui.qdv=null;render()},D.k);await W(250);await ev(()=>document.querySelector('[data-act=rvt][data-id=topicos]').click());await W(250);await ev(k=>{ui.open.add('tdi:'+k);render()},D.k);await W(250);
r=await ev(()=>{const c=document.querySelector('.tqcad');return c?{t:c.textContent.replace(/\s+/g,' '),v:c.querySelector('.qsin').value,mx:c.querySelector('.qsin').dataset.mx}:null});
ok(r&&/Caderno\s*·?\s*2 desta revisão/.test(r.t)&&r.v==='2'&&r.mx==='12','linha do tópico: "2 desta revisão", número 2, até 12 (2 + 10 de fora) '+JSON.stringify(r));
await ev(()=>document.querySelector('.tqcad [data-act=qns][data-d="1"]').click());await W(150);await ev(()=>document.querySelector('.tqcad [data-act=qns][data-d="1"]').click());await W(150);
ok(await ev(()=>document.querySelector('.tqcad .qsin').value==='4'&&!!document.querySelector('.tqcad [data-act=qnr]')),'+ duas vezes: 4, com ↺ para voltar ao padrão');
await p.screenshot({path:`saida/qzrvt-linha-${w}.png`});
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
/* janela Registrar, resolver 4 (2 desta vez + 2 de fora), 3 certas */
await ev(k=>{ui.trvk=k;render()},D.k);await W(300);ok(await ev(()=>!!document.querySelector('#modal .tqcad')),'a janela Registrar revisão tem a linha do caderno');
await ev(()=>document.querySelector('#modal .tqcad [data-act=tqgo]').click());await W(300);
let n=await ev(()=>ui.qz?ui.qz.ids.length:0);ok(n===4,'Resolver abre 4 questões (2 desta vez + 2 de fora) '+n);
const done1=await ev(()=>ui.qz.ids.slice());for(let i=0;i<n;i++){await ev(k=>qAns(k),i===0?'E':'C');await W(50);await ev(()=>document.querySelector('.qznav [data-act=qnext]').click());await W(60)}
await ev(()=>{ui.qz=null;render()});await W(300);
r=await ev(()=>(document.querySelector('#modal .tqcad')||{}).textContent||'');ok(/✓ 3\/4 · 75%/.test(r),'a janela mostra o placar ✓ 3/4 · 75% ('+r.replace(/\s+/g,' ')+')');
ok(await ev(()=>!S.qnow||!Object.keys(S.qnow).length),'o número volta ao padrão depois da bateria');
await ev(()=>document.querySelector('#modal form[data-f=trvok]').requestSubmit());await W(300);
r=await ev(([c,k])=>{const R=S.sessions.filter(x=>x.qtipo==='t'&&x.qcad===c);const m=qcM(c);return {n:R.length,ac:R[0]&&R[0].ac,tq:R[0]&&R[0].tq,qp:R[0]&&R[0].qpart,trv:R[0]&&R[0].trv===k,fz:((m.pdt||{}).t||{})[0],h:(((S.trv.t||{})[k]||{}).h||[]).length}},[D.cid,D.k]);
ok(r.n===1&&r.ac===3&&r.tq===4&&r.qp===0&&r.trv&&r.h===1,'registrar: um registro do caderno (3/4, fatia 1, qtipo t) e a revisão marcada '+JSON.stringify({...r,fz:undefined}));
ok(r.fz&&done1.every(id=>r.fz.includes(id)),'a 1ª fatia fica fixa com as 4 resolvidas (as 2 de fora passam a fazer parte dela)');
r=await ev(c=>({L:qPartsOf(c,'t').map(L=>L.length),out:qOut(c,'t').length}),D.cid);ok(r.L[0]===4&&r.out===8&&r.L.slice(1).join()==='2,2,2,2','as fatias seguintes não mudam; ficam 8 de fora '+JSON.stringify(r));
/* a vez seguinte: a errada volta */
r=await ev(c=>{const P=qPartIds(c,1,'t');return {back:P.back,n:P.ids.length}},D.cid);ok(r.back===1&&r.n===3,'na 2ª vez volta a errada (1) junto com a fatia (2) '+JSON.stringify(r));
/* caderno: seção Revisões mostra a revisão por tópico com o placar */
await ev(c=>{tab='qz';ui.qcad=c;render()},D.cid);await W(300);
r=await ev(()=>{const h=[...document.querySelectorAll('.qzsh4')].map(e=>e.textContent);const t=document.querySelector('.qzrv').textContent;return {h,ok:/3\/4 ✓/.test(t)}});ok(r.h.join()==='Revisão por questões,Revisão por tópico'&&r.ok,'caderno › Revisões: um grupo por tipo, com 3/4 ✓ na revisão por tópico '+JSON.stringify(r));
r=await ev(()=>{const H=(S.qh[ui.qcad]||[]).slice(-1)[0];return H&&qhLbl(H)});ok(r==='1ª revisão por tópico','Desempenho: "1ª revisão por tópico" ('+r+')');
/* apagar o registro solta a fatia */
await ev(c=>{S.sessions=S.sessions.filter(x=>!(x.qtipo==='t'&&x.qcad===c));qPdFix();save();render()},D.cid);r=await ev(c=>!((qcM(c).pdt||{}).t||{})[0],D.cid);ok(r,'apagar o registro do caderno solta a fatia');
/* aviso das questões novas: a revisão por tópico já fez todas as fatias */
await ev(c=>{const m=qcM(c),P=qPartsOf(c,'t');P.forEach((L,i)=>{qPdSet(m,'t',i,L.slice());S.sessions.push({id:'fx'+i,ses:'fx'+i,subj:m.subj,min:0,review:true,qcad:c,qtipo:'t',qpart:i,ac:1,tq:1,date:today(),cycle:S.cycle,items:[]})});save();
 ui.qimp={cad:c,txt:JSON.stringify([{numero:1,disciplina:'X',topico:'Crase',tipo:'CE',enunciado:'Nova 1.',gabarito:'C'},{numero:2,disciplina:'X',topico:'Crase',tipo:'CE',enunciado:'Nova 2.',gabarito:'C'}])};qImpSave()},D.cid);await W(300);
r=await ev(()=>{const u=document.querySelector('#undo');return u?u.textContent:''});ok(/2 questões novas ficam fora da revisão por tópico/.test(r)&&/Resolver agora/.test(r),'acrescentar depois de todas as fatias: aviso com "Resolver agora" ('+r+')');
await ev(()=>document.querySelector('#undo [data-act=qnewgo]').click());await W(300);ok(await ev(()=>ui.qz&&ui.qz.ids.length===2),'"Resolver agora" abre as 2 novas');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
