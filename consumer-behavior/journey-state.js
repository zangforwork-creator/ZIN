import {freshLearning,checkedLearning,mergeLearning} from './adaptive-state.js?v=20261123-concepts1';
import {schedule} from './core.js';
import {checkedWritten,mergeWritten} from './meaning-state.js';
import {freshExam,validateExam,mergeExam} from './exam-state.js';
export const JOURNEY_KEY='zin-cb-journey-v1';
export const freshJourney=()=>({version:1,chapters:{},rewards:{},activityDays:[],preferences:{vi:false,collapsed:false},session:null,conceptLearning:freshLearning(),exam:freshExam()});
export const newChapter=()=>({step:0,completed:[],hook:null,modelAnswers:{},modelIndex:0,conceptIndex:0,conceptAnswers:{},caseAnswers:{},games:{},recall:{},badge:false});
const safeKey=k=>/^[a-zA-Z0-9:_-]{1,140}$/.test(k)&&!['__proto__','constructor','prototype'].includes(k);
const dict=value=>Object.fromEntries(Object.entries(value&&typeof value==='object'&&!Array.isArray(value)?value:{}).filter(([k])=>safeKey(k)));
const integer=(value,max=100000)=>Number.isInteger(value)?Math.max(0,Math.min(max,value)):0;
const answers=value=>Object.fromEntries(Object.entries(dict(value)).map(([id,a])=>[id,{selected:integer(a?.selected,50),correct:a?.correct===true}]));
const text=(value,max)=>typeof value==='string'?value.slice(0,max):'';
function checkedGame(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid game progress in backup.');
 return {answers:answers(input.answers),selected:typeof input.selected==='string'&&safeKey(input.selected)?input.selected:null,order:Array.isArray(input.order)?[...new Set(input.order.filter(x=>typeof x==='string'&&safeKey(x)))].slice(0,30):[],complete:input.complete===true,streak:integer(input.streak),bestStreak:integer(input.bestStreak),hints:integer(input.hints),hintOpen:input.hintOpen===true,feedback:text(input.feedback,2000),positive:input.positive===true,index:integer(input.index,60),revealed:input.revealed===true,timed:input.timed===true,elapsedMs:integer(input.elapsedMs,86400000),response:text(input.response,500),...(input.written?{written:checkedWritten(input.written)}:{})};
}
export function validateJourney(value){
 if(!value||value.version!==1||JSON.stringify(value).length>6000000)throw Error('Choose a valid Consumer Behavior journey backup under 6 MB.');
 const next=freshJourney();
 for(const [id,input] of Object.entries(dict(value.chapters))){
  if(!/^(?:[1-9]|1[0-9]|20|10[1-5])$/.test(id)||!input||typeof input!=='object')continue;
  const c=newChapter();c.step=integer(input.step,6);c.modelIndex=integer(input.modelIndex,30);c.conceptIndex=integer(input.conceptIndex,30);c.completed=[...new Set((Array.isArray(input.completed)?input.completed:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<=6))];
  for(const k of ['modelAnswers','conceptAnswers','caseAnswers','practiceAnswers'])c[k]=answers(input[k]);
  c.games=Object.fromEntries(Object.entries(dict(input.games)).map(([id,g])=>[id,checkedGame(g)]));c.recall=dict(input.recall);
  c.hook=Number.isInteger(input.hook)?input.hook:null;c.badge=!!input.badge;next.chapters[id]=c;
 }
 for(const [key,reward] of Object.entries(dict(value.rewards)))if(reward&&Number.isInteger(reward.xp)&&reward.xp>0&&reward.xp<=50&&/^\d{4}-\d{2}-\d{2}$/.test(reward.day))next.rewards[key]={xp:reward.xp,day:reward.day};
 next.activityDays=[...new Set((Array.isArray(value.activityDays)?value.activityDays:[]).filter(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)))].sort();
 next.preferences={vi:!!value.preferences?.vi,collapsed:!!value.preferences?.collapsed};
 if(value.session&&typeof value.session.id==='string'&&safeKey(value.session.id)&&Array.isArray(value.session.ids)&&value.session.ids.length<=100&&value.session.ids.every(id=>/^c(?:[1-9]|1\d|20)-[1-9]\d?$/.test(id)))next.session={id:value.session.id,ids:[...new Set(value.session.ids)],index:integer(value.session.index,value.session.ids.length),records:Object.fromEntries(Object.entries(dict(value.session.records)).map(([id,r])=>[id,{response:text(r?.response,5000),revealed:r?.revealed===true,hint:r?.hint===true,saved:r?.saved===true}])),lessonId:integer(value.session.lessonId,105)};
 next.conceptLearning=checkedLearning(value.conceptLearning);next.exam=validateExam(value.exam);
 return next;
}
export const localDay=(now=Date.now())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
export function recordActivity(state,now=Date.now()){const day=localDay(now);if(!state.activityDays.includes(day))state.activityDays.push(day);}
export function award(state,id,xp,now=Date.now()){
 if(!safeKey(id)||!Number.isInteger(xp)||xp<1||xp>50)throw Error('Invalid learning reward.');
 if(Object.hasOwn(state.rewards,id))return false;
 const day=localDay(now);state.rewards[id]={xp,day};recordActivity(state,now);return true;
}
export const totalXP=state=>Object.values(state.rewards).reduce((n,r)=>n+r.xp,0);
export const level=state=>Math.floor(totalXP(state)/150)+1;
export function weeklyActivity(state,now=Date.now()){
 const today=localDay(now),mid=Date.parse(today+'T12:00:00Z');return Array.from({length:7},(_,i)=>{const day=new Date(mid-(6-i)*86400000).toISOString().slice(0,10);return {day,active:state.activityDays.includes(day)};});
}
export function dailyStreak(state,now=Date.now()){
 const today=localDay(now),days=new Set(state.activityDays);let cursor=Date.parse(today+'T12:00:00Z'),count=0;if(!days.has(today))cursor-=86400000;
 while(days.has(new Date(cursor).toISOString().slice(0,10))){count++;cursor-=86400000;}return count;
}
export function reviewSchedules(progress,interactiveIds){
 const result={},ids=new Set(interactiveIds);
 for(const attempt of [...progress.attempts].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)))result[attempt.conceptId]=schedule(result[attempt.conceptId],attempt,ids.has(attempt.conceptId)?[1,3,7,14]:[1,3,7,14,30]);
 return result;
}
export function mergeJourney(current,incoming){
 const a=validateJourney(current),b=validateJourney(incoming);
 a.rewards={...b.rewards,...a.rewards};a.activityDays=[...new Set([...a.activityDays,...b.activityDays])].sort();
 if(!a.session)a.session=b.session;
 a.conceptLearning=mergeLearning(a.conceptLearning,b.conceptLearning);a.exam=mergeExam(a.exam,b.exam);
 for(const [id,other] of Object.entries(b.chapters)){
  if(!a.chapters[id]){a.chapters[id]=other;continue;}
  const c=a.chapters[id];c.completed=[...new Set([...c.completed,...other.completed])];c.badge=c.badge||other.badge;
  for(const key of ['modelAnswers','conceptAnswers','caseAnswers','practiceAnswers','games','recall'])c[key]={...other[key],...c[key]};
  for(const [key,game]of Object.entries(c.games))if(other.games[key]?.written)game.written=game.written?mergeWritten(game.written,other.games[key].written):checkedWritten(other.games[key].written);
 }
 return validateJourney(a);
}
export function reconcileJourney(state,progress,data){
 for(const chapter of data.chapters.filter(c=>c.status==='available')){
  const c=state.chapters[chapter.id];if(!c)continue;
  c.modelIndex=Math.min(c.modelIndex,chapter.model.nodes.length-1);c.conceptIndex=Math.min(c.conceptIndex,chapter.concepts.length-1);
  if(c.hook!==null&&(c.hook<0||c.hook>=chapter.hook.options.length))c.hook=null;
  for(const [field,specs] of [['modelAnswers',Object.fromEntries(chapter.model.nodes.map(n=>[n.id,n.quiz]))],['conceptAnswers',Object.fromEntries(chapter.concepts.map(n=>[n.id,n.activity]))],['caseAnswers',Object.fromEntries(chapter.case.rounds.map((q,i)=>[i,q]))]]){
   c[field]=Object.fromEntries(Object.entries(c[field]).filter(([key,a])=>specs[key]&&Number.isInteger(a.selected)&&a.selected>=0&&a.selected<specs[key].options.length).map(([key,a])=>[key,{selected:a.selected,correct:a.selected===specs[key].correct}]));
  }
 }
 const s=state.session;
 if(s){
  for(const id of s.ids){
   const r=s.records[id];if(!r)continue;
   const attempt=progress.attempts.find(a=>a.id==='j-'+s.id+'-'+id);r.saved=!!attempt;if(attempt){r.revealed=true;r.response=attempt.response;r.hint=attempt.hintUsed;}
  }
 }
 return state;
}
