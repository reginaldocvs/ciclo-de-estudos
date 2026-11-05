/* Listas longas: 6 itens no celular e no computador, "Mostrar mais N · R restantes" e "Mostrar menos".
   Confere Revisão → Hoje (Para hoje, Em breve), Para refazer (janela), Tópicos (Para revisar, Próximas) e Histórico */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const N=6;
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
const dA=n=>{const d=new Date(Date.now()-n*864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const s=S0.subjects.find(x=>!x.off&&!x.of);s.topics=[];S0.sessions=[];
/* 30 tópicos estudados em dias passados (revisão vencida), 12 estudados hoje (próximas, em breve); 13 com questões abaixo do limite */
for(let i=0;i<42;i++){const id='tp'+i,old=i<30;s.topics.push({id,name:'Tópico de exemplo '+(i+1),done:false,links:[]});
 S0.sessions.push({id:'s'+i,ses:'s'+i,subj:s.id,topic:id,min:30,cycle:1,set:1,review:false,kind:'aula',date:old?dA(8+i):dA(0),items:i<13?[{kind:'aula',name:'Aula '+(i+1),link:'',ac:2,tq:10}]:[]})}
S0.trv={start:'2020-01-01',t:{}};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
const cnt=sel=>x.ev(q=>document.querySelectorAll(q).length,sel);
const pg=k=>x.ev(k=>{const m=document.querySelector('.pgm[data-pgk="'+k+'"]');return m?[...m.querySelectorAll('button')].map(b=>b.textContent.trim()):null},k);
const clk=(k,a)=>x.ev(([k,a])=>document.querySelector('.pgm[data-pgk="'+k+'"] [data-act="'+a+'"]').click(),[k,a]);
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.ev(()=>{const e=document.querySelector('[data-act=rvt][data-id=hoje]');e&&e.click()});await W(300);
// Para hoje
let n=await cnt('.rvtoday .trvr:not(.tdg)'),m=await pg('hoje');
ok(n===N&&m&&m[0]===`Mostrar mais ${N} · ${30-N} restantes`&&m.length===1,`Para hoje: ${n} de 30 e "${m}"`);
await p.screenshot({path:`${OUT}/paginas-${w}-hoje.png`});
await clk('hoje','pgmore');await W(200);n=await cnt('.rvtoday .trvr:not(.tdg)');m=await pg('hoje');
ok(n===2*N&&m.length===2&&m[1]==='Mostrar menos',`Mostrar mais: ${n} itens e "${m}"`);
while((await pg('hoje')).length===2&&/Mostrar mais/.test((await pg('hoje'))[0])){await clk('hoje','pgmore');await W(150)}
n=await cnt('.rvtoday .trvr:not(.tdg)');m=await pg('hoje');ok(n===30&&m.join()==='Mostrar menos','tudo aberto: 30 itens e só "Mostrar menos"');
await x.ev(()=>document.querySelector('.pgm[data-pgk=hoje]').scrollIntoView({block:'end'}));await W(100);
await clk('hoje','pgless');await W(300);n=await cnt('.rvtoday .trvr:not(.tdg)');
const top=await x.ev(()=>Math.round(document.querySelector('.rvtoday').getBoundingClientRect().top));
ok(n===N&&top>=0,`Mostrar menos: volta a ${n} e o cartão fica à vista (topo em ${top}px)`);
// Em breve (12 em 7 dias)
n=await cnt('.tdsoon .trvli');m=await pg('breve');ok(n===N&&m&&m[0]===`Mostrar mais ${N}`,`Em breve: ${n} de 12 e "${m}"`);
// Para refazer (13)
await x.ev(()=>document.querySelector('.rdcard .rdall').click());await W(400);n=await cnt('.rddlg .rdi');m=await pg('redo');
ok(n===N&&m&&m[0]===`Mostrar mais ${N} · ${13-N} restantes`,`Para refazer (janela): ${n} de 13 e "${m}"`);
await p.screenshot({path:`${OUT}/paginas-${w}-refazer.png`});
await clk('redo','pgmore');await W(200);ok(await cnt('.rddlg .rdi')===2*N,'Para refazer: mais abre outra leva');
await x.ev(()=>document.querySelector('.rddlg [data-act=redoclose]').click());await W(400);
// Tópicos
await x.ev(()=>document.querySelector('[data-act=rvt][data-id=topicos]').click());await W(300);
n=await cnt('.trvc .trvr');m=await pg('trvdue');ok(n===N&&m&&m[0]===`Mostrar mais ${N} · ${30-N} restantes`,`Tópicos → Para revisar: ${n} de 30 e "${m}"`);
n=await cnt('.trvc .trvl .trvli');m=await pg('trvnx');ok(n===N&&!!m,`Tópicos → Próximas: ${n} de 12 e "${m}"`);
// trocar de aba volta ao começo
await clk('trvdue','pgmore');await W(200);await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(300);
// Histórico (42 registros)
n=await cnt('.hlist .ritem');m=await pg('hist');ok(n===N&&m&&m[0]===`Mostrar mais ${N} · ${42-N} restantes`,`Histórico: ${n} de 42 e "${m}"`);
await x.ev(()=>document.querySelector('.pgm[data-pgk=hist] [data-act=hmore]').click());await W(300);n=await cnt('.hlist .ritem');m=await pg('hist');
ok(n===2*N&&m[1]==='Mostrar menos','Histórico: mais abre outra leva e mostra "Mostrar menos"');
await x.ev(()=>document.querySelector('.pgm[data-pgk=hist]').scrollIntoView({block:'end'}));await W(100);await p.screenshot({path:`${OUT}/paginas-${w}-hist.png`});
await x.ev(()=>document.querySelector('.pgm[data-pgk=hist] [data-act=pgless]').click());await W(300);ok(await cnt('.hlist .ritem')===N,'Histórico: menos volta ao começo');
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.ev(()=>document.querySelector('[data-act=rvt][data-id=topicos]').click());await W(300);
ok(await cnt('.trvc .trvr')===N,'trocar de aba volta a lista ao começo');
ok(!(await x.ev(()=>document.documentElement.scrollWidth>innerWidth)),'sem rolagem para o lado');
ok(!errs.length,'sem erros na página '+JSON.stringify(errs));
await b.close();console.log(bad?'FALHOU':'TUDO OK');process.exit(bad?1:0);
