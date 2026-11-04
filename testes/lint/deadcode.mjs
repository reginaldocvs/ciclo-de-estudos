/* Nomes declarados no topo do script (const/let/function) que só aparecem uma vez no index.html inteiro (HTML, CSS e JS) */
import fs from 'fs';
const all=fs.readFileSync(process.argv[2],'utf8');
const js=[...all.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]).reduce((a,b)=>b.length>a.length?b:a,'');
const names=new Set();
for(const m of js.matchAll(/^\s*(?:const|let|function)\s+([A-Za-z_$][\w$]*)/gm))names.add(m[1]);
for(const m of js.matchAll(/^\s*const\s+([^\n]*)/gm)){/* const A=..., B=... na mesma linha (nível superior) */
 let depth=0,cur='',parts=[];for(const ch of m[1]){if('([{'.includes(ch))depth++;else if(')]}'.includes(ch))depth--;if(ch===','&&depth===0){parts.push(cur);cur=''}else if(ch===';'&&depth===0){parts.push(cur);cur='';break}else cur+=ch}
 parts.push(cur);parts.slice(1).forEach(p=>{const n=(p.match(/^\s*([A-Za-z_$][\w$]*)\s*=(?!=)/)||[])[1];if(n)names.add(n)})}
const esc=s=>s.replace(/[$]/g,'\\$');
const out=[];for(const n of names){const c=(all.match(new RegExp('(?<![\\w$.])'+esc(n)+'(?![\\w$])','g'))||[]).length;if(c<=1)out.push(n)}
console.log(out.length+' sem uso: '+out.join(', '));
