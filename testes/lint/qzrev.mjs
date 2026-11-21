/* Questões (etapa 2): caderno ligado à sessão, dividido pelas revisões por questões.
   - 45 questões em 3 tópicos (15 cada, na ordem do Gemini) → 3 partes de 15: intercalada (cada parte com 5 de cada tópico) ou na ordem;
   - na janela "Revise com questões", a sessão com caderno tem "Resolver (15)": resolve por cima e o resultado volta para a janela;
   - Registrar: o resultado vira o acerto da sessão (registro "rev. questões") e a parte fica feita (não se redivide mais);
   - na revisão seguinte, as erradas de antes voltam junto (opção); questões novas vão para as partes que faltam.
   Uso: node lint/qzrev.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.qc;delete S0.qa;delete S0.rq;
S0.subjects.push({id:'qx',name:'Teste Q',goal:60,topics:[{id:'t1',name:'Tópico Um',done:false,links:[]}]});
const T=['Classes de palavras','Concordância','Regência'];const QJ=JSON.stringify(T.flatMap((tp,ti)=>[...Array(15)].map((_,j)=>({numero:ti*15+j+1,disciplina:'Teste Q',topico:tp,tipo:'CE',texto_base:null,comando:'Julgue o item.',enunciado:`${tp}: afirmação ${j+1}.`,alternativas:null,gabarito:j%2?'E':'C',comentario:{por_que_certa:'Explicação.',onde_esta_o_erro:null,o_correto_e:null,alternativas_erradas:null}}))));
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const study=n=>ev(n=>{S.sel.subj='qx';S.sel.groups=[{id:'g'+n,nt:'Tópico Um',rows:[{id:'r'+n,kind:'aula',name:'Aula '+n,link:''}]}];addSession(30);save();render()},n);
/* revisão por questões ligada; sessão 1 registrada; caderno de 45 ligado a ela */
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};if(S.srv)S.srv.on=false;save()});await study(1);await W(150);
const cid=await ev(j=>{const k=rqSesAll('qx')[0].k,id=uid(),P=qParse(j);qcL().push({id,subj:'qx',ses:k,nome:'Caderno da sessão 1',n:0,ce:0,me:0,d:today()});qSave(id,{qs:P.qs});save();return id},QJ);
const parts=()=>ev(id=>{const o=qLoad(id),tp=q=>o.qs.find(x=>x.id===q).tp;return qPartsOf(id).map(L=>({n:L.length,t:[...new Set(L.map(tp))].length,first:tp(L[0])}))},cid);
let r=await parts();ok(r.length===3&&r.every(z=>z.n===15&&z.t===3),'intercalada (padrão): 3 partes de 15, cada uma com os 3 tópicos '+JSON.stringify(r));
await ev(id=>{qcM(id).dist='ord'},cid);r=await parts();ok(r.every(z=>z.n===15&&z.t===1)&&r.map(z=>z.first).join()===T.join(),'na ordem do caderno: parte 1 = 1–15 (um tópico), parte 2 = 16–30… '+JSON.stringify(r));
await ev(id=>{delete qcM(id).dist},cid);
/* sessão 2: a 1ª revisão da sessão 1 chega; a janela tem o caderno */
await study(2);await W(150);await ev(()=>{const b=document.querySelector('#undo [data-act=rqreg]');b&&b.click()});await W(300);
r=await ev(()=>{const c=document.querySelector('[data-f=rqreg] .rqcad');return c?c.textContent:null});ok(r&&/Caderno · 15 questões/.test(r)&&/Resolver \(15\)/.test(r),'janela da revisão: "Caderno · 15 questões" e "Resolver (15)" '+JSON.stringify(r));
await p.screenshot({path:'saida/qzrev-janela-'+w+'.png'});
await ev(()=>document.querySelector('[data-f=rqreg] [data-act=rqcadgo]').click());await W(300);
r=await ev(()=>({rq:!!ui.qz.rq,n:ui.qz.ids.length,top:document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('.qzd')!==null}));ok(r.rq&&r.n===15&&r.top,'Resolver: abre a parte 1 (15) por cima da janela '+JSON.stringify(r));
for(let i=0;i<15;i++){await ev(i=>{const o=qLoad(ui.qz.cad),q=o.qs.find(x=>x.id===ui.qz.ids[ui.qz.i]),g=qGab(q),k=i<3?(g==='C'?'E':'C'):g;qAns(k)},i);await ev(()=>document.querySelector('.qzd [data-act=qnext]').click())}
r=await ev(()=>({res:document.querySelector('.qzres').textContent,btn:[...document.querySelectorAll('.qzd .btn')].map(b=>b.textContent).join('|')}));ok(/^12 de 15/.test(r.res)&&/Voltar à revisão/.test(r.btn),'fim: 12 de 15 e "Voltar à revisão" '+JSON.stringify(r));
await ev(()=>{[...document.querySelectorAll('.qzd .btn')].find(b=>/Voltar à revisão/.test(b.textContent)).click()});await W(300);
r=await ev(()=>({ok:!ui.qz,c:(document.querySelector('[data-f=rqreg] .rqcad')||{}).textContent||''}));r.f=await ev(()=>{const f=document.querySelector('[data-f=rqreg]');return f.querySelector('[name="qa-0-0"]').value+'/'+f.querySelector('[name="qt-0-0"]').value});ok(r.ok&&/resolvido/.test(r.c)&&/Refazer/.test(r.c)&&r.f==='12/15','de volta à janela: caderno resolvido e os acertos do tópico preenchidos (12 de 15) '+JSON.stringify(r));
await p.screenshot({path:'saida/qzrev-resultado-'+w+'.png'});
await ev(()=>document.querySelector('[data-f=rqreg]').requestSubmit());await W(300);
r=await ev(id=>{const R=S.sessions.filter(x=>x.qcad===id);return {n:R.length,ac:R[0]&&R[0].ac,tq:R[0]&&R[0].tq,k:R[0]&&kindOf(R[0]),pd:(qcM(id).pd||{})[0]?.length,due:rqDue('qx').length}},cid);
ok(r.n===1&&r.ac===12&&r.tq===15&&r.k==='q'&&r.pd===15&&r.due===0,'Registrar: "rev. questões" com 12/15 e a parte 1 fica feita '+JSON.stringify(r));
/* tela do caderno: as revisões */
await ev(id=>{document.querySelector('nav [data-tab=qz]')&&[...document.querySelectorAll('nav [data-tab=qz]')].find(e=>e.getClientRects().length).click();ui.qcad=id;render()},cid);await W(300);
r=await ev(()=>[...document.querySelectorAll('.qzrr')].map(e=>e.querySelector('.qzrrn').textContent+'|'+e.querySelector('.rqk').textContent+'|'+!!e.querySelector('[data-act=qpart]')));ok(r.length===3&&r[0]==='1ª revisão15 questões|12/15 ✓|true'&&r[1]==='2ª revisão15 questões|sessão 5|true'&&r[2]==='3ª revisão15 questões|sessão 9|true','caderno: 1ª feita 12/15 ✓, 2ª e 3ª nas sessões 5 e 9, treino no ícone '+JSON.stringify(r));
ok(await ev(()=>!document.querySelector('[data-act=qvolta]')&&/45 questões divididas em 3 partes, intercalada por tópico; as erradas voltam/.test(document.querySelector('.qzrvh').textContent)),'os ajustes ficam atrás da engrenagem; a frase resume a divisão');
await x.act('qdv',cid);ok(await ev(()=>!!document.querySelector('.qzdvp [data-act=qvolta]')&&!!document.querySelector('.qzdvp [data-act=qdist]')),'engrenagem: mostra Dividir e As erradas voltam');
await p.screenshot({path:'saida/qzrev-caderno-'+w+'.png',fullPage:true});
/* erradas voltam; partes feitas não mudam */
r=await ev(id=>qPartIds(id,1),cid);ok(r.back===3&&r.ids.length===18,'2ª revisão: 15 da parte + 3 erradas de antes');
await x.act('qvolta',cid);ok(await ev(id=>qPartIds(id,1).ids.length===15,cid),'"As erradas voltam" desligado: só as 15');await x.act('qvolta',cid);
const p0=await ev(id=>qPartsOf(id)[0].join(),cid);await x.act('qdist',cid+':ord');ok(await ev(([id,p0])=>qPartsOf(id)[0].join()===p0&&qcM(id).dist==='ord',[cid,p0]),'mudar para "na ordem": a parte já feita fica igual');await x.act('qdist',cid+':tp');
await ev(id=>{const o=qLoad(id),P=qParse(JSON.stringify([1,2,3].map(i=>({numero:45+i,topico:'Crase',tipo:'CE',enunciado:'Nova '+i,gabarito:'C'}))));o.qs=o.qs.concat(P.qs);qSave(id,o);save();render()},cid);
r=await ev(id=>qPartsOf(id).map(L=>L.length),cid);ok(r.join()==='15,17,16','3 questões novas vão para as partes que faltam (15, 17, 16) '+JSON.stringify(r));
/* treinar uma parte pelo caderno não registra */
await x.act('qpart',cid+':1');ok(await ev(()=>ui.qz&&!ui.qz.rq&&ui.qz.ids.length===17),'Resolver uma parte pelo caderno: treino, sem ligar à revisão');await p.keyboard.press('Escape');await W(200);
ok(await ev(id=>Object.keys(qcM(id).pd).join()==='0',cid),'treinar não marca a parte como feita');
/* zerar as respostas: a etiqueta da parte feita fica com o acerto do registro; na lista, "N/M certas" vira "novo"; Desfazer volta */
await ev(()=>{ui.qcad=null;render()});r=await ev(()=>document.querySelector('.qzrb .tag').textContent);ok(/^\d+\/\d+ certas$/.test(r),'lista: etiqueta "N/M certas" '+JSON.stringify(r));
await ev(id=>{ui.qcad=id;render()},cid);await x.act('qed',cid);await x.act('qzero',cid);
r=await ev(id=>({a:qSum(id).a,c:document.querySelector('.qzrr .rqk').textContent,u:!!document.querySelector('#undo .undob')}),cid);ok(r.a===0&&r.c==='12/15 ✓'&&r.u,'Zerar respostas: 0 respondidas, a 1ª revisão continua 12/15 ✓, com Desfazer '+JSON.stringify(r));
await ev(()=>document.querySelector('#undo .undob').click());await W(200);ok(await ev(id=>qSum(id).a>0,cid),'Desfazer devolve as respostas');await x.act('qedx');
/* Editar: com uma revisão feita com o caderno, a sessão fica fixa (sem seletor) e salvar não a muda */
await study(3);await W(150);await ev(id=>{ui.qcad=id;render()},cid);await x.act('qed',cid);
r=await ev(()=>{const d=document.querySelector('[data-f=qed]');return {sel:!!d.querySelector('.sfb[data-id=qzes]'),t:d.textContent}});ok(!r.sel&&/Ligado à Sessão 1/.test(r.t)&&/1ª revisão já foi feita com este caderno, por isso a sessão não muda/.test(r.t),'parte feita: sessão fixa, com a explicação '+JSON.stringify(r.t.slice(0,160)));
await p.screenshot({path:'saida/qzrev-editar-'+w+'.png'});
await ev(()=>document.querySelector('[data-f=qed]').requestSubmit());await W(200);ok(await ev(id=>!!qcM(id).ses&&!!(qcM(id).pd||{})[0],cid),'Salvar com a trava: continua ligado, com a parte feita');
/* caderno sem revisão feita: troca e desliga livremente; sessão com caderno aparece indisponível */
const c2=await ev(()=>{const k=rqSesAll('qx')[2].k,id=uid(),P=qParse(JSON.stringify([{numero:1,tipo:'CE',enunciado:'Uma',gabarito:'C'}]));qcL().push({id,subj:'qx',ses:k,nome:'Caderno 2',n:0,ce:0,me:0,d:today()});qSave(id,{qs:P.qs});save();ui.qcad=id;render();return id});
await x.act('qed',c2);r=(await x.opts('qzes')).map(t=>t.slice(0,9)+(t.endsWith('!')?'!':'')).join('|');ok(/Sessão 1.*!/.test(r)&&/Sessão 2 [^!|]*\|/.test(r+'|'),'seletor: a Sessão 1 (com caderno) indisponível '+JSON.stringify(r));
const k2=await ev(()=>rqSesAll('qx')[1].k);await x.pick('qzes',k2);
await ev(()=>document.querySelector('[data-f=qed]').requestSubmit());await W(200);ok(await ev(([id,k])=>qcM(id).ses===k&&!!document.querySelector('#undo .undob'),[c2,k2]),'sem revisão feita: troca de sessão, com Desfazer');
await x.act('qed',c2);await x.pick('qzes','');await ev(()=>document.querySelector('[data-f=qed]').requestSubmit());await W(200);
ok(await ev(id=>!qcM(id).ses&&!document.querySelector('.qzrv'),c2),'desligar: sem sessão e sem Revisões no caderno');
await ev(id=>{ui.qcad=id;render()},cid);
/* apagar no Histórico o registro da revisão com o caderno: a parte volta a pendente */
r=await ev(id=>{const R=S.sessions.find(x=>x.qcad===id);return R&&R.qpart},cid);ok(r===0,'o registro guarda a parte (qpart 0)');
await ev(id=>{const R=S.sessions.find(x=>x.qcad===id);window.confirm=()=>true;ui.edBack=null;const d=document.createElement('button');d.dataset.act='delreg';d.dataset.id=R.ses||R.id;document.body.appendChild(d);d.click();d.remove()},cid);await W(300);
r=await ev(id=>({regs:S.sessions.filter(x=>x.qcad===id).length,pd:qcM(id).pd||null}),cid);ok(r.regs===0&&!r.pd,'registro apagado: a parte deixa de ser feita '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
