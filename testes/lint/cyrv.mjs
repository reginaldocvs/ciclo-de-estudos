import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD]=process.argv.slice(2);const w=+(WD||1280);
const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:860});const x=mk(p);
const tabTo=async t=>{await x.ev(t=>document.querySelector(`nav [data-tab=${t}]`).click(),t);await W(250)};
const shot=n=>p.screenshot({path:`${OUT}/cy-${w}-${n}.png`});
// fecha o ciclo atual registrando todas as disciplinas que faltam
let k=0;
const finish=async()=>{await tabTo('ciclo');for(let i=0;i<20;i++){const id=await x.ev(()=>{const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)break;
 await x.act('rreg',id);await x.ev(k=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Tópico C'+S.cycle+'-'+k;g.rows[0].name='Aula '+k;render()},++k);await x.submit('#modal form[data-f=man]');await W(250)}};
// liga revisão por ciclos: a cada 2, 50%
await tabTo('rev');await x.act('rvadj');await W(200);await shot('ajustes-off');
const c0=await x.ev(()=>S.cycle);
await x.ev(()=>document.querySelector('[data-act=rvsys][data-id=c]').click());await W(200);
ok(await x.ev(()=>cyOn()&&!rgOn()),'ligar por ciclos desliga por grupos');
await shot('ajustes-on');
await x.act('cycfg');await W(200);
await x.ev(()=>{const f=document.querySelector('form[data-f=cycfg]');f.elements.cn.value=3;f.querySelector('.rvstep[data-k=cn][data-d="-1"]').click()});
await shot('cfg');await x.submit('form[data-f=cycfg]');await W(200);
ok(await x.ev(()=>cyN()===2),'ajuste salvo: 2 ciclos');
await shot('rev-status');
ok(await x.ev(()=>!!document.querySelector('[data-act=rvt][data-id=ciclos]')&&!document.querySelector('[data-act=rvt][data-id=grupos]')),'visão Ciclos no lugar de Grupos');await x.act('rvt','ciclos');await shot('visao-ciclos');ok(/Próximo ciclo de revisão/.test(await x.ev(()=>document.getElementById('app').innerText)),'visão Ciclos mostra quando vem o próximo');
// ciclo atual + mais um
await finish();ok(await x.ev(()=>/Iniciar ciclo \d/.test(document.getElementById('app').innerText)),'1º ciclo: botão é Iniciar ciclo N');
await x.act('next');await W(250);
await finish();const lb=await x.ev(()=>document.querySelector('[data-act=next]').textContent);ok(lb==='Iniciar ciclo de revisão','2º ciclo: botão vira "'+lb+'"');
await shot('fim');
const goals=await x.ev(()=>Object.fromEntries(S.subjects.map(s=>[s.id,s.goal])));
await x.act('next');await W(300);
const st=await x.ev(()=>({rv:S.rv,mode:S.mode,type:S.type,cy:S.cycle,goals:Object.fromEntries(S.subjects.map(s=>[s.id,s.goal]))}));
ok(st.rv&&st.rv.cy&&st.mode==='review'&&st.cy===c0+2&&await x.ev(()=>tab==='rev'),'ciclo de revisão começa sozinho, ciclo de estudo não avança: '+JSON.stringify({src:st.rv&&st.rv.src,cy:st.cy}));
ok(Object.keys(goals).every(id=>!st.goals[id]||st.goals[id]===goals[id]),'metas iguais às de estudo');
await shot('revisao');
const txt=await x.ev(()=>document.getElementById('app').innerText);ok(/Tópico C/.test(txt),'tópicos dos ciclos aparecem para revisar');
// aba Revisão mostra o mesmo; volta ao Ciclo continua em revisão
await tabTo('ciclo');ok(await x.ev(()=>S.mode==='study'&&/Ciclo de revisão em andamento/.test(document.getElementById('app').innerText)),'aba Ciclo avisa e espera');await shot('ciclo-espera');await x.ev(()=>document.querySelector('#app [data-tab=rev]').click());await W(300);ok(await x.ev(()=>S.mode==='review'&&rvtCur()==='ciclos'&&!!document.querySelector('.seg.on[data-id=ciclos]')&&!!document.querySelector('#app [data-act=rreg]')),'Continuar revisão abre a visão Ciclos com a revisão');
await x.act('rvt','hoje');ok(/Revisão em andamento/.test(await x.ev(()=>document.getElementById('app').innerText)),'Hoje mostra Revisão em andamento');await shot('hoje-run');
await x.ev(()=>document.querySelector('[data-act=rvcalm]').click());await W(300);ok(await x.ev(()=>!!document.querySelector('#modal .dlg')||!document.querySelector('.rvcalb')||getComputedStyle(document.querySelector('.rvcalb')).display==='none'),'calendário abre durante a revisão');await shot('cal-run');await x.ev(()=>{ui.rvcalm=null;render()});await x.act('rvt','topicos');ok(await x.ev(()=>!document.querySelector('#app [data-act=rreg]')),'Tópicos mostra só tópicos');
await x.act('rvt','hoje');await x.act('rvt','ciclos');ok(await x.ev(()=>!!document.querySelector('#app [data-act=rreg]')),'Continuar volta à revisão');
// marca tudo e registra cada disciplina
for(let i=0;i<20;i++){const id=await x.ev(()=>{const s=actives().find(s=>!gDone(s));return s?s.id:null});if(!id)break;
 await x.ev(id=>{const s=S.subjects.find(z=>z.id===id);rvRows(s).forEach(o=>o.rows.forEach(r=>S.checked[r.k]=true));render()},id);
 await x.act('rreg',id);await x.fill('#modal input[name=m]','2h00');await x.submit('#modal form[data-f=man]');await W(250)}
await shot('revisao-fim');
ok(await x.ev(()=>!!document.querySelector('[data-act=rvend]')),'Concluir revisão aparece');
await x.act('rvend');await W(300);
const e=await x.ev(()=>({rv:S.rv,mode:S.mode,last:S.cyrv.last,cy:S.cycle,goals:Object.fromEntries(S.subjects.map(s=>[s.id,s.goal])),h:(S.reviews||[]).slice(-1)[0]}));
ok(!e.rv&&e.mode==='study'&&e.last===c0+1&&e.cy===c0+2,'concluir volta ao estudo no ciclo '+e.cy+', last='+e.last);
ok(Object.keys(goals).every(id=>!e.goals[id]||e.goals[id]===goals[id]),'metas de estudo voltam');
await shot('depois');
// histórico mostra a revisão
await tabTo('reg');await x.ev(()=>{const b=[...document.querySelectorAll('#app button,#app select')].filter(b=>b.offsetParent&&/^Ciclos/.test(b.textContent.trim()));if(b.length)(b[1]||b[0]).click()});await W(300);await shot('hist');ok(/Revisão · Ciclos 3 e 4/.test(await x.ev(()=>document.body.innerText+[...document.querySelectorAll('option')].map(o=>o.textContent).join('|'))),'Histórico mostra "Revisão · Ciclos ..."');
// pular: completa mais 2 ciclos e pula
await finish();await x.act('next');await W(250);await finish();
// avança sem iniciar: simula cancelar
await x.act('next');await W(300);ok(await x.ev(()=>!!(S.rv&&S.rv.cy)),'2ª revisão começa');
await x.act('rvcancel');await tabTo('ciclo');await W(300);
ok(/Ciclo de revisão/.test(await x.ev(()=>document.getElementById('app').innerText)),'cancelar mostra o aviso com Começar/Pular');await shot('portao');
await x.act('cyskip');await W(300);ok(await x.ev(()=>!cyDue()&&S.cyrv.last===S.cycle-1),'pular libera o ciclo');
// religar grupos desliga ciclos
await tabTo('rev');await x.act('rvadj');await W(200);await x.ev(()=>document.querySelector('[data-act=rvsys][data-id=g]').click());await W(200);ok(await x.ev(()=>rgOn()&&!cyOn()),'ligar grupos desliga ciclos');
// recarregar mantém
await x.ev(()=>{document.querySelector('[data-act=rvsys][data-id=c]').click()});await W(200);await p.reload();await W(800);ok(await x.ev(()=>cyOn()),'recarregar mantém');
log.push('erros: '+JSON.stringify(errs));await b.close();console.log(log.join('\n'));
