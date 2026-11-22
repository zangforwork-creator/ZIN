// Original procedural lounge-jazz accompaniment. No external recordings or API.
const KEY='zin-cb-audio-v1';
let prefs={musicVolume:0.22,effectsVolume:0.35,effects:true,muted:false};
try{const p=JSON.parse(localStorage.getItem(KEY)||'{}');for(const key of ['musicVolume','effectsVolume'])if(Number.isFinite(p[key]))prefs[key]=Math.max(0,Math.min(1,p[key]));for(const key of ['effects','muted'])if(typeof p[key]==='boolean')prefs[key]=p[key]}catch{}
let context,musicBus,effectsBus,noiseBuffer,musicWanted=false,interval,nextTime=0,step=0,lastClick=0,lastCue='',noteCount=0,widget;
const voices=new Set();
function save(){try{localStorage.setItem(KEY,JSON.stringify(prefs))}catch{}}
function gains(){if(!context)return;musicBus.gain.setTargetAtTime(prefs.muted?0:prefs.musicVolume,context.currentTime,0.04);effectsBus.gain.setTargetAtTime(prefs.muted||!prefs.effects?0:prefs.effectsVolume,context.currentTime,0.02)}
async function ready(){
 if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('Audio is not supported in this browser.');context=new Audio();musicBus=context.createGain();effectsBus=context.createGain();musicBus.connect(context.destination);effectsBus.connect(context.destination);
  noiseBuffer=context.createBuffer(1,context.sampleRate,context.sampleRate);const samples=noiseBuffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;gains();
 }
 if(context.state==='suspended')await context.resume();
 return context;
}
function tone(midi,at,duration,bus,volume=0.14,type='triangle',music=false){
 const osc=context.createOscillator(),amp=context.createGain();osc.type=type;osc.frequency.value=440*2**((midi-69)/12);
 amp.gain.setValueAtTime(0,at);amp.gain.linearRampToValueAtTime(volume,at+0.012);amp.gain.exponentialRampToValueAtTime(0.0001,at+duration);
 osc.connect(amp);amp.connect(bus);osc.start(at);osc.stop(at+duration+0.02);if(music)voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();amp.disconnect()};noteCount++;
}
function brush(at,volume){const src=context.createBufferSource(),filter=context.createBiquadFilter(),amp=context.createGain();src.buffer=noiseBuffer;filter.type='highpass';filter.frequency.value=4200;src.connect(filter);filter.connect(amp);amp.connect(musicBus);amp.gain.setValueAtTime(volume,at);amp.gain.exponentialRampToValueAtTime(0.0001,at+0.13);src.start(at);src.stop(at+0.15);voices.add(src);src.onended=()=>{voices.delete(src);src.disconnect();filter.disconnect();amp.disconnect()}}
const changes=[
 {bass:36,chord:[64,67,71,74]}, {bass:45,chord:[60,64,67,71]},
 {bass:38,chord:[60,64,65,69]}, {bass:43,chord:[59,64,65,69]},
 {bass:40,chord:[62,66,67,71]}, {bass:45,chord:[61,64,67,71]},
 {bass:38,chord:[60,64,65,69]}, {bass:43,chord:[59,64,65,69]}
];
function schedule(){if(!context||!musicWanted||prefs.muted||document.hidden)return;const beat=60/78;
 while(nextTime<context.currentTime+0.25){
  const bar=Math.floor(step/8)%changes.length,eighth=step%8,ch=changes[bar];
  if([0,3,6].includes(eighth))for(const n of ch.chord)tone(n,nextTime,beat*(eighth===0?1.4:0.85),musicBus,0.055,'triangle',true);
  if(eighth%2===0){const quarter=eighth/2,bass=[ch.bass,ch.bass+7,ch.bass+12,changes[(bar+1)%changes.length].bass-1][quarter];tone(bass,nextTime,beat*0.82,musicBus,0.20,'sine',true)}
  brush(nextTime,eighth%2?0.018:0.032);
  if(eighth===5&&bar%2===0)tone(ch.chord[3]+12,nextTime,beat*1.1,musicBus,0.027,'sine',true);
  nextTime+=beat*(eighth%2?0.42:0.58);step++;
 }
}
function stopMusic(){clearInterval(interval);interval=null;for(const voice of voices){try{voice.stop()}catch{}}voices.clear()}
function startMusic(){if(!context||interval||!musicWanted||prefs.muted||document.hidden)return;nextTime=context.currentTime+0.04;step=0;schedule();interval=setInterval(schedule,100)}
function status(){if(!widget)return;const playing=musicWanted&&!prefs.muted&&!document.hidden&&context?.state==='running';const b=widget.querySelector('[data-audio-music]');b.textContent=playing?'Pause Jazz':'Play Jazz';b.setAttribute('aria-pressed',String(playing));widget.querySelector('[data-audio-mute]').textContent=prefs.muted?'Unmute all':'Mute all';widget.querySelector('[data-audio-mute]').setAttribute('aria-pressed',String(prefs.muted));widget.querySelector('[data-audio-status]').textContent=playing?'Playing: Jazz Lounge':prefs.muted?'All audio muted':'Jazz paused';}
export function playCue(kind){
 if(!prefs.effects||prefs.muted||document.hidden)return;
 void ready().then(()=>{const at=context.currentTime+0.005;lastCue=kind;
  if(kind==='correct'){[72,76,79].forEach((n,i)=>tone(n,at+i*0.065,0.23,effectsBus,0.12,'sine'))}
  else if(kind==='wrong'){tone(57,at,0.15,effectsBus,0.10,'triangle');tone(53,at+0.11,0.23,effectsBus,0.08,'sine')}
  else if(kind==='timeout'){[76,72,67,60].forEach((n,i)=>tone(n,at+i*0.15,0.3,effectsBus,0.11,'sine'))}
  else if(kind==='complete'){[60,64,67,72].forEach((n,i)=>tone(n,at+i*0.07,0.3,effectsBus,0.10,'sine'))}
  else tone(83,at,0.035,effectsBus,0.045,'sine');
 }).catch(()=>{if(widget)widget.querySelector('[data-audio-status]').textContent='Audio unavailable. Lessons still work.'});
}
export function getAudioState(){return {preferences:{...prefs},musicWanted,playing:!!interval,contextState:context?.state||'not-started',lastCue,noteCount}}
export function installAudio(){
 if(widget?.isConnected)return;const bar=document.querySelector('.topbar');if(!bar)return;
 widget=document.createElement('div');widget.className='study-audio';
 widget.innerHTML=`<button type="button" class="audio-play" data-audio-music aria-pressed="false">Play Jazz</button><details class="audio-settings"><summary aria-label="Sound settings" title="Sound settings">♫</summary><div class="audio-settings-panel"><strong>Study sounds</strong><p class="small muted">Jazz Lounge · Original instrumental loop</p><label for="jazz-volume">Jazz volume</label><input id="jazz-volume" type="range" min="0" max="100" value="${Math.round(prefs.musicVolume*100)}"><label for="effects-volume">Effects volume</label><input id="effects-volume" type="range" min="0" max="100" value="${Math.round(prefs.effectsVolume*100)}"><label class="audio-effects"><input type="checkbox" data-audio-effects ${prefs.effects?'checked':''}>Click and answer sounds</label><button type="button" data-audio-mute aria-pressed="${prefs.muted}">Mute all</button><p data-audio-status role="status">Jazz paused</p></div></details>`;
 bar.insertBefore(widget,bar.lastElementChild);
 widget.querySelector('[data-audio-music]').onclick=async()=>{if(musicWanted&&!prefs.muted){musicWanted=false;stopMusic();status();return}try{await ready();musicWanted=true;prefs.muted=false;save();gains();startMusic();status()}catch{widget.querySelector('[data-audio-status]').textContent='Audio unavailable. Lessons still work.'}};
 widget.querySelector('[data-audio-mute]').onclick=()=>{prefs.muted=!prefs.muted;save();gains();if(prefs.muted)stopMusic();else if(context)startMusic();status()};
 for(const [id,key] of [['jazz-volume','musicVolume'],['effects-volume','effectsVolume']])widget.querySelector('#'+id).oninput=e=>{prefs[key]=Number(e.target.value)/100;save();gains()};
 widget.querySelector('[data-audio-effects]').onchange=e=>{prefs.effects=e.target.checked;save();gains()};
 document.addEventListener('click',e=>{if(e.target.closest('button,a,summary,[role=button],input,select,textarea,label')&&!e.target.closest('[disabled]')){const now=performance.now();if(now-lastClick>45){lastClick=now;playCue('click')}}},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')widget.querySelector('details').open=false});
 document.addEventListener('click',e=>{if(!widget.contains(e.target))widget.querySelector('details').open=false});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMusic();if(context?.state==='running')void context.suspend().catch(()=>{});status()}else if(context&&musicWanted&&!prefs.muted){void context.resume().then(()=>{startMusic();status()}).catch(()=>status())}});
 window.addEventListener('pagehide',()=>{stopMusic();void context?.suspend().catch(()=>{})});
 status();
}
