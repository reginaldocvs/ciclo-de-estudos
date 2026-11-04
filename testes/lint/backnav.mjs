import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD]=process.argv.slice(2);const w=+(WD||390);
const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.trv={start:'2026-09-25',t:{}};d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:w<500?844:900});const x=mk(p);try{
const adj=()=>x.ev(()=>!!ui.rvadj&&!!document.querySelector('#modal [data-act=rvadjx]'));
await x.ev(()=>document.querySelector('nav [data-tab=rev]').click());await W(300);
for(const [act,nm] of [['rvcfg','grupos'],['cycfg','ciclos'],['trvcfg','tópico']]){
  if(act==='cycfg')await x.ev(()=>{S.cyrv={on:true,n:3,last:S.cycle-1};render()});
 await x.act('rvadj');await x.act(act);
 ok(await x.ev(()=>!!document.querySelector('#modal .chead [data-act=cfgback]')&&[...document.querySelectorAll('#modal .rvcfa .btn')].map(b=>b.textContent).join('|')==='Cancelar|Salvar'),nm+': seta de voltar e Cancelar|Salvar');
 if(act==='cycfg')await p.screenshot({path:`${OUT}/bk-${w}-ciclos.png`});
 await x.act('cfgback');ok(await adj(),nm+': seta volta para Ajustes de revisão');
 await x.act(act);await x.ev(()=>document.querySelector('#modal .rvcfa [data-act=cfgback]').click());await W(250);ok(await adj(),nm+': Cancelar volta para Ajustes');
 await x.act(act);await x.submit('#modal form');await W(250);ok(await adj(),nm+': Salvar volta para Ajustes');
 await x.act(act);await x.act(act==='trvcfg'?'trvcfgx':act+'x');ok(await x.ev(()=>!ui.rvadj&&!document.querySelector('#modal .dlg')),nm+': X fecha tudo');
}
// Ver registro → Editar
await x.ev(()=>document.querySelector('nav [data-tab=ciclo]').click());await W(300);
const sid=await x.ev(()=>{const s=inCycle().find(s=>S.sessions.some(x=>pkey(x)===s.id&&x.cycle===S.cycle&&!x.review));return s&&s.id});
if(!sid){log.push('sem registro no ciclo para testar o Ver registro')}else{
 await x.ev(s=>{ui.rview=s;render()},sid);await W(250);
 await x.ev(()=>document.querySelector('#modal [data-act=edit]').click());await W(300);
 ok(await x.ev(()=>!!S.edit&&!!document.querySelector('#modal .edh [data-act=canceledit].cback')),'editar aberto pelo registro tem seta de voltar');
 await p.screenshot({path:`${OUT}/bk-${w}-editar.png`});
 await x.act('canceledit');ok(await x.ev(s=>ui.rview===s&&!S.edit,sid),'Cancelar volta para o registro');
 await x.ev(()=>document.querySelector('#modal [data-act=edit]').click());await W(300);await x.act('saveedit');ok(await x.ev(s=>ui.rview===s&&!S.edit,sid),'Salvar volta para o registro');
 await x.ev(()=>{ui.rview=null;render()});
 // editar pelo Histórico: sem seta
 await x.ev(()=>document.querySelector('nav [data-tab=reg]').click());await W(300);await x.ev(()=>document.querySelector('#app [data-act=edit]').click());await W(300);
 ok(await x.ev(()=>!!S.edit&&!document.querySelector('#modal .edh .cback')),'editar pelo Histórico: sem seta');
 await x.act('canceledit');ok(await x.ev(()=>!ui.rview&&!S.edit),'cancelar no Histórico só fecha');
}
log.push('erros: '+JSON.stringify(errs));
}catch(e){log.push('EXCEÇÃO '+e.message)}await b.close();console.log(log.join('\n'));
