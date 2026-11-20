/* "Sobre" (ⓘ): Revisão por sessões, Revisão por questões e a aba Questões têm o seu; "Como funciona a revisão" fala dos tipos ligados.
   Uso: node lint/sobre.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;delete S0.rq;delete S0.srv;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const go=t=>ev(t=>{const e=[...document.querySelectorAll(`nav [data-tab=${t}]`)].find(e=>e.getClientRects().length);e&&e.click()},t);
const info=async(k,shot)=>{await x.act('info',k);const r=await ev(()=>{const d=document.querySelector('.infodlg');return d?{t:d.querySelector('h2').textContent,h:d.textContent}:null});if(shot)await p.screenshot({path:'saida/sobre-'+shot+'-'+w+'.png'});await x.act('infox');return r};
/* aba Questões */
await go('qz');await W(200);ok(await ev(()=>!!document.querySelector('[data-act=info][data-id=qzinfo]')),'aba Questões: ⓘ no título');
let r=await info('qzinfo','questoes');ok(r&&r.t==='Questões'&&/Gemini/.test(r.h)&&/1 · 4 · 8, em 3 partes/.test(r.h)&&/mais de um tópico/.test(r.h)&&/alternativas mudam de lugar/.test(r.h)&&/Zerar respostas/.test(r.h),'Sobre Questões: importar, divisão, tópicos, resolver, editar '+JSON.stringify(r&&r.h.slice(0,80)));
/* Revisão por questões */
await ev(()=>{S.rq={on:true,iv:[1,4,8],b:{},hold:[]};save();tab='rev';ui.rvt='questoes';render()});await W(200);
ok(await ev(()=>!!document.querySelector('.rvrule [data-act=info][data-id=rq]')),'Revisão › Questões: ⓘ ao lado da regra');
r=await info('rq','rq');ok(r&&/volta para revisão 1, 4 e 8 sessões depois dela/.test(r.h)&&/a sessão 1 é revisada ao terminar as sessões 2, 5 e 9/.test(r.h)&&/3 vezes \(1ª, 2ª e 3ª\)/.test(r.h)&&/links da aula e das questões/.test(r.h)&&/Adiantar/.test(r.h),'Sobre Revisão por questões '+JSON.stringify(r&&r.h.slice(0,120)));
r=await info('rvdias');ok(r&&/por <b>|por sessões|por questões/.test(r.h)&&/Por questões: cada sessão de uma disciplina volta para revisão 1, 4 e 8 sessões depois dela/.test(r.h)&&/ao terminar as sessões 2, 5 e 9/.test(r.h)&&/Questões mostra/.test(r.h),'Como funciona a revisão: fala da revisão por questões ligada '+JSON.stringify(r&&r.h.slice(0,160)));
/* Revisão por sessões */
await ev(()=>{S.rq.on=false;S.srv={on:true,n:3,y:2,start:today()};save();tab='rev';ui.rvt='sessoes';render()});await W(200);
ok(await ev(()=>!!document.querySelector('.rvrule [data-act=info][data-id=srv]')),'Revisão › Sessões: ⓘ ao lado da regra');
r=await info('srv','srv');ok(r&&/A cada 3 sessões de uma disciplina/.test(r.h)&&/até 2 revisões/.test(r.h)&&/não ficam ligadas ao mesmo tempo/.test(r.h),'Sobre Revisão por sessões '+JSON.stringify(r&&r.h.slice(0,100)));
r=await info('rvdias');ok(r&&/Por sessões: a cada 3 sessões/.test(r.h)&&/Sessões mostra/.test(r.h)&&!/Por questões:/.test(r.h),'Como funciona a revisão: com sessões ligada, fala dela e não da por questões');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
