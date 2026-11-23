/* Horário dos registros. Histórico: o horário fica ao lado do nome da disciplina, antes do lápis e da lixeira (não na linha de baixo).
   Ver registro: num dia só, o horário entra na aba "O que foi estudado · dd/mm, hh:mm"; em vários dias, cada tópico mostra a data e o horário,
   sem quebrar a linha (no celular, sem o dia da semana). Uso: node lint/horario.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.rv;S0.mode='study';
S0.subjects.push({id:'hx',name:'Disciplina do Horário',goal:600,topics:[{id:'h1',name:'Concordância verbal e nominal com nome comprido',done:false,links:[]},{id:'h2',name:'Crase',done:false,links:[]}]});
S0.subjects.push({id:'hy',name:'Disciplina de Um Dia',goal:600,topics:[{id:'y1',name:'Pontuação',done:false,links:[]}]});
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
await ev(()=>{const d0=today(),d1=addD(d0,-1),base={cycle:S.cycle,set:S.set||1,kind:'aula',min:40};const it=n=>[{id:uid(),kind:'aula',name:'Aula '+n,link:'https://exemplo.test/'+n}];
 S.sessions.push({...base,id:uid(),ses:'kx',subj:'hx',topic:'h1',items:it(1),date:d1,at:'08:39'},{...base,id:uid(),ses:'kx',subj:'hx',topic:'h2',items:it(2),date:d0,at:'19:10'},
  {...base,id:uid(),ses:'ky',subj:'hy',topic:'y1',items:it(3),date:d0,at:'14:05'},{...base,id:uid(),ses:'ky',subj:'hy',topic:'y1',items:it(4),date:d0,at:'15:20'});save();render()});
/* Histórico */
await ev(()=>{tab='reg';render()});await W(300);
let r=await ev(()=>{const R=[...document.querySelectorAll('#hres .ritem')].filter(e=>/Disciplina d/.test(e.textContent));return R.map(e=>{const h=e.querySelector('.hic .hat'),n=e.querySelector('.rsub'),pen=e.querySelector('.hic [data-act=edit]');const a=h&&h.getBoundingClientRect(),c=n.getBoundingClientRect(),q=pen&&pen.getBoundingClientRect();
 return {t:h&&h.textContent,low:!!e.querySelector('.rmeta .hat'),row:a?Math.abs((a.top+a.height/2)-(c.top+c.height/2)):99,before:a&&q?a.right<=q.left+1:false,one:c.height<30}})});
ok(r.length>=2&&r.every(o=>/^\d\d:\d\d$/.test(o.t||'')&&!o.low&&o.row<=6&&o.before&&o.one),'Histórico: horário na linha do nome, antes do lápis, e não na linha de baixo '+JSON.stringify(r));
await ev(()=>{const e=[...document.querySelectorAll('#hres .ritem')].find(e=>/Disciplina de Um Dia/.test(e.textContent));e.scrollIntoView({block:'center'})});await p.screenshot({path:'saida/horario-hist-'+w+'.png'});
/* Ver registro: um dia só */
await ev(()=>{tab='ciclo';ui.rview='hy';render()});await W(300);
r=await ev(()=>(document.querySelector('.dlg.reg .sttab')||{}).textContent||'');
ok(/^O que foi estudado · \d\d\/\d\d, 14:05$/.test(r),'Ver registro de um dia: horário na aba (o primeiro do dia) '+JSON.stringify(r));
await p.screenshot({path:'saida/horario-um-'+w+'.png'});
/* Ver registro: vários dias */
await ev(()=>{ui.rview='hx';render()});await W(300);
r=await ev(()=>{const D=document.querySelector('.dlg.reg');return {tab:D.querySelector('.sttab').textContent,wh:[...D.querySelectorAll('.rvwh')].map(e=>({t:e.textContent,vis:e.innerText,h:e.closest('.rvtn').getBoundingClientRect().height,in:e.getBoundingClientRect().right<=D.getBoundingClientRect().right+1})),tall:[...D.querySelectorAll('.rvtn .tpcl')].filter(e=>e.getBoundingClientRect().height>30).length}});
ok(/^O que foi estudado · \d\d\/\d\d a \d\d\/\d\d$/.test(r.tab)&&r.wh.length===2&&/· 08:39$/.test(r.wh[0].t)&&/· 19:10$/.test(r.wh[1].t)&&r.wh.every(o=>o.h<34&&o.in)&&!r.tall,'Ver registro de vários dias: cada tópico com data e horário, numa linha só '+JSON.stringify(r));
if(w<=420)ok(r.wh.every(o=>!/^(dom|seg|ter|qua|qui|sex|sáb),/.test(o.vis)),'celular: sem o dia da semana, para sobrar espaço ao nome '+JSON.stringify(r.wh.map(o=>o.vis)));
else ok(r.wh.every(o=>/^(dom|seg|ter|qua|qui|sex|sáb), /.test(o.vis)),'computador: com o dia da semana '+JSON.stringify(r.wh.map(o=>o.vis)));
await p.screenshot({path:'saida/horario-varios-'+w+'.png'});
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
