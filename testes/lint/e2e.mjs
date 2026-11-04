import {open,mk,W} from './lib.mjs';
import fs from 'fs';
const [OUT,STAGE='all']=process.argv.slice(2);
const {b,p,errs}=await open();const x=mk(p);
const log=[],bugs=[];let step='';
const ok=(c,m)=>{log.push((c?'OK   ':'FALHA ')+step+' · '+m);if(!c)bugs.push(step+' · '+m)};
const shot=async n=>{await p.screenshot({path:`${OUT}/${n}.png`})};
/* Verificações gerais a cada etapa: erros de script, textos quebrados, rolagem lateral */
async function sanity(tag){const r=await x.ev(()=>{const t=document.body.innerText;return {bad:(t.match(/\bNaN\b|\bundefined\b|\bnull\b|Infinity|\[object Object\]/g)||[]).slice(0,5),ovf:document.documentElement.scrollWidth>innerWidth+1}});
 if(r.bad.length)ok(false,tag+': texto quebrado '+JSON.stringify(r.bad));if(r.ovf)ok(false,tag+': rolagem lateral');
 if(errs.length){ok(false,tag+': '+errs.join(' | '));errs.length=0}}
const run=async(name,fn)=>{step=name;try{await fn()}catch(e){ok(false,'EXCEÇÃO: '+e.message.split('\n')[0]);await shot('erro-'+name.replace(/\W+/g,'_'))}await sanity(name)};
const tab=async t=>{await x.ev(t=>document.querySelector(`nav [data-tab="${t}"]`).click(),t);await W(300)};
const st=()=>x.ev(()=>({cycle:S.cycle,set:S.set||1,ses:S.sessions.length,today:today()}));

// ===== 1. Começo do zero: boas-vindas, plano, disciplinas e tópicos =====
const PLAN=[['Português','Crase\nRegência\nConcordância\nPontuação'],['Direito Constitucional','Direitos fundamentais\nOrganização do Estado\nPoder Legislativo'],['Informática','Redes\nSegurança\nExcel']];
await run('1 plano',async()=>{
 await x.txt('Usar só neste aparelho');await x.txt('Monte seu plano');
 for(const [n,tops] of PLAN){await x.txt('+ Nova disciplina');await x.fill('#modal input[name=n]',n);await x.submit('#modal form');
  const sid=await x.ev(n=>S.subjects.find(s=>s.name===n).id,n);await x.act('pdedit',sid);await x.act('pdaddopen',sid);await x.fill('#modal textarea[name=t]',tops);await x.txt('Adicionar');await x.act('pdsave',sid)}
 await x.act('plclose');
 const r=await x.ev(()=>S.subjects.map(s=>s.name+':'+s.topics.length));ok(r.join()==='Português:4,Direito Constitucional:3,Informática:3','disciplinas e tópicos criados: '+r.join(', '));
 // meta de Informática para 1h
 await x.act('edopen');const iid=await x.ev(()=>S.subjects.find(s=>s.name==='Informática').id);
 await x.fill(`#modal #tf-goal-${iid}`,'1h00');await x.act('edclose');
 ok(await x.ev(()=>S.subjects.find(s=>s.name==='Informática').goal===60),'meta de Informática mudou para 1h');
});

/* Estuda uma disciplina num dia: Iniciar pelo cartão Agora, cronômetro adiantado, Registrar com tópico e aula */
let aula=1;
async function studyNext({pauseTest=false}={}){
 await tab('ciclo');
 const s=await x.ev(()=>{const c=current();return c?{id:c.id,name:c.name,goal:c.goal,tops:c.topics.map(t=>t.name)}:null});if(!s)throw new Error('sem disciplina da vez');
 await x.ev(()=>document.querySelector('.nwplay').click());await W(250);
 if(!(await x.ev(()=>S.sx===true&&S.timer.running)))throw new Error('Iniciar não abriu o foco');
 await x.ev(m=>{S.timer.start=Date.now()-m*60000},Math.min(s.goal,50));
 if(pauseTest){await x.act('fmoff');ok(await x.ev(id=>pzMs(id)>0&&!S.sx,s.id),'sair do foco guarda a pausa ('+s.name+')');
  ok(await x.ev(()=>document.querySelector('.nwplay span').textContent==='Retomar'),'Agora mostra Retomar');
  await x.ev(()=>document.querySelector('.nwplay').click());await W(250);ok(await x.ev(()=>S.sx===true&&el()>=40*60000),'Retomar continua o tempo')}
 await x.act('fmreg');
 const tp=s.tops[(aula-1)%s.tops.length];
 await x.fill('#modal input[id^="n-"]',tp);if(await p.evaluate(()=>!document.querySelector('#modal input[id^="r-"]')))await x.act('addrow');await x.fill('#modal input[id^="r-"]','Aula '+aula);aula++;
 const before=await x.ev(()=>S.sessions.length);
 await x.submit('#modal form[data-f=man]');
 const after=await x.ev(id=>({n:S.sessions.length,done:gDone(S.subjects.find(x=>x.id===id)),sx:S.sx,msg:ui.msg}),s.id);
 if(after.n<=before)throw new Error('registro não gravou ('+s.name+'): '+after.msg);
 ok(after.done&&!after.sx,'registrou '+s.name+' ('+tp+')');
 return s}

