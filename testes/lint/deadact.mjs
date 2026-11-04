/* Ações: tratadas (a==='x') sem nenhum data-act="x" que as dispare, e data-act sem tratamento */
import fs from 'fs';
const all=fs.readFileSync(process.argv[2],'utf8');
const handled=new Set([...all.matchAll(/\ba===['"]([\w-]+)['"]/g)].map(m=>m[1]));
const emitted=new Set([...all.matchAll(/data-act=\\?["']([\w-]+)/g),...all.matchAll(/dataset\.act\s*=\s*['"]([\w-]+)/g),...all.matchAll(/act\s*===?\s*['"]([\w-]+)['"]/g)].map(m=>m[1]));
/* data-act montado com ${...}: pega os nomes que aparecem como valor em listas ['x', ...] perto de act */
const dyn=new Set([...all.matchAll(/data-act="\$\{([^}]*)\}"/g)].map(m=>m[1]));
console.log('tratadas sem botão:',[...handled].filter(a=>!emitted.has(a)&&!all.includes("'"+a+"'",0)||false).filter(a=>!emitted.has(a)).join(' '));
console.log('botão sem tratamento:',[...emitted].filter(a=>!handled.has(a)).join(' '));
console.log('data-act dinâmicos:',[...dyn].join(' | '));
