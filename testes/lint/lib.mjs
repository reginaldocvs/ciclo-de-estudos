import puppeteer from 'puppeteer-core';
export const W=ms=>new Promise(r=>setTimeout(r,ms));
export async function open({w=1280,h=800,fresh=true,data=null,off=0}={}){
 const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,protocolTimeout:120000});
 const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
 await p.evaluateOnNewDocument(()=>{const D=Date,off=()=>+(localStorage.getItem('__fkoff')||0);class F extends D{constructor(...a){if(a.length)super(...a);else super(D.now()+off())}static now(){return D.now()+off()}};window.Date=F});
 await p.setViewport({width:w,height:h,deviceScaleFactor:1});
 await p.goto('http://localhost:8765/');if(fresh)await p.evaluate(()=>localStorage.clear());if(data)await p.evaluate(d=>{for(const k in d)localStorage.setItem(k,d[k])},data);await p.goto('http://localhost:8765/');await W(500);
 return {b,p,errs};
}
export const mk=p=>({
 ev:(f,...a)=>p.evaluate(f,...a),
 act:async(a,id,{all=false}={})=>{const ok=await p.evaluate((a,id)=>{const els=[...document.querySelectorAll(`[data-act="${a}"]`+(id!=null?`[data-id="${CSS.escape(id)}"]`:''))].filter(e=>e.offsetParent!==null||e.getClientRects().length);const e=els[els.length-1];if(!e)return false;e.click();return true},a,id);await W(250);if(!ok)throw new Error('ação não encontrada: '+a+' '+(id||''));return ok},
 txt:async t=>{const ok=await p.evaluate(t=>{const els=[...document.querySelectorAll('button,a')].filter(b=>(b.offsetParent!==null)&&b.textContent.trim()===t);const b=els[els.length-1];if(b){b.click();return true}return false},t);await W(250);if(!ok)throw new Error('botão não encontrado: '+t);return ok},
 fill:async(sel,v)=>{const ok=await p.evaluate((sel,v)=>{const els=[...document.querySelectorAll(sel)].filter(e=>e.offsetParent!==null);const e=els[els.length-1];if(!e)return false;e.focus();e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true},sel,v);await W(120);if(!ok)throw new Error('campo não encontrado: '+sel);return ok},
 submit:async sel=>{const ok=await p.evaluate(sel=>{const f=[...document.querySelectorAll(sel)].filter(e=>e.offsetParent!==null).pop();if(!f)return false;f.requestSubmit?f.requestSubmit():f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));return true},sel);await W(300);if(!ok)throw new Error('formulário não encontrado: '+sel);return ok},
 ctrls:()=>p.evaluate(()=>[...document.querySelectorAll('#modal button,#modal input,#modal select,#modal textarea')].filter(e=>e.offsetParent).map(e=>e.tagName+'|'+(e.dataset.act||e.name||e.id||'')+'|'+(e.dataset.id||'')+'|'+(e.textContent||e.placeholder||e.value||'').trim().slice(0,30)).join('\n')),
 days:async n=>{await p.evaluate(n=>{localStorage.setItem('__fkoff',String((+(localStorage.getItem('__fkoff')||0))+n*86400000))},n);await p.reload();await W(600)},
});
