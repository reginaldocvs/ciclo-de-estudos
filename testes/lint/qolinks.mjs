/* Várias "Questões" (sem link de aula) com links diferentes no mesmo tópico: cada uma vira um item (no tópico, no "Registrado neste ciclo",
   na revisão e nos acertos); o mesmo link de novo não duplica; dados antigos já juntados voltam a ser separados ao abrir */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rvf=null;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w:390,h:860});const x=mk(p);
const Q=n=>'https://quiz.exemplo.com/q.html?v='+n;
const id=await x.ev(()=>actives().find(s=>!gDone(s)).id);
await x.act('rreg',id);
await x.ev(base=>{const g=S.sel.groups[0];g.nt='Tópico Q';g.rows=[{id:uid(),kind:'aula',name:'Aula 1',link:'',q:''},...[1,2,3].map(i=>({id:uid(),kind:'aula',name:'',link:'',q:base+i,qo:true,ac:String(i+3),tq:'8'}))];render()},Q(''));
await W(300);const fv=await x.ev(()=>[...document.querySelectorAll('#modal .qlb')].map(e=>e.textContent.trim()).join(','));ok(fv==='Questões - 1,Questões - 2,Questões - 3','formulário numera ('+fv+')');
await x.fill('#modal input[name=m]','1h30');await x.submit('#modal form[data-f=man]');await W(400);
const t1=await x.ev(id=>{const s=S.subjects.find(z=>z.id===id),t=s.topics.find(t=>t.name==='Tópico Q');return t.links.map(l=>l.title+'|'+(l.q||''))},id);console.log('    tópico:',JSON.stringify(t1));
ok(t1.filter(l=>l.startsWith('Questões')).length===3,'3 links de questões viram 3 itens no tópico');
await x.ev(id=>{const e=[...document.querySelectorAll(`[data-act=rview][data-id="${id}"]`)].find(e=>e.offsetParent);e.click()},id);await W(400);
const nv=await x.ev(()=>(document.querySelector('#modal .dlg').innerText.match(/Questões - \d/g)||[]).join(','));ok(nv==='Questões - 1,Questões - 2,Questões - 3','"Registrado neste ciclo" mostra as 3 numeradas ('+nv+')');await p.screenshot({path:OUT+'/qolinks-registrado.png'});
await x.ev(()=>document.querySelector('#modal [data-act=rvclose]').click());await W(300);
await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(500);const hv=await x.ev(()=>(document.getElementById('app').innerText.match(/Questões - \d/g)||[]).join(','));ok(hv==='Questões - 1,Questões - 2,Questões - 3','Histórico numera ('+hv+')');await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300);
// acertos por item: cada "Questões" tem o seu
const ac=await x.ev(id=>{const s=S.subjects.find(z=>z.id===id),t=s.topics.find(t=>t.name==='Tópico Q');return t.links.filter(l=>l.title==='Questões').map(l=>{const r=acLast(t.id,l);return r?r.a+'/'+r.t:'-'})},id).catch(e=>['erro '+e.message]);
console.log('    acertos:',JSON.stringify(ac));ok(JSON.stringify(ac)==='["4/8","5/8","6/8"]','cada "Questões" guarda os próprios acertos');
await x.ev(id=>{const s=S.subjects.find(z=>z.id===id);S.progress[id]=0;save();render()},id);await x.act('rreg',id);await x.ev(base=>{const g=S.sel.groups[0];g.nt='Tópico Q';g.rows=[{id:uid(),kind:'aula',name:'',link:'',q:base+'4',qo:true},{id:uid(),kind:'aula',name:'',link:'',q:base+'2',qo:true}];render()},Q(''));await W(300);
const fv2=await x.ev(()=>[...document.querySelectorAll('#modal .qlb')].map(e=>e.textContent.trim()).join(','));ok(fv2==='Questões - 4,Questões - 2','2ª sessão: link novo vira 4, link repetido mantém o 2 ('+fv2+')');
await x.ev(()=>{const c=document.querySelector('#modal [data-act=xcancel],#modal .x[data-act=rvclose],#modal [data-act=regx]');c&&c.click()});await W(300);await p.reload();await W(700);
// dados antigos: junta as 3 num item só (como o app antigo) e recarrega; o app separa de novo
await x.ev(id=>{const s=S.subjects.find(z=>z.id===id),t=s.topics.find(t=>t.name==='Tópico Q');const qs=t.links.filter(l=>l.title==='Questões');t.links=t.links.filter(l=>l.title!=='Questões');t.links.push({...qs[2]});save()},id);
await p.reload();await W(800);
const t2=await x.ev(id=>{const s=S.subjects.find(z=>z.id===id),t=s.topics.find(t=>t.name==='Tópico Q');return t.links.filter(l=>l.title==='Questões').map(l=>l.q)},id);ok(t2.length===3&&new Set(t2).size===3,'ao abrir, as questões juntadas voltam a ser 3 ('+t2.length+')');
await p.reload();await W(800);ok(await x.ev(id=>S.subjects.find(z=>z.id===id).topics.find(t=>t.name==='Tópico Q').links.filter(l=>l.title==='Questões').length,id)===3,'recarregar de novo não duplica');
ok(!errs.length,'sem erros '+JSON.stringify(errs));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
