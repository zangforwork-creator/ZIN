export const DAY=86400000;
export const day=at=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));
export const freshLearning=()=>({version:2,learned:[],attempts:[],gameBatches:[],examAttempts:[],active:null,drafts:{}});
export function checkedLearning(value){
 if(value===undefined)return freshLearning();
 if(!value||value.version!==2||!Array.isArray(value.learned)||!Array.isArray(value.attempts)||value.attempts.length>10000||!Array.isArray(value.gameBatches)||!Array.isArray(value.examAttempts)||!value.drafts||typeof value.drafts!=='object')throw Error('Invalid concept-learning backup');
 const safe=/^[a-zA-Z0-9:_-]{1,160}$/;
 if(!value.learned.every(x=>typeof x==='string'&&safe.test(x))||!value.gameBatches.every(Number.isInteger))throw Error('Invalid concept list');
 for(const a of value.attempts)if(!a||!safe.test(a.id)||!safe.test(a.conceptId)||!safe.test(a.questionId)||!Number.isFinite(a.at)||!Number.isInteger(a.LO)||a.LO<1||a.LO>5||!Array.isArray(a.sourceSlide)||!a.sourceSlide.length||!a.sourceSlide.every(n=>Number.isInteger(n)&&n>0&&n<=62)||!Array.isArray(a.sourcePages)||!a.sourcePages.length||!a.sourcePages.every(n=>Number.isInteger(n)&&n>0)||!a.type||typeof a.correct!=='boolean'||typeof a.independent!=='boolean')throw Error('Invalid concept evidence');
 if(JSON.stringify(value).length>4500000)throw Error('Concept history is too large');
 const copy=JSON.parse(JSON.stringify(value),(k,v)=>['__proto__','constructor','prototype'].includes(k)?undefined:v);
 if(copy.active&&(!['check','game','exam'].includes(copy.active.kind)||!Array.isArray(copy.active.ids)||!copy.active.ids.every(id=>typeof id==='string'&&safe.test(id))||!Number.isInteger(copy.active.index)||copy.active.index<0||copy.active.index>copy.active.ids.length||!Array.isArray(copy.active.results)||(copy.active.kind==='exam'&&!Number.isFinite(copy.active.end))))throw Error('Invalid active learning session');
 for(const r of copy.examAttempts)if(!r||!safe.test(r.id)||!Number.isFinite(r.at)||!Number.isFinite(r.score)||r.score<0||r.score>1||!Number.isInteger(r.total)||r.total<1||!Array.isArray(r.results)||typeof r.passed!=='boolean'||r.passed!==(!r.expired&&r.score>=0.8))throw Error('Invalid exam report');
 return copy;
}
export function mergeLearning(current,incoming){const a=checkedLearning(current),b=checkedLearning(incoming);return checkedLearning({...a,learned:[...new Set([...a.learned,...b.learned])],attempts:[...new Map([...b.attempts,...a.attempts].map(x=>[x.id,x])).values()],examAttempts:[...new Map([...b.examAttempts,...a.examAttempts].map(x=>[x.id,x])).values()],gameBatches:[...new Set([...a.gameBatches,...b.gameBatches])],drafts:{...b.drafts,...a.drafts}})}
export function assess(state,id,now=Date.now()){
 const attempts=state.attempts.filter(a=>a.conceptId===id).sort((a,b)=>a.at-b.at||(a.sequence??0)-(b.sequence??0));
 let consecutiveCorrect=0,mastered=false,secure=false,nextReviewDate=null,reviewStage=0,lastQualification=null,lastQuestion=null,wrongCount=0;const distinct=new Set();
 for(const a of attempts){
  if(!a.correct){wrongCount++;consecutiveCorrect=0;mastered=false;secure=false;reviewStage=0;nextReviewDate=a.at+DAY;lastQualification=null;lastQuestion=null;continue}
  if(!a.independent||a.assisted||a.revealed)continue;
  distinct.add(a.questionId);if(lastQuestion!==a.questionId)consecutiveCorrect++;lastQuestion=a.questionId;
  if(!mastered&&consecutiveCorrect>=2&&distinct.size>=3){mastered=true;nextReviewDate=a.at+DAY;lastQualification=a.at}
  else if(mastered&&a.activity==='review'&&lastQualification!==null&&a.at>=nextReviewDate&&day(a.at)!==day(lastQualification)){
   secure=true;reviewStage=Math.min(3,reviewStage+1);nextReviewDate=a.at+[1,3,7,14][reviewStage]*DAY;lastQualification=a.at;
  }
 }
 const learned=state.learned.includes(id),status=wrongCount&&!mastered?'weak':secure?'secure':mastered?'provisional':learned?'learning':'unassessed';
 return {conceptId:id,learned,attempts:attempts.length,correctCount:attempts.filter(a=>a.correct).length,wrongCount,consecutiveCorrect,mastered,secure,status,nextReviewDate,reviewStage,due:nextReviewDate!==null&&nextReviewDate<=now,independentQuestions:distinct.size};
}
export function addEvidence(state,q,{correct,assisted=false,revealed=false,activity='lesson',at=Date.now(),id=crypto.randomUUID()}){
 if(!q.id||!q.conceptId||!q.LO||!q.type||!q.sourceSlide?.length||!q.sourcePages?.length)throw Error('Missing question metadata');
 if(state.attempts.some(a=>a.id===id))return false;
 // Feedback viewed earlier today makes a repeated item practice, not fresh evidence.
 const repeated=state.attempts.some(a=>a.questionId===q.id&&day(a.at)===day(at));
 state.attempts.push({id,sequence:state.attempts.length,questionId:q.id,conceptId:q.conceptId,LO:q.LO,type:q.type,sourceSlide:q.sourceSlide,sourcePages:q.sourcePages,correct,assisted,revealed,independent:!repeated&&!assisted&&!revealed,activity,at});return true;
}
export function eligibility(state,concepts,now=Date.now()){
 const blocked=concepts.map(c=>assess(state,c.id,now)).filter(c=>!c.mastered||c.due);
 return {eligible:concepts.length>0&&blocked.length===0,blocked};
}
export function chapterStatus(state,concepts,now=Date.now()){
 const rows=concepts.map(c=>assess(state,c.id,now));
 const latest=state.examAttempts.at(-1);
 if(rows.some(c=>c.status==='weak'))return 'Remediation';if(rows.some(c=>c.due))return 'Review due';if(latest?.passed)return 'Passed';
 if(eligibility(state,concepts,now).eligible)return 'Exam unlocked';return 'Learning';
}
