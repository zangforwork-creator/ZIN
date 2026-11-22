// Version the entry module so cached files from the former standalone page
// cannot be mixed with the restored application shell.
const app=document.getElementById('app');
function showRecovery(message){
 if(!app.querySelector('.boot'))return;
 const screen=document.createElement('main');screen.className='boot';
 const title=document.createElement('h1');title.textContent='Your learning space could not open.';
 const text=document.createElement('p');text.textContent=message+' Your saved progress has been kept.';
 const retry=document.createElement('button');retry.className='btn primary';retry.textContent='Retry loading';
 retry.onclick=()=>{const url=new URL(location.href);url.searchParams.set('reload',Date.now());location.replace(url)};
 screen.append(title,text,retry);app.replaceChildren(screen);
}
const timeout=setTimeout(()=>showRecovery('Loading is taking longer than expected. Check your connection and retry.'),20000);
try{await import('./journey-app.js?v=20261123-concepts1')}
catch(error){console.error('Consumer Behavior startup failed:',error);showRecovery('Some application files could not load. Please retry.')}
finally{clearTimeout(timeout)}

try{const {installAudio}=await import('./study-audio.js?v=20261122-audio1');installAudio()}catch(error){console.warn('Sound controls unavailable:',error)}
