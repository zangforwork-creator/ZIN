import {chromium} from 'playwright-core';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {zipSync,strToU8} from '../vendor/fflate.mjs';
import {startServer} from './serve.mjs';

const executablePath=process.env.STUDIO_BROWSER||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/chromium','/usr/bin/google-chrome'].find(existsSync);
if(!executablePath)throw Error('Set STUDIO_BROWSER to an installed Chrome or Edge executable.');
const {server,url}=await startServer({port:0,basePath:'/Zin-studio/'});
let browser;
const results=[],errors=[],apiRequests=[],localFailures=[];
async function check(name,action){try{await action();results.push({name,pass:true});console.log('PASS '+name);}catch(error){results.push({name,pass:false,error:error.message});console.log('FAIL '+name+': '+error.message);}}
try{
 browser=await chromium.launch({executablePath,headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:1000},reducedMotion:'reduce'});
 await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(url).origin?route.continue():route.abort());
 const page=await context.newPage();page.setDefaultTimeout(12000);
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(new URL(request.url()).pathname.startsWith('/api/'))apiRequests.push(request.url());});
 page.on('response',response=>{if(response.url().startsWith(url)&&response.status()>=400)localFailures.push(response.url());});
 const act=name=>page.locator('[data-action="'+name+'"]').first();
 const open=async(route='home')=>{await page.goto(url+'#'+route);await page.locator('.sidebar a[aria-current="page"][href="#'+route+'"]').waitFor();await page.locator('.hero h1').waitFor();};
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('zin-studio-v2')));
 await mkdir(resolve(import.meta.dirname,'../.preview'),{recursive:true});
 await open();
 await check('project subpath loads all three routes with static reading and no backend',async()=>{
  await page.locator('#market-pulse h3').waitFor();
  assert.match(await page.locator('#market-pulse h2').innerText(),/Saved reading/);
  await page.locator('.reading-status summary').click();
  assert.match(await page.locator('.reading-status').innerText(),/not a live news feed/);
  await page.locator('a[href="#bookshelf"]').first().click();await page.locator('.sidebar a[aria-current="page"][href="#bookshelf"]').waitFor();assert.equal(await page.locator('.book-card').count(),10);
  await page.locator('a[href="#courses"]').first().click();await page.locator('.sidebar a[aria-current="page"][href="#courses"]').waitFor();assert.equal(await page.locator('.online-course-card').count(),5);
  await page.locator('#courses-delivery').selectOption('online');assert.equal(await page.locator('.online-course-card').count(),4);
  await open();
 });
 await check('saved stories page correctly and failed reload retains the last library',async()=>{
  await open();await page.locator('#market-pulse h3').waitFor();
  const first=await page.locator('#market-pulse h3').innerText();
  await act('news-next').click();assert.notEqual(await page.locator('#market-pulse h3').innerText(),first);
  await act('news-prev').click();assert.equal(await page.locator('#market-pulse h3').innerText(),first);
  await page.route('**/data/reading-seed.json',route=>route.abort());
  await act('refresh').click();await page.waitForFunction(()=>document.querySelector('.reading-status').textContent.includes('Could not reload'));
  assert.equal(await page.locator('#market-pulse h3').innerText(),first);
  await page.unroute('**/data/reading-seed.json');
  await act('refresh').click();await page.waitForFunction(()=>!document.querySelector('[data-action="refresh"]').disabled);
  assert(!((await page.locator('.reading-status').innerText()).includes('Could not reload')));
 });
 await check('exam creation, reload, deletion and undo preserve browser state',async()=>{
  await open();
  await act('add-exam').click();await page.locator('#exam-form [name="date"]').fill('2027-01-15');
  await page.locator('#exam-note').fill('QA fixture');await page.locator('#exam-form [type="submit"]').click();
  assert.equal((await state()).exams.length,1);
  await page.reload();await page.locator('.hero h1').waitFor();assert.equal((await state()).exams.length,1);
  await act('delete-exam').click();await act('confirm-delete').click();assert.equal((await state()).exams.length,0);
  await act('undo-exam').click();assert.equal((await state()).exams.length,1);
 });
 await check('course dialogs offer local attachments with no broken original-document API links',async()=>{
  await open('bookshelf');await act('course').click();
  assert.match(await page.locator('#modal').innerText(),/Attach your own copy/);
  assert.equal(await page.locator('#modal a[href*="/api/"]').count(),0);
  await page.keyboard.press('Escape');
 });
 const fixtureText='Case study: a hypothetical campus bookshop compares customer needs before choosing a marketing message. This synthetic source verifies document extraction and does not report a real campaign outcome.';
 const helper=await context.newPage();await helper.setContent('<h1>Local document fixture</h1><p>'+fixtureText+'</p>');const pdf=await helper.pdf({format:'A4'});await helper.close();
 const xml='<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>'+fixtureText+'</w:t></w:r></w:p></w:body></w:document>';
 const slide='<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>'+fixtureText+'</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>';
 const fixtures=[{name:'fixture.pdf',mimeType:'application/pdf',buffer:pdf},{name:'fixture.docx',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',buffer:Buffer.from(zipSync({'word/document.xml':strToU8(xml)}))},{name:'fixture.pptx',mimeType:'application/vnd.openxmlformats-officedocument.presentationml.presentation',buffer:Buffer.from(zipSync({'ppt/slides/slide1.xml':strToU8(slide)}))}];
 for(const fixture of fixtures)await check('local '+fixture.name+' attachment, text extraction and file persistence',async()=>{
  await act('upload').click();await page.locator('#document-file').setInputFiles(fixture);await page.locator('#upload-form [type="submit"]').click();
  if(fixture.name.endsWith('.pdf')){await page.locator('#extract-form').waitFor();await page.locator('#extract-form [type="submit"]').click();await page.waitForFunction(()=>document.querySelector('#extract-status').textContent.startsWith('Saved'));}
  await page.locator('#document-sections').waitFor();assert.match(await page.locator('#document-sections').textContent(),/campus bookshop/);
  await page.keyboard.press('Escape');await page.reload();await page.locator('.hero h1').waitFor();
  const doc=(await state()).documents.find(doc=>doc.name===fixture.name);assert(doc);
  const stored=await page.evaluate(async id=>{const {getFile}=await import('./documents.js');return Boolean(await getFile(id));},doc.id);assert(stored);
 });
 await check('case reflections and JSON backup can migrate to a fresh browser context',async()=>{
  await open();await page.locator('#case-panel [data-action="case-open"]').first().click();
  await page.locator('#case-reflection').fill('A personal source reflection.');await act('case-note').click();await page.keyboard.press('Escape');
  await act('data').click();const downloadEvent=page.waitForEvent('download');await act('backup').click();const download=await downloadEvent;
  const backupPath=resolve(import.meta.dirname,'../.preview/migration-backup.json');await download.saveAs(backupPath);
  const fresh=await browser.newContext();const migrated=await fresh.newPage();await migrated.goto(url);await migrated.locator('.hero h1').waitFor();
  await migrated.locator('[data-action="data"]').first().click();await migrated.locator('[data-action="import"]').click();
  await migrated.locator('#backup-file').setInputFiles(backupPath);await migrated.locator('#backup-form [type="submit"]').click();
  await migrated.waitForFunction(()=>JSON.parse(localStorage.getItem('zin-studio-v2')||'{}').exams?.length===1);
  const data=await migrated.evaluate(()=>JSON.parse(localStorage.getItem('zin-studio-v2')));assert.equal(data.documents.length,3);assert(Object.values(data.notes).includes('A personal source reflection.'));
  const missing=await migrated.evaluate(async id=>{const {getFile}=await import('./documents.js');return await getFile(id);},data.documents[0].id);assert.equal(missing,undefined);
  await fresh.close();await page.keyboard.press('Escape');
 });
 await check('mobile layout, desktop layout and local asset requests are valid',async()=>{
  await open();
  for(const width of [390,768,1366]){await page.setViewportSize({width,height:950});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  await page.screenshot({path:resolve(import.meta.dirname,'../.preview/desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:resolve(import.meta.dirname,'../.preview/mobile.png'),fullPage:true});
  assert.deepEqual(apiRequests,[]);assert.deepEqual(localFailures,[]);assert.deepEqual(errors,[]);
 });
 await context.close();
}finally{
 await browser?.close();server.closeAllConnections();await new Promise(accept=>server.close(accept));
 await writeFile(resolve(import.meta.dirname,'../.preview/qa.json'),JSON.stringify({results,errors,apiRequests,localFailures},null,2));
}
if(results.some(result=>!result.pass))process.exitCode=1;
