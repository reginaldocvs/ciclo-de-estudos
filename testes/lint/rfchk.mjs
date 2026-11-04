import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD]=process.argv.slice(2);const w=+(WD||390);
const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);S0.trv={start:'2026-09-25',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:w<500?844:900});const x=mk(p);try{
const shot=n=>p.screenshot({path:`${OUT}/rf-${w}-${n}.png`});
const A=await x.ev(()=>inCycle().map(s=>s.id));const s=A[1];
// 1. registro
await x.act('rreg',s);const g=await x.ev(()=>S.sel.groups[0].id);await x.act('addrow',g);
ok(await x.ev(()=>document.querySelector('#modal [data-rn]').placeholder==='Assunto'&&/Onde/.test(document.querySelector('#modal .rbody .rlb').textContent)&&document.querySelector('#modal [data-rl]').placeholder.startsWith('Link ou local')),'campos Assunto e Onde');
await x.fill('#modal [data-gn]','Crase');await x.fill('#modal [data-rl]','PDF p. 12');
await x.ev(()=>{S.sel.mt='0h20';render()});await x.submit('#modal form[data-f=man]');await W(200);
ok(await x.ev(()=>document.getElementById('app')&&/assunto/i.test(ui.msg||'')),'só local, sem assunto: pede o assunto ('+await x.ev(()=>ui.msg)+')');
await x.fill('#modal [data-rn]','Crase – regra geral');await x.ev(()=>{S.sel.groups[0].rows[0].open=false;render()});
ok(await x.ev(()=>/tem local da aula/.test(document.querySelector('#modal .rsig')?.getAttribute('aria-label')||'')),'linha fechada mostra o sinal de local (livro)');
await x.submit('#modal form[data-f=man]');await W(300);
const it=await x.ev(s=>{const L=S.sessions.filter(x=>pkey(x)===s&&!x.review);const l=L[L.length-1];return {raw:l.items[0],key:itKey(l.items[0])}},s);
ok(it.raw.link==='PDF p. 12'&&it.key.loc==='PDF p. 12'&&it.key.title==='Crase – regra geral'&&!it.key.url,'salvou o local com o assunto: '+JSON.stringify(it.key));
// editar traz o local de volta
const ses=await x.ev(s=>{const L=S.sessions.filter(x=>pkey(x)===s&&!x.review);return L[L.length-1].ses},s);
await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(300);await x.ev(id=>document.querySelector(`[data-act=edit][data-id="${id}"]`).click(),ses);await W(300);
ok(await x.ev(()=>S.sel.groups[0].rows[0].link==='PDF p. 12'&&S.sel.groups[0].rows[0].name==='Crase – regra geral'),'editar traz o local');
await x.act('canceledit');await x.ev(()=>{document.querySelector('nav [data-tab=ciclo]').click()});await W(200);
// 2. selo, antes, livro: cria tentativas de questões num tópico de Português
const tid=await x.ev(s=>{const sb=S.subjects.find(y=>y.id===s);return sb.topics.find(t=>t.name==='Crase').id},s);
await x.ev(([s,tid])=>{const mkS=(d,a,t)=>({id:uid(),ses:uid(),subj:s,topic:tid,min:30,cycle:S.cycle-1,set:S.set||1,review:false,kind:'aula',items:[{kind:'aula',name:'Questões',link:'',qo:true,ac:a,tq:t}],date:d});S.sessions.push(mkS('2026-10-20',14,20),mkS('2026-10-22',11,20));save();render()},[s,tid]);
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.ev(()=>{ui.rvt='topicos';render()});await W(200);
const tags=await x.ev(()=>[...document.querySelectorAll('#app .tagrf')].map(e=>e.textContent));
ok(tags.some(t=>/reforçar · \d+%/.test(t)),'selo reforçar aparece: '+JSON.stringify(tags.slice(0,3)));
ok(await x.ev(()=>{const e=document.querySelector('#app .tagrf');const c=getComputedStyle(e);return c.backgroundColor==='rgba(0, 0, 0, 0)'||c.backgroundColor==='transparent'}),'selo sem cor de fundo');
// abre um tópico Crase com o item Questões
await x.ev(tid=>{const o=trvList().find(o=>o.tp.id===tid&&o.k.endsWith('2026-10-22'));if(o)ui.open.add('tdi:'+o.k);ui.pg={trvdue:99,hoje:99};render()},tid);await W(200);
const prev=await x.ev(()=>[...document.querySelectorAll('#app .qprev')].map(e=>e.textContent));
ok(prev.some(t=>/antes 70% →/.test(t)),'acerto anterior: '+JSON.stringify(prev));
await x.ev(()=>{const e=document.querySelector('#app .qprev')||document.querySelector('#app .tagrf');e.scrollIntoView({block:'center'})});await W(200);await shot('1-topicos');
// livro na lista do registro: Revise antes (Português)
// 3. limite nos ajustes da revisão por tópico
await x.ev(()=>document.querySelector('[data-tab=bk]').click());await W(300);
ok(await x.ev(()=>!document.querySelector('#app [data-qlim]')&&!/Reforçar/.test(document.getElementById('app').innerText)),'Configurações sem o limite');
await x.ev(()=>{document.querySelector('nav [data-tab=rev]').click()});await W(200);await x.act('rvadj');await x.act('trvcfg');
ok(await x.ev(()=>document.querySelector('#modal [data-tvl]')?.value==='70'),'ajustes da revisão por tópico: limite 70%');
await x.act('tvlstep','-5');ok(await x.ev(()=>ui.tvl===65&&S.qlim!==65),'− baixa para 65 sem salvar ainda');
await x.fill('#modal [data-tvl]','50');await shot('2-ajustes');await x.submit('#modal form[data-f=trvcfg]');await W(200);
ok(await x.ev(()=>S.qlim===50),'Salvar grava 50%');
await x.ev(()=>{ui.rvadj=null;render()});
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);
ok(await x.ev(()=>![...document.querySelectorAll('#app .tagrf')].some(e=>/· 6\d%|· 5[0-9]%/.test(e.textContent)&&+e.textContent.match(/(\d+)%/)[1]>=50)),'limite 50%: some o selo de quem está acima');
await x.ev(()=>{S.qlim=70;save();render()});
// 4. Estatísticas
await x.ev(()=>document.querySelector('nav [data-tab=st]').click());await W(300);
const st=await x.ev(()=>{const c=[...document.querySelectorAll('#app .card')].find(c=>/Tópicos para reforçar/.test(c.textContent));return c?c.innerText.replace(/\s+/g,' '):''});
ok(/Crase/.test(st)&&/abaixo de 70%/.test(st),'Estatísticas lista o tópico: '+st.slice(0,120));
await x.ev(()=>[...document.querySelectorAll('#app .card h2')].find(h=>/reforçar/.test(h.textContent)).scrollIntoView({block:'center'}));await shot('3-stats');
// 5. resumo do bloco
await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(200);
await x.ev(()=>{S.blk=[{id:'m1',pos:0}];render()});await W(200);
const sm=await x.ev(()=>[...document.querySelectorAll('#app .blkc .bks2')].map(e=>e.textContent));
ok(sm.some(t=>/quest(ão|ões)/.test(t)),'resumo do bloco conta questões: '+JSON.stringify(sm));
await x.ev(()=>document.querySelector('#app .blkc')?.scrollIntoView({block:'start'}));await shot('4-bloco');
log.push('erros: '+JSON.stringify(errs));
}catch(e){log.push('EXCEÇÃO '+e.message)}await b.close();console.log(log.join('\n'));
