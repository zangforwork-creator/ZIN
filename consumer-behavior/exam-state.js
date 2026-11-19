import {schedule} from './core.js';
const safe=v=>typeof v==='string'&&/^[a-zA-Z0-9:_-]{1,150}$/.test(v)&&!['__proto__','constructor','prototype'].includes(v);
const dict=v=>Object.fromEntries(Object.entries(v&&typeof v==='object'&&!Array.isArray(v)?v:{}).filter(([k])=>safe(k)));
const text=(v,max=6000)=>typeof v==='string'?v.slice(0,max):'';
const bounded=(v,max)=>Number.isInteger(v)?Math.max(0,Math.min(max,v)):0;
export const freshExam=()=>({version:1,attempts:[],session:null,book:{},tab:'practice',lastModule:101,tools:{satisfaction:{expected:5,delivered:5,minimum:5},segments:{product:'',names:['','',''],scores:{},other:''}}});
export function checkedRecord(v={}){return {selected:Number.isInteger(v.selected)&&v.selected>=0&&v.selected<50?v.selected:null,response:text(v.response),matches:Object.fromEntries(Object.entries(dict(v.matches)).filter(([,n])=>Number.isInteger(n)&&n>=0&&n<50)),rubric:(Array.isArray(v.rubric)?v.rubric:[]).slice(0,20).map(x=>x===true),revealed:v.revealed===true,hint:v.hint===true,early:v.early===true,saved:v.saved===true,attemptId:safe(v.attemptId)?v.attemptId:null};}
export function validateExam(v){
 if(!v)return freshExam();if(v.version!==1||JSON.stringify(v).length>3000000||!Array.isArray(v.attempts)||v.attempts.length>15000)throw Error('Invalid Chapter 1 exam backup. Original progress is preserved.');
 const s=freshExam();for(const a of v.attempts){if(!a||!safe(a.id)||!safe(a.questionId)||!/^c1-\d{1,2}$/.test(a.conceptId)||!Number.isInteger(a.lo)||a.lo<1||a.lo>5||!Number.isFinite(Date.parse(a.at))||typeof a.score!=='number'||a.score<0||a.score>1||!['objective','self-assessed','unanswered'].includes(a.basis))throw Error('Invalid exam attempt.');if(!s.attempts.some(x=>x.id===a.id))s.attempts.push({id:a.id,questionId:a.questionId,conceptId:a.conceptId,lo:a.lo,type:text(a.type,30),at:a.at,score:a.score,basis:a.basis,assisted:!!a.assisted,response:text(a.response),sessionId:safe(a.sessionId)?a.sessionId:'imported'});}
 if(v.session&&safe(v.session.id)&&Array.isArray(v.session.ids)&&v.session.ids.length<=150&&v.session.ids.every(safe)){const t=v.session;s.session={id:t.id,ids:[...new Set(t.ids)],index:bounded(t.index,t.ids.length),kind:['practice','simulator','weak'].includes(t.kind)?t.kind:'practice',records:Object.fromEntries(Object.entries(dict(t.records)).map(([id,r])=>[id,checkedRecord(r)])),timed:!!t.timed,paused:!!t.paused,elapsedMs:bounded(t.elapsedMs,86400000),limitMs:bounded(t.limitMs,86400000),finished:!!t.finished,filterLO:bounded(t.filterLO,5),requested:bounded(t.requested,150)};}
 s.book=Object.fromEntries(Object.entries(dict(v.book)).map(([id,r])=>[id,checkedRecord(r)]));s.tab=['practice','simulator','textbook','compare','mistakes','coverage'].includes(v.tab)?v.tab:'practice';s.lastModule=[101,102,103,104,105].includes(v.lastModule)?v.lastModule:101;
 const tools=v.tools||{},sat=tools.satisfaction||{};s.tools.satisfaction=Object.fromEntries(['expected','delivered','minimum'].map(k=>[k,typeof sat[k]==='number'&&sat[k]>=0&&sat[k]<=10?sat[k]:5]));
 const seg=tools.segments||{};s.tools.segments={product:text(seg.product,150),names:Array.from({length:3},(_,i)=>text(seg.names?.[i],100)),other:text(seg.other,100),scores:Object.fromEntries(Object.entries(dict(seg.scores)).filter(([key])=>/^r\d{1,2}$/.test(key)).map(([key,row])=>[key,Array.from({length:3},(_,i)=>Number.isInteger(row?.[i])&&row[i]>=1&&row[i]<=10?row[i]:null)]))};return s;
}
export function mergeExam(current,incoming){const a=validateExam(current),b=validateExam(incoming);a.attempts=[...new Map([...b.attempts,...a.attempts].map(x=>[x.id,x])).values()];a.book={...b.book,...a.book};if(!a.session)a.session=b.session;if(!a.tools.segments.product&&!Object.keys(a.tools.segments.scores).length)a.tools=b.tools;return a;}
export function gradeQuestion(q,r){
 if(q.type==='mc'||q.type==='scenario')return r.selected===q.correct?1:0;
 if(q.type==='tf')return r.selected===(q.correct?0:1)?1:0;
 if(q.type==='matching')return q.pairs.reduce((n,p,i)=>n+(r.matches[p.id]===i?1:0),0)/q.pairs.length;
 if(!r.response.trim())return 0;return q.rubric.reduce((n,_,i)=>n+(r.rubric[i]?1:0),0)/q.rubric.length;
}
export function recordExam(s,q,r,sessionId,now=Date.now()){
 const id=r.attemptId||'exam-'+sessionId+'-'+q.id;if(s.attempts.some(a=>a.id===id)){r.saved=true;return false;}
 const written=['short','essay','flashcard','application'].includes(q.type),score=gradeQuestion(q,r),basis=written?'self-assessed':'objective',response=written?r.response:q.type==='matching'?JSON.stringify(r.matches):String(r.selected??'');
 s.attempts.push({id,questionId:q.id,conceptId:q.conceptId,lo:q.lo,type:q.type,at:new Date(now).toISOString(),score,basis,assisted:!!(r.hint||r.early||(written&&!r.response.trim())),response,sessionId});r.attemptId=id;r.saved=true;return true;
}
export function questionReviews(s){const map={};for(const a of [...s.attempts].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at))){const prior=map[a.questionId],converted={at:a.at,result:a.score===1?'good':a.score===0?'again':'hard',response:a.response,hintUsed:a.assisted,answerBeforeRecall:a.basis==='unanswered'};const next=schedule(prior,converted,[1,3,7,14]);map[a.questionId]={...next,questionId:a.questionId,conceptId:a.conceptId,lo:a.lo,unresolved:a.score<1||a.assisted};}return map;}
export function evidenceFor(s,filter,minimum=5){
 const all=s.attempts.filter(filter),objective=all.filter(a=>a.basis==='objective'&&!a.assisted).slice(-20),unique=new Set(objective.map(a=>a.questionId)).size,accuracy=objective.length?objective.reduce((n,a)=>n+a.score,0)/objective.length:null,written=all.some(a=>a.basis==='self-assessed'&&!a.assisted&&a.response.trim());
 const status=!all.length?'Not started':unique<minimum?'Learning':accuracy>=.8&&written?'Exam-ready':accuracy>=.7?'Strong':'Learning';return {status,accuracy,unique,minimum,written,attempts:all.length,objective:objective.length,selfAssessed:all.filter(a=>a.basis==='self-assessed').length};
}
export function examReadiness(s){const los=Array.from({length:5},(_,i)=>({lo:i+1,...evidenceFor(s,a=>a.lo===i+1)}));return {los,eligible:los.every(l=>l.status==='Exam-ready')};}
export function rankSegments(scores,criteriaCount){
 const rows=Array.from({length:3},(_,segment)=>{const values=Array.from({length:criteriaCount},(_,i)=>scores['r'+i]?.[segment]);const complete=values.every(v=>Number.isInteger(v)&&v>=1&&v<=10);return {segment,complete,count:values.filter(v=>v!==null&&v!==undefined).length,total:complete?values.reduce((a,b)=>a+b,0):null,average:complete?values.reduce((a,b)=>a+b,0)/criteriaCount:null};});
 const completed=rows.filter(r=>r.complete);for(const row of completed)row.rank=1+completed.filter(other=>other.total>row.total).length;return rows;
}
export function satisfactionState({expected,delivered,minimum}){return delivered<minimum?'Needs not adequately met':delivered<expected?'Delivery below expectations':'Conditions for satisfaction met in this illustration';}
export function reconcileExam(s,bank){
 const known=new Set([...bank.questions,...bank.textbook].map(q=>q.id));
 if(s.session){const session=s.session;session.ids=session.ids.filter(id=>known.has(id));session.index=Math.min(session.index,session.ids.length);if(!session.ids.length)s.session=null;else for(const [qid,r]of Object.entries(session.records)){const attempt=s.attempts.find(a=>a.id===r.attemptId&&a.questionId===qid&&a.sessionId===session.id);r.saved=!!attempt;if(attempt)r.revealed=true;}}
 for(const [qid,r]of Object.entries(s.book)){if(!qid.startsWith('tb1-'))continue;const attempt=s.attempts.find(a=>a.id===r.attemptId&&a.questionId===qid);r.saved=!!attempt;if(attempt)r.revealed=true;}return s;
}