// ===== 2. Rodada 1: dois ciclos, um dia por sessão =====
async function cycle(label,{pauseTest=false}={}){
 await run(label,async()=>{
  const n=await x.ev(()=>actives().length);
  for(let i=0;i<n;i++){await x.days(1);await studyNext({pauseTest:pauseTest&&i===0})}
  await tab('ciclo');await shot(label.replace(/\W+/g,'_')+'-fim');
  ok(await x.ev(()=>actives().every(gDone)),'todas concluídas no '+label);
 })}
async function nextCycle(label){await run(label,async()=>{await tab('ciclo');const c0=await x.ev(()=>S.cycle);
  const b1=await x.ev(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/Novo ciclo|Próximo ciclo|Iniciar ciclo/i.test(b.textContent));return b?b.textContent.trim():null});
  ok(!!b1,'botão de novo ciclo aparece ('+b1+')');if(b1)await x.txt(b1);
  ok(await x.ev(c=>S.cycle===c+1&&actives().every(s=>!gDone(s)),c0),'ciclo avançou para '+(c0+1))})}


/* Revisão de grupo: inicia, marca as aulas de cada disciplina, registra com tempo; ao fim a revisão sai do modo revisão */
async function reviewGroup(label){await run(label,async()=>{
 await tab('rev');await x.ev(()=>{const b=document.querySelector('[data-act=rvt][data-id=hoje]');if(b)b.click()});await W(200);
 const g=await x.ev(()=>{const o=rgInfo().list.find(o=>o.st==='disponivel');return o?o.g.id:null});ok(!!g,'há grupo disponível');if(!g)return;
 await x.act('rvstart',g);ok(await x.ev(()=>S.type==='review'&&!!S.rv),'revisão iniciada');
 for(let k=0;k<6;k++){
  const c=await x.ev(()=>{if(!S.rv)return null;const c=actives().find(s=>!gDone(s));return c?{id:c.id,name:c.name}:null});if(!c)break;
  await x.ev(id=>{const b=document.querySelector(`[data-act=pickrow][data-id="${id}"]`);if(b)b.click()},c.id);await W(200);
  const n=await x.ev(()=>{const cs=[...document.querySelectorAll('#app .rvcard input[type=checkbox]:not(:checked):not(:disabled)')];cs.forEach(c=>c.click());return cs.length});await W(250);
  await x.act('rreg',c.id);await x.fill('#modal input[name=m]','0h20');await x.submit('#modal form[data-f=man]');
  ok(await x.ev(id=>!S.rv||gDone(S.subjects.find(x=>x.id===id)),c.id),'revisou '+c.name+' ('+n+' aulas marcadas)')}
 const fim=await x.ev(()=>({rv:!!S.rv,type:S.type}));
 if(fim.rv){const b=await x.ev(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/Concluir revisão|Finalizar revisão|Encerrar revisão/i.test(b.textContent));return b?b.textContent.trim():null});if(b)await x.txt(b)}
 ok(await x.ev(g=>!S.rv&&S.reviewed&&!!S.reviewed[g],g),'grupo marcado como revisado');
 await shot(label.replace(/\W+/g,'_'));
})}

// grupos de 3 dias de estudo, revisão 2 dias depois de fechar
await run('1a ligar revisões',async()=>{await tab('rev');ok(/desligadas/.test(await x.ev(()=>document.getElementById('app').innerText)),'app novo: revisões desligadas');await x.act('rvadj');await x.act('rvsys','g');await x.act('rvsys','t');ok(await x.ev(()=>rgOn()&&tvOn()),'ligou grupos e por tópico');await x.ev(()=>{ui.rvadj=null;render()})});
await run('1b ajustes de grupo',async()=>{await tab('rev');await x.act('rvadj');await x.act('rvcfg');await x.fill('#modal input[name=i]','3');await x.fill('#modal input[name=w]','2');await x.submit('#modal form[data-f=rvcfg]');await x.ev(()=>{ui.rvadj=null;render()});
 ok(await x.ev(()=>rvInt()===3&&rvWait()===2),'grupos de 3 dias, revisar 2 dias depois')});

