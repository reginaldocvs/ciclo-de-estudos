/* Acertos por aula no registro de revisão: aulas que já tiveram questões ganham campo próprio (total da última vez preenchido;
   aula sem acertos digitados não registra), nos registros por tópico, por grupos, de bloco e na edição; tópico sem aula com questões
   continua com um campo só. Depois: "antes X%" por aula e Estatísticas contando como revisão. */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.trv={start:'2026-09-25',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:900});const x=mk(p);
const shot=n=>p.screenshot({path:`${OUT}/aci-${w}-${n}.png`});
const type=async(sel,v)=>{await x.ev((sel,v)=>{const e=document.querySelector(sel);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))},sel,v);await W(80)};
try{
// 1. revisão por tópico
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);
const k=await x.ev(()=>trvList().find(o=>!o.fix&&acList(o.tp.id,trvItems(o)).length).k);await x.ev(k=>{ui.trvk=k;ui.trvm='';render()},k);await W(300);
const f1=await x.ev(()=>({names:[...document.querySelectorAll('#modal [data-qa]')].map(e=>e.name),tq:[...document.querySelectorAll('#modal [data-qt]')].map(e=>e.value),lbl:[...document.querySelectorAll('#modal .acit .rlb')].map(e=>e.textContent.trim())}));console.log('   tópico:',JSON.stringify(f1));
ok(f1.names[0]==='qa-0'&&!f1.names.includes('qa'),'tópico: campos por aula, sem o campo único');ok(f1.tq[0]!==''&&f1.lbl[0],'tópico: total da última vez já preenchido e nome da aula ('+f1.lbl[0]+': de '+f1.tq[0]+')');
await type('#modal input[name="qa-0"]','8');await x.fill('#modal input[name=m]','0h20');await shot('1-topico');await x.submit('#modal form[data-f=trvok]');await W(300);
const tr=await x.ev(k=>{const s=S.sessions.filter(x=>x.trv===k).pop();return {s,q:S.trv.t[k].q}},k);
ok(tr.s&&!tr.s.tq&&tr.s.items.length>=1&&tr.s.items[0].ac===8&&tr.s.items[0].tq===+f1.tq[0],'tópico: a aula guarda 8/'+f1.tq[0]+' (e o registro não guarda acertos do tópico)');
ok(tr.s.items.slice(1).every(i=>!i.tq),'tópico: aula sem acertos digitados não registra');ok(tr.q&&Object.values(tr.q)[0].a===8,'tópico: agenda guarda a soma');
// 2. revisão por grupos
await x.act('rvt','hoje');const g=await x.ev(()=>rgNext());await x.act('rvstart',g);await W(400);
const sid=await x.ev(()=>{const s=actives().find(s=>rvRows(s).some(o=>acList(o.t.id,o.rows.map(r=>r.l)).length))||actives()[0];rvRows(s).forEach(o=>o.rows.forEach(r=>S.checked[r.k]=true));render();return s.id});
await x.act('rreg',sid);await W(400);
const gi=await x.ev(()=>{const e=document.querySelector('#modal [data-qa][data-tik]');return e&&{tid:e.dataset.tid,tik:e.dataset.tik,n:document.querySelectorAll('#modal [data-qa][data-tik]').length,one:document.querySelectorAll('#modal [data-qa][data-tid]:not([data-tik])').length}});console.log('   grupo:',JSON.stringify(gi));
ok(gi&&gi.n>=1,'grupo: campos por aula');
const sel=`#modal [data-qa][data-tik="${gi.tik}"]`;await type(sel,'7');await x.fill('#modal input[name=m]','0h30');await shot('2-grupo');
await x.submit('#modal form[data-f=man]');await W(400);
const gs=await x.ev(t=>S.sessions.filter(x=>x.rid&&x.topic===t).pop(),gi.tid);const gItem=gs&&gs.items.find(i=>+i.tq>0);
ok(gs&&!gs.tq&&gItem&&gItem.ac===7,'grupo: a aula guarda 7 acertos ('+JSON.stringify(gItem)+')');
// 3. editar o registro da revisão
await x.ev(s=>{ui.rview=s;render()},sid);await W(300);await x.act('edit',gs.ses);await W(400);
ok(await x.ev(t=>{const e=document.querySelector(`[data-qa][data-tik="${t}"]`);return e&&e.value==='7'},gi.tik),'editar mostra os acertos da aula');
await type(`[data-qa][data-tik="${gi.tik}"]`,'9');await shot('3-editar');await x.act('saveedit');await W(400);
ok(await x.ev(t=>{const s=S.sessions.filter(x=>x.rid&&x.topic===t).pop();return s.items.some(i=>i.ac===9)},gi.tid),'editar salva 9 na aula');
await x.ev(()=>{S.sx=false;S.edit=null;render()});await x.act('rvcancel');await W(300);
// 4. revisão de bloco: aula estudada com questões → campo por aula; tópico sem questões → campo único
await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300);
await x.ev(()=>{S.progress={};S.sessions=S.sessions.filter(x=>x.cycle!==S.cycle||x.rid||x.review);S.blk=[{id:'m',pos:2}];render()});
for(const i of [0,1]){const id=await x.ev(i=>inCycle()[i].id,i);await x.act('rreg',id);await x.ev(i=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Tópico B'+i;g.rows[0].name='Aula B'+i;if(i===0){g.rows[0].ac='5';g.rows[0].tq='10'}render()},i);await x.submit('#modal form[data-f=man]');await W(250)}
const b0=await x.ev(()=>{const s=inCycle()[0];return s.of||s.id}),b1=await x.ev(()=>{const s=inCycle()[1];return s.of||s.id});
await x.act('bkreg',b0);await W(300);const bf=await x.ev(()=>[...document.querySelectorAll('#modal [data-f=bkreg] [data-qa]')].map(e=>e.name+'='+e.closest('.acrow').querySelector('[data-qt]').value));console.log('   bloco (com questões):',JSON.stringify(bf));
ok(bf.length===1&&/^qa-\w+-0=10$/.test(bf[0]),'bloco: aula com questões ganha campo próprio, total 10 preenchido');
await type(`#modal [name="${bf[0].split('=')[0]}"]`,'6');await x.fill('#modal input[name=m]','0h15');await shot('4-bloco');await x.submit('#modal form[data-f=bkreg]');await W(300);
const bk=await x.ev(s=>S.sessions.filter(x=>String(x.rid||'').startsWith('bk-')&&x.subj===s),b0);ok(bk.length===1&&!bk[0].tq&&bk[0].items[0].ac===6&&bk[0].items[0].tq===10,'bloco: a aula guarda 6/10');
ok(/15min · 60%/.test(await x.ev(()=>document.querySelector('#app .blkc').innerText)),'bloco: cartão mostra "15min · 60%"');
await x.act('bkreg',b1);await W(300);const bf1=await x.ev(()=>[...document.querySelectorAll('#modal [data-f=bkreg] [data-qa]')].map(e=>e.name));ok(bf1.length===1&&/^qa-\w+$/.test(bf1[0]),'bloco: tópico sem questões continua com campo único ('+bf1[0]+')');await x.act('bkregx');
// 5. depois: "antes" por aula no Histórico e Estatísticas como revisão
await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(400);
const h=await x.ev(()=>[...document.querySelectorAll('#hres .ritem')].slice(0,1).map(e=>e.innerText.replace(/\s+/g,' ')).join(''));console.log('   histórico:',h.slice(0,160));ok(/antes 50% → ?6\/10 · 60%/.test(h),'Histórico: aula da revisão de bloco "antes 50% → 6/10"');
await x.ev(()=>document.querySelector('nav [data-tab=st]').click());await W(400);const stx=await x.ev(()=>document.getElementById('app').innerText.replace(/\s+/g,' '));console.log('   stats:',stx.slice(0,900));
ok(/rev\. \d+%/.test(stx),'Estatísticas mostram "rev."');
}catch(e){ok(false,'EXCEÇÃO '+e.message)}
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
