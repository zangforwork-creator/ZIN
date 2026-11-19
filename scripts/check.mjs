import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const modules=(await readdir(root)).filter(name=>name.endsWith('.js'));
for(const name of modules){
 const file=resolve(root,name),source=await readFile(file,'utf8');
 const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 assert(!/['"`]\/api\//.test(source),name+' still depends on a server API.');
}
for(const name of ['studio.json','online-courses.json','reading-seed.json'])JSON.parse(await readFile(resolve(root,'data',name),'utf8'));
const catalog=JSON.parse(await readFile(resolve(root,'data/studio.json'),'utf8'));
assert.equal(catalog.courses.length,10);
for(const course of catalog.courses)if(course.cover)assert((await stat(resolve(root,course.cover.src))).isFile());
assert((await stat(resolve(root,'index.html'))).isFile());
assert((await stat(resolve(root,'.nojekyll'))).isFile());
for(const name of ['vendor/pdf.mjs','vendor/pdf.worker.mjs','vendor/fflate.mjs'])assert((await stat(resolve(root,name))).isFile());
console.log('Static source, document libraries, catalog and relative paths are ready. No build is required.');
