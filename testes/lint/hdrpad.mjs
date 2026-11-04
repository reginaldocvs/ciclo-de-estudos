import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.trv={start:'2026-09-25',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const probs=[],tab=t=>`document.querySelector('nav [data-tab=${t}]')?.click()`;
const D=[['Planos',`${tab('ciclo')};ui.pl=true`],['Editar ciclo',`ui.pl=null;ui.ed=true`],['Adicionar disciplina',`ui.addm=true`],['Registrar',`ui.ed=null;ui.addm=null;S.sx='manual';const s=actives().find(s=>!gDone(s));S.sel.subj=s.id`],['Ver registro',`S.sx=false;S.sel.groups=null;ui.rview=inCycle()[0].id`],['Ajustes de revisão',`ui.rview=null;${tab('rev')};ui.rvadj=true`],['Tópico',`ui.rvadj=null;ui.trvcfg=true;ui.trviv=trvIv().slice()`],['Ajuda',`ui.trvcfg=null;ui.info='trv'`],['Calendário',`ui.info=null;ui.rvcalm=true`],['Grupo',`ui.rvcalm=null;ui.rvt='grupos';render();document.querySelector('#app [data-act=rgview]')?.click()`],['Editar registro',`ui.rgview=null;${tab('reg')};render();document.querySelector('#app [data-act=edit]')?.click()`]];
for(const [w,hh] of [[390,700],[1280,800]]){const {b,p,errs}=await open({data:d,w,h:hh});const x=mk(p);
 for(const [nm,code] of D){await x.ev(c=>{eval(c);render()},code);await W(450);
  const r=await x.ev(()=>{const e=[...document.querySelectorAll('#modal .dlg')].pop();if(!e)return null;const h=e.querySelector('h2');if(!h)return {nh:1};const a=e.getBoundingClientRect(),rg=document.createRange();{const tw=document.createTreeWalker(h,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.textContent.trim()&&!n.parentElement.closest('.sgrip')?1:3});const tn=tw.nextNode();if(tn)rg.selectNodeContents(tn);else rg.selectNodeContents(h)} /* mede o texto do título (a alça do painel fica dentro dele no celular) */const t=[...rg.getClientRects()].find(z=>z.width>0)||h.getBoundingClientRect() /* ignora pedaços de texto vazios (largura 0) */,xb=[...e.querySelectorAll('.x')].find(z=>z.getBoundingClientRect().top<t.bottom&&z.getBoundingClientRect().bottom>t.top&&z.getBoundingClientRect().left>t.left);const xr=xb?Math.round(a.right-xb.getBoundingClientRect().right):null;return {l:Math.round(t.left-a.left),xr,top:Math.round(t.top-a.top)}});
  if(!r){probs.push(`${w} ${nm}: não abriu`);continue}if(r.nh)continue;
  if(r.l<14)probs.push(`${w} ${nm}: título encostado na borda (${r.l}px) ${JSON.stringify(r)}`);
  if(r.xr!==null&&r.xr<8)probs.push(`${w} ${nm}: X encostado na borda (${r.xr}px)`);
  console.log(w,nm,JSON.stringify(r));
  if((nm==='Planos'||nm==='Registrar')&&w===390)await p.screenshot({path:'saida/rvf/hdr-390-'+(nm==='Planos'?'planos':'reg')+'.png'});
 }
 errs.forEach(e=>probs.push(`${w} console: ${e}`));await b.close()}
console.log(probs.length?probs.join('\n'):'todos os títulos com recuo');
