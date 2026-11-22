import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';
const {server,url}=await startServer({port:0,basePath:'/ZIN/'});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const page=await browser.newPage();let staleRequests=0;
 await page.route('**/consumer-behavior/chapter-one.js',route=>{staleRequests++;return route.fulfill({contentType:'text/javascript',body:"throw Error('stale standalone module')"})});
 await page.route('**/consumer-behavior/chapter-one.css',route=>{staleRequests++;return route.fulfill({contentType:'text/css',body:'body{display:none}'})});
 await page.goto(url+'consumer-behavior/index.html#home');
 await page.locator('.dashboard-chapters').waitFor();assert.equal(staleRequests,0);
 await page.goto(url+'consumer-behavior/index.html#chapter/1');await page.locator('[data-lesson="0"]').waitFor();
 await page.close();
 const failed=await browser.newPage();
 await failed.route('**/journey-app.js?*',r=>r.abort());
 await failed.goto(url+'consumer-behavior/index.html#home');
 await failed.getByRole('button',{name:'Retry loading'}).waitFor();
 assert.match(await failed.locator('#app').innerText(),/saved progress has been kept/);
 console.log('PASS: stale standalone assets are bypassed; home and chapter open; module failure shows recovery instead of an infinite loading screen.');
}finally{await browser.close();await new Promise(r=>server.close(r))}
