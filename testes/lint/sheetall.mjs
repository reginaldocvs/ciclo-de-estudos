import {open,mk,W} from './lib.mjs';import fs from 'fs';
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.trv={start:'2026-09-25',t:{},iv:[7,15,30,30,60,90]};d['ciclo-estudos-v2']=JSON.stringify(S0);
const probs=[],tab=t=>`document.querySelector('nav [data-tab=${t}]')?.click()`;
const D=[['Ajustes de revisão',`${tab('rev')};ui.rvadj=true`],['Revisão por tópico',`${tab('rev')};ui.rvadj=null;ui.trvcfg=true;ui.trviv=trvIv().slice()`],['Grupos',`ui.trvcfg=null;ui.rvcfg=true`],['Ajuda',`ui.rvcfg=null;ui.info='trv'`],['Calendário',`ui.info=null;ui.rvcalm=true`],['Planos',`ui.rvcalm=null;ui.pl=true`],['Registrar',`ui.pl=null;${tab('ciclo')};S.sx='manual';const s=actives().find(s=>!gDone(s));S.sel.subj=s.id;const g=grps()[0];g.nt='Crase';for(let i=0;i<6;i++)g.rows.push({id:uid(),kind:'aula',name:'Aula '+i,link:'',q:'',open:i===5})`]];
for(const [w,hh] of [[390,640],[768,560],[1280,600]]){const {b,p,errs}=await open({data:d,w,h:hh});const x=mk(p);
 for(const [nm,code] of D){await x.ev(c=>{eval(c);render()},code);await W(500);
  const r=await x.ev(()=>{const L=[...document.querySelectorAll('#modal .dlg')];const e=L[L.length-1];if(!e)return null;const hd=e.querySelector(':scope>.chead,:scope>.mhead,:scope>h2.rvt:first-child');const b0=e.getBoundingClientRect();
   const an=getComputedStyle(e).animationName,res={w:Math.round(b0.width),vw:innerWidth,bot:Math.round(b0.bottom),vh:innerHeight,an,grip:!!e.querySelector('.sgrip')&&getComputedStyle(e.querySelector('.sgrip')).display!=='none',hd:!!hd,scroll:e.scrollHeight>e.clientHeight+1};
   if(hd&&res.scroll){e.scrollTop=e.scrollHeight;const t1=hd.getBoundingClientRect().top;res.stick=Math.abs(t1-b0.top)<2;res.cls=e.classList.contains('scrolled')}
   return res});
  if(!r){probs.push(`${w} ${nm}: não abriu`);continue}
  await W(150);const sc=await x.ev(()=>{const e=[...document.querySelectorAll('#modal .dlg')].pop();return e.classList.contains('scrolled')});
  if(w<=600){if(r.w!==r.vw||r.bot!==r.vh)probs.push(`${w} ${nm}: não é painel de baixo ${JSON.stringify(r)}`);if(!r.grip)probs.push(`${w} ${nm}: sem alça`)}
  else if(r.w>=r.vw-4)probs.push(`${w} ${nm}: ocupa a largura toda no tablet/computador`);
  if(r.scroll&&r.hd&&!r.stick)probs.push(`${w} ${nm}: título não fica fixo ${JSON.stringify(r)}`);
  if(r.scroll&&r.hd&&!sc)probs.push(`${w} ${nm}: sem a linha sob o título ao rolar`);
  log: console.log(w,nm,JSON.stringify(r));
 }
 if(w===390){await x.ev(()=>{ui.pl=null;S.sx=false;S.sel.groups=null;document.querySelector('nav [data-tab=rev]').click();ui.rvadj=true;render()});await W(400);await p.screenshot({path:'saida/rvf/sheet-390-ajustes.png'});await x.ev(()=>{ui.rvadj=null;ui.trvcfg=true;ui.trviv=trvIv().slice();render()});await W(400);await x.ev(()=>{const e=document.querySelector('#modal .dlg');e.scrollTop=e.scrollHeight});await W(200);await p.screenshot({path:'saida/rvf/sheet-390-topico.png'})}
 errs.forEach(e=>probs.push(`${w} console: ${e}`));await b.close()}
console.log(probs.length?probs.join('\n'):'tudo certo');
