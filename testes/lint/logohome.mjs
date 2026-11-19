/* Logo "Ciclo de Estudos" leva ao Ciclo: na barra de cima do celular e na lateral do computador;
   já no Ciclo, volta ao topo; visual igual (sem borda, sem fundo, cor e fonte de antes).
   Uso: node lint/logohome.mjs <dados.json> */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const D=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
for(const [w,sel] of [[390,'.mbar .brand'],[1280,'.sbrand']]){
 const {b,p,errs}=await open({w,h:800,data:{'ciclo-estudos-v2':JSON.stringify(D),'ciclo-welcome-skip':'1'}});const x=mk(p);
 const st=await x.ev(s=>{const e=document.querySelector(s),c=getComputedStyle(e);return {tag:e.tagName,vis:!!e.getClientRects().length,bd:c.borderTopWidth,bg:c.backgroundColor,cur:c.cursor,ff:c.fontFamily===getComputedStyle(document.body).fontFamily}},sel);
 ok(st.tag==='BUTTON'&&st.vis&&st.bd==='0px'&&st.bg==='rgba(0, 0, 0, 0)'&&st.cur==='pointer'&&st.ff,w+': logo é botão, com o visual de antes '+JSON.stringify(st));
 for(const t of ['rev','reg','st','bk']){await x.ev(t=>document.querySelector(`nav [data-tab="${t}"]`).click(),t);await W(250);await x.ev(s=>document.querySelector(s).click(),sel);await W(300);
  const r=await x.ev(()=>({cur:document.querySelector('nav button[aria-current=page]').dataset.tab,y:scrollY}));ok(r.cur==='ciclo'&&r.y===0,w+': da aba '+t+' o logo leva ao Ciclo, no topo '+JSON.stringify(r))}
 await x.ev(()=>{document.body.style.minHeight='4000px';scrollTo(0,1500)});await W(200);await x.ev(s=>document.querySelector(s).click(),sel);await W(900);
 ok(await x.ev(()=>scrollY)===0,w+': já no Ciclo, o logo volta ao topo');
 ok(!errs.length,w+': sem erros de script '+errs.slice(0,2).join(' | '));
 await p.screenshot({path:'saida/logohome-'+w+'.png',clip:{x:0,y:0,width:w,height:200}});await b.close()}
process.exit(bad?1:0);
