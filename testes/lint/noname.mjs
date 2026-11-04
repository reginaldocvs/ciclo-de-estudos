import {open,mk,W} from './lib.mjs';
import fs from 'fs';
const [SHOT,OUT]=process.argv.slice(2);
const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
const d=JSON.parse(fs.readFileSync(SHOT+'/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;d['ciclo-estudos-v2']=JSON.stringify(S0);
const cases=[
 ['só questões (link)',{q:'www.google.com',tq:10,ac:7},'Questões'],
 ['só questões (texto)',{q:'Apostila p. 32'},'Apostila p. 32'],
 ['só acertos',{tq:20,ac:15},'Questões'],
 ['só anotação',{note:'Revisar'},'Anotação'],
 ['anotação e acertos',{note:'Revisar',tq:5,ac:3},'Questões'],
];
const {b,p,errs}=await open({data:d,w:1280,h:820});const x=mk(p);
for(const [nm,row,exp] of cases){
 const id=await x.ev(()=>{S.progress={};render();return actives().find(s=>!gDone(s)).id});await x.act('rreg',id);
 const n0=await x.ev(()=>S.sessions.length);
 await x.ev(r=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Tópico sem nome '+Math.random().toString(36).slice(2,6);Object.assign(g.rows[0],r);render()},row);
 await x.submit('#modal form[data-f=man]');await W(300);
 const res=await x.ev(()=>{const o=S.sessions[S.sessions.length-1];return {n:S.sessions.length,it:o.items,msg:(document.querySelector('#modal .err,#modal [role=alert]')||{}).textContent||''}});
 ok(res.n>n0&&res.it.length===1&&res.it[0].name===exp,`${nm}: registra e aparece como "${exp}" → ${JSON.stringify(res.it)} ${res.msg}`);
 if(row.tq)ok(res.it[0].tq===row.tq,nm+': acertos guardados');
 await x.ev(()=>{S.sel.groups=null;S.sx=false;render()});
}
for(const row of [{link:'youtube.com/aula12'},{link:'youtube.com/aula12',q:'www.google.com',tq:5,ac:2}]){const id=await x.ev(()=>{S.progress={};render();return actives().find(s=>!gDone(s)).id});await x.act('rreg',id);const n0=await x.ev(()=>S.sessions.length);
 await x.ev(r=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Crase';Object.assign(g.rows[0],r);render()},row);await x.submit('#modal form[data-f=man]');await W(300);
 const t=await x.ev(()=>document.getElementById('modal').innerText);ok(/Preencha o assunto/.test(t)&&await x.ev(()=>S.sessions.length)===n0,'link sem assunto pede o assunto: '+JSON.stringify(row));
 if(!row.q)await p.screenshot({path:OUT+'/link-sem-nome.png'});await x.ev(()=>{S.sel.groups=null;S.sx=false;render()})}
// sem tópico ainda exige tópico
{const id=await x.ev(()=>{S.progress={};render();return actives().find(s=>!gDone(s)).id});await x.act('rreg',id);const n0=await x.ev(()=>S.sessions.length);
 await x.ev(()=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='';g.rows[0].q='www.google.com';render()});await x.submit('#modal form[data-f=man]');await W(300);
 const t=await x.ev(()=>document.getElementById('modal').innerText);ok(/Escolha ou digite o tópico/.test(t)&&await x.ev(()=>S.sessions.length)===n0,'sem tópico continua pedindo o tópico');
 ok(!/Preencha o nome da aula/.test(t),'aviso de nome da aula não aparece mais');}
log.push('erros: '+JSON.stringify(errs));await b.close();console.log(log.join('\n'));
