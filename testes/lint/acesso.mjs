/* Pedido de acesso por e-mail: conta recusada pelas regras manda o comprovante de login ao script do dono, uma vez por conta;
   sem endereço configurado, nada sai. Firebase e o script são simulados; nada vai para a internet. Uso: node lint/acesso.mjs */
import {open,mk,W} from './lib.mjs';
let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const URL='https://script.google.com/macros/s/TESTE/exec';
const {b,p,errs}=await open({w:1280,h:900,data:{'ciclo-welcome-skip':'1'}});const x=mk(p);
const sent=[];await p.setRequestInterception(true);
p.on('request',r=>{if(r.url().startsWith('https://script.google.com/')){sent.push({m:r.method(),body:r.postData()||''});r.respond({status:200,contentType:'text/plain',body:'ok'})}else r.continue()});
const fake=()=>x.ev(()=>{window.firebase=window.firebase||{};const u={uid:'uidTeste123',getIdToken:()=>Promise.resolve('cab.corpo.assinatura')};window.firebase.auth=()=>({currentUser:u});SY.user={name:'Pessoa Teste',email:'pessoa@exemplo.com'}});
/* sem endereço: nada sai */
await fake();await x.ev(()=>{window.__acessoUrl='';syDenied()});await W(500);
ok(sent.length===0,'sem o endereço do script, nenhum pedido sai');
/* com endereço: sai um pedido, com o token, e só uma vez */
await x.ev(u=>{window.__acessoUrl=u;syDenied()},URL);await W(800);
ok(sent.length===1&&sent[0].m==='POST'&&/"t":"cab\.corpo\.assinatura"/.test(sent[0].body),'conta recusada: manda o comprovante de login ao script '+JSON.stringify(sent));
await x.ev(()=>syDenied());await W(600);
ok(sent.length===1,'segunda recusa na mesma conta: não manda de novo');
ok(await x.ev(()=>!!localStorage.getItem('ciclo-pedido:uidTeste123')),'o pedido fica marcado neste aparelho');
/* a mensagem em Configurações */
await x.ev(()=>{[...document.querySelectorAll('[data-tab="bk"]')].find(e=>e.offsetParent).click()});await W(400);
const t=await x.ev(()=>document.querySelector('main').textContent);
ok(/não tem acesso à sincronização/.test(t)&&/responsável pelo app foi avisado/.test(t),'Configurações: diz que o responsável foi avisado');
ok(!errs.filter(e=>!/ERR_|Failed to load|net::/.test(e)).length,'sem erros de script '+errs.slice(0,2).join(' | '));
await b.close();process.exit(bad?1:0);
