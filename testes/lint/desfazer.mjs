/* Desfazer não reabre telas por cima: depois de registrar (pelo foco do estudo, pelo foco da revisão por sessões, pela revisão de tópico,
   pela revisão de bloco) e ir para outra aba, tocar em "Desfazer" devolve os dados sem abrir o foco, a janela de registro ou a edição.
   Uso: node lint/desfazer.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};delete S0.srv;S0.srvPt=[];
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const tab=async(t,sub)=>{await ev(t=>document.querySelector(`nav [data-tab=${t}]`).click(),t);await W(250);if(sub){await ev(s=>{const e=document.querySelector(`[data-act=rvt][data-id=${s}]`);e&&e.click()},sub);await W(250)}};
/* o que está aberto por cima */
const over=()=>ev(()=>({sx:!!S.sx,rvf:!!(S.rvf&&S.rvf.open!==false&&document.querySelector('.rvfd')),modal:!!document.querySelector('#modal form, #modal .dlg, #modal .sheet'),edit:!!S.edit}));
const undo=async()=>{const r=await ev(()=>{const u=[...document.querySelectorAll('button')].find(b=>/^Desfazer/.test(b.textContent.trim())&&b.offsetParent);if(u){u.click();return true}return false});await W(350);return r};
const clean=o=>!o.sx&&!o.rvf&&!o.modal&&!o.edit;
/* prepara: tópicos e revisões ligadas */
await ev(()=>{const s=current();['Crase','Regência'].forEach((n,i)=>{if(!s.topics.some(t=>t.name===n))s.topics.push({id:'u'+i,name:n,done:false,links:[]})});S.srv={on:true,n:2,y:3,start:today()};trvInit();delete S.trv.off;S.trv.start=today();save();render()});

// 1. estudo pelo foco → outra aba → Desfazer
await tab('ciclo');const sid=await ev(()=>current().id);
await ev(()=>document.querySelector('.nwplay').click());await W(250);await ev(()=>{S.timer.start=Date.now()-30*60000});await x.act('fmreg');await W(300);
await ev(()=>{const g=S.sel.groups;g.length=0;const z=newG();z.nt='Crase';z.rows=[{id:uid(),kind:'aula',name:'Aula 1',link:'',q:'',ac:'6',tq:'10'}];g.push(z);render()});
const n0=await ev(()=>S.sessions.length);let o;await x.submit('#modal form[data-f=man]');await W(300);
ok(await ev(n=>S.sessions.length>n&&!S.sx,n0),'estudo pelo foco registrado e o foco fechou');
/* registro de estudo não tem "Desfazer" (corrige-se pela edição no Histórico); excluir pela edição e desfazer já é conferido no simzero */
await tab('reg');const e1=await ev(()=>{const b=document.querySelector('#app [data-act=edit]');return b?b.dataset.id:null});
if(e1){await x.act('edit',e1);await x.act('delreg');await tab('st');const u1=await undo();o=await over();ok(u1&&await ev(n=>S.sessions.length>n,n0),'excluir pela edição e Desfazer em outra aba devolve o registro');ok(clean(o),'e não reabre a edição nem o foco '+JSON.stringify(o))}
await ev(()=>{S.sx=false;S.timer={running:false,start:0,acc:0};save();render()});

// 2. duas sessões → revisão por sessões pelo foco → registrar → outra aba → Desfazer
await ev(sid=>{const s=S.subjects.find(x=>x.id===sid);['k1','k2'].forEach((k,i)=>S.sessions.push({id:k,ses:k,subj:sid,topic:s.topics[i%2].id,min:30,cycle:S.cycle,set:S.set||1,review:false,kind:'aula',date:today(),items:[{kind:'aula',name:'Aula '+k,link:''}]}));S.progress[sid]=0;S.sel.subj=sid;save();render()},sid);
await tab('ciclo');
if(await ev(()=>!!document.querySelector('.srvc [data-act=srgo]'))){
 await ev(()=>document.querySelector('.srvc [data-act=srgo]').click());await W(300);await ev(()=>document.querySelector('.rvfd [data-act=srall]').click());await W(200);
 await ev(()=>{S.rvf.acc=10*60000;save();render()});await ev(()=>document.querySelector('[data-act=rvfreg]').click());await W(300);
 const p0=await ev(()=>(S.srvPt||[]).length);await x.submit('#modal form[data-f=srreg]');await W(300);
 ok(await ev(p=>(S.srvPt||[]).length===p+1,p0),'revisão por sessões registrada pelo foco');
 await tab('st');const u2=await undo();o=await over();
 ok(u2&&await ev(p=>(S.srvPt||[]).length===p,p0),'Desfazer devolve a revisão por sessões');
 ok(clean(o),'Desfazer nas Estatísticas não reabre o foco da revisão '+JSON.stringify(o));
}else ok(false,'cartão da revisão por sessões não apareceu');

// 3. revisão por tópico → outra aba → Desfazer
await ev(()=>{S.trv.start=addD(today(),-30);S.sessions.forEach(x=>{if(!x.review)x.date=addD(today(),-8)});save();render()});
const k=await ev(()=>{const d=trvDue();return d[0]?d[0].k:null});
if(k){await tab('rev','topicos');await x.act('trvok',k);await x.fill('#modal input[name=m]','0h15');await x.submit('#modal form[data-f=trvok]');await W(300);
 await tab('ciclo');const u3=await undo();o=await over();
 ok(u3&&await ev(k=>trvDue().some(o=>o.k===k),k),'Desfazer devolve a revisão de tópico');ok(clean(o),'Desfazer no Ciclo não reabre a janela da revisão de tópico '+JSON.stringify(o))}
else ok(false,'sem revisão de tópico vencida para o teste');

ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
