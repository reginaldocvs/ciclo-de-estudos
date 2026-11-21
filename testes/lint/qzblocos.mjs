/* Importar em blocos: um bloco do Gemini por vez, cada um com o tópico da sessão (sugerido pelos assuntos; "Vários tópicos" quando mistura);
   "Outro bloco" recolhe o atual numa linha (reabrir e tirar); repetidas contam entre blocos; cada questão guarda o tópico do bloco.
   Caderno sem sessão: lista agrupada pelos assuntos do Gemini, com ▶ por assunto.
   Uso: node lint/qzblocos.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.qc;delete S0.qa;delete S0.rq;
S0.subjects.push({id:'qx',name:'Teste Q',goal:60,topics:[{id:'ta',name:'Classes Gramaticais',done:false,links:[]},{id:'tb',name:'Concordância Verbal',done:false,links:[]}]});
const mkQ=(tp,n,o)=>[...Array(n)].map((_,j)=>({numero:o+j+1,topico:tp,tipo:'CE',enunciado:`${tp}: item ${o+j+1}.`,gabarito:j%2?'E':'C'}));
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const paste=j=>ev(j=>{const t=document.querySelector('[data-f=qimp] [name=qj]');t.value=j;t.dispatchEvent(new Event('input',{bubbles:true}))},j).then(()=>W(400));
const head=()=>ev(()=>{const s=document.querySelector('#qzbh .sfb');return {lb:document.querySelector('#qzbh .lb').textContent,t:s?s.textContent:null}});
const rows=()=>ev(()=>[...document.querySelectorAll('.qzbr .qzbrt')].map(e=>e.querySelector('.qzbrc').textContent.replace(/ · .*/,'')+' · '+e.querySelector('.qzbrn').textContent+' · '+e.querySelector('.qzbrc').textContent.replace(/^.* · /,'')));
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};S.sel.subj='qx';S.sel.groups=[{id:'g1',nt:'Classes Gramaticais',rows:[{id:'r1',kind:'aula',name:'Aula 1',link:''}]},{id:'g2',nt:'Concordância Verbal',rows:[{id:'r2',kind:'aula',name:'Aula 2',link:''}]}];addSession(30);ui.rqreg=null;save();tab='qz';render()});await W(200);
await x.act('qnew','qx');const k1=await ev(()=>rqSesAll('qx')[0].k);
ok(await ev(()=>!document.querySelector('[data-act=qbadd]')),'sem nada colado: não há "Outro bloco"');
await x.pick('qzse',k1);
let r=await head();ok(r.lb==='Bloco 1'&&r.t==='Tópico da sessão…','sessão de 2 tópicos: "Bloco 1" com a escolha do tópico '+JSON.stringify(r));
await paste(JSON.stringify(mkQ('Classes de palavras',10,0)));r=await head();ok(r.t==='Classes Gramaticais'&&await ev(()=>!!document.querySelector('#qzadd [data-act=qbadd]')),'colou: o bloco vira Classes Gramaticais e aparece "Outro bloco" '+JSON.stringify(r));
await x.act('qbadd');r={rows:await rows(),h:await head(),foco:await ev(()=>document.activeElement&&document.activeElement.name),vazio:await ev(()=>document.querySelector('[name=qj]').value==='')};
ok(r.rows.join()==='Bloco 1 · Classes Gramaticais · 10 questões'&&r.h.lb==='Bloco 2'&&r.foco==='qj'&&r.vazio,'Outro bloco: o 1º recolhe numa linha, o 2º abre vazio, com o cursor no campo '+JSON.stringify(r));
await paste(JSON.stringify([...mkQ('Concordância',8,10),...mkQ('Classes de palavras',2,0)]));
r=await ev(()=>document.querySelector('#qzpv').textContent);ok(/8 questões lidas/.test(r)&&/2 repetidas/.test(r),'repetidas contam as do bloco anterior '+JSON.stringify(r));
r=await head();ok(r.t==='Concordância Verbal','bloco 2: Concordância Verbal '+JSON.stringify(r));
await p.screenshot({path:'saida/qzblocos-'+w+'.png'});
/* bloco misturado: "Vários tópicos" com a escolha por assunto */
await x.act('qbadd');await paste(JSON.stringify([...mkQ('Pronomes',2,40),...mkQ('Concordância nominal',2,50)]));
r={h:await head(),m:await ev(()=>[...document.querySelectorAll('#qzmap .qzmr')].map(e=>e.querySelector('.snt').textContent+'→'+e.querySelector('.sfb').textContent))};
ok(r.h.t==='Vários tópicos'&&r.m.join('|')==='Pronomes (2)→Classes Gramaticais|Concordância nominal (2)→Concordância Verbal','assuntos de tópicos diferentes: "Vários tópicos", assunto por assunto '+JSON.stringify(r));
await p.screenshot({path:'saida/qzblocos-varios-'+w+'.png'});
await x.pick('qzbt','ta');
ok(await ev(()=>!document.querySelector('#qzmap .qzmr')),'escolher um tópico para o bloco: some a escolha por assunto');
/* reabrir e tirar */
await x.act('qbopen','0');r={h:await head(),rows:await rows(),txt:await ev(()=>document.querySelector('[name=qj]').value.length>10)};ok(r.h.lb==='Bloco 1'&&r.rows.length===2&&r.txt,'reabrir o bloco 1: volta o texto dele; os outros ficam em linha '+JSON.stringify(r.rows));
await x.act('qbdel','1');r=await rows();ok(r.length===1&&/^Bloco 2 · Classes Gramaticais · 4 questões/.test(r[0]),'tirar o bloco 2: os seguintes renumeram '+JSON.stringify(r));
await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(300);
r=await ev(()=>{const c=qcL().find(c=>c.subj==='qx'),o=qLoad(c.id),m=qcM(c.id),T=qTops(m);return {n:o.qs.length,st:[...new Set(o.qs.map(q=>q.st))].join(),top:T.map(t=>o.qs.filter(q=>qTopOf(m,q,T)===t.t).length).join()}});
ok(r.n===14&&r.st==='ta'&&r.top==='14,0','salvar: 10 + 4 questões, todas no tópico escolhido de cada bloco '+JSON.stringify(r));
/* caderno sem sessão: agrupado pelos assuntos */
await ev(()=>{ui.qcad=null;render()});await x.act('qnew','qx');await paste(JSON.stringify([...mkQ('Pronomes',3,0),...mkQ('Crase',2,3)]));
r=await head();ok(r.lb==='Bloco JSON do Gemini'&&r.t===null,'sem sessão e um bloco: o campo de sempre, sem escolha de tópico '+JSON.stringify(r));
await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(300);
r=await ev(()=>[...document.querySelectorAll('.qzgh')].map(e=>e.textContent));ok(r.join('|')==='Pronomes3|Crase2','caderno sem sessão: agrupado pelos assuntos '+JSON.stringify(r));
await ev(()=>document.querySelectorAll('.qzgh [data-act=qsubgo]')[1].click());await W(200);r=await ev(()=>ui.qz&&ui.qz.ids.length);ok(r===2,'▶ no assunto: resolve só as 2 de Crase');await p.keyboard.press('Escape');
/* assunto "Tópico - Sub-tópico": agrupa pela cabeça; dentro, cada questão mostra o sub */
await ev(()=>{ui.qcad=null;ui.qgo=null;render()});await x.act('qnew','qx');
await paste(JSON.stringify([...mkQ('Teoria dos Direitos Fundamentais - Superioridade Normativa',2,0),...mkQ('Teoria dos Direitos Fundamentais - Titularidade',1,2),...mkQ('Características dos Direitos Fundamentais - Relatividade',2,3)]));
await ev(()=>document.querySelector('[data-f=qimp]').requestSubmit());await W(300);
r=await ev(()=>[...document.querySelectorAll('.qzgh')].map(e=>e.querySelector('.snt').textContent+'|'+e.querySelector('.qzgn').textContent));
ok(r.join(',')==='Teoria dos Direitos Fundamentais|3,Características dos Direitos Fundamentais|2','agrupa pela parte antes do " - " '+JSON.stringify(r));
await ev(()=>document.querySelector('[data-act=qgtog]').click());await W(150);
r=await ev(()=>[...document.querySelectorAll('.qzg .qzq .tpcl')].map(e=>e.textContent));ok(r.join(',')==='Superioridade Normativa,Superioridade Normativa,Titularidade','dentro do grupo, cada questão mostra só o sub-tópico '+JSON.stringify(r));
await p.screenshot({path:'saida/qzblocos-cabeca-'+w+'.png',fullPage:true});
await ev(()=>document.querySelectorAll('.qzgh [data-act=qsubgo]')[0].click());await W(200);ok(await ev(()=>ui.qz&&ui.qz.ids.length===3),'▶ na cabeça: resolve as 3 do grupo');await p.keyboard.press('Escape');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
