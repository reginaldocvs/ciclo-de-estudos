/* Classes usadas em seletores CSS que não aparecem em nenhum lugar fora do <style> (HTML e JS) */
import fs from 'fs';
const all=fs.readFileSync(process.argv[2],'utf8');
const css=[...all.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(x=>x[1]).join('\n');
const rest=all.replace(/<style[^>]*>[\s\S]*?<\/style>/g,'');
const sel=css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\{[^{}]*\}/g,'{}');
const cls=new Set([...sel.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(m=>m[1]).filter(c=>!/^\d/.test(c)));
const out=[...cls].filter(c=>!new RegExp('(?<![\\w-])'+c+'(?![\\w-])').test(rest)).sort();
console.log(out.length+' classes sem uso: '+out.join(' '));
