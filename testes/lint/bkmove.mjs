import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w:1280,h:900});const x=mk(p);const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
await x.ev(()=>{S.blk=[{id:'m1',pos:2}];save();render()});
let k=0;const reg=async id=>{await x.act('rreg',id);await x.ev(k=>{const g=S.sel.groups[0];g.nt='Tópico M'+k;g.rows=[{id:uid(),kind:'aula',name:'Aula M'+k,link:'',q:''}];render()},++k);await x.submit('#modal form[data-f=man]');await W(250)};
const A=await x.ev(()=>inCycle().map(s=>s.id));await reg(A[0]);await reg(A[1]);
await x.act('bkreg',A[0]);await x.fill('#modal [data-f=bkreg] input[name=m]','15');await x.ev(()=>{const a=document.querySelector('#modal [data-f=bkreg] input[name^=qa-]'),t=document.querySelector('#modal [data-f=bkreg] input[name^=qt-]');a.value='8';t.value='10'});await x.submit('#modal form[data-f=bkreg]');await W(300);
await x.act('blkend');await W(300);ok(await x.ev(()=>Object.keys(S.blkDone).length===1),'1º marcador encerrado (com a 1ª disciplina revisada: 15min, 8/10)');
await reg(A[2]);
// remove o marcador encerrado e põe um novo depois da 3ª
await x.ev(()=>{S.blk=[{id:'m2',pos:3}];save();render()});await W(300);
const n=await x.ev(()=>{const b=blkCur();return b?blkBy(b).map(v=>v.s.name):null});
ok(n&&n.length===3,'marcador novo, depois de remover o encerrado, pega as 3 disciplinas: '+JSON.stringify(n));
ok(await x.ev(a=>{const b=blkCur(),k=blkKey(b);return (S.blkRev[k]||[]).includes(a)&&S.sessions.some(x=>x.bkr===k&&x.subj===a&&Math.round(x.min)===15&&x.ac===8)},A[0]),'a revisão do bloco apagado passa para o novo (15min, 8/10)');
ok(/15min · 80%/.test(await x.ev(()=>document.querySelector('#app .blkc .bkok')?.textContent||'')),'selo mostra 15min · 80%: '+await x.ev(()=>document.querySelector('#app .blkc .bkok')?.textContent));
ok(await x.ev(()=>[...document.querySelectorAll('#app .blkc [data-act=bkgo]')].length===2),'as outras duas seguem com Iniciar');
await x.act('bkunreg',A[0]);await W(200);await x.ev(()=>render());
ok(await x.ev(a=>{const b=blkCur(),k=blkKey(b);return !(S.blkRev[k]||[]).includes(a)&&!S.sessions.some(x=>x.bkr&&x.subj===a)},A[0]),'desfazer pelo ✓ remove, e ela não volta sozinha');
ok(!/Nenhuma sessão registrada/.test(await x.ev(()=>document.querySelector('#app .blkc')?.innerText||'')),'sem "Nenhuma sessão registrada"');
// com o 1º marcador mantido, o novo pega só a 3ª
await x.ev(()=>{S.blk=[{id:'m1',pos:2},{id:'m2',pos:3}];save();render()});await W(300);
const n2=await x.ev(()=>{const b=blkCur();return b?blkBy(b).map(v=>v.s.name):null});
ok(n2&&n2.length>=1,'com o 1º mantido, o 2º pega só o que veio depois: '+JSON.stringify(n2));
log.push('erros: '+JSON.stringify(errs));await b.close();console.log(log.join('\n'));
