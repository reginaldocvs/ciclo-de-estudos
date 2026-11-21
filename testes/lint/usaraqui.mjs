/* "Usar aqui": a janela que outra assumiu fica bloqueada e o botão recarrega e assume — inclusive quando a camada
   "Sincronizando com a sua conta…" estava ativa na hora (ela não pode travar o aviso).
   Uso: node lint/usaraqui.mjs */
import {open,W} from './lib.mjs';
let bad=0;const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m);if(!c)bad++};
const st=pg=>pg.evaluate(()=>{const u=document.getElementById('tbuse');return {blk:!!document.getElementById('tabblock'),inert:u?!!u.closest('[inert]'):null,gate:!!document.getElementById('sygate')}});
for(const comGate of [false,true]){
 const {b,p}=await open({data:{'ciclo-welcome-skip':'1'},w:1000,h:700});
 if(comGate)await p.evaluate(()=>{gateShow()});
 const p2=await b.newPage();await p2.setViewport({width:1000,height:700});await p2.goto('http://localhost:8765/');await W(1200);
 let r=await st(p);ok(r.blk&&!r.inert&&!r.gate,(comGate?'com a sincronização em andamento: ':'')+'a janela antiga mostra o aviso e o botão responde '+JSON.stringify(r));
 await p.bringToFront();const nav=p.waitForNavigation({timeout:5000}).then(()=>true).catch(()=>false);await p.click('#tbuse').catch(()=>{});
 ok(await nav,(comGate?'com a sincronização em andamento: ':'')+'"Usar aqui" recarrega e assume');await W(1500);
 r=await st(p2);ok(r.blk,'a outra janela passa a mostrar o aviso');await b.close()}
process.exit(bad?1:0);
