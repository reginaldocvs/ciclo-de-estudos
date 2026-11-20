/* Aba Questões (etapa 1): cadernos de questões por disciplina, alimentados com o JSON do guia do Gemini.
   - importar: aceita o bloco com avisos e cerca de código, junta dois arrays colados, aponta JSON quebrado (questão e linha),
     deixa de fora as questões com problema e as repetidas, liga à sessão (opcional);
   - o conteúdo fica fora de S (navegador: ciclo-q-ID; conta: documentos q-ID); S guarda só a lista e as respostas;
   - resolver CE e ME (mouse e teclado), comentário com negrito, resultado, só as erradas, corrigir gabarito;
   - renomear, excluir com Desfazer, backup com os cadernos, cada plano com os seus; barra de baixo com 5 itens cabe em 320px.
   Uso: node lint/questoes.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';import path from 'path';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.qc;delete S0.qa;
const QJ=fs.readFileSync(new URL('../dados/questoes-exemplo.json',import.meta.url),'utf8'),QA=JSON.parse(QJ);
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const toTab=t=>ev(t=>{const e=[...document.querySelectorAll(`nav [data-tab=${t}]`)].find(e=>e.getClientRects().length);e.click()},t);
const paste=t=>ev(t=>{const a=document.querySelector('[name=qj]');a.value=t;a.dispatchEvent(new Event('input',{bubbles:true}))},t);
const pv=async()=>{await W(300);return ev(()=>{const e=document.querySelector('#qzpv .qzpv');return e?{cls:e.className,t:e.textContent}:null})};
/* uma sessão de estudo registrada, para ligar o caderno a ela */
await ev(()=>{const s=actives()[0];S.sel.subj=s.id;S.sel.groups=[{id:'g1',nt:'Direitos fundamentais',rows:[{id:'r1',kind:'aula',name:'Aula 1',link:''}]}];addSession(30);save();render()});await W(200);
/* 1. aba no menu */
await toTab('qz');await W(300);
ok(await ev(()=>document.getElementById('mtt').textContent==='Questões'&&!!document.querySelector('.qzintro [data-act=qnew]')),'aba Questões: título e convite para o primeiro caderno');
/* 2. importar: erros e prévia */
await ev(()=>document.querySelector('.qzintro [data-act=qnew]').click());await W(300);
/* a disciplina com mais sessões de estudo (para ligar à sessão) */
const QS=await ev(()=>qSubs().map(s=>[s.id,rqSesAll(s.id).length]).sort((a,b)=>b[1]-a[1])[0][0]);await ev(id=>{const s=document.querySelector('[name=qs]');s.value=id;s.dispatchEvent(new Event('change',{bubbles:true}))},QS);await W(300);
const sub=await ev(id=>({sel:document.querySelector('[name=qs]').value,want:id,ses:document.querySelectorAll('[name=qse] option').length}),QS);
ok(sub.sel===sub.want&&sub.ses>=2,'janela Novo caderno: disciplina e sessões para ligar '+JSON.stringify(sub));
await paste('[{"numero": 1, "tipo": "CE", "enunciado": "Um item", "gabarito": "C"},\n{"numero": 2, "tipo": "CE", "enunciado": "Outro "item"", "gabarito": "E"}]');
let r=await pv();ok(r&&/no/.test(r.cls)&&/quebrado perto da questão 2/.test(r.t),'JSON quebrado: avisa perto de qual questão '+JSON.stringify(r));
ok(await ev(()=>{document.querySelector('[data-f=qimp]').requestSubmit();return !!document.querySelector('[data-f=qimp]')&&!qcL().length}),'com JSON quebrado não salva nada pela metade');
const bad2=JSON.stringify([{numero:9,tipo:'ME',enunciado:'Sem gabarito válido',alternativas:{A:'a',B:'b'},gabarito:'D'},{numero:10,tipo:'CE',enunciado:'Gabarito estranho',gabarito:'X'}]);
await paste('Aviso: faltaram 2 questões.\n```json\n'+QJ+'\n```\n'+bad2+'\nFaltaram X questões. Envie: Mais X');
r=await pv();ok(r&&/wa/.test(r.cls)&&/^3 questões lidas · 2 Certo\/Errado e 1 múltipla escolha/.test(r.t)&&/2 com problema/.test(r.t)&&/questão 9: o gabarito D não está nas alternativas/.test(r.t),'avisos e cerca ignorados, dois arrays juntos, 2 com problema ficam de fora '+JSON.stringify(r));
await p.screenshot({path:'saida/questoes-importar-'+w+'.png'});
const sesK=await ev(()=>{const o=document.querySelectorAll('[name=qse] option')[1];return o?o.value:''});
await ev(k=>{const s=document.querySelector('[name=qse]');s.value=k;s.dispatchEvent(new Event('change',{bubbles:true}))},sesK);await W(300);
ok(await ev(()=>/^Sessão \d+ · /.test(document.querySelector('[name=qn]').placeholder)&&/^3 questões lidas/.test(document.querySelector('#qzpv').textContent)),'ligar à sessão: o nome sugerido vem da sessão e o texto colado continua lá');
await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(400);
const cid=await ev(()=>qcL()[0]&&qcL()[0].id);
r=await ev(id=>{const m=qcM(id);return {n:m.n,ce:m.ce,me:m.me,ses:!!m.ses,open:ui.qcad===id,ls:!!localStorage.getItem('ciclo-q-'+id),inS:JSON.stringify(S).includes('exemplificativo'),pend:qPend().includes(id)}},cid);
ok(r.n===3&&r.ce===2&&r.me===1&&r.ses&&r.open&&r.ls&&!r.inS,'caderno salvo: 3 questões, ligado à sessão, conteúdo guardado fora dos dados do app '+JSON.stringify(r));
ok(await ev(()=>/Sessão \d+/.test(document.querySelector('.qzcad').textContent)&&document.querySelectorAll('.qzcad .qzq').length===3&&!document.querySelector('[data-act=qwrong]')),'tela do caderno: 3 questões, ligação com a sessão, sem "Só as erradas" ainda');
/* 3. acrescentar: repetidas ficam de fora */
await x.act('qmore',cid);await paste(QJ);r=await pv();ok(r&&/0 questões lidas/.test(r.t)&&/3 repetidas/.test(r.t),'acrescentar o mesmo bloco: 3 repetidas, nada novo '+JSON.stringify(r));
const one=JSON.stringify([{...QA[1],numero:4,enunciado:'Uma afirmação nova, só para acrescentar ao caderno.',gabarito:'C'}]);await paste(one);await pv();await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(400);
ok(await ev(id=>qcM(id).n===4&&qLoad(id).qs.length===4,cid),'acrescentar uma nova: o caderno passa a 4');
/* 4. resolver */
await x.act('qall',cid);await W(300);
r=await ev(()=>({n:document.querySelector('.qzt .mut').textContent,tag:document.querySelector('.qzt .tag').textContent,ce:document.querySelectorAll('.qzce .qzo').length}));ok(r.n==='1 de 4'&&r.tag==='Rol dos direitos'&&r.ce===2,'resolver: "1 de 4", tópico e Certo/Errado '+JSON.stringify(r));
await x.act('qans','C');r=await ev(()=>({fb:document.querySelector('.qzfb').innerHTML,c:document.querySelector('.qzo[data-id=C]').className,e:document.querySelector('.qzo[data-id=E]').className}));
ok(/Gabarito: Errado/.test(r.fb)&&/Onde está o erro/.test(r.fb)&&/<b>exemplificativo<\/b>/.test(r.fb)&&/ no/.test(r.c)&&/ ok/.test(r.e),'errou: gabarito, "Onde está o erro" e "O correto é" com negrito; a escolhida em vermelho, a certa em verde');
await p.screenshot({path:'saida/questoes-resolver-'+w+'.png'});
await x.act('qans','E');ok(await ev(()=>qaOf(ui.qz.cad,ui.qz.ids[0]).length===1),'depois de responder, não troca a resposta');
await p.keyboard.press('Enter');await W(200);await p.keyboard.press('c');await W(200);ok(await ev(()=>ui.qz.i===1&&/Você acertou/.test(document.querySelector('.qzfb').textContent)),'teclado: Enter vai à próxima; C responde Certo (acertou)');
await p.keyboard.press('Enter');await W(200);r=await ev(()=>({me:document.querySelectorAll('.qzme .qzo').length,tb:!!document.querySelector('.qztb')}));ok(r.me===5&&r.tb,'múltipla escolha: 5 alternativas e o texto-base');
await x.act('qans','A');r=await ev(()=>document.querySelector('.qzfb').textContent);ok(/Gabarito: B/.test(r)&&/Por que está certa/.test(r)&&/Não dependem sempre de lei/.test(r)&&!/^B /.test(r),'ME errada: gabarito B, por que está certa e o erro de cada alternativa');
await x.act('qnext');await x.act('qans','C');await x.act('qnext');
r=await ev(()=>({t:document.querySelector('.qzres').textContent,w:document.querySelectorAll('.qzwi').length,retry:!!document.querySelector('[data-act=qretry]')}));ok(/^2 de 4/.test(r.t)&&/50% de acerto/.test(r.t)&&r.w===2&&r.retry,'resultado: 2 de 4 (50%), as 2 erradas listadas, Refazer as erradas '+JSON.stringify(r));
await x.act('qretry');ok(await ev(()=>ui.qz.ids.length===2&&ui.qz.i===0&&!ui.qz.done),'Refazer as erradas: só as 2');
/* corrigir gabarito */
await x.act('qans','C');await x.act('qfix');await x.act('qfixset','C');
r=await ev(id=>{const q=qLoad(id).qs[0];return {gf:q.gf,ok:ui.qz.res[q.id].ok,last:qLast(id,q.id).ok,pend:qPend().includes(id),txt:document.querySelector('.qzfb').textContent}},cid);
ok(r.gf==='C'&&r.ok&&r.last&&/gabarito corrigido por você/.test(r.txt),'Gabarito parece errado → Certo: a resposta passa a contar como certa '+JSON.stringify(r));
await p.keyboard.press('Escape');await W(200);ok(await ev(()=>!ui.qz&&!!document.querySelector('.qzcad')),'Esc sai do resolver e volta ao caderno');
r=await ev(()=>({w:(document.querySelector('[data-act=qwrong]')||{}).textContent||'',ok:document.querySelectorAll('.qzcad .qzst.ok').length,no:document.querySelectorAll('.qzcad .qzst.no').length}));ok(r.w==='Só as erradas (1)'&&r.ok===3&&r.no===1,'caderno: ✓ e ✗ da última vez e "Só as erradas (1)" '+JSON.stringify(r));
/* 4b. navegação: Pular (antes de responder), Voltar, setas, bandeira só depois de responder, sem resposta no resultado */
await x.act('qall',cid);await W(200);
r=await ev(()=>({nx:document.querySelector('.qzd [data-act=qnext]').textContent,pv:!!document.querySelector('.qzd [data-act=qprev]'),fl:!!document.querySelector('.qzd .qzflag')}));ok(r.nx==='Pular'&&!r.pv&&!r.fl,'1ª questão sem responder: "Pular", sem "Voltar" e sem a bandeira (não entrega o gabarito) '+JSON.stringify(r));
await p.keyboard.press('ArrowRight');await W(200);ok(await ev(()=>ui.qz.i===1&&!!document.querySelector('.qzd [data-act=qprev]')),'→ pula para a 2ª; aparece "Voltar"');
await p.keyboard.press('c');await W(200);ok(await ev(()=>!!document.querySelector('.qzd .qzflag')&&document.querySelector('.qzd [data-act=qnext]').textContent==='Próxima'),'depois de responder: bandeira no alto e "Próxima"');
await p.screenshot({path:'saida/questoes-navegar-'+w+'.png'});
await p.keyboard.press('ArrowLeft');await W(200);ok(await ev(()=>ui.qz.i===0&&!document.querySelector('.qzd .qzfb')),'← volta para a 1ª, que continua sem resposta');
await p.keyboard.press('ArrowRight');await W(200);ok(await ev(()=>ui.qz.i===1&&/acertou|Gabarito/.test(document.querySelector('.qzd .qzfb').textContent)),'→ de novo: a 2ª aparece como você deixou, com a resposta');
for(let i=0;i<3;i++){await ev(()=>document.querySelector('.qzd [data-act=qnext]').click());await W(150)}
r=await ev(()=>({t:document.querySelector('.qzres').textContent,rest:(document.querySelector('[data-act=qrest]')||{}).textContent||''}));ok(/^1 de 1/.test(r.t)&&/3 sem resposta/.test(r.t)&&r.rest==='Resolver as que faltaram (3)','resultado: só a respondida conta; "3 sem resposta" e "Resolver as que faltaram (3)" '+JSON.stringify(r));
await x.act('qrest');ok(await ev(()=>ui.qz.ids.length===3&&ui.qz.i===0&&!ui.qz.done),'"Resolver as que faltaram": só as 3');
await x.act('qzx');
/* 5. lista por disciplina */
await x.act('qback');r=await ev(()=>{const c=document.querySelector('.qzs');return {tag:c.querySelector('.qzh .tag').textContent,row:c.querySelector('.qzr .tag').textContent,sm:c.querySelector('.qzsm').textContent}});ok(r.tag==='75%'&&r.row==='3/4 certas'&&/1 caderno · 4 questões/.test(r.sm),'lista: 75% na disciplina, "3/4 certas" no caderno '+JSON.stringify(r));
await p.screenshot({path:'saida/questoes-lista-'+w+'.png'});
/* 6. renomear, excluir e Desfazer */
r=await ev(id=>{const row=document.querySelector(`[data-act=qopen][data-id="${id}"]`).closest('.qzr'),n=row.querySelector('.qzrb>.snt').getBoundingClientRect(),e=row.querySelector('[data-act=qed]').getBoundingClientRect(),d=row.querySelector('[data-act=qdel]').getBoundingClientRect(),c=y=>(y.top+y.bottom)/2;return {tag:row.querySelector('.qzrm .tag').textContent,alin:Math.abs(c(n)-c(e))<3&&Math.abs(c(n)-c(d))<3,dentro:!document.querySelector('.qzcad')}},cid);
ok(r.tag==='3/4 certas'&&r.alin&&r.dentro,'lista: placar ao lado do número de questões; lápis e lixeira alinhados com o nome '+JSON.stringify(r));
await x.act('qed',cid);r=await ev(()=>{const d=document.querySelector('.qimpdlg[aria-label="Editar caderno"]');return d&&{nome:!!d.querySelector('[name=qen]'),ses:!!d.querySelector('[name=qes]'),z:!!d.querySelector('[data-act=qzero]'),t:d.querySelector('.qzedz').textContent}});ok(r&&r.nome&&r.ses&&r.z&&/4 de 4 respondidas · 3 certas/.test(r.t),'Editar: nome, sessão e Zerar respostas '+JSON.stringify(r));
await p.screenshot({path:'saida/questoes-editar-'+w+'.png'});
await x.act('qzero',cid);r=await ev(id=>({a:qSum(id).a,open:!!ui.qed,t:document.querySelector('.qzedz').textContent,u:!!document.querySelector('#undo .undob')}),cid);ok(r.a===0&&r.open&&/Nenhuma resposta/.test(r.t)&&r.u,'Zerar respostas: 0 respondidas, o painel fica aberto, com Desfazer '+JSON.stringify(r));
await ev(()=>document.querySelector('#undo .undob').click());await W(200);ok(await ev(id=>qSum(id).a===4,cid),'Desfazer devolve as respostas');
await ev(()=>{if(!ui.qed)document.querySelector('[data-act=qed]').click()});await W(150);await ev(()=>{const i=document.querySelector('[data-f=qed] [name=qen]');i.value='Caderno renomeado';i.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-f=qed]').requestSubmit()});await W(200);
ok(await ev(id=>qcM(id).nome==='Caderno renomeado',cid),'renomear');
await x.act('qdel',cid);ok(await ev(id=>!qcM(id)&&!!localStorage.getItem('ciclo-q-'+id),cid),'excluir: sai da lista (o conteúdo fica guardado para o Desfazer)');
await ev(()=>{const u=[...document.querySelectorAll('#undo button')].find(b=>/Desfazer/.test(b.textContent));u&&u.click()});await W(300);ok(await ev(id=>!!qcM(id)&&qSum(id).n===4,cid),'Desfazer: o caderno volta inteiro');
/* 7. backup com os cadernos */
const bk=await ev(()=>new Promise(res=>{const U=URL.createObjectURL;URL.createObjectURL=bl=>{bl.text().then(res);URL.createObjectURL=U;return U(bl)};const A=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){HTMLAnchorElement.prototype.click=A};bkOut()}));
const BJ=JSON.parse(bk);ok(BJ.qbank&&BJ.qbank[cid]&&BJ.qbank[cid].qs.length===4,'backup: leva o conteúdo dos cadernos');
const bpath=path.resolve('saida/questoes-backup.json');fs.writeFileSync(bpath,bk);
await ev(id=>{localStorage.removeItem('ciclo-q-'+id);delete QC[id];S.qc=[];save();render()},cid);
const [fc]=await Promise.all([p.waitForFileChooser(),ev(()=>bkIn())]);await fc.accept([bpath]);await W(800);
ok(await ev(id=>!!qcM(id)&&qLoad(id)&&qLoad(id).qs.length===4&&!!localStorage.getItem('ciclo-q-'+id),cid),'restaurar o backup: lista e conteúdo voltam');
/* 8. cada plano com os seus cadernos */
const pl=await ev(()=>{const id=uid();S.plans.push({id,name:'Plano Q'});save();switchPlan(id);render();return id});await W(300);
ok(await ev(()=>!qcL().length),'outro plano: sem os cadernos do primeiro');
await ev(()=>{switchPlan(S.plans[0].id);render()});await W(300);ok(await ev(id=>!!qcM(id),cid),'de volta ao primeiro plano: o caderno está lá');
/* 9. barra de baixo com 5 itens em 320px */
await p.setViewport({width:320,height:700});await W(400);
r=await ev(()=>{const B=[...document.querySelectorAll('.tabbar button')];return {n:B.length,cut:B.filter(b=>{const s=b.querySelector('span');return s.scrollWidth>s.clientWidth+1}).map(b=>b.textContent),sw:document.documentElement.scrollWidth}});
ok(r.n===5&&!r.cut.length&&r.sw<=320,'barra de baixo: 5 itens cabem em 320px sem cortar nome '+JSON.stringify(r));
await p.screenshot({path:'saida/questoes-barra-320.png',clip:{x:0,y:600,width:320,height:100}});
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
