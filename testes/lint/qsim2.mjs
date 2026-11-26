/* Simulado (etapa 2):
   - tempo de prova (opcional) ao montar e no lápis ("1:30", "90", "1h"); relógio "restam m:ss" no topo do resolver;
   - o relógio para quando você sai (Continuar retoma do mesmo ponto); acabou o tempo, entrega sozinho;
   - resultado e Desempenho com o tempo gasto; botão "Fazer o simulado" / "Refazer o simulado".
   Uso: node lint/qsim2.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;delete S0.qc;delete S0.qa;delete S0.qzp;delete S0.qfim;delete S0.qh;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const adv=ms=>ev(ms=>localStorage.setItem('__fkoff',String((+(localStorage.getItem('__fkoff')||0))+ms)),ms);
const P=await ev(()=>['1:30','90','1h','1h30','','abc','0','2'].map(v=>qTlParse(v)));
ok(JSON.stringify(P)===JSON.stringify([90,90,60,90,0,false,false,2]),'tempo de prova: lê "1:30", "90", "1h", "1h30"; vazio = sem limite; inválido recusa '+JSON.stringify(P));
const J=JSON.stringify([1,2,3].map(i=>({numero:i,disciplina:'X',topico:'T',tipo:'CE',enunciado:'Tempo item '+i+'.',gabarito:'C'})));
const A=await ev(j=>{const s=qSubs()[0],id=uid(),P=qPrev({txt:j});qcL().push({id,subj:s.id,nome:'Caderno T',n:3,ce:3,me:0,d:today()});qSave(id,{qs:P.qs});tab='qz';ui.qcad=null;save();render();return s.id},J);await W(300);
/* inválido não monta */
await x.act('qsim');await W(300);await x.fill(`.qsimdlg input[data-g="${A}"]`,'3');await x.fill('.qsimdlg [name=qstl]','abc');await ev(()=>document.querySelector('[data-f=qsim]').requestSubmit());await W(300);
ok(await ev(()=>!qcL().some(c=>c.sim)&&!!document.querySelector('.qsimdlg')),'tempo inválido: avisa e não monta');
await x.fill('.qsimdlg [name=qstl]','0:02');await p.screenshot({path:`saida/qsim2-janela-${w}.png`});await ev(()=>document.querySelector('[data-f=qsim]').requestSubmit());await W(400);
const sim=await ev(()=>ui.qcad);
let r=await ev(()=>({tl:qcM(ui.qcad).tl,hd:(document.querySelector('.qzcm')||{}).textContent,bt:(document.querySelector('[data-act=qall]')||{}).textContent}));
ok(r.tl===2&&/2min de prova/.test(r.hd)&&r.bt==='Fazer o simulado','montado com 2 min de prova; botão "Fazer o simulado" '+JSON.stringify(r));
await x.act('qall',sim);await W(400);
const tm=()=>ev(()=>(document.getElementById('qztm')||{}).textContent||'');
r=await tm();ok(/^(2:00|1:5\d)$/.test(r),'relógio na linha da questão: "2:00" '+JSON.stringify(r));
await p.screenshot({path:`saida/qsim2-relogio-${w}.png`});
await ev(()=>qAns('C'));await adv(60000);await W(1300);r=await tm();ok(/^(0:5\d|1:00)$/.test(r),'um minuto depois: "0:5x" '+JSON.stringify(r));
/* sair para o relógio; fora, o tempo não corre */
await x.act('qzx');await W(300);await adv(600000);await W(300);
await ev(()=>document.querySelector('.qzdr [data-act=qzcont]').click());await W(1300);r=await tm();
ok(/^(0:5\d|0:4\d|1:00)$/.test(r),'fora do simulado o tempo não corre: Continuar volta com ~1 min '+JSON.stringify(r));
/* acaba o tempo: entrega sozinho */
await adv(70000);await W(1800);
r=await ev(()=>({res:!!document.querySelector('.qzd .qzres'),tm:(document.querySelector('.qzrtm')||{}).textContent||'',toast:(document.getElementById('undo')||{}).innerText||''}));
ok(r.res&&/Tempo esgotado/.test(r.toast)&&/^Tempo: 2min de 2min$/.test(r.tm),'acabou o tempo: entregue sozinho, com aviso e "Tempo: 2min de 2min" '+JSON.stringify(r));
await p.screenshot({path:`saida/qsim2-resultado-${w}.png`});
await x.act('qzx');await W(300);
r=await ev(()=>({row:(document.querySelector('.qzhr')||{}).innerText||'',bt:(document.querySelector('[data-act=qall]')||{}).textContent}));
ok(/^Simulado/.test(r.row)&&/2min/.test(r.row.replace(/\s+/g,' '))&&r.bt==='Refazer o simulado','Desempenho: "Simulado · … · 2min"; botão "Refazer o simulado" '+JSON.stringify(r));
/* lápis: muda o tempo de prova */
await ev(()=>document.querySelector('[data-act=qed]').click());await W(300);
ok(await ev(()=>document.querySelector('[name=qetl]').value==='2'),'lápis: o tempo atual aparece');
await x.fill('[name=qetl]','1:30');await ev(()=>document.querySelector('[data-f=qed]').requestSubmit());await W(300);
r=await ev(()=>({tl:qcM(ui.qcad).tl,hd:(document.querySelector('.qzcm')||{}).textContent}));ok(r.tl===90&&/1h30 de prova/.test(r.hd),'lápis: "1:30" vira 1h30 de prova '+JSON.stringify(r));
ok(await ev(()=>document.documentElement.scrollWidth<=innerWidth),'sem rolagem para o lado');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
