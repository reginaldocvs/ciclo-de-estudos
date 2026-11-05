/* Revisão por sessões: a cada N sessões de uma disciplina, antes da próxima, revisar o que foi estudado nela; cada item até Y revisões.
   Percorre: cartão no Ciclo (no lugar do "Revise antes"), linha no Hoje, aba Sessões, registrar (com acertos e tempo), pular,
   itens chegando a ✓, desfazer, foco da revisão, ajustes (ligar/desligar, N e Y) e o Histórico.
   Uso: node lint/sessoes.mjs <dados.json> <saída> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.sessions=[];S0.progress={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
const ev=(f,...a)=>x.ev(f,...a);
/* sessões de estudo da disciplina da vez: cada uma com um tópico e uma aula */
const study=n0=>ev(n0=>{const s=current();['Crase','Regência verbal','Concordância'].forEach((n,i)=>{if(!s.topics.some(t=>t.name===n))s.topics.push({id:'t'+i,name:n,done:false,links:[]})});
 const d=today();for(let i=0;i<3;i++){const k='ss'+(n0+i),t=s.topics[(n0+i)%3];S.sessions.push({id:k,ses:k,subj:s.id,topic:t.id,min:30,cycle:Math.max(1,S.cycle-1),set:1,review:false,kind:'aula',date:d,items:[{kind:'aula',name:'Aula '+(n0+i+1),link:'',...(n0+i===0?{ac:6,tq:10}:{})}]})}save();render()},n0);
const goTab=async(t,r)=>{await ev(t=>document.querySelector(`nav [data-tab="${t}"]`).click(),t);await W(250);if(r){await ev(r=>document.querySelector(`[data-act=rvt][data-id="${r}"]`).click(),r);await W(250)}};
const st=()=>ev(()=>{const s=current();return {due:srDue(s.id),nw:srNew(s.id).length,todo:srTodo(s.id).map(t=>t.t.name+':'+t.its.map(z=>z.n).join(',')).join(' '),fin:srSplit(s.id).fin.reduce((a,t)=>a+t.its.length,0),pts:(S.srvPt||[]).length}});

