// Written game practice is self-assessed participation, separate from exam/recall evidence.
const keys=new Set(['claim','support','counter','conclusion','observation','meaning','alternative','ethics']);
const safe=value=>typeof value==='string'&&/^[a-zA-Z0-9:_-]{1,140}$/.test(value);
const drafts=value=>Object.fromEntries(Object.entries(value&&typeof value==='object'?value:{}).filter(([key])=>keys.has(key)).map(([key,text])=>[key,typeof text==='string'?text.slice(0,2000):'']));
const rubric=value=>(Array.isArray(value)?value:[]).slice(0,12).map(v=>v===true);
export const freshWritten=()=>({drafts:{},rubric:[],revealed:false,early:false,saved:false,attemptId:null,history:[]});
export function checkedWritten(value){
 if(!value)return freshWritten();
 if(typeof value!=='object'||Array.isArray(value)||!Array.isArray(value.history)||value.history.length>200)throw Error('Invalid written-practice backup. Current answers are preserved.');
 const history=[];
 for(const attempt of value.history){
  if(!attempt||!safe(attempt.id)||!Number.isFinite(Date.parse(attempt.at)))throw Error('Invalid saved reflection. Current answers are preserved.');
  const clean={id:attempt.id,at:new Date(attempt.at).toISOString(),drafts:drafts(attempt.drafts),rubric:rubric(attempt.rubric),assisted:attempt.assisted===true};
  if(Object.values(clean.drafts).filter(text=>text.trim()).length<4)throw Error('A saved reflection must contain its original four responses.');
  if(!history.some(a=>a.id===clean.id))history.push(clean);
 }
 const attemptId=safe(value.attemptId)?value.attemptId:null,saved=history.some(a=>a.id===attemptId);
 return {drafts:drafts(value.drafts),rubric:rubric(value.rubric),revealed:value.revealed===true||saved,early:value.early===true,saved,attemptId,history};
}
export const writtenComplete=(state,spec)=>spec.fields.every(f=>typeof state.drafts[f.id]==='string'&&state.drafts[f.id].trim());
export const writtenScore=(state,spec)=>spec.rubric.reduce((sum,_,i)=>sum+(state.rubric[i]===true?1:0),0);
export function revealWritten(state,spec){if(state.saved)return;state.early=state.early||!writtenComplete(state,spec);state.revealed=true;}
export function saveWritten(state,spec,{now=Date.now(),id=crypto.randomUUID(),hintUsed=false}={}){
 if(state.saved)return false;
 if(!writtenComplete(state,spec))throw Error('Write an answer in all four sections before saving. Your draft is kept.');
 if(!state.revealed)throw Error('Compare with the reference before saving your self-assessment.');
 if(state.history.length>=200)throw Error('This activity has reached 200 saved reflections. Export a backup to preserve your answers.');
 if(!safe(id)||!Number.isFinite(now))throw Error('Could not save this reflection. Your draft is kept.');
 if(state.history.some(a=>a.id===id))return false;
 state.attemptId=id;state.history.push({id,at:new Date(now).toISOString(),drafts:drafts(state.drafts),rubric:spec.rubric.map((_,i)=>state.rubric[i]===true),assisted:state.early||hintUsed});state.saved=true;return true;
}
export const replayWritten=state=>({...freshWritten(),history:checkedWritten(state).history});
export function mergeWritten(current,incoming){const a=checkedWritten(current),b=checkedWritten(incoming);a.history=[...new Map([...b.history,...a.history].map(item=>[item.id,item])).values()].sort((x,y)=>Date.parse(x.at)-Date.parse(y.at));return checkedWritten(a);}
