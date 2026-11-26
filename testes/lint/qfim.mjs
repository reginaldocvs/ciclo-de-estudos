/* Gabarito "a cada questão" ou "no fim", escolhido no começo da bateria:
   - a escolha aparece só antes da primeira resposta e é lembrada por tipo (caderno, revisão, consolidação);
   - no fim: a resposta fica marcada (dá para trocar), sem gabarito nem comentário, e não conta até Entregar;
   - sair no meio guarda as respostas: no caderno, "Continuar" ou "Descartar" (com Desfazer);
   - Entregar pede confirmação (avisa as sem resposta) e mostra o resultado; depois, cada questão com gabarito;
   - teclado: a letra marca, Enter avança.
   Uso: node lint/qfim.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qfim;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const J=JSON.stringify([1,2,3,4].map(i=>({numero:i,disciplina:'X',topico:'Tópico '+i,tipo:'CE',enunciado:'Item '+i+' do teste.',gabarito:i===4?null:(i%2?'C':'E'),comentario:{por_que_certa:'Porque sim.',onde_esta_o_erro:null,o_correto_e:null,alternativas_erradas:null}})));
const cad=await ev(j=>{const s=actives()[0],id=uid(),P=qPrev({txt:j});qcL().push({id,subj:s.of||s.id,nome:'Caderno fim',n:P.qs.length,ce:4,me:0,d:today()});qSave(id,{qs:P.qs});tab='qz';ui.qcad=id;save();render();return id},J);await W(300);
const scr=()=>ev(()=>{const d=document.querySelector('.qzd');if(!d)return null;return {gm:[...d.querySelectorAll('.qzgm .seg')].map(b=>b.textContent+(b.classList.contains('on')?'*':'')),fb:!!d.querySelector('.qzfb'),pk:[...d.querySelectorAll('.qzo.pk')].map(b=>b.dataset.id),pr:[...d.querySelectorAll('.qzo[aria-pressed=true]')].map(b=>b.dataset.id),an:d.querySelectorAll('.qzps.an').length,ent:!!d.querySelector('.qzentb'),nf:(d.querySelector('.qznav .qznf')||{}).textContent||'',q:(d.querySelector('.qzn b')||{}).textContent||'',res:!!d.querySelector('.qzres')}});
await x.act('qall',cad);await W(300);
await p.screenshot({path:`saida/qfim-inicio-${w}.png`});let r=await scr();ok(r&&r.gm.join()==='A cada questão*,No fim','começo da bateria: a escolha, com "A cada questão" marcada '+JSON.stringify(r&&r.gm));
await x.act('qzfim','1');await W(200);r=await scr();
ok(r.gm.join()==='A cada questão,No fim*'&&await ev(()=>S.qfim&&S.qfim.cad===true),'"No fim" escolhido e lembrado para os cadernos');
await ev(()=>qAns('C'));await W(250);r=await scr();
const qa0=await ev(c=>Object.keys((S.qa||{})[c]||{}).length,cad);
ok(!r.fb&&r.pk.join()==='C'&&r.pr.join()==='C'&&r.an===1&&!r.gm.length&&r.ent&&qa0===0&&r.nf==='Próxima','no fim: marcada sem gabarito nem comentário, não conta ainda; a escolha some; "Entregar" no topo '+JSON.stringify({r,qa0}));
await p.screenshot({path:`saida/qfim-marcada-${w}.png`});
await ev(()=>qAns('E'));await W(200);r=await scr();ok(r.pk.join()==='E','dá para trocar a resposta antes de entregar');
/* teclado: a letra marca e Enter avança */
await x.act('qnext');await W(200);await p.keyboard.press('e');await W(200);r=await scr();ok(r.q==='Questão 2'&&r.pk.join()==='E','teclado: E marca Errado na questão 2');
await p.keyboard.press('Enter');await W(250);r=await scr();ok(r.q==='Questão 3','Enter avança para a questão 3');
/* sair no meio: guarda e oferece Continuar / Descartar */
await x.act('qzx');await W(300);
r=await ev(()=>{const e=document.querySelector('.qzdr');return e?e.innerText.replace(/\s+/g,' '):null});
ok(r&&/não entregue/.test(r)&&/Gabarito no fim · 2 de 4 respondidas/.test(r),'caderno: "Bateria com gabarito no fim, não entregue · 2 de 4 respondidas" '+JSON.stringify(r));
await p.screenshot({path:`saida/qfim-caderno-${w}.png`});
await ev(()=>document.querySelector('.qzdr [data-act=qzcont]').click());await W(300);r=await scr();
ok(r&&r.q==='Questão 3'&&r.an===2,'Continuar: volta onde parou, com as 2 respostas '+JSON.stringify(r));
await x.act('qgoto','3');await W(200);r=await scr();ok(r.nf==='Entregar','na última, o rodapé é "Entregar"');
await ev(()=>document.querySelector('.qznav [data-act=qzent]').click());await W(250);
r=await ev(()=>(document.querySelector('.qzentq')||{}).innerText||'');ok(/Entregar agora\?/.test(r)&&/2 questões estão sem resposta/.test(r),'confirmação: avisa as 2 sem resposta '+JSON.stringify(r));
await x.act('qzentx');await W(200);ok(await ev(()=>!document.querySelector('.qzentq')),'Voltar: continua resolvendo');
await ev(()=>qAns('C'));await W(150);await ev(()=>document.querySelector('.qzentb').click());await W(200);await x.act('qzentok');await W(400);
r=await ev(c=>({res:(document.querySelector('.qzres')||{}).innerText||'',qa:Object.keys((S.qa||{})[c]||{}).length,dr:Object.keys(S.qzp||{}).length}),cad);
ok(/1 de 2/.test(r.res)&&/sem resposta/.test(r.res)&&/sem gabarito/.test(r.res)&&r.qa===2&&r.dr===0,'entregue: resultado (1 de 2, sem resposta, sem gabarito), as respostas contam, o rascunho some '+JSON.stringify(r));
await p.screenshot({path:`saida/qfim-resultado-${w}.png`});
await x.act('qgoto','0');await W(250);r=await ev(()=>(document.querySelector('.qzd .qzfb')||{}).innerText||'');
ok(/Você errou/.test(r)&&/Gabarito: Certo/.test(r),'rever depois de entregar: a questão 1 com o gabarito '+JSON.stringify(r.slice(0,60)));
/* próxima bateria do caderno começa em "No fim"; a revisão continua em "A cada questão" */
await x.act('qzx');await W(250);await x.act('qall',cad);await W(250);r=await scr();ok(r.gm.join()==='A cada questão,No fim*','próxima bateria do caderno já começa em "No fim"');
const rv=await ev(c=>{const o=qLoad(c);qzOpen({cad:c,ids:o.qs.map(q=>q.id),i:0,res:{},fix:false,rq:c+':0',rk:''});return !!ui.qz.fim},cad);ok(!rv,'revisão por questões: continua "A cada questão" (lembrado à parte)');
/* descartar: começar outra bateria com uma não entregue descarta, com Desfazer */
await ev(c=>{const o=qLoad(c);ui.qz=null;qStart(c,o.qs.map(q=>q.id),0)},cad);await W(200);await ev(()=>qAns('C'));await x.act('qzx');await W(250);
await x.act('qall',cad);await W(300);
r=await ev(()=>({dr:Object.keys(S.qzp||{}).length,toast:(document.querySelector('#undo')||{}).innerText||''}));
ok(r.dr===0&&/descartada/.test(r.toast),'outra bateria descarta a não entregue, com aviso e Desfazer '+JSON.stringify(r));
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