// 1. ligar nos Ajustes de revisão
await goTab('rev');await x.act('rvadj');await W(200);
await ev(()=>document.querySelector('[data-act=rvsys][data-id=s]').click());await W(250);
ok(await ev(()=>srOn()&&S.srv.start===today()&&srN()===2&&srY()===3&&/A cada 2 sessões de uma disciplina; até 3 revisões por item/.test(document.getElementById('modal').innerText)),'liga nos Ajustes (padrão: a cada 2 sessões, até 3 revisões)');
/* o resto do roteiro usa 3 sessões e 2 revisões */
await ev(()=>{S.srv.n=3;S.srv.y=2;save();render()});
await ev(()=>document.querySelector('[data-act=rvadjx]').click());await W(200);
ok(await ev(()=>!!document.querySelector('.rvtabs [data-id=sessoes]')),'aba "Sessões" aparece na Revisão');
// 2. três sessões: disponível; cartão no Ciclo no lugar do "Revise antes"
await study(0);await goTab('ciclo');
let c=await ev(()=>{const k=document.querySelector('.srvc');return k?{t:k.innerText,tags:[...k.querySelectorAll('.srn')].map(e=>e.textContent),old:!!document.querySelector('.rvcard')}:null});
ok(c&&/3 sessões desde a última revisão · 3 itens/.test(c.t)&&c.tags.join()==='1ª de 2,1ª de 2,1ª de 2'&&!c.old,'Ciclo: cartão "Revise as sessões anteriores" com 3 itens "1ª de 2" e sem o "Revise antes" '+JSON.stringify(c&&{tags:c.tags,old:c.old}));
ok(await ev(()=>{const k=document.querySelector('.srvc');return /6\/10 · 60%/.test(k.innerText)&&/reforçar · 60%/.test(k.innerText)&&k.querySelectorAll('.srit .ritl').length===3}),'acertos: aula com "6/10 · 60%", tópico com "reforçar · 60%" e uma linha só por aula');
await p.screenshot({path:`${OUT}/sessoes-${w}-ciclo.png`,fullPage:true});
// 3. Hoje mostra a linha; aba Sessões mostra "Disponível"
await goTab('rev','hoje');
ok(await ev(()=>/Para hoje \(1\)/.test(document.querySelector('.rvtoday').innerText)&&!!document.querySelector('.rvtoday [data-act=srgo]')),'Hoje: "Para hoje (1)" com a revisão por sessões');
await goTab('rev','sessoes');
ok(await ev(()=>/Disponível/.test(document.querySelector('.srsc').innerText)&&/Em revisão \(3\)/.test(document.querySelector('.srsc').innerText)),'aba Sessões: disponível, "Em revisão (3)"');
await p.screenshot({path:`${OUT}/sessoes-${w}-aba.png`,fullPage:true});
// 4. foco: abre com a lista e "Registrar" leva à janela de registro
await ev(()=>document.querySelector('.srsc [data-act=srgo]').click());await W(300);
ok(await ev(()=>{const d=document.querySelector('.rvfd');return !!d&&/Revisão por sessões/.test(d.innerText)&&d.querySelectorAll('.srit').length===3}),'foco: "Revisão por sessões" com as 3 aulas');
await ev(()=>{S.rvf.acc=20*60000;save();render()});await W(200);await ev(()=>document.querySelector('[data-act=rvfreg]').click());await W(300);
ok(await ev(()=>{const d=document.querySelector('form[data-f=srreg]');return !!d&&d.querySelector('[name=m]').value==='0h20'}),'Registrar do foco abre a janela com 0h20');
// 5. registrar com acertos: ponto conta 1 para cada item, sai da vez, vai para o Histórico
await ev(()=>{const a=document.querySelector('form[data-f=srreg] [name^=qa]'),t=document.querySelector('form[data-f=srreg] [name^=qt]');a.value='4';t.value='10';a.dispatchEvent(new Event('input',{bubbles:true}));t.dispatchEvent(new Event('input',{bubbles:true}))});
await x.submit('form[data-f=srreg]');await W(300);
let s1=await st();ok(!s1.due&&s1.nw===0&&s1.todo==='Crase:1 Regência verbal:1 Concordância:1'&&s1.pts===1,'registrar: cada item conta 1 e a disciplina sai da vez '+JSON.stringify(s1));
ok(await ev(()=>{const R=S.sessions.filter(x=>String(x.rid).startsWith('sr-'));return R.length===3&&Math.round(R.reduce((a,x)=>a+x.min,0))===20&&R.every(x=>x.review)}),'registro de 20 min dividido entre os 3 tópicos, como revisão');
ok(await ev(()=>/Próxima revisão em 3 sessões/.test(document.querySelector('.srsc').innerText)&&/Última revisão: \d\d\/\d\d · 20min · \d+\/\d+ acertos \(\d+%\)/.test(document.querySelector('.srsc').innerText)),'aba Sessões: "Próxima revisão em 3 sessões" e a última com tempo e acertos '+JSON.stringify(await ev(()=>document.querySelector('.srlast').innerText)));
// 6. mais 3 sessões: lista acumula (antigos "2ª de 2", novos "1ª de 2")
await study(3);await goTab('ciclo');
c=await ev(()=>[...document.querySelectorAll('.srvc .srn')].map(e=>e.textContent).sort().join());
ok(c==='1ª de 2,1ª de 2,1ª de 2,2ª de 2,2ª de 2,2ª de 2','segunda vez: 3 itens novos (1ª) e os 3 anteriores (2ª) "'+c+'"');
// 7. pular: cobre as sessões sem contar
await ev(()=>document.querySelector('.srvc [data-act=srskip]').click());await W(300);
s1=await st();ok(!s1.due&&s1.todo.split(',').length>1&&s1.pts===2&&!(await ev(()=>!!document.querySelector('.srvc'))),'Pular: sai da vez sem contar '+JSON.stringify(s1));
// 8. mais 3: registrar sem nada → os 3 primeiros chegam a 2 e ganham ✓
await study(6);await goTab('rev','hoje');await ev(()=>document.querySelector('.rvtoday [data-act=srreg]').click());await W(300);await x.submit('form[data-f=srreg]');await W(300);
s1=await st();ok(s1.fin===3&&!s1.due&&s1.todo==='Crase:1,1 Regência verbal:1,1 Concordância:1,1','terceira vez: os 3 primeiros chegam a 2 revisões e vão para Concluídos ✓ (o pulo não contou) '+JSON.stringify(s1));
await goTab('rev','sessoes');await ev(()=>document.querySelector('.srsc .srfg [data-act=trvtog]').click());await W(200);
ok(await ev(()=>document.querySelectorAll('.srsc .srok').length===3&&/Concluídos ✓ \(3\)/.test(document.querySelector('.srsc').innerText)),'aba Sessões: "Concluídos ✓ (3)" com ✓ em cada um');
await p.screenshot({path:`${OUT}/sessoes-${w}-concl.png`,fullPage:true});
// 9. desfazer a última revisão: volta a valer
await ev(()=>document.querySelector('.srsc [data-act=srundo]').click());await W(300);
s1=await st();ok(s1.due&&s1.fin===0&&s1.pts===2,'Desfazer a última: a revisão volta a ficar disponível '+JSON.stringify(s1));
// 10. ajustes: N e Y
await x.act('rvadj');await ev(()=>document.querySelector('[data-act=srcfg]').click());await W(200);
await ev(()=>{const f=document.querySelector('form[data-f=srcfg]');f.elements.sn.value='4';f.elements.sy.value='3';f.elements.sy.dispatchEvent(new Event('input',{bubbles:true}))});await W(100);
ok(await ev(()=>/A cada 4 sessões[\s\S]*até 3 revisões/.test(document.getElementById('rvsum').innerText)),'resumo dos ajustes acompanha os números');
await x.submit('form[data-f=srcfg]');await W(300);
ok(await ev(()=>srN()===4&&srY()===3),'salva: a cada 4 sessões, até 3 revisões');
// 11. histórico: filtro e etiqueta
await goTab('reg');
ok(await ev(()=>/rev\. sessões/.test(document.querySelector('main').innerText)),'Histórico: registro com a etiqueta "rev. sessões"');
// 12. desligar: some a aba e o cartão volta a ser o "Revise antes"
await goTab('rev');await x.act('rvadj');await ev(()=>document.querySelector('[data-act=rvsys][data-id=s]').click());await W(200);await ev(()=>document.querySelector('[data-act=rvadjx]').click());await W(200);
ok(await ev(()=>!srOn()&&!document.querySelector('.rvtabs [data-id=sessoes]')),'desligada: a aba Sessões some');
await goTab('ciclo');ok(await ev(()=>!document.querySelector('.srvc')&&!!document.querySelector('.rvcard')),'desligada: volta o "Revise antes de começar"');
// 13. sincronização: revisões feitas em dois aparelhos ficam as duas (com e sem versão em comum)
ok(await ev(()=>{const P=id=>({id,s:'x',d:today(),ses:[id],its:[]}),o=m3({srvPt:[]},{srvPt:[P('a')]},{srvPt:[P('b')]},true),C={sessions:[],srvPt:[P('b')]};syMerge(C,{sessions:[],srvPt:[P('a'),P('b')]},null);return o.srvPt.length===2&&C.srvPt.length===2}),'sincronização junta as revisões por sessões dos dois aparelhos');
ok(!(await ev(()=>document.documentElement.scrollWidth>innerWidth)),'sem rolagem para o lado');
ok(!errs.length,'sem erros na página '+JSON.stringify(errs));
await b.close();console.log(bad?'FALHOU':'TUDO OK');process.exit(bad?1:0);
