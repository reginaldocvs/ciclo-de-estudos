import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD]=process.argv.slice(2);const w=+(WD||390);
const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:w<500?844:900});const x=mk(p);try{
const shot=n=>p.screenshot({path:`${OUT}/qr-${w}-${n}.png`});
const A=await x.ev(()=>inCycle().map(s=>s.id));const s=A[1];
await x.ev(s=>{S.progress[s]=0;render()},s);await x.act('rreg',s);
ok(await x.ev(()=>!document.querySelector('#modal .x.plus[data-act=addrow]')&&!!document.querySelector('#modal .radd [data-act=addrow]')&&!!document.querySelector('#modal .radd [data-act=addrowq]')),'botões + Aula e + Questões no fim do tópico');
ok(await x.ev(()=>S.sel.groups[0].rows.length===0&&!document.querySelector('#modal .rowf')),'tópico começa sem linhas');
ok(await x.ev(()=>[...document.querySelectorAll('#modal .radd .btn')].map(b=>b.textContent).join('|')==='Aula +|Questões +'),'botões "+ Aula" e "+ Questões"');
const gid=await x.ev(()=>S.sel.groups[0].id);
await x.act('addrow',gid);await x.ev(()=>{const g=S.sel.groups[0];g.nt='Crase';g.rows[0].name='Aula 12';render()});
await x.act('addrowq',gid);
const [ra,rq]=await x.ev(()=>S.sel.groups[0].rows.map(r=>r.id));await x.act('rtog',gid+':'+ra);ok(await x.ev(()=>{const R=S.sel.groups[0].rows;return R[0].open&&!R[1].open}),'abrir a aula fecha as questões');await x.act('rtog',gid+':'+rq);ok(await x.ev(()=>{const R=S.sel.groups[0].rows;return !R[0].open&&R[1].open}),'abrir as questões fecha a aula');await x.act('rtog',gid+':'+rq);await x.ev(()=>document.querySelector('#modal .rowq [data-rac]').focus());

await x.fill('#modal .rowq [data-rac]','8');await x.fill('#modal .rowq [data-rtq]','10');
ok(await x.ev(()=>{const G=[...document.querySelectorAll('#modal .rgrp')];return G.length===2&&G.every(g=>!g.classList.contains('open'))}),'linhas fechadas sem fundo');await x.act('rtog',gid+':'+ra);ok(await x.ev(()=>{const G=[...document.querySelectorAll('#modal .rgrp')];return G[0].classList.contains('open')&&!!G[0].querySelector('.rbody')&&getComputedStyle(G[0]).backgroundColor!=='rgba(0, 0, 0, 0)'&&!G[1].classList.contains('open')}),'aula aberta: fundo envolve o nome e os campos');await shot('0-hier');await x.act('rtog',gid+':'+ra);
ok(/80%/.test(await x.ev(()=>document.querySelector('#modal .rowq .qpct').textContent)),'mostra 80%');
await shot('1-misto');
await x.ev(()=>{S.sel.mt='0h30';render()});await x.submit('#modal form[data-f=man]');await W(300);
const its=await x.ev(s=>{const L=S.sessions.filter(x=>pkey(x)===s&&!x.review);const ses=L[L.length-1].ses;return L.filter(x=>x.ses===ses).flatMap(x=>x.items)},s);
ok(its.length===2&&its[1].qo&&its[1].name==='Questões'&&its[1].ac===8&&its[1].tq===10&&!its[0].qo,'salvou aula + questões: '+JSON.stringify(its));
await x.ev(s=>{S.progress[s]=0;render()},s);
// só questões
await x.act('rreg',s);await x.ev(()=>{const g=S.sel.groups[0];g.nt='Crase';g.rows=[{id:'qq1',kind:'aula',name:'',link:'',qo:true,ac:'7',tq:'10',q:'Apostila p. 32'}];S.sel.mt='0h20';render()});
await x.submit('#modal form[data-f=man]');await W(300);
await x.ev(s=>{S.progress[s]=0;render()},s);await x.act('rreg',s);
ok(await x.ev(()=>S.sel.groups[0].rows.length===0&&!document.querySelector('#modal .rqhint')),'depois de só questões: continua abrindo sem linhas (regra desfeita)');
const g2=await x.ev(()=>S.sel.groups[0].id);await x.act('addrowq',g2);await x.act('delrow',g2+':'+await x.ev(()=>S.sel.groups[0].rows[0].id));ok(await x.ev(()=>S.sel.groups[0].rows.length===0),'dá para remover a única linha');
await shot('2-so-questoes');
await x.act('xcancel').catch(()=>{});await x.ev(()=>{S.sx=false;S.sel.groups=null;render()});
// editar o registro só de questões
const ses=await x.ev(s=>{const L=S.sessions.filter(x=>pkey(x)===s&&!x.review);return L[L.length-1].ses},s);
await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(300);
await x.ev(id=>{const b=document.querySelector(`[data-act=edit][data-id="${id}"]`);b?b.click():null},ses);await W(400);
ok(await x.ev(()=>{const r=S.sel.groups&&S.sel.groups[0].rows[0];return r&&r.qo&&r.ac==='7'&&r.tq==='10'&&r.q==='Apostila p. 32'&&!!document.querySelector('#modal .rowq')}),'editar traz a linha de Questões com acertos e local');
await shot('3-editar');
log.push('erros: '+JSON.stringify(errs));
}catch(e){log.push('EXCEÇÃO '+e.message)}await b.close();console.log(log.join('\n'));
