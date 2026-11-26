/* Acertos só com o lugar das questões: no registro, videoaula/leitura com acertos pede o campo Questões (link ou local);
   a linha de Questões com acertos pede o Onde. Sem isso não registra, a linha abre com o campo em vermelho e o cursor nele.
   Uso: node lint/qonde.mjs <dados.json> [largura=390] */
import {open,mk,W} from './lib.mjs';import fs from 'fs';
const [F,WD]=process.argv.slice(2);const w=+(WD||390);let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const S0=JSON.parse(fs.readFileSync(F,'utf8'));S0.timer={running:false,start:0,acc:0};S0.sx=false;S0.paused={};delete S0.rv;
const {b,p,errs}=await open({data:{'ciclo-estudos-v2':JSON.stringify(S0),'ciclo-welcome-skip':'1'},w,h:w<500?844:900});const x=mk(p);const ev=(f,...a)=>x.ev(f,...a);
const id=await ev(()=>actives().find(s=>!gDone(s)).id);
const n0=await ev(()=>S.sessions.length);
const tryReg=async rows=>{await x.act('rreg',id);await ev(rows=>{const g=S.sel.groups[0];g.nt='Tópico Onde';g.rows=rows;S.sel.mt='0h30';render()},rows);await W(200);await x.submit('#modal form[data-f=man]');await W(400);
 return ev(()=>{const f=document.querySelector('#modal .rbody .full.err');return {n:S.sessions.length,msg:(document.querySelector('#modal')||{}).textContent||'',err:f?f.id:null,foco:document.activeElement&&document.activeElement.id,inv:f&&f.getAttribute('aria-invalid')}})};
/* videoaula com acertos e sem o campo Questões */
let r=await tryReg([{id:'v1',kind:'aula',name:'Aula 9',link:'https://aula/9',q:'',ac:'5',tq:'10',open:false}]);
ok(r.n===n0&&/Diga onde estão as questões/.test(r.msg)&&r.err==='q-v1'&&r.foco==='q-v1'&&r.inv==='true','videoaula com acertos e sem Questões: não registra, abre a linha com o campo em vermelho e o cursor nele '+JSON.stringify({...r,msg:r.msg.includes('Diga onde')}));
/* preenchido o lugar, registra */
await ev(()=>{const g=S.sel.groups[0];g.rows[0].q='Apostila p. 40';render()});await W(150);await x.submit('#modal form[data-f=man]');await W(400);
ok(await ev(n0=>S.sessions.length>n0,n0),'com o lugar das questões, registra');
/* linha de Questões com acertos e sem o Onde */
await ev(id=>{S.progress[id]=0;render()},id);const n1=await ev(()=>S.sessions.length);
r=await tryReg([{id:'q1',kind:'aula',name:'',link:'',qo:true,q:'',ac:'3',tq:'5',open:false}]);
ok(r.n===n1&&/Diga onde estão as questões/.test(r.msg)&&r.err==='q-q1','linha de Questões com acertos e sem Onde: não registra '+JSON.stringify({...r,msg:r.msg.includes('Diga onde')}));
/* sem acertos, o lugar não é obrigatório */
await ev(()=>{const g=S.sel.groups[0];g.rows=[{id:'v2',kind:'aula',name:'Aula 10',link:'',q:'',ac:'',tq:'',open:false}];render()});await W(150);await x.submit('#modal form[data-f=man]');await W(400);
ok(await ev(n1=>S.sessions.length>n1,n1),'sem acertos, registra sem o lugar das questões');
ok(!errs.length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
