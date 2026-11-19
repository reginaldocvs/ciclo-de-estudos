/* Revisão por questões:
   - liga em Revisão › Ajustes; ou ela ou a por sessões (ligar uma desliga a outra);
   - cada sessão de estudo da disciplina ganha um número que não recomeça (frentes na mesma fila; modo revisão não conta);
     ao terminar a sessão N revisa N−1, N−4 e N−8 (padrão); cada sessão sai depois da última revisão;
   - ligar com histórico: numera com ele, sem atrasadas antigas;
   - janela logo depois de registrar: Registrar (com acertos, vira registro "rev. questões"), Pular (conta feita), Depois (fica pendente, aparece em Para hoje);
   - apagar o registro devolve a revisão; ajustar: − e + em ordem, Adicionar (dobro), tirar a última, Voltar ao padrão; mudar não cria atrasadas.
   Uso: node lint/rqrev.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.rq;S0.srv={n:2,y:3,on:true,start:'2026-01-01'};
S0.subjects.push({id:'rqx',name:'Teste RQ',goal:60,topics:[{id:'tq1',name:'Tópico Q',done:false,links:[]}]},{id:'rqx2',name:'Teste RQ',goal:60,topics:[],of:'rqx'});
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
/* registra uma sessão de estudo; se vier o aviso "… para revisar com questões · Revisar", toca em Revisar (abre a janela) */
const study=async(sid,n,rv)=>{await ev(([sid,n,rv])=>{S.type=rv?'review':'study';S.sel.subj=sid;S.sel.groups=[{id:'g'+n,nt:'Tópico Q',rows:[{id:'r'+n,kind:'aula',name:'Aula '+n,link:''}]}];addSession(30);S.type='study';save();render()},[sid,n,!!rv]);await W(80);await ev(()=>{const b=document.querySelector('#undo [data-act=rqreg]');if(b)b.click()})};
const due=()=>ev(()=>rqDue('rqx').map(z=>z.m+':'+(z.i+1)).join(' '));
/* 1. ligar: desliga a por sessões; sem atrasadas antigas */
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);await x.act('rvadj');await W(300);
await ev(()=>{S.sessions.push(...[1,2,3,4,5].map(i=>({id:'old'+i,ses:'old'+i,subj:'rqx',topic:'tq1',min:30,cycle:1,set:1,review:false,kind:'aula',items:[{kind:'aula',name:'Antiga '+i,link:''}],date:'2026-10-0'+i})));save();render()});
await ev(()=>document.querySelector('[data-act=rvsys][data-id=q]').click());await W(300);
ok(await ev(()=>rqOn()&&!srOn()&&/Revisão por sessões desligada/.test(document.body.innerText)),'ligar a por questões desliga a por sessões e avisa');
ok(await ev(()=>rqSes('rqx').length===5&&rqDue('rqx').length===0),'ligar com histórico: as 5 sessões antigas contam, sem atrasadas antigas');
await x.act('rvadjx');
/* 2. sessão 6: revisa a 5 (1ª) e a 2 (2ª) */
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(200);
await study('rqx',6);await W(300);
let d=await ev(()=>{const f=document.querySelector('[data-f=rqreg]');return f?{h:[...f.querySelectorAll('.rqh')].map(e=>[...e.children].slice(0,2).map(c=>c.textContent).join(' ')),top:document.querySelector('.dlg .chead h2').textContent}:null});
ok(d&&d.top==='Revise com questões'&&d.h.join('|')==='Sessão 5 1ª revisão|Sessão 2 2ª revisão','sessão 6: janela logo depois, com a 5 (1ª) e a 2 (2ª) '+JSON.stringify(d));
await p.screenshot({path:'saida/rqrev-janela-'+w+'.png'});
/* registrar com acertos na sessão 5 */
await ev(()=>{const f=document.querySelector('[data-f=rqreg]');f.querySelector('[name="qa-0-0-0"]').value='7';f.querySelector('[name="qt-0-0-0"]').value='10';f.requestSubmit()});await W(300);
let r=await ev(()=>{const R=S.sessions.filter(x=>String(x.rid||'').startsWith('rq-'));return {n:R.length,k:R.map(kindOf).join(),it:R[0]&&R[0].items[0],tag:R[0]&&recTag(R[0]).t,open:!!document.querySelector('[data-f=rqreg]'),due:rqDue('rqx').length}});
ok(r.n===1&&r.k==='q'&&r.it&&r.it.ac===7&&r.it.tq===10&&/rev\. questões/.test(r.tag)&&!r.open&&r.due===0,'Registrar: vira registro "rev. questões" com 7/10 e a fila fica em dia '+JSON.stringify(r));
/* 3. sessão 7: 6 (1ª) e 3 (2ª) → Depois: pendente e em Para hoje */
await study('rqx',7);await W(300);ok(await due()==='6:1 3:2','sessão 7: revisa a 6 e a 3');
await x.act('rqregx');await W(200);ok(await ev(()=>!ui.rqreg&&rqDue('rqx').length===2),'Depois: fecha e fica pendente');
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);
ok(await ev(()=>{const r=[...document.querySelectorAll('.rvtoday .trvr')].find(e=>/Revisão por questões/.test(e.textContent));return !!r&&/2 sessões/.test(r.textContent)&&!!r.querySelector('[data-act=rqreg]')}),'Para hoje: "Revisão por questões · 2 sessões" com Revisar');
await ev(()=>[...document.querySelectorAll('.rvtoday [data-act=rqreg]')][0].click());await W(300);ok(await ev(()=>!!document.querySelector('[data-f=rqreg]')),'Revisar abre a janela');
await p.keyboard.press('Escape');await W(200);ok(await ev(()=>!document.querySelector('[data-f=rqreg]')&&rqDue('rqx').length===2),'Esc fecha e continua pendente');
/* 4. sessão 8 com pendentes: 7, 4 e as atrasadas 6 e 3 → Pular */
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(200);await study('rqx',8);await W(300);
d=await ev(()=>rqDue('rqx').map(z=>z.m+':'+(z.i+1)+(z.late?'L':'')).join(' '));ok(d==='7:1 6:1L 4:2 3:2L','sessão 8: a 7 e a 4, mais as atrasadas 6 e 3 '+d);
ok(await ev(()=>document.querySelectorAll('.rqh .late').length===2),'atrasadas marcadas na janela');
const nR=await ev(()=>S.sessions.length);await x.act('rqskip');await W(200);ok(await ev(n=>rqDue('rqx').length===0&&S.sessions.length===n,nR),'Pular: conta como feita, sem registro');
/* 5. regra completa até a 3ª e saída: sessão 9 → 8, 5 e 1; sessão 13 → 12, 9 e 5 */
await study('rqx',9);await W(200);ok(await due()==='8:1 5:2 1:3','sessão 9: 8 (1ª), 5 (2ª) e 1 (3ª)');
ok(await ev(()=>/3ª revisão · última/.test(document.querySelector('[data-f=rqreg]').textContent)),'a 3ª aparece como "· última"');
await x.act('rqskip');for(const n of [10,11,12]){await study('rqx',n);await W(100);await x.act('rqskip')}
await study('rqx',13);await W(200);ok(await due()==='12:1 9:2 5:3','sessão 13: 12, 9 e 5 (a 1 já saiu)');await x.act('rqskip');
/* 6. frente da disciplina na mesma fila; modo revisão não conta */
await study('rqx2',14);await W(200);ok(await ev(()=>rqSes('rqx').length===14)&&await due()==='13:1 10:2 6:3','frente (Teste RQ 2) entra na mesma fila: sessão 14');await x.act('rqskip');
await study('rqx',99,true);await W(200);ok(await ev(()=>rqSes('rqx').length===14&&!ui.rqreg),'registro no modo revisão não conta nem abre a janela');
/* 7. apagar o registro de revisão devolve a revisão */
await ev(()=>{const R=S.sessions.find(x=>String(x.rid||'').startsWith('rq-'));S.sessions=S.sessions.filter(x=>x.rid!==R.rid);save();render()});
ok(await ev(()=>rqDue('rqx').some(z=>z.m===5&&z.i===0)),'apagar o registro "rev. questões": a revisão da sessão 5 volta');
await ev(()=>{rqMark(rqDue('rqx'),'skip');save();render()});
/* 8. ajustar */
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);await x.act('rvadj');await x.act('rqcfg');await W(200);
await x.act('rqst','0:-1');ok(await ev(()=>ui.rqiv.join()==='1,4,8'),'− não passa de 1');
await x.act('rqst','1:-1');await x.act('rqst','1:-1');await x.act('rqst','1:-1');ok(await ev(()=>ui.rqiv.join()==='1,2,8'),'− para no número de cima + 1 (ordem crescente)');
await x.act('rqadd');ok(await ev(()=>ui.rqiv.join()==='1,2,8,16'),'Adicionar: o dobro da última (16)');
ok(await ev(()=>/Ao terminar a sessão 18, você revisa a 17, a 16, a 10 e a 2\./.test(document.querySelector('.rvsum').textContent)),'resumo com o exemplo');
await p.screenshot({path:'saida/rqrev-ajuste-'+w+'.png'});
await x.act('rqdel');await x.act('rqdef');ok(await ev(()=>ui.rqiv.join()==='1,4,8'),'tirar a última e Voltar ao padrão');
await x.act('rqst','2:1');await x.act('rqsave');await W(200);ok(await ev(()=>rqIv().join()==='1,4,9'&&rqDue('rqx').length===0&&ui.rvadj),'Salvar: 1 · 4 · 9, sem atrasadas, volta aos Ajustes');
/* 9. aba Questões */
await ev(()=>{rqMark(rqDue('rqx'),'skip');save();render()});await study('rqx',15);await W(200);await x.act('rqregx');
await ev(()=>{S.sel.subj='rqx';save();render()});await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);
ok(await ev(()=>{const T=[...document.querySelectorAll('[data-act=rvt]')].map(b=>b.textContent);return T.includes('Questões')&&!T.includes('Sessões')}),'aba Questões aparece (e não a Sessões)');
await x.act('rvt','questoes');await W(300);
let tb=await ev(()=>{const c=[...document.querySelectorAll('.rqsc')].find(c=>/Teste RQ/.test(c.textContent));if(!c)return null;const rows=[...c.querySelectorAll('.rqsr')];const row=m=>{const r=rows.find(r=>new RegExp('^Sessão '+m+' ').test(r.querySelector('b').parentElement.textContent));return r?[...r.querySelectorAll('.rqk')].map(k=>k.textContent).join('|'):null};return {hd:c.querySelector('.bks2').textContent,nx:c.querySelector('.rqnx').textContent,rv:!!c.querySelector('[data-act=rqreg]'),s15:row(15),s14:row(14),s5:row(5)}});
ok(tb&&/^15 sessões · 2 sessões para revisar$/.test(tb.hd)&&tb.rv,'cartão: 15 sessões, 2 para revisar (a 3ª da sessão 6 já tinha sido pulada), com Revisar '+JSON.stringify(tb&&tb.hd));
ok(tb&&tb.nx==='Ao terminar a sessão 16, você revisa a 15, a 12 e a 7.','próxima sessão: o que vem ao terminar a 16 '+JSON.stringify(tb&&tb.nx));
ok(tb&&tb.s15==='1ª · sessão 16|2ª · sessão 19|3ª · sessão 24'&&tb.s14==='1ª agora|2ª · sessão 18|3ª · sessão 23','marcas por vez: em que sessão vem e agora '+JSON.stringify(tb&&[tb.s15,tb.s14]));
await p.screenshot({path:'saida/rqrev-aba-'+w+'.png',fullPage:true});
await ev(()=>{S.subjects.find(s=>s.id==='rqx').topics[0].name='1 - Direitos e garantias fundamentais: direitos e deveres individuais e coletivos; direito à vida, à liberdade, à igualdade, à segurança e à propriedade; direitos sociais; nacionalidade';render()});await W(200);
ok(await ev(()=>{const c=[...document.querySelectorAll('.rqsc')].find(c=>/Teste RQ/.test(c.textContent)),r=c.querySelector('.rqsr'),T=[...r.querySelectorAll('.rqk')].map(e=>Math.round(e.getBoundingClientRect().top));return new Set(T).size===1}),'tópico de nome longo: as marcas continuam numa linha só');
await ev(()=>{S.subjects.find(s=>s.id==='rqx').topics[0].name='Tópico Q';render()});
/* 10. nova rodada: a numeração continua, as pendentes ficam e o registro leva "R2 ·" */
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(200);await ev(()=>document.querySelector('#mtt .plsel').click());await W(300);
const pid=await ev(()=>S.plan),nP=await ev(()=>rqDue('rqx').length);await x.act('plset',pid);await W(400);await ev(()=>{const c=document.querySelector('#modal [data-act=plclose]');c&&c.click()});await W(200);
ok(await ev(n=>(S.set||1)===2&&rqOn()&&rqIv().join()==='1,4,9'&&rqSes('rqx').length===15&&rqDue('rqx').length===n,nP),'nova rodada: continua ligada, com a mesma regra, as 15 sessões e as pendentes');
await study('rqx',16);await W(300);
let r2=await ev(()=>({n:rqSes('rqx').length,due:rqDue('rqx').map(z=>z.m+':'+(z.i+1)+(z.late?'L':'')).join(' '),open:!!document.querySelector('[data-f=rqreg]')}));
ok(r2.n===16&&r2.open&&/^15:1 14:1L 12:2 11:2L 7:3$/.test(r2.due),'1ª sessão da rodada 2 é a sessão 16: revisa a 15, a 12 e a 7, mais as pendentes da rodada 1 '+JSON.stringify(r2));
await x.act('rqregx');await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);await x.act('rvt','questoes');await W(300);
let ch=await ev(()=>{const c=[...document.querySelectorAll('.rqsc')].find(c=>/Teste RQ/.test(c.textContent));const rows=[...c.querySelectorAll('.rqsr')];const g=m=>{const r=rows.find(r=>r.querySelector('b').textContent==='Sessão '+m);return r?[...r.querySelectorAll('.rqk')].map(k=>k.textContent+(k.classList.contains('late')?'!':'')).join('|'):null};return {s15:g(15),s14:g(14)}});
ok(ch.s15&&ch.s15.startsWith('1ª agora|')&&ch.s14&&ch.s14.startsWith('1ª atrasada!|')&&!/pendente/.test(JSON.stringify(ch)),'aba: "1ª agora" (cor normal) para o que chegou e "1ª atrasada" (cor de atraso) para o que ficou '+JSON.stringify(ch));
await p.screenshot({path:'saida/rqrev-agora-'+w+'.png',fullPage:true});
await ev(()=>[...document.querySelectorAll('.rqsc')].find(c=>/Teste RQ/.test(c.textContent)).querySelector('[data-act=rqreg]').click());await W(300);
await ev(()=>{const f=document.querySelector('[data-f=rqreg]');f.querySelector('[name="qa-0-0-0"]').value='5';f.querySelector('[name="qt-0-0-0"]').value='8';f.requestSubmit()});await W(300);
ok(await ev(()=>{const R=S.sessions.filter(x=>String(x.rid||'').startsWith('rq-')).pop();return !!R&&R.set===2&&/^R2 · rev\. questões$/.test(recTag(R).t)&&rqDue('rqx').length===0}),'registro na rodada 2: etiqueta "R2 · rev. questões" e fila em dia');
/* 11. adiantar revisões (véspera de prova): todas as sessões em revisão, com caixinha; a adiantada conta como a próxima vez */
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);await x.act('rvt','questoes');await W(300);
await ev(()=>[...document.querySelectorAll('.rqsc')].find(c=>/Teste RQ/.test(c.textContent)).querySelector('[data-act=rqadv]').click());await W(300);
let av=await ev(()=>{const f=document.querySelector('[data-f=rqreg]');return f?{n:f.querySelectorAll('.rqb').length,ck:f.querySelectorAll('.rqck:checked').length,adv:f.querySelectorAll('.rqh .fu').length,first:f.querySelector('.rqh b').textContent,btn:[...f.querySelectorAll('.trvact button')].map(b=>b.textContent).join('|')}:null});
ok(av&&av.n===9&&av.ck===9&&av.adv===9&&av.first==='Sessão 16'&&av.btn==='Cancelar|Registrar','Adiantar: as 9 sessões em revisão (16 a 8), todas marcadas e "adiantada", com Cancelar e Registrar '+JSON.stringify(av));
await p.screenshot({path:'saida/rqrev-adiantar-'+w+'.png'});
await ev(()=>{const f=document.querySelector('[data-f=rqreg]');f.querySelector('[name=ck-0]').checked=false;f.querySelector('[name="qa-1-0-0"]').value='9';f.querySelector('[name="qt-1-0-0"]').value='10';f.requestSubmit()});await W(300);
av=await ev(()=>{const I=rqInfo('rqx'),st=m=>I.rows.find(r=>r.m===m).vz.map(v=>v.st).join(',');return {s16:st(16),s15:st(15),s8:st(8),open:!!document.querySelector('[data-f=rqreg]'),last:recTag(S.sessions.filter(x=>String(x.rid||'').startsWith('rq-')).pop()).t}});
ok(av.s16==='fu,fu,fu'&&av.s15==='ok,ok,fu'&&av.s8==='sk,sk,ok'&&!av.open&&/rev\. questões/.test(av.last),'Registrar: cada marcada conta a próxima vez (15: 2ª ✓, 3ª continua; 8: a 3ª fecha a fila dela); a desmarcada (16) fica como estava '+JSON.stringify(av));
/* 12. recomeçar a contagem: por disciplina (aba) e de todas (ajuste); o Histórico não muda */
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);await x.act('rvt','questoes');await W(300);
const card=()=>`[...document.querySelectorAll('.rqsc')].find(c=>/Teste RQ/.test(c.textContent))`;
await ev(new Function(`${card().replace(/^/,'const c=')};c.querySelector('[data-act=rqz]').click()`));await W(200);
ok(await ev(()=>/A contagem de Teste RQ volta a 0/.test(document.querySelector('.rqzq').textContent)),'Recomeçar: pede confirmação explicando o que acontece');
await x.act('rqzx');ok(await ev(()=>!document.querySelector('.rqzq')&&rqSes('rqx').length===16),'Cancelar: nada muda');
const nH=await ev(()=>S.sessions.length);
await ev(new Function(`${card().replace(/^/,'const c=')};c.querySelector('[data-act=rqz]').click()`));await W(200);await x.act('rqzok','rqx');await W(300);
ok(await ev(n=>rqSes('rqx').length===0&&rqDue('rqx').length===0&&S.sessions.length===n&&rqSesAll('rqx').length===16,nH),'Recomeçar: fila zerada, nada pendente, Histórico igual');
ok(await ev(()=>{const c=[...document.querySelectorAll('.rqsc')].find(c=>/Teste RQ/.test(c.textContent));return !!c&&/0 sessões · Em dia · contagem recomeçada em/.test(c.textContent)&&/Desfazer/.test(document.body.innerText)}),'cartão: "0 sessões · contagem recomeçada em …", com Desfazer');
await p.screenshot({path:'saida/rqrev-recomecar-'+w+'.png'});
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(200);
await study('rqx',17);await W(200);ok(await ev(()=>rqSes('rqx').length===1&&!ui.rqreg),'depois de recomeçar: a próxima é a sessão 1, sem revisão');
await study('rqx',18);await W(200);ok(await due()==='1:1','sessão 2: revisa a 1');await x.act('rqskip');
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);await x.act('rvadj');await x.act('rqcfg');await W(200);
await x.act('rqz','*');ok(await ev(()=>/todas as disciplinas volta a 0/.test(document.querySelector('.rqzq').textContent)),'ajuste: recomeçar todas pede confirmação');
await x.act('rqzok','*');await W(200);ok(await ev(()=>rqSubs().every(s=>rqSes(s.id).length===0)&&rqSesAll('rqx').length===18),'recomeçar todas: todas as filas zeradas; o Histórico continua');
await x.act('rqcfgx');
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);
await x.act('rvadj');await W(200);
/* 13. aviso depois de registrar (sem abrir a janela) e revisão durante a sessão: Agora e foco */
await ev(()=>{hideUndo();for(const n of ['A1','A2']){S.sel.subj='rqx';S.sel.groups=[{id:'g'+n,nt:'Tópico Q',rows:[{id:'r'+n,kind:'aula',name:'Aula '+n,link:''}]}];addSession(30)}save();render()});await W(120);
let av2=await ev(()=>({jan:!!document.querySelector('[data-f=rqreg]'),toast:(document.getElementById('undo')||{}).textContent||''}));
ok(!av2.jan&&/sess(ão|ões) para revisar com questões · Teste RQ/.test(av2.toast)&&/Revisar$/.test(av2.toast),'depois de registrar: sem janela, só o aviso com Revisar '+JSON.stringify(av2));
await ev(()=>{rqMark(rqDue('rqx'),'skip');S.progress.rqx=0;S.sel.subj='rqx';save();render()});
await ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(250);await ev(()=>{S.sel.subj='rqx';render()});await W(150);
const nS=await ev(()=>rqSes('rqx').length);
const ag=await ev(()=>{const e=[...document.querySelectorAll('#app [data-act=rqnow]')].find(e=>e.offsetParent);return e?e.textContent:null});
ok(ag&&/^Revisar com questões \(\d+\)$/.test(ag),'cartão Agora: "Revisar com questões (N)" com as revisões da sessão em andamento '+JSON.stringify(ag));
await ev(()=>document.querySelector('.nwplay').click());await W(300);await ev(()=>document.querySelector('.fmd [data-act=tstart]').click());await W(300);
await ev(()=>document.querySelector('.fmd [data-act=rqnow]').click());await W(300);
let fz=await ev(n=>{const d=document.querySelector('.dlg.rqfz'),D=rqDue('rqx',true);return d?{run:S.timer.running,top:document.elementFromPoint(innerWidth/2,d.getBoundingClientRect().top+40)?.closest('.rqfz')===d,sub:d.querySelector('.trvok .mut').textContent,tempo:!!d.querySelector('[name=m]'),due:D.map(z=>z.m).join(','),esp:rqIv().map(g=>n+1-g).filter(m=>m>=1).join(',')}:null},nS);
ok(fz&&fz.run&&fz.top&&!fz.tempo&&new RegExp('durante a sessão '+(nS+1)+'$').test(fz.sub)&&fz.due===fz.esp,'foco: a janela abre por cima, o relógio continua, sem campo de tempo, com as revisões da sessão '+(nS+1)+' '+JSON.stringify(fz));
await p.keyboard.press('Space');await W(200);ok(await ev(()=>S.timer.running),'com a janela aberta, Espaço não pausa o relógio');
await ev(()=>{const f=document.querySelector('[data-f=rqreg]');f.querySelector('[name="qa-0-0-0"]').value='4';f.querySelector('[name="qt-0-0-0"]').value='5';f.requestSubmit()});await W(300);
ok(await ev(()=>!document.querySelector('[data-f=rqreg]')&&S.sx===true&&S.timer.running&&rqDue('rqx',true).length===0),'registrar no foco: volta ao foco, relógio contando, nada pendente para esta sessão');
ok(await ev(()=>{const R=S.sessions.filter(x=>String(x.rid||'').startsWith('rq-')).pop();return R&&R.min===0&&R.items[0].ac===4}),'a revisão feita no foco não leva tempo próprio (o tempo é da sessão de estudo)');
await ev(()=>{S.timer.acc=el();S.timer.running=false;S.sel.groups=[{id:'gb',nt:'Tópico Q',rows:[{id:'rb',kind:'aula',name:'Aula B',link:''}]}];addSession(30);S.timer={running:false,start:0,acc:0};S.sx=false;save();render()});await W(150);
ok(await ev(()=>!/para revisar com questões/.test((document.getElementById('undo')||{}).textContent||'')&&rqDue('rqx').length===0),'ao registrar a sessão, nada sobra: sem aviso');
/* 14. outras revisões contam: só no que já chegou e só com acertos; apagar devolve */
await ev(()=>{rqMark(rqDue('rqx'),'skip');S.timer={running:false,start:0,acc:0};S.sx=false;for(const n of ['C1','C2']){S.sel.subj='rqx';S.sel.groups=[{id:'g'+n,nt:'Tópico Q',rows:[{id:'r'+n,kind:'aula',name:'Aula '+n,link:''}]}];addSession(30)}save();render()});await W(150);
let cr=await ev(()=>{const D=rqDue('rqx');return D.map(z=>z.m+':'+z.o.recs[0].items[0].name).join(' ')});const last=await ev(()=>rqSes('rqx').length);
ok(/Aula C1/.test(cr),'antes: a sessão da Aula C1 está para revisar '+cr);
const mkRv=(nm,tq)=>ev(([nm,tq])=>{S.sessions.push({id:'rv'+nm+tq,ses:'rv'+nm+tq,subj:'rqx',topic:'tq1',min:10,cycle:S.cycle,set:S.set||1,review:true,trv:'rqx|tq1|x',kind:'aula',items:[{kind:'aula',name:nm,link:'',...(tq?{ac:3,tq}:{})}],date:today()});save();render()},[nm,tq]);
await mkRv('Aula C1',0);ok(await ev(()=>rqDue('rqx').some(z=>z.o.recs[0].items[0].name==='Aula C1')),'revisão por tópico sem acertos na Aula C1: continua para revisar');
await mkRv('Aula C1',5);ok(await ev(()=>!rqDue('rqx').some(z=>z.o.recs[0].items[0].name==='Aula C1')),'com acertos (3/5): a vez que já chegou conta como feita');
ok(await ev(()=>{const r=rqInfo('rqx').rows.find(r=>r.o.recs[0].items[0].name==='Aula C1');return r&&r.vz[0].st==='cr'&&r.vz[0].c==='t'&&r.vz.slice(1).every(v=>v.st==='fu')}),'só a vez que já chegou: as próximas continuam no lugar (marca "1ª ✓ tópico")');
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);await x.act('rvt','questoes');await W(200);await ev(()=>{const k='rqs:rqx';const c=[...document.querySelectorAll('.rqsc')].find(c=>/Teste RQ/.test(c.textContent));if(c&&!c.querySelector('.rqsr')){ui.open.has(k)?ui.open.delete(k):ui.open.add(k);render()}});await W(200);
ok(await ev(()=>[...document.querySelectorAll('.rqk')].some(k=>/^1ª ✓ tópico$/.test(k.textContent)&&/feita na revisão por tópico/.test(k.title))),'aba Questões: "1ª ✓ tópico", com "feita na revisão por tópico" ao passar o mouse');
await ev(()=>{S.sessions=S.sessions.filter(x=>x.id!=='rvAula C15');save();render()});ok(await ev(()=>rqDue('rqx').some(z=>z.o.recs[0].items[0].name==='Aula C1')),'apagar essa revisão: a vez volta a ficar para revisar');
await ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(200);await x.act('rvadj');await W(200);
await ev(()=>document.querySelector('[data-act=rvsys][data-id=s]').click());await W(200);ok(await ev(()=>srOn()&&!rqOn()),'ligar a por sessões desliga a por questões');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
