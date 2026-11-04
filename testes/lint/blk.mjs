import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [OUT,WD]=process.argv.slice(2);const w=+(WD||390);
const log=[],ok=(c,m)=>log.push((c?'OK   ':'FALHA ')+m);
const d=JSON.parse(fs.readFileSync('dados/data-rv3.json','utf8'));const S0=JSON.parse(d['ciclo-estudos-v2']);S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.rv=null;S0.mode='study';S0.alt=null;S0.type='regular';S0.progress={};S0.sessions=S0.sessions.filter(x=>x.cycle!==S0.cycle||x.rid||x.review);d['ciclo-estudos-v2']=JSON.stringify(S0);
const {b,p,errs}=await open({data:d,w,h:900});const x=mk(p);process.on('exit',()=>console.log(log.join(String.fromCharCode(10))));try{
const shot=n=>p.screenshot({path:`${OUT}/blk-${w}-${n}.png`,fullPage:w<500});
const app=()=>x.ev(()=>document.getElementById('app').innerText);
let k=0;
const reg=async id=>{await x.act('rreg',id);await x.ev(k=>{const g=S.sel.groups[0];if(!g.rows.length)g.rows.push({id:uid(),kind:"aula",name:"",link:"",q:""});g.nt='Tópico B'+k;g.rows[0].name='Aula B'+k;render()},++k);await x.submit('#modal form[data-f=man]');await W(250)};
// 1. Editar ciclo: adicionar e arrastar
await x.act('edopen');await W(700);await x.ev(()=>{S.blk=[{id:'m1',pos:inCycle().length}];render()});await W(500);await x.ev(()=>document.querySelector('#modal [data-grip^="b:"]').scrollIntoView({block:'center'}));await W(400);
ok(await x.ev(()=>S.blk.length===1&&S.blk[0].pos===inCycle().length),'adicionar põe o marcador no fim');
// arrastar o marcador para depois da 2ª disciplina
const pos=await x.ev(()=>{const g=document.querySelector('#modal [data-grip^="b:"]').getBoundingClientRect(),c=[...document.querySelectorAll('#modal .mlist .card[data-sid]:not([data-blk])')];const t=c[2].getBoundingClientRect();return {x:g.x+g.width/2,y:g.y+g.height/2,ty:t.y+t.height*0.3}});
await p.mouse.move(pos.x,pos.y);await p.mouse.down();for(let i=1;i<=12;i++){await p.mouse.move(pos.x,pos.y+(pos.ty-pos.y)*i/12);await W(30)}await p.mouse.up();await W(400);
ok(await x.ev(()=>S.blk[0].pos===2),'arrastar muda a posição: pos='+await x.ev(()=>S.blk[0].pos));
await shot('1-editar');
await x.act('edclose');await W(300);
const A=await x.ev(()=>inCycle().map(s=>({id:s.id,name:s.name})));
// 2. estudar as duas primeiras: depois da 1ª, "Depois" não é marcador; depois da 2ª, vez do bloco
await reg(A[0].id);
ok(/Revisão de bloco/.test(await x.ev(()=>document.querySelector('#app .nwnext')?.innerText||'')),'Agora da 2ª mostra "Depois · Revisão de bloco"');
await reg(A[1].id);
ok(await x.ev(()=>!!document.querySelector('#app .blkc')),'vez do bloco: cartão aparece');
const t0=await app();ok(!/Tópico B1/.test(t0)&&/1 tópico · 1 aula/.test(t0),'disciplinas começam fechadas, com resumo');
const tg=await x.ev(()=>[...document.querySelectorAll('#app [data-act=bktog]')].map(e=>e.dataset.id));await x.act('bktog',tg[0]);let t1=await app();ok(/Tópico B1/.test(t1)&&!/Tópico B2/.test(t1),'abrir a 1ª mostra só ela');
await x.act('bktog',tg[1]);t1=await app();ok(!/Tópico B1/.test(t1)&&/Tópico B2/.test(t1),'abrir a 2ª fecha a 1ª');
ok(!/Revise antes de começar/.test(t1),'sem "Revise antes" na vez do bloco');
ok(await x.ev(()=>!!document.querySelector('#app .cbk')),'divisor na barra');
ok(await x.ev(()=>!!document.querySelector('#app .bkrow.cur')),'linha do marcador na lista, marcada como agora');
await shot('2-vez');
await x.act('bkreg',await x.ev(()=>inCycle()[0].of||inCycle()[0].id));await W(300);await x.submit('#modal form[data-f=bkreg]');await W(300);ok(await x.ev(()=>Object.values(S.blkRev)[0].length===1),'Revisado marca a disciplina');await shot('3-revisado');
await x.act('blkend');await W(300);
ok(await x.ev(()=>!document.querySelector('#app .blkc')&&current().id===inCycle()[2].id),'Concluir bloco passa para a 3ª');
ok(await x.ev(()=>/pulado/.test(document.querySelector('#app .bkrow').innerText)),'1 de 2 revisadas: marcador fica pulada');
// 3. regra do Revise antes: duplicar a 1ª disciplina logo depois do bloco
await x.ev(()=>{const s=inCycle()[0];const c={id:'dupx',name:s.name,goal:30,topics:s.topics,of:s.id};const L=inCycle();S.subjects=[L[0],L[1],c,...S.subjects.filter(y=>y!==L[0]&&y!==L[1])];S.sel.subj='dupx';render()});await W(300);
ok(/Revise antes de começar/.test(await app()),'disciplina repetida depois do bloco: "Revise antes" aparece, como antes');await shot('4-repetida');
await x.ev(()=>{S.subjects=S.subjects.filter(y=>y.id!=='dupx');const c=current();S.sel.subj=c.id;render()});await W(200);
// 4. terminar o ciclo com marcador no fim: vez do bloco antes do "Ciclo concluído"
await x.ev(()=>{S.blk.push({id:'fim',pos:inCycle().length});render()});
for(let i=0;i<10;i++){const id=await x.ev(()=>{const s=current();return s?s.id:null});if(!id)break;await reg(id)}
ok(await x.ev(()=>!!document.querySelector('#app .blkc')&&!document.querySelector('[data-act=next]')),'marcador no fim: bloco antes de concluir o ciclo');
const t2=await x.ev(()=>blkSes(blkCur()).map(x=>x.items[0].name).join(','));ok(/B3/.test(t2)&&!/B1\b|B2\b/.test(t2),'bloco do fim cobre só as sessões depois do marcador anterior');
await shot('5-fim');
await x.act('blkend');await W(300);ok(await x.ev(()=>!!document.querySelector('[data-act=next]')),'depois de concluir aparece Iniciar ciclo');
await x.act('next');await W(300);
// 5. novo ciclo: 1º marcador emenda com o fim do ciclo passado (já revisado no bloco do fim) → só as sessões novas
await reg(A[0].id);await reg(A[1].id);
const t3=await x.ev(()=>blkSes(blkCur()).map(x=>x.items[0].name).join(','));ok(await x.ev(()=>!!document.querySelector('#app .blkc'))&&/B\d/.test(t3),'novo ciclo: vez do 1º bloco: '+t3);
ok(!/B3\b/.test(t3),'não repete o que o bloco do fim já revisou');
// Revise antes some no novo ciclo para disciplina cujo último estudo foi revisado em bloco
log.push('erros: '+JSON.stringify(errs));
// 6. remover
await x.act('edopen');await W(300);await x.act('blkdel','fim');ok(await x.ev(()=>!S.blk.some(b=>b.id==='fim')),'remover marcador');
await b.close();console.log(log.join('\n'));
}catch(e){log.push('EXCEÇÃO '+e.message)}await b.close();