await cycle('2 rodada1-ciclo1',{pauseTest:true});
await run('2b espera',async()=>{await x.days(2)});await reviewGroup('2c revisão grupo 1');
await nextCycle('3 novo ciclo');
await cycle('4 rodada1-ciclo2');
await run('4b espera',async()=>{await x.days(2)});await reviewGroup('4c revisão grupo 2');

// ===== Revisão por tópico: chega a 21 dias do primeiro estudo =====
await run('5 revisão por tópico',async()=>{
 await x.days(16);await tab('rev');await x.act('rvt','topicos');
 const due=await x.ev(()=>trvDue().length);ok(due>0,'tópicos vencidos: '+due);await shot('5-topicos');
 const k1=await x.ev(()=>trvDue()[0].k);await x.act('trvok',k1);await x.fill('#modal input[name=m]','0h15');await x.submit('#modal form[data-f=trvok]');
 ok(await x.ev(k=>trvList().find(o=>o.k===k).n===1,k1),'registrou a 1ª revisão do tópico');
 ok(await x.ev(()=>S.sessions.some(s=>s.trv)),'tempo da revisão entrou no histórico');
 const k2=await x.ev(()=>trvDue()[0]&&trvDue()[0].k);if(k2){await x.act('trvok',k2);await x.act('trvend',k2);
  ok(await x.ev(k=>!!trvList().find(o=>o.k===k).end,k2),'encerrou um estudo');
  await x.ev(()=>{const b=[...document.querySelectorAll('.trvgh')].find(b=>/Finalizados/.test(b.textContent));if(b&&b.getAttribute('aria-expanded')!=='true')b.click()});await W(200);
  await x.act('trvres',k2);ok(await x.ev(k=>!trvList().find(o=>o.k===k).fix,k2),'retomou o estudo')}
 const k3=await x.ev(()=>trvDue()[0]&&trvDue()[0].k);if(k3){await x.act('trvtog','tdi:'+k3);ok(await x.ev(()=>document.querySelectorAll('.rvits .rvit').length>0),'setinha mostra as aulas do dia')}
 await x.act('rvcalm');ok(await x.ev(()=>!!document.querySelector('#modal .rcy')),'calendário abre');
 const dd=await x.ev(()=>{const c=[...document.querySelectorAll('#modal .rcy[data-id]')].find(c=>c.querySelector('.rctp'));return c?c.dataset.id:null});if(dd){await x.act('rcday',dd);ok(await x.ev(()=>!!document.querySelector('#modal .rctl')),'dia com tópicos mostra o painel')}
 await x.act('rvcalx');
 await x.act('rvadj');await x.act('trvcfg');ok(await x.ev(()=>!!document.querySelector('#modal [data-f=trvcfg]')),'janela de intervalos abre');await x.act('trvcfgx');
 await x.act('rvadj');await x.act('rvsys','t');ok(await x.ev(()=>!!document.querySelector('#modal .tvoffq')),'confirmação ao desligar');await x.act('tvoffok');
 ok(await x.ev(()=>!tvOn()&&trvList().every(o=>o.fix)),'desligar encerra as agendas');
 await x.ev(()=>{const u=[...document.querySelectorAll('button')].find(b=>/Desfazer/.test(b.textContent));u&&u.click()});await W(300);
 ok(await x.ev(()=>tvOn()),'Desfazer religa');
 await x.ev(()=>{ui.rvadj=null;render()});
});

// ===== Rodada 2 =====
await run('6 nova rodada',async()=>{const s0=await x.ev(()=>S.set||1);await x.ev(()=>document.querySelector('nav [data-nav=pl]').click());await W(300);
 const pid=await x.ev(()=>S.plan);await x.act('plset',pid);await W(300);
 ok(await x.ev(s=>(S.set||1)===s+1&&S.cycle===1&&actives().every(s=>!gDone(s)),s0),'rodada 2 começou no ciclo 1');
 await x.ev(()=>{const b=document.querySelector('#modal [data-act=plclose]');b&&b.click()});await W(200)});
await cycle('7 rodada2-ciclo1');
await run('7b espera',async()=>{await x.days(2)});await reviewGroup('7c revisão grupo (rodada 2)');
await nextCycle('8 novo ciclo');
await cycle('9 rodada2-ciclo2');
await run('9b espera',async()=>{await x.days(2)});await reviewGroup('9c revisão grupo 2 (rodada 2)');

