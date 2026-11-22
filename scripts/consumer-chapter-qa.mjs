import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';
const {server,url}=await startServer({port:0,basePath:'/ZIN/'});
let browser;
try{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'consumer-behavior/index.html#home');
 await page.locator('.sidebar-brand').waitFor();
 assert.equal(await page.locator('.chapter-content').count(),0);
 assert(await page.locator('.dashboard-chapters').count(),'Original dashboard is missing');
 await page.screenshot({path:'consumer-original-home.png',fullPage:true});
 await page.goto(url+'consumer-behavior/index.html#chapter/1');
 await page.locator('.grid [data-lesson="0"]').waitFor();
 assert.equal(await page.locator('.grid [data-lesson]').count(),5);
 await page.locator('.grid [data-lesson="0"]').click();await page.locator('.learn-reference summary').click();await page.locator('[data-full-lesson]').click();
 await page.locator('#note').fill('Buyer and consumer can differ.');
 await page.locator('[data-complete]').click();
 await page.reload();await page.locator('.grid [data-lesson="0"]').click();await page.locator('.learn-reference summary').click();await page.locator('[data-full-lesson]').click();
 assert.equal(await page.locator('#note').inputValue(),'Buyer and consumer can differ.');
 await page.locator('[data-tab="practice"]').first().click();
 for(const game of ['gap','match','shoot']){
  await page.locator('[data-game="'+game+'"]').first().click();
  await page.locator('#clock').waitFor();
  if(game==='gap')for(const answer of ['dynamic','place','lifestyle','self-concept','promotion']){await page.locator('#gap input').fill(answer);await page.locator('#gap button').click()}
  if(game==='match')for(const n of [0,1,2,3,4]){await page.locator('[data-left="'+n+'"]').click();await page.locator('[data-right="'+n+'"]').click()}
  if(game==='shoot')for(const n of [0,1,2,3,4])await page.locator('[data-shot="'+n+'"]').click();
  assert.match(await page.locator('#play').innerText(),/5\/5/);
 }
 await page.locator('[data-tab="exam"]').first().click();await page.locator('#begin-exam').click();
 assert.equal(await page.locator('#exam-form section').count(),10);
 await page.locator('#submit-exam').click();assert.match(await page.locator('#result').innerText(),/0\/8/);
 await page.locator('[data-tab="learn"]').first().click();
 await page.screenshot({path:'consumer-chapter-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'consumer-chapter-mobile.png',fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile overflow: '+await page.evaluate(()=>JSON.stringify([...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>[e.tagName,e.className,Math.round(e.getBoundingClientRect().right)]).slice(0,18))));
 await page.screenshot({path:'consumer-chapter-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: existing /ZIN/consumer-behavior path, lessons, persistence, all games, exam, mobile layout, no browser errors');
}finally{await browser?.close();await new Promise(r=>server.close(r))}
