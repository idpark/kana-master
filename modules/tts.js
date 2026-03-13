// TTS utility using Web Speech API
let _loaded=false;
let _jaVoice=null;

function _loadVoices(){
  const voices=speechSynthesis.getVoices();
  _jaVoice=voices.find(v=>v.name==="Kyoko")
    ||voices.find(v=>v.name==="O-Ren")
    ||voices.find(v=>v.lang==="ja-JP"&&!v.name.includes("Google"))
    ||voices.find(v=>v.lang==="ja-JP");
  _loaded=true;
}

if(window.speechSynthesis){
  _loadVoices();
  speechSynthesis.addEventListener("voiceschanged",_loadVoices);
}

export function speak(text,rate=0.85){
  if(!window.speechSynthesis) return;
  speechSynthesis.cancel();
  setTimeout(()=>{
    const u=new SpeechSynthesisUtterance(text);
    u.lang="ja-JP";
    u.rate=rate;
    u.volume=1;
    u.pitch=1;
    if(_jaVoice) u.voice=_jaVoice;
    let keepAlive=null;
    u.onstart=()=>{
      keepAlive=setInterval(()=>{
        if(!speechSynthesis.speaking){clearInterval(keepAlive);return}
        speechSynthesis.pause();
        speechSynthesis.resume();
      },5000);
    };
    u.onend=()=>{if(keepAlive)clearInterval(keepAlive)};
    u.onerror=()=>{if(keepAlive)clearInterval(keepAlive)};
    speechSynthesis.speak(u);
  },100);
}

export function stop(){
  if(window.speechSynthesis) speechSynthesis.cancel();
}
