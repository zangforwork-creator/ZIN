import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {cleanEdition,fetchEdition,cachedEdition,safeSource,dailyCase} from '../reading.js';
const seed=JSON.parse(await readFile(new URL('../data/reading-seed.json',import.meta.url),'utf8'));

test('saved reading keeps source dates, case provenance and safe outbound links',()=>{
 const value=cleanEdition(seed);
 assert(value.items.length>0);assert.equal(value.caseStudies.length,5);
 assert.equal(value.updatedAt,seed.updatedAt);
 assert(value.items.every(item=>item.url.startsWith('https://')));
 assert.equal(safeSource('javascript:alert(1)'), '');
 assert.equal(safeSource('https://vnexpress.net.evil.example/article'),'');
 assert.equal(safeSource('https://user:pass@vnexpress.net/article'),'');
 assert(seed.caseStudies.some(item=>!item.date));
});

test('reading loads a relative static file and retains its cached copy after a failed reload',async(t)=>{
 const originalFetch=globalThis.fetch,originalStorage=globalThis.localStorage,stored=new Map();
 globalThis.localStorage={getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)};
 t.after(()=>{globalThis.fetch=originalFetch;if(originalStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=originalStorage;});
 globalThis.fetch=async(url)=>{assert.equal(String(url),new URL('../data/reading-seed.json',import.meta.url).href);return Response.json(seed);};
 const downloaded=await fetchEdition();
 assert.deepEqual(cachedEdition().items,downloaded.items);
 globalThis.fetch=async()=>new Response('Unavailable',{status:503});
 await assert.rejects(fetchEdition(),/saved reading library/);
 assert.deepEqual(cachedEdition().items,downloaded.items);
 assert.equal(dailyCase(downloaded.caseStudies,0,new Date('2026-11-19T10:00:00Z')).id,dailyCase(downloaded.caseStudies,0,new Date('2026-11-19T10:00:00Z')).id);
});
