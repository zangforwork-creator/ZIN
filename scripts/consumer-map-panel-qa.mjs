import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';
const {server,url}=await startServer({port:0,basePath:'/ZIN/'});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'consumer-behavior/index.html#chapter/1/learn');
 await page.locator('.learn-card-image').first().waitFor();
 assert.equal(await page.locator('.learn-card-image').count(),5);
 for(const img of await page.locator('.learn-card-image').all())await img.evaluate(x=>x.decode());
 assert(await page.locator('.learn-story .learn-illustration img').evaluate(x=>Math.abs(x.getBoundingClientRect().width-x.closest('figure').getBoundingClientRect().width)<1));
 assert.equal(await page.locator('.map-variable-icon').count(),7);
 const titles=['External influences','Self-concept & lifestyle','Internal influences','Customer value','Consumer process','Consumption meaning','Marketing strategy'];
 for(const [i,node] of (await page.locator('[data-map-variable]').all()).entries()){
  await node.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#map-inspector-title').innerText(),titles[i]);
  assert.match(await page.locator('.learn-map-inspector').innerText(),/Hypothetical/);
  await page.keyboard.press('Escape');assert(await page.locator('.learn-map-inspector').isHidden());
 }
 const relationships=new Set();
 for(let i=0;i<8;i++){
  await page.locator('[data-map-edge="'+i+'"]').focus();await page.keyboard.press('Enter');
  relationships.add(await page.locator('#map-inspector-title').innerText());
  assert.match(await page.locator('.learn-map-inspector').innerText(),/RELATIONSHIP/);
  await page.locator('[data-map-close]').click();
 }
 assert.equal(relationships.size,8);
 await page.locator('[data-map-edge="0"] .edge-label').click();
 await page.locator('.learn-map-inspector').waitFor();
 await page.locator('.learn-linked-map').screenshot({path:'consumer-map-panel-desktop.png'});
 await page.locator('[data-map-close]').click();
 await page.locator('[data-map-variable="internal"]').click();assert.equal(await page.locator('.learn-map-inspector').getAttribute('data-side'),'left');
 await page.locator('[data-map-close]').click();
 await page.setViewportSize({width:390,height:844});
 await page.locator('[data-map-variable="external"]').focus();await page.keyboard.press('Enter');
 const box=await page.locator('.learn-map-inspector').boundingBox();assert(box.x>=0&&box.x+box.width<=390,'Panel exceeds mobile viewport');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('.learn-linked-map').screenshot({path:'consumer-map-panel-mobile.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS: five illustrated cards, compact hero, seven icons, seven variable panels, eight distinct relationship panels, pointer and keyboard selection, close/escape and mobile fit.');
}finally{await browser.close();await new Promise(r=>server.close(r))}
