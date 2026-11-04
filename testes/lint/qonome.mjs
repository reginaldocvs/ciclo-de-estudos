/* Nome opcional das "Questões": digitado no campo da linha aberta, aparece no registro, Histórico e revisões; repetir o link mantém o nome;
   renomear vale em todo lugar; apagar volta a "Questões - n"; a numeração das outras não muda */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rvf=null;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w:390,h:860});const x=mk(p);
const Q='https://quiz.exemplo.com/q.html?v=';
const id=await x.ev(()=>actives().find(s=>!gDone(s)).id);
const tab=async t=>{await x.ev(t=>document.querySelector(`nav [data-tab=${t}]`).click(),t);await W(400)};
const hist=async()=>{await tab('reg');const v=await x.ev(()=>{const t=document.getElementById('app').innerText;const i=t.indexOf('Tópico N');return t.slice(i,i+300)});await tab('ciclo');return v};
const labels=()=>x.ev(()=>[...document.querySelectorAll('#modal .qlb')].map(e=>e.textContent.trim()).join(','));
// 1º registro: 3 links; dá nome à 1ª pelo campo
await x.act('rreg',id);
await x.ev(Q=>{const g=S.sel.groups[0];g.nt='Tópico N';g.rows=[1,2,3].map(i=>({id:uid(),kind:'aula',name:'',link:'',q:Q+i,qo:true,ac:String(i+4),tq:'10',...(i===1?{open:true}:{})}));render()},Q);await W(300);
ok(await x.ev(()=>!!document.querySelector('#modal input[data-rlbl]')),'linha aberta mostra o campo "Nome"');
const inp=await p.$('#modal input[data-rlbl]');await inp.click();await inp.type('Quiz da aula 2');await W(200);
await p.screenshot({path:OUT+'/qonome-campo.png'});
await x.ev(()=>{const r=S.sel.groups[0].rows[0];r.open=false;render()});await W(200);
const l1=await labels();ok(l1==='Quiz da aula 2,Questões - 2,Questões - 3','linha fechada mostra o nome e as outras seguem numeradas ('+l1+')');await p.screenshot({path:OUT+'/qonome-fechado.png'});
await x.fill('#modal input[name=m]','1h30');await x.submit('#modal form[data-f=man]');await W(400);
let h=await hist();console.log('    histórico:',h.replace(/\s+/g,' ').slice(0,200));ok(/Quiz da aula 2/.test(h)&&/Questões - 2/.test(h)&&/Questões - 3/.test(h)&&!/Questões - 1/.test(h),'Histórico mostra o nome e mantém "- 2" e "- 3"');
await tab('reg');await x.ev(()=>{const e=[...document.querySelectorAll('#app *')].find(e=>e.children.length===0&&/Tópico N/.test(e.textContent));e&&e.scrollIntoView({block:'start'})});await W(200);await p.screenshot({path:OUT+'/qonome-historico.png'});await tab('ciclo');
// 2º registro com o mesmo link da 1ª (sem mexer no nome): continua com o nome
await x.ev(id=>{S.progress[id]=0;save();render()},id);await x.act('rreg',id);
await x.ev(Q=>{const g=S.sel.groups[0];g.nt='Tópico N';g.rows=[{id:uid(),kind:'aula',name:'',link:'',q:Q+1,qo:true,ac:'9',tq:'10'}];render()},Q);await W(300);
const l2=await labels();ok(l2==='Quiz da aula 2','mesmo link de novo já aparece com o nome ('+l2+')');
await x.fill('#modal input[name=m]','1h30');await x.submit('#modal form[data-f=man]');await W(400);
ok(await x.ev(id=>S.subjects.find(z=>z.id===id).topics.find(t=>t.name==='Tópico N').links.find(l=>l.q&&l.q.endsWith('=1')).lbl,id)==='Quiz da aula 2','registrar de novo sem mexer mantém o nome');
// renomear pelo 3º registro e depois apagar o nome
const rn=async v=>{await x.ev(id=>{S.progress[id]=0;save();render()},id);await x.act('rreg',id);await x.ev(Q=>{const g=S.sel.groups[0];g.nt='Tópico N';g.rows=[{id:uid(),kind:'aula',name:'',link:'',q:Q+1,qo:true,ac:'8',tq:'10',open:true}];render()},Q);await W(300);
 await x.ev(v=>{const e=document.querySelector('#modal input[data-rlbl]');e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))},v);await x.fill('#modal input[name=m]','1h30');await x.submit('#modal form[data-f=man]');await W(400)};
await rn('Lista CESPE');h=await hist();ok(/Lista CESPE/.test(h)&&!/Quiz da aula 2/.test(h),'renomear vale em todos os registros dessa questão');
await rn('');h=await hist();ok(/Questões - 1/.test(h)&&!/Lista CESPE/.test(h),'apagar o nome volta a "Questões - 1"');
// acertos seguem ligados à mesma questão
const ac=await x.ev(id=>{const t=S.subjects.find(z=>z.id===id).topics.find(t=>t.name==='Tópico N');const l=t.links.find(l=>l.q&&l.q.endsWith('=1'));return JSON.stringify(qAgg(t.id,l))},id);ok(ac==='{"a":30,"t":40}','acertos da questão somam os 4 registros dela ('+ac+')');
// Editar registro: renomeia por lá
await x.ev(id=>{const e=[...document.querySelectorAll(`[data-act=rview][data-id="${id}"]`)].find(e=>e.offsetParent);e.click()},id);await W(400);
await x.ev(()=>{const b=[...document.querySelectorAll('#modal button')].find(b=>b.textContent.trim()==='Editar');b.click()});await W(500);
const opened=await x.ev(()=>{const r=grps().flatMap(g=>g.rows.map(r=>[g,r])).find(([g,r])=>r.qo&&String(r.q||'').endsWith('=1'));if(!r)return false;r[1].open=true;render();return true});await W(300);
ok(opened&&await x.ev(()=>!!document.querySelector('#modal input[data-rlbl]')),'Editar registro: linha de Questões abre com o campo "Nome"');
await x.ev(()=>{const e=document.querySelector('#modal input[data-rlbl]');e.value='Simulado 1';e.dispatchEvent(new Event('input',{bubbles:true}))});await p.screenshot({path:OUT+'/qonome-editar.png'});
console.log('    botões:',await x.ev(()=>[...document.querySelectorAll('#modal button,#modal form')].map(e=>e.tagName+':'+(e.dataset.act||e.dataset.f||'')+':'+e.textContent.trim().slice(0,15)).filter(t=>/Salvar|FORM|edsave|svedit/i.test(t)).join(' | ')));await x.ev(()=>{const b=[...document.querySelectorAll('#modal button')].find(b=>/^Salvar/.test(b.textContent.trim()));b.click()});await W(500);
h=await hist();ok(/Simulado 1/.test(h),'nome dado em Editar registro aparece no Histórico');
ok(!errs.length,'sem erros '+JSON.stringify(errs));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
