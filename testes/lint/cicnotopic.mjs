/* Modo Ciclos: disciplina com duas cópias no ciclo, um registro com tópico e outro sem → avisa o registro sem tópico e o atalho mostra os dois */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const S0=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const SB=S0.subjects.find(s=>!s.off&&S0.subjects.some(d=>d.of===s.id)),SID=SB.id,DUP=S0.subjects.find(d=>d.of===SID).id; /* disciplina do ciclo, sem depender do arquivo de dados */let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const b0=S0.subjects.find(s=>s.id===SID);b0.topics=[{id:'tpN',name:'Nacionalidade',done:false,links:[]}];
S0.subjects.push({id:'cp2',name:b0.name,goal:90,topics:b0.topics,of:SID});
S0.sessions=[{id:'a1',ses:'a1',subj:DUP,topic:'tpN',min:90,cycle:1,set:1,review:false,kind:'aula',items:[{kind:'aula',name:'Questões',link:''}],date:'2026-10-29',at:'21:27'},
 {id:'a2',ses:'a2',subj:'cp2',topic:null,min:90,cycle:1,set:1,review:false,kind:'aula',items:[],date:'2026-10-29',at:'23:47'}];
const {b,p,errs}=await open({w:390,h:800,data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'}});const x=mk(p);
await p.evaluate(()=>[...document.querySelectorAll('[data-tab="reg"]')].find(e=>e.getClientRects().length).click());await W(300);await x.act('hmode','cic');await W(300);
const r=await x.ev(n=>{const h=[...document.querySelectorAll('.hcs')].find(e=>e.textContent.includes(n));return h&&{txt:h.innerText,btn:h.querySelector('[data-act=hgo]').textContent,id:h.querySelector('[data-act=hgo]').dataset.id}},SB.name);
console.log('  ',JSON.stringify(r));ok(r&&/\+ 1 registro sem tópico/.test(r.txt)&&/Nacionalidade/.test(r.txt),'mostra o tópico e o aviso do registro sem tópico');ok(r&&r.btn==='Editar registros','botão "Editar registros" (dois registros)');
await p.screenshot({path:process.argv[3]});
await x.act('hgo',r.id);const l=await x.ev(()=>[...document.querySelectorAll('#hres .ritem')].length);ok(l===2,'atalho mostra os dois registros ('+l+')');
ok(!errs.length,'sem erros '+errs.join('|'));console.log(bad?'FALHAS: '+bad:'TUDO OK');await b.close();
