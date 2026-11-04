/* Histórico: etiquetas por tipo de revisão (com contorno e origem ao tocar), filtro Tipo com vários,
   Ciclos = tudo sobre o conteúdo do ciclo */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,O]=process.argv.slice(2);const RAW=JSON.parse(fs.readFileSync(F,'utf8')),S0=JSON.parse(RAW['ciclo-estudos-v2']||JSON.stringify(RAW));
let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
/* um registro de cada tipo, no formato que o app grava */
const base=S0.sessions.find(x=>x.topic&&!x.review),sub=base.subj,g0=S0.rgs[0],mk1=(o)=>({...base,id:o.id,ses:o.id,items:base.items,min:30,review:true,...o});
S0.reviews=[{id:'rvG',src:[g0.id],lbl:'Grupo '+g0.idx,start:'2026-10-21',end:'2026-10-21'},{id:'rvC',src:[1,2],lbl:'Ciclos 1 e 2',start:'2026-10-22',end:'2026-10-22',cy:true}];
const tk=sub+'|'+base.topic+'|'+base.date;S0.trv={start:'2026-01-01',t:{[tk]:{h:['2026-10-20','2026-10-24']}}};
S0.sessions.push(mk1({id:'sG',rid:'rvG',date:'2026-10-21',cycle:3}),mk1({id:'sC',rid:'rvC',date:'2026-10-22',cycle:3}),mk1({id:'sB',rid:'bk-1-3-blk1',bkr:'k',date:'2026-10-23',cycle:3}),mk1({id:'sT',trv:tk,trvd:'2026-10-24',date:'2026-10-24',cycle:3}));
const DATA=JSON.stringify(S0);
for(const w of [1280,360]){const {b,p,errs}=await open({w,h:900,data:{'ciclo-estudos-v2':DATA,'ciclo-welcome-skip':'1'}});const x=mk(p);
 await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);
 const tags=await x.ev(()=>Object.fromEntries(['sT','sB','sC','sG'].map(k=>{const e=document.querySelector(`[data-act=htag][data-id="${k}"]`);return [k,e&&{t:e.textContent,d:e.title,out:getComputedStyle(e).backgroundColor}]})));
 console.log('  ',w,JSON.stringify(tags));
 ok(tags.sG&&/^rev\. grupo \d+$/.test(tags.sG.t)&&/Revisão do grupo \d+: estudos de/.test(tags.sG.d),w+' grupo: '+(tags.sG&&tags.sG.t+' — '+tags.sG.d));
 ok(tags.sC&&tags.sC.t==='rev. ciclos 1 e 2'&&tags.sC.d==='Revisão dos ciclos 1 e 2.',w+' ciclos: '+(tags.sC&&tags.sC.t));
 ok(tags.sB&&tags.sB.t==='rev. bloco · ciclo 3',w+' bloco: '+(tags.sB&&tags.sB.t+' — '+tags.sB.d));
 ok(tags.sT&&tags.sT.t==='rev. tópico · 2ª'&&/^2ª revisão do tópico estudado em .*, no ciclo \d+\.$/.test(tags.sT.d),w+' tópico: '+(tags.sT&&tags.sT.t+' — '+tags.sT.d));
 ok(Object.values(tags).every(t=>t&&/rgba\(0, 0, 0, 0\)|transparent/.test(t.out)),w+' revisões com contorno (sem fundo)');
 await x.act('htag','sT');ok(await x.ev(()=>{const d=document.querySelector('[data-act=htag][data-id="sT"]').closest('.grow').querySelector('.htd');return d&&/2ª revisão do tópico/.test(d.textContent)}),w+' tocar na etiqueta mostra a origem');
 await p.screenshot({path:`${O}/rvtags-${w}.png`});
 await x.act('htag','sT');ok(await x.ev(()=>!document.querySelector('.htd')),w+' tocar de novo esconde');
 /* filtros */
 await x.act('hfo');const opt=await x.ev(()=>({c:(()=>{ui.dd='s:hfc';render();return [...document.querySelectorAll('[data-act=mpick][data-id^="hfc:"]')].map(e=>e.textContent)})(),t:(()=>{ui.dd='s:hft';render();return [...document.querySelectorAll('[data-act=mpick][data-id^="hft:"]')].map(e=>e.textContent)})()}));
 console.log('   ciclos:',opt.c.join(' | '),' · tipos:',opt.t.join(' | '));
 ok(opt.c.every(t=>/^(Todos os ciclos|(R\d · )?Ciclo \d+)$/.test(t)),w+' Ciclos só tem ciclos');ok(opt.t.length===6&&opt.t[0]==='Todos os tipos',w+' Tipo lista os 5 tipos presentes');
 await x.act('mpick','hft:b');await x.act('mpick','hft:t');
 const k2=await x.ev(()=>[...new Set([...document.querySelectorAll('#hres [data-act=htag]')].map(e=>e.dataset.id))].sort().join());ok(k2==='sB,sT','Tipo com bloco + tópico mostra só esses ('+k2+')');
 await x.act('mpick','hft:');
 /* Ciclos = tudo sobre o conteúdo do ciclo: cada revisão entra no ciclo de onde veio */
 const byC=async c=>x.ev(c=>{ui.hfc=c;ui.dd=null;render();return {rv:[...document.querySelectorAll('#hres [data-act=htag]')].map(e=>e.dataset.id).sort().join(),n:+document.querySelector('#hres .htot').textContent.match(/\d+/)[0]}},c); /* total do filtro (a lista mostra 30 por vez) */
 const c1=await byC(['c1.1']),c2=await byC(['c1.2']),c3=await byC(['c1.3']),c13=await byC(['c1.1','c1.3']);console.log('   por ciclo:',JSON.stringify({c1,c2,c3,c13}));
 ok(c1.rv==='sC,sG','Ciclo 1 traz a revisão por grupos dos dias dele e a revisão dos ciclos 1 e 2 ('+c1.rv+')');
 ok(c2.rv==='sC,sT','Ciclo 2 traz a revisão dos ciclos 1 e 2 e a revisão por tópico do estudo feito nele ('+c2.rv+')');
 ok(c3.rv==='sB'&&c3.n>1,'Ciclo 3 traz os estudos e a revisão de bloco feita nele ('+c3.n+' registros)');
 const c12=await byC(['c1.1','c1.2']);ok(c13.n===c1.n+c3.n&&c12.n===c1.n+c2.n-1,'ciclos juntos contam cada registro uma vez ('+c12.n+' = '+c1.n+' + '+c2.n+' − 1 repetido)');
 await x.ev(()=>{ui.hfc=[];ui.hfo=null;render()});
 /* modo Ciclos: ciclos e revisões por grupos e por ciclos; sem revisão de bloco nem por tópico */
 await x.act('hmode','cic');const cb=await x.ev(()=>({b:[...document.querySelectorAll('.hct b')].map(e=>e.textContent),cnt:document.querySelector('#hres .htot').textContent.trim()}));
 console.log('   modo Ciclos:',JSON.stringify(cb));
 ok(cb.b.some(t=>/^Revisão · Grupo/.test(t))&&cb.b.some(t=>/^Revisão · Ciclos 1 e 2/.test(t))&&cb.b.filter(t=>/^Ciclo \d+$/.test(t)).length===3,w+' modo Ciclos tem os ciclos e as revisões por grupos e por ciclos');
 ok(!cb.b.some(t=>/bloco|tópico/i.test(t)),w+' modo Ciclos sem revisão de bloco nem por tópico');
 await p.screenshot({path:`${O}/rvtags-ciclos-${w}.png`});
 /* atalho da revisão por grupos: tipo e dias daquela revisão */
 await x.ev(()=>{const g=[...document.querySelectorAll('[data-act=hctog]')].find(e=>/Grupo/.test(e.textContent));g.click()});await W(250);
 const id=await x.ev(()=>{const b=[...document.querySelectorAll('[data-act=hgo]')].find(e=>e.dataset.id.startsWith('rrvG'));return b&&b.dataset.id});ok(!!id,w+' revisão por grupos tem atalho');
 if(id){await x.act('hgo',id);const r=await x.ev(()=>({ft:ui.hft,d:[ui.hd1,ui.hd2],ids:[...document.querySelectorAll('#hres [data-act=htag]')].map(e=>e.dataset.id)}));ok(r.ft.join()==='g'&&r.ids.join()==='sG',w+' atalho abre a revisão por grupos pelo tipo e pelos dias '+JSON.stringify(r));await x.act('hclr')}
 ok(!errs.length,w+' sem erros '+errs.join('|'));await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
