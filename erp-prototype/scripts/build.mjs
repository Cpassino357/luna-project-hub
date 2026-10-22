import {readFile,writeFile,mkdir} from 'node:fs/promises';
const files={'/':['index.html','text/html; charset=utf-8'],'/app.js':['app.js','text/javascript; charset=utf-8'],'/logic.js':['logic.js','text/javascript; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8'],'/cloud.js':['cloud.js','text/javascript; charset=utf-8']};
const assets={};for(const [url,[name,type]] of Object.entries(files))assets[url]={body:await readFile(new URL('../web/'+name,import.meta.url),'utf8'),type};
const source=await readFile(new URL('../worker/index.mjs',import.meta.url),'utf8');
await mkdir(new URL('../dist/server/',import.meta.url),{recursive:true});await mkdir(new URL('../dist/.openai/',import.meta.url),{recursive:true});
await writeFile(new URL('../dist/server/index.js',import.meta.url),'const assets='+JSON.stringify(assets)+';\n'+source);
await writeFile(new URL('../dist/.openai/hosting.json',import.meta.url),await readFile(new URL('../.openai/hosting.json',import.meta.url)));
console.log('Built cloud Worker with embedded application assets.');
