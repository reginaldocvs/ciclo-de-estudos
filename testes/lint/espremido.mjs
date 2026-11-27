/* Texto espremido ao lado de botão: em cada aba (e sub-aba da Revisão), acha blocos de texto que dividem a linha com um botão
   e quebram em 3 linhas ou mais numa coluna estreita (menos de 60% da largura da linha). O padrão é título e botão em cima,
   explicação embaixo, na largura toda. Uso: node lint/espremido.mjs <dados.json> [largura=320] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||320);let bad=0;
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const scan=lugar=>ev(lugar=>{const out=[],seen=new Set();
 document.querySelectorAll('#app .btn, #modal .btn').forEach(bt=>{if(!bt.getClientRects().length)return;const br=bt.getBoundingClientRect();if(br.width<1)return;
  let row=bt.parentElement;for(let k=0;k<3&&row;k++){const cs=getComputedStyle(row);if(/flex|grid/.test(cs.display))break;row=row.parentElement}if(!row)return;const rr=row.getBoundingClientRect();
  row.querySelectorAll('p,div,span').forEach(t=>{if(t.contains(bt)||t.closest('button,.btn'))return;if([...t.children].some(c=>/^(block|flex|grid)$/.test(getComputedStyle(c).display)))return;
   const tx=(t.textContent||'').trim();if(tx.length<25)return;const r=t.getBoundingClientRect();if(!r.width)return;
   const lh=parseFloat(getComputedStyle(t).lineHeight)||parseFloat(getComputedStyle(t).fontSize)*1.4;const lines=Math.round(r.height/lh);
   const side=r.top<br.bottom&&r.bottom>br.top||r.right<=br.left+2&&r.top<br.bottom+lh; /* ao lado do botão */
   if(lines>=3&&r.width<rr.width*.6&&side){const k=tx.slice(0,60);if(seen.has(k))return;seen.add(k);out.push({lugar,txt:k,lines,w:Math.round(r.width),row:Math.round(rr.width),cls:(t.className||t.tagName)+' ⊂ '+(row.className||row.tagName)})}})});return out},lugar);
const R=[];const go=async(t,sub)=>{await ev(t=>{const e=document.querySelector(`nav [data-tab="${t}"]`);if(e)e.click()},t);await W(300);if(sub){await ev(s=>{const e=document.querySelector(`[data-act=rvt][data-id="${s}"]`);if(e)e.click()},sub);await W(300)}R.push(...await scan(t+(sub?'/'+sub:'')))};
const tabs=await ev(()=>[...document.querySelectorAll('nav [data-tab]')].map(e=>e.dataset.tab).filter((v,i,a)=>a.indexOf(v)===i));
/* além das abas: abre janelas e telas (cada uma no máximo 3 vezes por lugar), confere e fecha com Esc */
const OPEN=['rvcfg','rqcfg','srcfg','trvcfg','cycfg','rqreg','srreg','rview','edopen','plopen','pled','qnew','qsim','qopen','qed','redoall','rvnow','rvcalm','qinfo','rvadj','csnew','pickrow','rgview','info','qall'];
const deep=async(t,sub)=>{await go(t,sub);const L=await ev(O=>{const r=[],c={};document.querySelectorAll('[data-act]').forEach(e=>{const a=e.dataset.act;if(!O.includes(a)||!e.getClientRects().length)return;c[a]=(c[a]||0)+1;if(c[a]<=3)r.push([a,e.dataset.id||null])});return r},OPEN);
 for(const [a,id] of L){const okc=await ev(([a,id])=>{const e=[...document.querySelectorAll(`[data-act="${a}"]`)].find(e=>(e.dataset.id||null)===id&&e.getClientRects().length);if(!e)return false;e.click();return true},[a,id]);if(!okc)continue;await W(300);
  R.push(...await scan(t+(sub?'/'+sub:'')+' › '+a+(id?':'+id:'')));for(let k=0;k<3;k++){await p.keyboard.press('Escape');await W(80)}await ev(()=>{ui.qz=null;ui.qcad=null;render()});await go(t,sub)}};
for(const t of tabs){await deep(t);if(t==='rev'){const subs=await ev(()=>[...document.querySelectorAll('[data-act=rvt]')].map(e=>e.dataset.id));for(const s of subs)await deep('rev',s)}}
R.forEach(o=>{bad++;console.log('FALHA texto espremido ao lado de botão '+JSON.stringify(o))});console.log(bad?`${bad} casos`:'OK    nenhum texto espremido ao lado de botão');
if(errs.length){bad++;console.log('FALHA erros de script: '+errs.slice(0,2).join(' | '))}await b.close();process.exit(bad?1:0);
