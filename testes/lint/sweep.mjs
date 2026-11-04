import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT]=process.argv.slice(2);
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.trv={start:'2026-09-25',t:{}};S0.blk=[{id:'m',pos:2}];d['ciclo-estudos-v2']=JSON.stringify(S0);
const probs=[];const P=(w,th,where,m)=>probs.push(`${w}px ${th} · ${where}: ${m}`);
/* o que conferir em cada tela */
const check=x=>x.ev(()=>{const out=[],vw=document.documentElement.clientWidth;
 if(document.documentElement.scrollWidth>vw+1)out.push('rolagem lateral ('+document.documentElement.scrollWidth+' > '+vw+')');
 document.querySelectorAll('.snt').forEach(e=>{if(!e.offsetParent)return;const lh=parseFloat(getComputedStyle(e).lineHeight)||e.getBoundingClientRect().height;if(e.getClientRects().length>1||e.getBoundingClientRect().height>lh*1.6)out.push('nome quebrou: '+e.textContent.trim().slice(0,30))});
 document.querySelectorAll('#app *, #modal *').forEach(e=>{if(!e.offsetParent||e.closest('.cbt,.rcg,.chart,svg,[class*=scroll],.sper,.mscroll'))return;const r=e.getBoundingClientRect();if(r.width&&(r.right>vw+2||r.left<-2)&&getComputedStyle(e).position!=='fixed'){const c=e.className&&e.className.baseVal===undefined?String(e.className):e.tagName;out.push('fora da tela: '+e.tagName.toLowerCase()+'.'+c.split(' ')[0]+' ('+Math.round(r.left)+'..'+Math.round(r.right)+')')}});
 return [...new Set(out)].slice(0,6)});
const views=[
 ['Ciclo',async x=>{await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click())}],
 ['Ciclo · Editar ciclo',async x=>{await x.ev(()=>{ui.ed=true;render()})},x=>x.ev(()=>{ui.ed=null;render()})],
 ['Ciclo · Registrar',async x=>{await x.ev(()=>{const s=actives().find(s=>!gDone(s));document.querySelector(`[data-act=rreg][data-id="${s.id}"]`).click()})},x=>x.ev(()=>{S.sx=false;S.sel.groups=null;render()})],
 ['Revisão · Hoje',async x=>{await x.ev(()=>document.querySelector('nav [data-tab=rev]').click())}],
 ['Revisão · Grupos',async x=>{await x.ev(()=>{ui.rvt='grupos';render()})}],
 ['Revisão · Tópicos',async x=>{await x.ev(()=>{ui.rvt='topicos';render()})}],
 ['Revisão · Calendário',async x=>{await x.ev(()=>{ui.rvcalm=true;render()})},x=>x.ev(()=>{ui.rvcalm=null;render()})],
 ['Revisão · Ajustes',async x=>{await x.ev(()=>{ui.rvadj=true;render()})},x=>x.ev(()=>{ui.rvadj=null;render()})],
 ['Revisão · Registrar tópico',async x=>{await x.ev(()=>{ui.trvk=trvList().find(o=>!o.fix).k;render()})},x=>x.ev(()=>{ui.trvk=null;render()})],
 ['Revisão · Ajuda',async x=>{await x.ev(()=>{ui.info='rvdias';render()})},x=>x.ev(()=>{ui.info=null;render()})],
 ['Planos',async x=>{await x.ev(()=>{ui.pl=true;render()})},x=>x.ev(()=>{ui.pl=null;render()})],
 ['Histórico',async x=>{await x.ev(()=>document.querySelector('nav [data-tab=reg]').click())}],
 ['Estatísticas',async x=>{await x.ev(()=>document.querySelector('nav [data-tab=st]').click())}],
 ['Configurações',async x=>{await x.ev(()=>document.querySelector('[data-tab=bk]').click())}],
];
for(const th of ['light','dark'])for(const w of [320,390,768,1280]){
 const {b,p,errs}=await open({data:d,w,h:900});const x=mk(p);
 await p.emulateMediaFeatures([{name:'prefers-color-scheme',value:th}]);await W(200);
 for(const [nm,go,back] of views){try{await go(x);await W(350);const r=await check(x);r.forEach(m=>P(w,th,nm,m));if(w===390||w===1280)await p.screenshot({path:`${OUT}/sw-${th}-${w}-${nm.replace(/[ ·]+/g,'_')}.png`});if(back)await back(x),await W(200)}catch(e){P(w,th,nm,'EXCEÇÃO '+e.message)}}
 errs.forEach(e=>P(w,th,'console',e));await b.close()}
console.log(probs.length?probs.join('\n'):'nenhum problema');