// ===== Histórico: editar, excluir e desfazer =====
await run('10 histórico',async()=>{await tab('reg');await shot('10-historico');
 const n0=await x.ev(()=>S.sessions.length);
 const e=await x.ev(()=>{const b=document.querySelector('#app [data-act=edit]');return b?b.dataset.id:null});ok(!!e,'há botão de editar');
 if(e){await x.act('edit',e);ok(await x.ev(()=>!!S.edit),'editar abre');await x.fill('#modal [data-em]','0h45');await x.act('saveedit');ok(await x.ev(()=>!S.edit),'salvou a edição')}
 const d=await x.ev(()=>{const b=document.querySelector('#app [data-act=edit]');return b?b.dataset.id:null});
 if(d){await x.act('edit',d);await x.act('delreg');const n1=await x.ev(()=>S.sessions.length);ok(n1<n0,'excluiu um registro');
  await x.ev(()=>{const u=[...document.querySelectorAll('button')].find(b=>/Desfazer/.test(b.textContent));u&&u.click()});await W(300);ok(await x.ev(n=>S.sessions.length===n,n0),'Desfazer devolveu o registro')}
});
// ===== Estatísticas =====
await run('11 estatísticas',async()=>{await tab('st');await shot('11-estatisticas');
 const pers=await x.ev(()=>[...document.querySelectorAll('#app [data-act=sper]')].map(b=>b.dataset.id));for(const pr of pers){await x.act('sper',pr)}
 ok(true,'períodos percorridos: '+pers.join(','))});
// ===== Planos: criar, voltar, excluir =====
await run('12 planos',async()=>{await x.ev(()=>document.querySelector('nav [data-nav=pl]').click());await W(300);
 await x.fill('#modal input[name=n]','Plano B');await x.submit('#modal form[data-f=plnew]');
 const pb=await x.ev(()=>S.plans.find(p=>p.name==='Plano B'));ok(!!pb,'criou Plano B');
 if(pb){const cur=await x.ev(()=>S.plans.find(p=>p.id===S.plan).name);ok(true,'plano atual depois de criar: '+cur);
  if(cur!=='Meu plano'){await x.ev(()=>{const b=document.querySelector('#modal [data-act=plback]');b&&b.click()});await W(300);const pa=await x.ev(()=>S.plans.find(p=>p.name==='Meu plano').id);await x.act('plsw',pa).catch(e=>ok(false,'trocar de plano: '+e.message))}
  ok(await x.ev(()=>S.plans.find(p=>p.id===S.plan).name==='Meu plano'&&S.sessions.length>10),'Meu plano continua com os dados');
  await x.ev(()=>{if(!document.querySelector('#modal [data-act=plclose]'))document.querySelector('nav [data-nav=pl]').click()});await W(300);
  await x.act('pldel',pb.id).catch(e=>ok(false,e.message));const c=await x.ev(()=>{const b=[...document.querySelectorAll('#modal button')].find(b=>b.offsetParent&&/^Excluir/.test(b.textContent.trim()));if(b){b.click();return b.textContent.trim()}return null});await W(300);
  ok(await x.ev(()=>!S.plans.some(p=>p.name==='Plano B')),'excluiu Plano B ('+c+')')}
 await x.ev(()=>{const b=document.querySelector('#modal [data-act=plclose]');b&&b.click()});await W(200)});
// ===== Configurações: tema =====
await run('13 configurações',async()=>{await tab('bk');await shot('13-config');
 const th=await x.ev(()=>[...document.querySelectorAll('#app [data-act=theme]')].map(b=>b.dataset.id));for(const t of th)await x.act('theme',t);
 ok(th.length>0,'temas: '+th.join(','))});
// ===== Recarregar mantém a aba =====
await run('14 recarregar',async()=>{await tab('st');await p.reload();await W(600);ok(await x.ev(()=>tab==='st'),'continua em Estatísticas')});
// ===== Celular: todas as abas sem rolagem lateral =====
await run('15 celular',async()=>{await p.setViewport({width:360,height:760});for(const t of ['ciclo','rev','reg','st','bk']){await x.ev(t=>document.querySelector(`[data-tab="${t}"]`).click(),t);await W(300);await sanity('celular '+t);await shot('15-cel-'+t)}
 await x.ev(()=>document.querySelector('[data-tab=rev]').click());for(const v of ['grupos','topicos']){await x.ev(v=>{const b=document.querySelector(`[data-act=rvt][data-id=${v}]`);b&&b.click()},v);await W(250);await sanity('celular rev '+v);await shot('15-cel-rev-'+v)}
 await p.setViewport({width:1280,height:800})});

console.log(JSON.stringify(await st()));
console.log(log.join('\n'));console.log('\nPROBLEMAS: '+bugs.length);bugs.forEach(b=>console.log(' - '+b));
await b.close();
