import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../consumer-behavior/data/concept-learning.json',import.meta.url)));
test('all 35 concepts have Vietnam examples, misconceptions and source-tagged variant pools',()=>{const ids=new Set();assert.equal(data.concepts.length,35);for(const c of data.concepts){assert(c.definition&&c.example&&c.misconception&&c.alternative);assert(c.sourcePages.length&&c.sourceSlide.length);assert(c.questions.length>=5);for(const q of c.questions){assert(!ids.has(q.id));ids.add(q.id);assert.equal(q.conceptId,c.id);assert.equal(q.LO,c.LO);assert(q.sourcePages.length&&q.sourceSlide.length);assert.equal(q.type,'mc');assert(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.options.length);assert(q.explanation)}}});
