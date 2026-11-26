/* Planos: no único plano vazio não há lixeira nem "Nova rodada"; rodadas vazias voltam à rodada 1 ao abrir;
   com estudo na rodada, aparece "Nova rodada"; o único plano com conteúdo pede confirmação antes de excluir.
   Uso: node lint/plvazio.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
/* app com um plano só, vazio, que já ganhou duas "novas rodadas" sem estudo */
const S0=JSON.parse(fs.readFileSync(F,'utf8'));const pid=S0.plan||'p1';S0.plans=[{id:pid,name:'Meu plano'}];S0.plan=pid;S0.planData={};S0.subjects=[];S0.sessions=[];S0.set=3;S0.rod={1:{hist:{},cycle:1},2:{hist:{},cycle:1}};S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.rv;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const card=()=>ev(()=>{const c=document.querySelector('.plans .plrow');return c?{txt:c.innerText.replace(/\s+/g,' '),del:!!c.querySelector('[data-act=pldel]'),nr:!!c.querySelector('[data-act=plset]')}:null});
await ev(()=>{ui.pl=true;render()});await W(300);
let r=await card();ok(r&&/Ciclo 1 · 0 disciplinas/.test(r.txt)&&!/Rodada/.test(r.txt),'rodadas vazias voltam à rodada 1 '+JSON.stringify(r&&r.txt));
ok(r&&!r.del&&!r.nr,'único plano vazio: sem lixeira e sem "Nova rodada"');
/* com uma disciplina e um estudo registrado */
await ev(()=>{S.subjects.push({id:'d1',name:'Português',goal:60,topics:[{id:'t1',name:'Crase',done:false,links:[]}]});S.sessions.push({id:uid(),ses:uid(),subj:'d1',topic:'t1',min:30,cycle:1,set:1,review:false,kind:'aula',items:[],date:today()});save();ui.pl=true;render()});await W(300);
r=await card();ok(r&&r.del&&r.nr,'com estudo: aparecem a lixeira e "Nova rodada"');
await x.act('pldel');await W(300);
r=await ev(()=>({q:(document.querySelector('.plans .rqzq')||{}).innerText||'',n:S.subjects.length}));
ok(/Excluir este plano\?/.test(r.q)&&/plano novo e vazio/.test(r.q)&&r.n===1,'único plano com conteúdo: pede confirmação antes '+JSON.stringify(r.q.slice(0,80)));
await x.act('pldelx');await W(200);ok(await ev(()=>!document.querySelector('.plans .rqzq')&&S.subjects.length===1),'Voltar: nada muda');
await x.act('pldel');await W(200);await x.act('pldelok');await W(400);
r=await ev(()=>({n:S.subjects.length,s:S.sessions.length,pl:S.plans.length,nome:S.plans[0].name}));ok(r.n===0&&r.s===0&&r.pl===1&&r.nome==='Meu plano','Excluir: entra um plano novo e vazio '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
