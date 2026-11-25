/* Assunto comprido na linha de Questões (no estilo da videoaula: assunto no topo, onde e acertos ao abrir):
   fechada, o assunto e os acertos ("4 de 10") cabem na linha, sem rolagem para o lado; aberta, os campos cabem. */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,OUT]=process.argv.slice(2);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;
const estoura=()=>[...document.querySelectorAll('#modal *')].filter(e=>e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflowX!=='hidden'&&getComputedStyle(e).overflowX!=='clip'&&!e.matches('input,textarea')).map(e=>e.tagName+'.'+e.className);
for(const w of [1280,768,390,320]){const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:860});const x=mk(p);
 const id=await x.ev(()=>actives().find(s=>!gDone(s)).id);await x.act('rreg',id);
 await x.ev(()=>{const g=S.sel.groups[0];g.nt='Tópico L';g.rows=[{id:uid(),kind:'aula',name:'',link:'',q:'https://q/1',qo:true,ac:'4',tq:'10',lbl:'Testando um nome bem grande para as questões do tópico'},{id:uid(),kind:'aula',name:'',link:'',q:'https://q/2',qo:true,ac:'7',tq:'10'}];render()});await W(300);
 let r=await x.ev(es=>{const h=document.querySelector('#modal .rowq'),inp=h.querySelector('input[data-rlbl]'),pg=h.querySelector('.rpg'),hb=h.getBoundingClientRect(),d=document.querySelector('#modal .dlg').getBoundingClientRect();
  return {nome:inp.value.slice(0,10),pg:pg&&pg.textContent,pgDentro:!!pg&&pg.getBoundingClientRect().right<=hb.right+1,cabe:hb.right<=d.right+1,estoura:eval(es)().length}},'('+estoura.toString()+')');
 ok(r.nome==='Testando u'&&r.pg==='4 de 10'&&r.pgDentro&&r.cabe&&!r.estoura,w+': fechada, assunto e "4 de 10" na linha, sem estourar '+JSON.stringify(r));
 await x.ev(()=>{S.sel.groups[0].rows[0].open=true;render()});await W(200);
 r=await x.ev(es=>{const b=document.querySelector('#modal .rbody');return {campos:!!b.querySelector('[data-rq]')&&!!b.querySelector('[data-rac]')&&!!b.querySelector('[data-rtq]'),estoura:eval(es)().length}},'('+estoura.toString()+')');
 ok(r.campos&&!r.estoura,w+': aberta, onde e acertos sem estourar '+JSON.stringify(r));
 await p.screenshot({path:`${OUT}/qnlong-${w}.png`,clip:{x:0,y:0,width:w,height:700}});ok(!errs.length,w+': sem erros');await b.close()}
console.log(bad?'FALHAS: '+bad:'TUDO OK');
