import {readFile,writeFile} from 'node:fs/promises';
const path='consumer-behaviour-lab/dist/lecture-companion.js';let js=await readFile(path,'utf8');
js=js.replace("let data,error='';", "let data,error='',submittedAt=-Infinity;");
js=js.replace("if(!b)return;\n  if(b.hasAttribute", "if(!b)return;if(event.detail>1&&performance.now()-submittedAt<450){event.preventDefault();return;}\n  if(b.hasAttribute");
js=js.replace("next.current[id]=attempt.id;}))refresh(id);", "next.current[id]=attempt.id;})){submittedAt=performance.now();refresh(id);}");
// Reject malformed supplementary backups before they can change current notes/history.
js=js.replace("const key='zin-'", "const valid=value=>value&&value.version===1&&value.course===course&&Array.isArray(value.attempts)&&value.attempts.length<=5000&&value.attempts.every(a=>a&&typeof a.id==='string'&&/^[-a-z0-9]{1,80}$/i.test(a.id)&&typeof a.sectionId==='string'&&Number.isInteger(a.selected)&&a.selected>=0&&a.selected<=2&&typeof a.correct==='boolean'&&Number.isFinite(Date.parse(a.at)))&&value.notes&&typeof value.notes==='object'&&!Array.isArray(value.notes)&&Object.entries(value.notes).every(([k,v])=>/^[a-z-]{1,50}$/.test(k)&&typeof v==='string'&&v.length<=12000)&&value.current&&typeof value.current==='object'&&!Array.isArray(value.current);\n const key='zin-'");
js=js.replace("if(value.version!==1||value.course!==course||!Array.isArray(value.attempts)||!value.notes||!value.current||JSON.stringify(value).length>1500000)", "if(!valid(value)||JSON.stringify(value).length>1500000)");
js=js.replace("if(value.course!==course||value.version!==1||!Array.isArray(value.attempts)||!value.notes||!value.current)","if(!valid(value))");
await writeFile(path,js);await writeFile('digital-marketing-lab/dist/lecture-companion.js',js);
