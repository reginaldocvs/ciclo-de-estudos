/* Formato 1.2.1 do JSON do Gemini (seção 11 do guia de questões):
   - nivel guardado; no resolver, "Nível" que mostra o nível ao clicar (e sozinho depois de responder);
   - comentario_do_arquivo guardado; depois de responder, cartão "Comentário do professor" recolhido, que fica aberto nas seguintes desta vez;
   - gabarito null: a questão entra pendente; resposta "Sem gabarito no arquivo", não conta até informar pela bandeira;
   - repetidas: mesmo enunciado com alternativas diferentes (ME) não é repetida; números entre colchetes ficam no texto.
   Uso: node lint/qz12.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const C=(o={})=>({por_que_certa:null,onde_esta_o_erro:null,o_correto_e:null,alternativas_erradas:null,...o});
const J=[
 {numero:1,disciplina:'Português',topico:'Crase',tipo:'CE',nivel:'médio',texto_base:null,comando:'Julgue o item.',enunciado:'Usa-se crase antes de palavra feminina [1] determinada.',alternativas:null,gabarito:'C',comentario:C({por_que_certa:'Regra geral.',comentario_do_arquivo:'Gabarito: Certo.\nA crase ocorre…\nSegunda linha.'})},
 {numero:2,disciplina:'Português',topico:'Crase',tipo:'CE',nivel:'difícil',texto_base:null,comando:'Julgue o item.',enunciado:'Item sem gabarito no arquivo.',alternativas:null,gabarito:null,comentario:C({comentario_do_arquivo:'Comentário do professor da 2.'})},
 {numero:3,disciplina:'Português',topico:'Crase',tipo:'ME',texto_base:null,comando:'Assinale.',enunciado:'Qual é a correta?',alternativas:{A:'um',B:'dois',C:'três'},gabarito:'B',comentario:C({por_que_certa:'Porque sim.'})},
 {numero:4,disciplina:'Português',topico:'Crase',tipo:'ME',texto_base:null,comando:'Assinale.',enunciado:'Qual é a correta?',alternativas:{A:'quatro',B:'cinco',C:'seis'},gabarito:'A',comentario:C()},
 {numero:5,disciplina:'Português',topico:'Crase',tipo:'ME',texto_base:null,comando:'Assinale.',enunciado:'Qual é a correta?',alternativas:{A:'um',B:'dois',C:'três'},gabarito:'B',comentario:C()},
 {numero:6,disciplina:'Português',topico:'Crase',tipo:'ME',texto_base:null,comando:'Assinale.',enunciado:'Questão do site com comentário do professor.',alternativas:{A:'alfa',B:'beta',C:'gama',D:'delta'},gabarito:'B',comentario:C({comentario_do_arquivo:'Gabarito: letra B. A alternativa C erra ao…'})},
 {numero:7,disciplina:'Português',topico:'Crase',tipo:'ME',texto_base:null,comando:'Assinale.',enunciado:'Questão gerada, sem comentário do professor.',alternativas:{A:'norte',B:'sul',C:'leste',D:'oeste'},gabarito:'C',comentario:C({por_que_certa:'Porque é leste.',alternativas_erradas:{A:'norte não',B:'sul não',D:'oeste não'}})}];
const P=await ev(j=>{const P=qPrev({txt:j});return {ok:P.ok,dup:P.dup,bad:P.bad,qs:P.qs.map(q=>({en:q.en,g:q.g,nv:q.nv||null,ca:q.c.ca||null}))}},JSON.stringify(J));
ok(P.ok===6&&P.dup===1&&!P.bad.length,'importa 6: a ME com o mesmo enunciado e outras alternativas entra; a igual em tudo é repetida '+JSON.stringify({ok:P.ok,dup:P.dup,bad:P.bad}));
ok(P.qs[0].nv==='médio'&&P.qs[0].ca==='Gabarito: Certo.\nA crase ocorre…\nSegunda linha.'&&/\[1\]/.test(P.qs[0].en),'guarda o nível e o comentário do professor; o [1] fica no texto '+JSON.stringify(P.qs[0]));
ok(P.qs[1].g===null,'gabarito null: entra sem gabarito (pendente)');
/* caderno e resolver */
const cad=await ev(j=>{const s=actives()[0],id=uid(),P=qPrev({txt:j});qcL().push({id,subj:s.of||s.id,nome:'Caderno 1.2',n:P.qs.length,ce:2,me:2,d:today()});qSave(id,{qs:P.qs});const o=qLoad(id);ui.qz={cad:id,ids:o.qs.map(q=>q.id),i:0,res:{},fix:false};save();render();return id},JSON.stringify(J));await W(300);
const scr=()=>ev(()=>{const d=document.querySelector('.qzd');return {meta:(d.querySelector('.qzmeta')||{}).innerText||'',nvb:!!d.querySelector('[data-act=qnv]'),fb:(d.querySelector('.qzfb:not(.qzpf)')||{}).innerText||'',pf:!!d.querySelector('.qzpf'),pfo:!!d.querySelector('.qzpft'),pft:(d.querySelector('.qzpft')||{}).innerText||'',flag:!!d.querySelector('.qzflag')}});
let r=await scr();ok(r.nvb&&!/médio/.test(r.meta)&&!r.pf,'antes de responder: "Nível" escondido e sem comentário do professor '+JSON.stringify(r));
await x.act('qnv');r=await scr();ok(/médio/.test(r.meta)&&!r.nvb,'tocar em "Nível" mostra "médio" '+JSON.stringify(r.meta));
await ev(()=>qAns('C'));await W(300);r=await scr();
ok(/Você acertou/.test(r.fb)&&r.pf&&!r.pfo,'respondida: o cartão "Comentário do professor" aparece recolhido '+JSON.stringify(r));
await x.act('qprof');r=await scr();ok(r.pfo&&r.pft==='Gabarito: Certo.\nA crase ocorre…\nSegunda linha.','aberto: o texto inteiro, com as quebras de linha '+JSON.stringify(r.pft));
/* a 2: sem gabarito */
await ev(()=>{ui.qz.i=1;render()});await W(200);r=await scr();ok(r.nvb,'outra questão: o nível começa escondido de novo');
await ev(()=>qAns('E'));await W(300);r=await scr();
const qa=await ev(c=>{const o=qLoad(c);return ((S.qa||{})[c]||{})[o.qs[1].id]||null},cad);
ok(/Sem gabarito no arquivo/.test(r.fb)&&/Você marcou Errado/.test(r.fb)&&!qa&&r.flag,'sem gabarito: "Sem gabarito no arquivo", não conta nos acertos e a bandeira está à mão '+JSON.stringify({fb:r.fb,qa}));
ok(/difícil/.test(r.meta),'respondida: o nível aparece sozinho '+JSON.stringify(r.meta));
await p.screenshot({path:`saida/qz12-pend-${w}.png`});
ok(r.pfo&&/professor da 2/.test(r.pft),'o comentário do professor continua aberto nas seguintes');
await x.act('qfix');await W(150);await x.act('qfixset','E');await W(300);
const qa2=await ev(c=>{const o=qLoad(c);return {a:((S.qa||{})[c]||{})[o.qs[1].id]||null,res:ui.qz.res[o.qs[1].id]}},cad);
r=await scr();ok(qa2.a&&qa2.a.length===1&&qa2.a[0].ok===true&&/Você acertou/.test(r.fb),'informado o gabarito (Errado): a resposta é corrigida e passa a contar '+JSON.stringify(qa2));
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
/* 1.2.2: ME com comentário do professor fica na ordem original; ME sem ele continua embaralhando, com a frase da errada na alternativa certa */
const ordem=en=>ev(([c,en])=>{const o=qLoad(c),i=o.qs.findIndex(q=>q.en===en);ui.qz={cad:c,ids:o.qs.map(q=>q.id),i,res:{},fix:false};render();return [...document.querySelectorAll('.qzd .qzo .qzotx')].map(e=>e.textContent).join(',')},[cad,en]);
const O6=new Set(),O7=new Set();for(let k=0;k<15;k++){O6.add(await ordem('Questão do site com comentário do professor.'));O7.add(await ordem('Questão gerada, sem comentário do professor.'))}
ok(O6.size===1&&[...O6][0]==='alfa,beta,gama,delta','com comentário do professor: 15 vezes, sempre na ordem do JSON '+JSON.stringify([...O6]));
ok(O7.size>1,'sem comentário do professor: a ordem muda entre as vezes ('+O7.size+' ordens em 15)');
await ev(()=>{const o=qLoad(ui.qz.cad),q=o.qs[ui.qz.i];qAns(qGab(q))});await W(250);
const ae=await ev(()=>[...document.querySelectorAll('.qzd .qzo')].map(b=>({t:b.querySelector('.qzotx').textContent,e:(b.querySelector('.qzoe')||{}).textContent||''})));
ok(ae.filter(x=>x.e).length===3&&ae.every(x=>!x.e||x.e===x.t+' não'),'sem comentário do professor: a frase de cada errada fica na própria alternativa, mesmo embaralhada '+JSON.stringify(ae));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await p.screenshot({path:`saida/qz12-${w}.png`});
await b.close();process.exit(bad?1:0);
