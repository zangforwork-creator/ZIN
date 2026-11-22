import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {startServer} from './serve.mjs';
const catalog=JSON.parse(await readFile(new URL('../consumer-behavior/data/concept-learning.json',import.meta.url),'utf8'));
const qs=new Map(catalog.concepts.flatMap(c=>c.questions.map(q=>[q.id,q])));
const {server,url}=await startServer({port:0,basePath:'/ZIN/'});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const key='zin-cb-journey-v1';
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const state=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)).conceptLearning,key);
 await page.goto(url+'consumer-behavior/index.html#exam');await page.locator('[data-cl-exam]').waitFor();assert(await page.locator('[data-cl-exam]').isDisabled());
 await page.goto(url+'consumer-behavior/library.html#module/3');await page.locator('[data-cl-start]').waitFor();assert.match(await page.locator('.concept-card h2').innerText(),/Customer vs consumer/);
 await page.locator('[data-cl-start]').click();
 assert.equal(await page.locator('.concept-question .feedback').count(),0,'Answer must not be revealed before an attempt');
 async function answer(correct=true){const s=await state(),q=s.active.items?.find(x=>x.id===s.active.ids[s.active.index])||qs.get(s.active.ids[s.active.index]);if(q.written){await page.locator('[name=written]').fill('The consumer evaluates benefits and non-monetary costs in context. A comparison group is needed for an effect claim.')}else if(q.steps){for(let i=0;i<q.steps.length;i++)await page.locator('[name=order'+i+']').selectOption(q.steps[i])}else if(q.answers)await page.locator('[name=gap]').fill(correct?q.answers[0]:'unrelated term');else await page.locator('input[name=answer][value="'+(correct?q.correct:(q.correct+1)%q.options.length)+'"]').check();await page.locator('#concept-answer button').click();await page.locator('[data-cl-next]').click()}
 await answer(false);assert((await state()).attempts.some(a=>!a.correct));
 for(let i=0;i<3;i++)await answer();
 assert(await page.locator('[data-cl-start]').count());assert.equal(await page.locator('.concept-card h2').innerText(),catalog.concepts[1].term);
 await page.reload();await page.locator('[data-cl-start]').waitFor();assert.equal((await state()).attempts.length,4);
 for(let n=0;n<2;n++){await page.locator('[data-cl-start]').click();for(let i=0;i<3;i++)await answer()}
 await page.locator('[data-cl-game]').waitFor();assert.equal((await state()).learned.length,3);
 await page.locator('[data-cl-game]').click();assert.match(await page.locator('.concept-question').innerText(),/INTERLEAVED GAME/);
 await answer(false);assert.match(await page.locator('.concept-card').innerText(),/explain it another way/);
 const download=page.waitForEvent('download');await page.locator('[data-cl-export]').click();const path=await (await download).path();
 const fresh=await browser.newContext(),restored=await fresh.newPage();await restored.goto(url+'consumer-behavior/index.html#chapter/1');await restored.locator('[data-cl-import]').setInputFiles(path);await restored.waitForFunction(k=>JSON.parse(localStorage.getItem(k)).conceptLearning.attempts.length>=10,key);await fresh.close();
 // Exercise the final exam with prepared independent evidence, without UI bypass flags.
 await page.evaluate(async({catalog,key})=>{const m=await import('./adaptive-state.js?v=20261123-concepts1');const s=m.freshLearning();for(const c of catalog.concepts){s.learned.push(c.id);for(const q of c.questions.slice(0,3))m.addEvidence(s,q,{correct:true})}s.gameBatches=Array.from({length:12},(_,i)=>i+1);const j=JSON.parse(localStorage.getItem(key));j.conceptLearning=s;localStorage.setItem(key,JSON.stringify(j))},{catalog,key});
 await page.reload();
 await page.goto(url+'consumer-behavior/index.html#exam');await page.locator('[data-cl-exam]').click();
 for(let i=0;i<catalog.concepts.length+2;i++)await answer(i>=7);
 const finished=await state();assert.equal(finished.examAttempts.length,1);assert(finished.examAttempts[0].passed);assert.equal(finished.examAttempts[0].score,0.8);
 await page.goto(url+'consumer-behavior/index.html#chapter/2');await page.getByText('UNLOCKED SOURCE OVERVIEW',{exact:false}).waitFor();
 await page.goto(url+'consumer-behavior/index.html#chapter/1');await page.locator('.concept-card').waitFor();assert.match(await page.locator('.concept-card').innerText(),/explain it another way/);
 // A due review blocks the final exam and updates the same concept history.
 await page.evaluate(async({catalog,key})=>{const m=await import('./adaptive-state.js?v=20261123-concepts1');const s=m.freshLearning();for(const c of catalog.concepts){s.learned.push(c.id);for(const q of c.questions.slice(0,3))m.addEvidence(s,q,{correct:true,at:Date.now()-2*m.DAY})}s.gameBatches=Array.from({length:12},(_,i)=>i+1);const j=JSON.parse(localStorage.getItem(key));j.conceptLearning=s;localStorage.setItem(key,JSON.stringify(j))},{catalog,key});
 await page.reload();
 await page.goto(url+'consumer-behavior/index.html#exam');await page.locator('[data-cl-exam]').waitFor();assert(await page.locator('[data-cl-exam]').isDisabled());
 await page.goto(url+'consumer-behavior/index.html#review');await page.locator('[data-cl-start]').click();await answer();
 assert((await state()).attempts.some(a=>a.activity==='review'));
 await page.evaluate(async({catalog,key})=>{const m=await import('./adaptive-state.js?v=20261123-concepts1');const s=m.freshLearning();for(const c of catalog.concepts){s.learned.push(c.id);for(const q of c.questions.slice(0,3))m.addEvidence(s,q,{correct:true})}s.gameBatches=Array.from({length:12},(_,i)=>i+1);const j=JSON.parse(localStorage.getItem(key));j.conceptLearning=s;localStorage.setItem(key,JSON.stringify(j))},{catalog,key});
 await page.reload();
 await page.goto(url+'consumer-behavior/index.html#exam');await page.locator('[data-cl-exam]').click();for(let i=0;i<catalog.concepts.length+2;i++)await answer(i>=8);
 assert(!(await state()).examAttempts[0].passed);
 await page.goto(url+'consumer-behavior/index.html#chapter/2');await page.getByRole('heading',{name:'Chapter 2 ? Locked'}).waitFor();
 await page.goto(url+'consumer-behavior/index.html#chapter/1');await page.locator('.concept-card').waitFor();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 console.log('PASS: gated concept cards, 3-item checks, immediate remediation, interleaving, classic route gates, persistence, unified backup, balanced exam, 80% pass, chapter unlock and mobile.');
}finally{await browser.close();await new Promise(r=>server.close(r))}
