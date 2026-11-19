export const KEY='zin-consumer-lab-v1',DAY=86400000;
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fresh=()=>({version:1,sourceHash:'cd079cb9c064cac8',studied:[],attempts:[],games:[],notes:{},bookmarks:{},lastChapter:1,consent:false});
const safeId=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,150}$/.test(value)&&!['__proto__','prototype','constructor'].includes(value);
export function validateState(value){
 if(!value||value.version!==1||value.sourceHash!=='cd079cb9c064cac8')throw Error('This backup belongs to a different subject or source version. Your current data has not changed.');
 for(const key of ['studied','attempts','games'])if(!Array.isArray(value[key])||value[key].length>30000)throw Error('Data '+key+' is invalid.');
 const state=fresh();state.studied=[...new Set(value.studied.filter(safeId))];
 for(const kind of ['attempts','games']){
  for(const item of value[kind]){
   if(!item||!safeId(item.id)||!safeId(item.conceptId)||!Number.isFinite(Date.parse(item.at))||!['again','hard','good'].includes(item.result)||typeof item.response!=='string'||item.response.length>6000)throw Error('Invalid learning history.');
   if(!state[kind].some(a=>a.id===item.id))state[kind].push({id:item.id,conceptId:item.conceptId,at:item.at,result:item.result,response:item.response,hintUsed:!!item.hintUsed,answerBeforeRecall:!!item.answerBeforeRecall});
  }
 }
 for(const key of ['notes','bookmarks']){
  if(!value[key]||typeof value[key]!=='object'||Array.isArray(value[key]))throw Error('Invalid notes.');
  state[key]=Object.fromEntries(Object.entries(value[key]).filter(([k,v])=>safeId(k)&&(key==='notes'?typeof v==='string'&&v.length<=20000:Number.isInteger(v)&&v>=1&&v<=833)));
 }
 state.lastChapter=Number.isInteger(value.lastChapter)&&value.lastChapter>=1&&value.lastChapter<=20?value.lastChapter:1;
 // Importing a backup never grants consent for a new external AI request.
 state.consent=false;return state;
}
export function addAttempt(state,item,kind='attempts'){
 if(!['attempts','games'].includes(kind))throw Error('Invalid activity type.');
 if(state[kind].some(a=>a.id===item.id))return false;
 if(!safeId(item.id)||!safeId(item.conceptId)||!['again','hard','good'].includes(item.result)||typeof item.response!=='string'||!Number.isFinite(Date.parse(item.at)))throw Error('Invalid result.');
 state[kind].push(item);return true;
}
export function schedule(previous,attempt,intervals=[1,3,7,14,30]){
 const at=Date.parse(attempt.at),assisted=attempt.hintUsed||attempt.answerBeforeRecall||!attempt.response.trim(),spaced=!previous||at-Date.parse(previous.lastReviewed)>=DAY;
 let stage=previous?.stage||0,evidence=previous?.evidence||0;
 if(attempt.result==='again'){stage=0;evidence=0;}else if(attempt.result==='hard'||assisted)stage=Math.max(0,stage-1);else if(spaced){stage=Math.min(intervals.length-1,previous?stage+1:0);evidence++;}
 stage=Math.min(stage,intervals.length-1);
 const interval=attempt.result==='again'||assisted?1:attempt.result==='hard'?Math.min(3,intervals[stage]):intervals[stage];
 return {lastReviewed:attempt.at,nextReview:new Date(at+interval*DAY).toISOString(),stage,interval,evidence,status:attempt.result==='again'?'needs reinforcement':'practicing'};
}
export function reviews(state){const result={};for(const item of [...state.attempts].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)))result[item.conceptId]=schedule(result[item.conceptId],item);return result;}
export function dueQueue(concepts,state,now=Date.now()){
 const dates=reviews(state);return concepts.filter(c=>!dates[c.id]||Date.parse(dates[c.id].nextReview)<=now).sort((a,b)=>{
  const x=dates[a.id],y=dates[b.id];if(x&&!y)return -1;if(!x&&y)return 1;return (Date.parse(x?.nextReview)||0)-(Date.parse(y?.nextReview)||0);
 });
}
export function metrics(state,concepts,now=Date.now()){
 const ids=new Set(concepts.map(c=>c.id)),dates=reviews(state),attempts=state.attempts.filter(a=>ids.has(a.conceptId));
 return {studied:state.studied.filter(id=>ids.has(id)).length,total:ids.size,attempts:attempts.length,independent:attempts.filter(a=>a.result==='good'&&!a.hintUsed&&!a.answerBeforeRecall&&a.response.trim()).length,evidence:Object.entries(dates).filter(([id,r])=>ids.has(id)&&r.evidence>=2).length,due:Object.entries(dates).filter(([id,r])=>ids.has(id)&&Date.parse(r.nextReview)<=now).length,newItems:concepts.filter(c=>!dates[c.id]).length,games:state.games.length};
}
export function mergeProgress(current,incoming){
 const next=structuredClone(current);next.studied=[...new Set([...current.studied,...incoming.studied])];
 for(const key of ['attempts','games'])next[key]=[...new Map([...incoming[key],...current[key]].map(a=>[a.id,a])).values()];
 next.notes={...incoming.notes,...current.notes};next.bookmarks={...incoming.bookmarks,...current.bookmarks};return validateState(next);
}
export function matchScore(pairs,selections){
 const keys=new Set(pairs.map(p=>p.id));if(Object.keys(selections).some(id=>!keys.has(id)))throw Error('Invalid matching pair.');
 return pairs.map(pair=>({id:pair.id,correct:selections[pair.id]===pair.id}));
}
