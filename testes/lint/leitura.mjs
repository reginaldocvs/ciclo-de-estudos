/* Videoaula e Leitura no registro. Botões Videoaula +, Leitura + e Questões + numa linha; ícone de câmera ou livro em cada linha;
   leitura: título obrigatório, páginas de/até (opcionais, conta as páginas, avisa se a final vem antes), "p. 12–30" com a linha fechada;
   salva lt/pi/pf no item, volta ao editar, e aparece no Ver registro e no Histórico. Uso: node lint/leitura.mjs [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const w=+(process.argv[2]||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const A=await ev(()=>inCycle().map(s=>s.id));const s=A[1];
await ev(s=>{S.progress[s]=0;render()},s);await x.act('rreg',s);
let r=await ev(()=>{const B=[...document.querySelectorAll('#modal .radd .btn')];return {t:B.map(b=>b.textContent).join('|'),one:new Set(B.map(b=>Math.round(b.getBoundingClientRect().top))).size===1,h:B.every(b=>b.getBoundingClientRect().height<46)}});
ok(r.t==='Videoaula +|Leitura +|Questões +'&&r.one&&r.h,'três botões numa linha só, sem quebrar o texto '+JSON.stringify(r));
const gid=await ev(()=>S.sel.groups[0].id);
await x.act('addrow',gid);await x.act('addrowl',gid);
r=await ev(()=>{const G=[...document.querySelectorAll('#modal .rgrp')];return G.map(g=>({ic:(g.querySelector('.rkic')||{}).title,ph:g.querySelector('[data-rn]').placeholder,pg:!!g.querySelector('[data-rpi]')}))});
ok(r.length===2&&r[0].ic==='Videoaula'&&r[0].ph==='Assunto'&&!r[0].pg&&r[1].ic==='Leitura'&&/^Título/.test(r[1].ph)&&r[1].pg,'linha de videoaula com câmera; de leitura com livro, Título e Páginas (aberta) '+JSON.stringify(r));
/* leitura sem título: avisa */
await ev(()=>{const g=S.sel.groups[0];g.nt='Crase';g.rows[0].name='Aula 12';render()});
const lid=await ev(()=>S.sel.groups[0].rows[1].id);
await x.fill('#pi-'+lid,'12');await x.fill('#pf-'+lid,'30');
r=await ev(id=>document.getElementById('pn-'+id).textContent,lid);ok(r==='· 19 páginas','conta as páginas ao digitar '+JSON.stringify(r));
await ev(()=>{S.sel.mt='1h00';render()});await x.submit('#modal form[data-f=man]');await W(200);
r=await ev(()=>({msg:ui.msg,open:!!document.querySelector('#modal [data-rpi]')}));ok(/título da leitura/.test(r.msg||''),'leitura sem título: pede o título '+JSON.stringify(r));
/* página final antes da inicial */
await ev(id=>{const R=S.sel.groups[0].rows.find(x=>x.id===id);R.name='Gramática Essencial, cap. 4';R.link='PDF da apostila';R.pi='30';R.pf='12';render()},lid);
await x.submit('#modal form[data-f=man]');await W(200);
r=await ev(()=>ui.msg);ok(/página final vem antes/.test(r||''),'página final antes da inicial: avisa '+JSON.stringify(r));
await ev(id=>{const R=S.sel.groups[0].rows.find(x=>x.id===id);R.pi='12';R.pf='30';R.open=false;S.sel.groups[0].rows[0].open=false;ui.msg='';render()},lid);
r=await ev(()=>{const g=document.querySelectorAll('#modal .rgrp')[1],a=g.querySelector('.aname'),pg=g.querySelector('.rpg');return {pg:pg&&pg.textContent,in:pg?pg.getBoundingClientRect().right<=a.getBoundingClientRect().right+1:false,h:a.getBoundingClientRect().height}});
ok(r.pg==='p. 12–30'&&r.in&&r.h<50,'fechada: "p. 12–30" dentro da linha, sem quebrar '+JSON.stringify(r));
await p.screenshot({path:'saida/leitura-form-'+w+'.png'});
await x.submit('#modal form[data-f=man]');await W(300);
const its=await ev(s=>{const L=S.sessions.filter(x=>pkey(x)===s&&!x.review);const ses=L[L.length-1].ses;return L.filter(x=>x.ses===ses).flatMap(x=>x.items)},s);
ok(its.length===2&&!its[0].lt&&its[1].lt===1&&its[1].pi===12&&its[1].pf===30&&its[1].name==='Gramática Essencial, cap. 4','salvou a leitura com as páginas '+JSON.stringify(its));
/* Ver registro */
await ev(s=>{tab='ciclo';ui.rview=s;render()},s);await W(300);
r=await ev(()=>{const D=document.querySelector('.dlg.reg');const e=[...D.querySelectorAll('.lpg')];return e.map(z=>({t:z.textContent,n:z.previousElementSibling.textContent,h:z.closest('.lrow').getBoundingClientRect().height}))});
ok(r.length===1&&r[0].t==='p. 12–30'&&/Gramática/.test(r[0].n)&&r[0].h<34,'Ver registro: páginas ao lado do título, numa linha '+JSON.stringify(r));
await p.screenshot({path:'saida/leitura-ver-'+w+'.png'});
/* editar: volta como leitura */
await ev(()=>document.querySelector('.dlg.reg [data-act=edit]').click());await W(300);
r=await ev(()=>{const R=(S.sel.groups||[]).flatMap(g=>g.rows);return R.map(z=>({lt:!!z.lt,pi:z.pi,pf:z.pf}))});
ok(r.some(z=>z.lt&&z.pi==='12'&&z.pf==='30')&&r.some(z=>!z.lt),'editar o registro: a leitura volta com as páginas '+JSON.stringify(r));
await ev(()=>{S.edit=null;S.sel.groups=null;render()});
/* Histórico */
await ev(()=>{tab='reg';render()});await W(300);
r=await ev(()=>[...document.querySelectorAll('#hres .lpg')].map(e=>e.textContent));ok(r.includes('p. 12–30'),'Histórico: mostra as páginas '+JSON.stringify(r));
/* textos */
r=await ev(()=>[pgTxt({pi:12}),pgTxt({pf:30}),pgTxt({pi:5,pf:5}),pgTxt({})]);ok(r.join('|')==='a partir da p. 12|até a p. 30|p. 5|','só a inicial, só a final, uma página, nenhuma '+JSON.stringify(r));
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
