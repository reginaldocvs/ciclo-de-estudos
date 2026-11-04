/* Gera dados/exemplo.json do zero, pelo próprio app: 8 disciplinas (4 no ciclo, uma delas duplicada; 4 fora), metas de 1h30,
   revisões por grupo e por tópico desligadas, nenhum registro. Nada vem de dados reais. */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const {b,p}=await open({data:{'ciclo-welcome-skip':'1'},w:1280,h:860});const x=mk(p);
const j=await x.ev(()=>{const nm=['Disciplina A','Disciplina B','Disciplina C','Disciplina D','Disciplina E','Disciplina F','Disciplina G'];
 const L=nm.map(n=>({id:uid(),name:n,goal:90,topics:[]}));const dup={id:uid(),name:L[0].name,goal:90,topics:[],of:L[0].id};
 S.subjects=[L[0],dup,L[1],L[2],...L.slice(3).map(s=>({...s,off:true}))];S.trv={off:true};S.rvgOff=true;
 if(S.plans&&S.plans[0])S.plans[0].name='Concurso de exemplo';if(S.editais&&S.editais[0])S.editais[0].name='Edital de exemplo';
 S.sel.subj=L[0].id;save();render();return localStorage.getItem('ciclo-estudos-v2')});
await p.reload();await W(600);const k=await x.ev(()=>localStorage.getItem('ciclo-estudos-v2'));
fs.writeFileSync('dados/exemplo.json',k);const S=JSON.parse(k);console.log('disciplinas',S.subjects.map(s=>s.name+(s.of?' (dup)':'')+(s.off?' (fora)':'')).join(', '),'| plano',S.plans.map(p=>p.name),'| registros',S.sessions.length);await b.close();
