/* Regra: em linhas com texto de 2+ linhas, o que fica ao lado (ponto, data, ícone, botão) alinha na PRIMEIRA linha.
   Percorre as telas com nomes compridos e mede cada linha flex: centro de cada vizinho x centro da 1ª linha do texto. */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT,WD]=process.argv.slice(2);const w=+(WD||390);
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
const LONG=' — direitos e deveres individuais e coletivos, direito à vida, à liberdade e à igualdade';
S0.subjects.forEach(s=>(s.topics||[]).forEach((t,i)=>{if(i%2===0)t.name+=LONG;(t.links||[]).forEach((l,j)=>{if(j===0&&l.title)l.title+=' (parte teórica com exercícios comentados)'})}));
(S0.sessions||[]).forEach(x=>(x.items||[]).forEach((it,j)=>{if(j===0&&it.name&&!it.qo)it.name+=' (parte teórica com exercícios comentados)'}));
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);
const found=new Map();
const scan=async tela=>{await W(300);const r=await x.ev(()=>{const out=[];const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
 const firstLine=el=>{const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.textContent.trim()?1:3});const n=tw.nextNode();if(!n)return null;const rg=document.createRange();rg.selectNodeContents(n);const rs=[...rg.getClientRects()].filter(r=>r.height>0);return rs[0]||null};
 const lines=el=>{const rg=document.createRange();rg.selectNodeContents(el);const ys=new Set([...rg.getClientRects()].filter(r=>r.height>4&&r.width>1).map(r=>Math.round(r.top/4)));return ys.size};
 const path=e=>{const p=[];for(let n=e;n&&n!==document.body&&p.length<4;n=n.parentElement)p.unshift(n.tagName.toLowerCase()+(n.id?'#'+n.id:'')+(n.className&&typeof n.className==='string'?'.'+n.className.trim().split(/\s+/).slice(0,2).join('.'):''));return p.join('>')};
 document.querySelectorAll('#app *,#modal *').forEach(row=>{const cs=getComputedStyle(row);if(!/flex/.test(cs.display)||cs.flexDirection.startsWith('column')||!vis(row))return;if(row.matches('.pvh[data-act=rvatog]'))return; /* exceção aprovada: setinha de "Revise antes de começar a sessão de" fica centrada */
  const kids=[...row.children].filter(vis);if(kids.length<2)return;
  const T=kids.map(k=>({k,l:lines(k),h:k.getBoundingClientRect().height})).filter(o=>o.l>=2&&o.k.textContent.trim().length>20).sort((a,b)=>b.h-a.h)[0];if(!T)return;
  const fl=firstLine(T.k);if(!fl)return;const fc=(fl.top+fl.bottom)/2;
  const tb=T.k.getBoundingClientRect();kids.filter(k=>k!==T.k).forEach(k=>{const r=k.getBoundingClientRect();if(r.height>=T.h-2)return;if(r.top>=tb.bottom-2||r.bottom<=tb.top+2)return; /* quebrou para baixo/cima de propósito: não está ao lado */const c=(r.top+r.bottom)/2,d=Math.round(c-fc);
   /* vizinho mais alto que uma linha (ex.: botão de 40px): basta o topo não ficar abaixo do topo da linha */
   const big=r.height>fl.height*1.6,okk=big?r.top<=fl.top+4:Math.abs(d)<=4;if(!okk)out.push({row:path(row),viz:path(k).split('>').pop(),d,txt:T.k.textContent.trim().slice(0,40)})})});
 return out});
 r.forEach(o=>{const k=o.row+' | '+o.viz;if(!found.has(k))found.set(k,{...o,tela})})};
const tab=async t=>{await x.ev(t=>document.querySelector(`nav [data-tab=${t}]`)?.click(),t);await W(400)};
const sv=async v=>{await x.ev(v=>document.querySelector(`[data-act=rvt][data-id=${v}]`)?.click(),v);await W(300)};
await tab('ciclo');await scan('Ciclo');await p.screenshot({path:OUT+'/al-ciclo-'+w+'.png'});
await x.ev(()=>{const e=[...document.querySelectorAll('[data-act=rview]')].find(e=>e.offsetParent);e&&e.click()});await scan('Registrado neste ciclo');await x.ev(()=>document.querySelector('#modal [data-act=rvclose]')?.click());await W(200);
await x.ev(()=>{const e=[...document.querySelectorAll('[data-act=rreg]')].find(e=>e.offsetParent);e&&e.click()});await W(300);await x.ev(()=>{const g=S.sel.groups&&S.sel.groups[0];if(g){ui.dd=g.id;render()}});await scan('Registrar (lista de tópicos)');await x.ev(()=>{ui.dd=null;document.querySelector('#modal [data-act=xcancel]')?.click()});await W(200);
await tab('rev');await sv('grupos');await p.screenshot({path:OUT+'/al-grupos-'+w+'.png'});for(const v of ['hoje','grupos','ciclos','topicos'])await (async()=>{await sv(v);await scan('Revisão · '+v)})();
await x.ev(()=>{const e=[...document.querySelectorAll('[data-act=trvok]')].find(e=>e.offsetParent);e&&e.click()});await scan('Registrar revisão por tópico');await x.ev(()=>document.querySelector('#modal [data-act=trvokx]')?.click());await W(200);
await x.ev(()=>{const e=[...document.querySelectorAll('[data-act=rvfgo]')].find(e=>e.offsetParent);e&&e.click()});await scan('Foco da revisão por tópico');await x.ev(()=>document.querySelector('#modal [data-act=rvfoff]')?.click());await W(200);
await x.ev(()=>document.querySelector('[data-act=rvcalm]')?.click());await W(300);for(let i=0;i<6;i++){await x.ev(i=>{const d=[...document.querySelectorAll('[data-act=rcday]')].filter(e=>/\d\s*\d/.test(e.innerText))[i];d&&d.click()},i);await scan('Calendário · dia '+i)}await x.ev(()=>document.querySelector('#modal [data-act=rvcalx]')?.click());await W(200);
await tab('reg');await scan('Histórico · Registros');await x.ev(()=>{const b=[...document.querySelectorAll('#app button')].find(b=>b.offsetParent&&b.textContent.trim()==='Ciclos');b&&b.click()});await scan('Histórico · Ciclos');
await tab('st');await scan('Estatísticas');
await x.ev(()=>document.querySelector('nav [data-act=plopen]')?.click());await W(400);await x.ev(()=>document.querySelector('#modal [data-act=pled]')?.click());await W(400);await x.ev(()=>{const e=document.querySelector('[data-act=pdtog]');e&&e.click()});await scan('Planos (ver tópicos)');
await x.ev(()=>{const e=document.querySelector('[data-act=pdedit]');e&&e.click()});await W(300);await x.ev(()=>{const e=document.querySelector('[data-act=pdaddopen]');e&&e.click()});await scan('Adicionar tópicos');
const L=[...found.values()];console.log(w+'px: '+L.length+' linhas desalinhadas');L.forEach(o=>console.log('  ['+o.tela+'] '+o.row+'  →  '+o.viz+' ('+(o.d>0?'+':'')+o.d+'px)  "'+o.txt+'"'));
console.log('erros:',JSON.stringify(errs));console.log(L.length||errs.length?'FALHA: '+L.length+' desalinhadas':'TUDO OK');await b.close();
