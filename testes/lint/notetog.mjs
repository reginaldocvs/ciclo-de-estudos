import {open,mk,W} from './lib.mjs';
import fs from 'fs';
const [SHOT,OUT]=process.argv.slice(2);
const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
const d=JSON.parse(fs.readFileSync(SHOT+'/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;d['ciclo-estudos-v2']=JSON.stringify(S0);
for(const w of [1280,390]){const {b,p,errs}=await open({data:d,w,h:820});const x=mk(p);
 const st=()=>x.ev(()=>[...document.querySelectorAll('#modal .rowf')].map(r=>{const id=r.querySelector('[data-rn]').dataset.rn;return {l:!!document.getElementById('l-'+id),n:!!document.getElementById('nt-'+id)}}));
 const id=await x.ev(()=>actives().find(s=>!gDone(s)).id);await x.act('rreg',id);await x.act('addrow');
 let v=await st();ok(v[0].l&&!v[0].n,w+': aula nova abre sem o campo de anotação');await p.screenshot({path:`${OUT}/note-${w}-1.png`});
 const k=await x.ev(()=>S.sel.groups[0].id+':'+S.sel.groups[0].rows[0].id);
 await x.act('rnote',k);v=await st();ok(v[0].n&&await x.ev(()=>document.activeElement&&document.activeElement.id.startsWith('nt-')),w+': tocar na legenda mostra o campo com o cursor');
 await x.fill('#modal textarea[data-rnt]','Revisar casos');await x.act('rnote',k);v=await st();ok(!v[0].n&&await x.ev(()=>S.sel.groups[0].rows[0].note==='Revisar casos'),w+': tocar de novo esconde sem apagar');
 await x.act('rnote',k);await p.screenshot({path:`${OUT}/note-${w}-2.png`});
 await x.act('addrow');v=await st();ok(!v[0].l&&v[1].l&&!v[1].n,w+': nova aula abre sem anotação; a anterior recolhe');
 ok(await x.ev(()=>!!document.querySelector('#modal .rowf .rsig')),w+': aula fechada mostra o sinal de anotação');
 await x.act('rtog',k);v=await st();ok(v[0].l&&v[0].n,w+': reabrir aula com anotação mostra o campo aberto');
 log.push(w+' erros: '+JSON.stringify(errs));await b.close()}
console.log(log.join('\n'));
