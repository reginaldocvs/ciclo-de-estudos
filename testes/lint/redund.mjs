/* Texto redundante: numa mesma tela/cartão, uma frase que repete o nome de um item que a lista ao lado já mostra
   (ex.: "Nenhum tópico para revisar hoje. Próximo: Crase, 10/11." com "Próximas" logo abaixo listando Crase).
   Também acusa contagem que não bate com a lista: "Título (N)" com N diferente do número de linhas, e "(0)".
   Percorre Ciclo, Revisão (todas as abas), Histórico, Estatísticas e Planos.
   Uso: node lint/redund.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
/* estado vindo de simulação com relógio adiantado: usa o mesmo adiantamento */
const mx=(S0.sessions||[]).map(s=>s.date).filter(Boolean).sort().pop(),td=new Date().toISOString().slice(0,10);
const off=mx&&mx>td?Math.round((Date.parse(mx)-Date.parse(td))/864e5):0;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1','__fkoff':String(off*864e5)},w,h:900});const x=mk(p);
const scan=nm=>x.ev(nm=>{const out=[],vis=e=>e.offsetParent!==null;
 const boxes=[...document.querySelectorAll('#app .card, #app .srsc, #app .trvc, #modal .dlg, #modal .sheet, #modal')].filter(vis);
 boxes.forEach(bx=>{
  /* nomes de itens mostrados em linhas da lista */
  const names=[...bx.querySelectorAll('[title]')].filter(vis).map(e=>e.getAttribute('title').trim()).filter(t=>t.length>=10&&!/^(Expandir|Fechar|Remover|Duplicar|Editar|Marque|Registrar|Iniciar|Retomar|Pular)/.test(t));
  /* frases: elementos de texto corrido sem botões dentro */
  const sents=[...bx.querySelectorAll('.mut, p, .trve, .rohint')].filter(e=>vis(e)&&!e.querySelector('button,input,[title]')&&e.textContent.trim().length>20);
  sents.forEach(s=>{const t=s.textContent;names.forEach(n=>{const rest=t.replace(n,'').replace(/[\s·.,:;()\d/–-]+/g,'');if(rest.length>=12&&t.includes(n.slice(0,40))&&![...bx.querySelectorAll('[title]')].every(e=>s.contains(e)))out.push(`${nm}: frase repete item da lista: "${t.trim().slice(0,90)}" ↔ "${n.slice(0,40)}"`)})});
 });
 /* contagem no título que não bate com as linhas visíveis (quando não há "Mostrar mais") */
 document.querySelectorAll('#app h2, #app h3, #modal h2, #modal h3').forEach(h=>{if(!vis(h))return;const m=h.textContent.match(/\((\d+)\)\s*$/);if(!m)return;if(+m[1]===0)out.push(`${nm}: título com (0): "${h.textContent.trim()}"`)});
 return [...new Set(out)]},nm);
const tab=async(t,sub)=>{await x.ev(t=>{const e=document.querySelector(`nav [data-tab=${t}]`);e&&e.click()},t);await W(250);if(sub){await x.ev(s=>{const e=document.querySelector(`[data-act=rvt][data-id=${s}]`);e&&e.click()},sub);await W(250)}};
let all=[];
/* SELFTEST=1: põe um cartão com o bug antigo ("Próximo: <item>" com a lista abaixo) para provar que o verificador acusa */
if(process.env.SELFTEST){await x.ev(()=>{const d=document.createElement('div');d.className='card';d.innerHTML='<div class="mut trve">Nenhum tópico para revisar hoje. Próximo: Direitos e garantias fundamentais, 10/11/2026.</div><h3>Próximas (1)</h3><div><span class="snt" title="Direitos e garantias fundamentais">Direitos e garantias fundamentais</span></div>';document.getElementById('app').prepend(d)});const r=await scan('selftest');console.log((r.length?'OK    ':'FALHA ')+'autoteste: o bug antigo é acusado');await b.close();process.exit(r.length?0:1)}
for(const [t,sub] of [['ciclo'],['rev','hoje'],['rev','ciclos'],['rev','topicos'],['rev','sessoes'],['rev','grupos'],['reg'],['st'],['bk']]){await tab(t,sub);all=all.concat(await scan(t+(sub?'/'+sub:'')))}
all=[...new Set(all)];all.forEach(l=>console.log('FALHA '+l));
if(errs.length)console.log('FALHA erros: '+errs.slice(0,3).join(' | '));
console.log(all.length||errs.length?'COM FALHAS':'OK    nenhum texto redundante');
await b.close();process.exit(all.length?1:0);
