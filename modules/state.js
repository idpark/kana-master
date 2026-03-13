// State management + SRS (SM-2 algorithm)
const STORAGE_KEY="kana_master_state";

const DEF_STATE={
  // SRS per character: { interval, easeFactor, repetitions, nextReview, quality }
  charSRS:{},
  // Stats per character: { c(correct), w(wrong), t(totalTime), n(total), last(timestamp) }
  charStats:{},
  // Gamification
  totalXP:0,
  playerLevel:1,
  levelXP:0,
  todayXP:0,
  dailyGoal:50,
  dailyGoalMet:false,
  todayDate:"",
  // Streak
  streak:{current:0,best:0,lastDate:""},
  // Badges earned (array of badge ids)
  badges:[],
  // Combo
  comboBest:0,
  // Confusion pairs tracking
  confusionPairs:{},
  // Settings
  ttsEnabled:true,
  ttsRate:0.85,
  // AI
  aiProvider:"gemini",
  aiApiKey:"",
};

let state=loadState();

function loadState(){
  try{
    const s=JSON.parse(localStorage.getItem(STORAGE_KEY))||{};
    for(const k of Object.keys(DEF_STATE)){
      if(s[k]===undefined) s[k]=structuredClone(DEF_STATE[k]);
    }
    return s;
  }catch{return structuredClone(DEF_STATE)}
}

export function saveState(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}

export function getState(){return state}

export function updateState(updates){
  Object.assign(state,updates);
  saveState();
}

// === Date helpers ===
function todayStr(){return new Date().toISOString().slice(0,10)}
function daysBetween(d1,d2){
  return Math.round(Math.abs(new Date(d1)-new Date(d2))/86400000);
}

// === Daily reset ===
export function checkDailyReset(){
  const today=todayStr();
  if(state.todayDate!==today){
    state.todayXP=0;
    state.dailyGoalMet=false;
    state.todayDate=today;
    saveState();
  }
}

// === Streak ===
export function checkStreak(){
  const today=todayStr();
  if(!state.streak.lastDate){
    state.streak.lastDate=today;
    state.streak.current=1;
  }else{
    const diff=daysBetween(today,state.streak.lastDate);
    if(diff===0) return; // same day
    if(diff===1){
      state.streak.current++;
    }else{
      state.streak.current=1;
    }
    state.streak.lastDate=today;
  }
  if(state.streak.current>state.streak.best) state.streak.best=state.streak.current;
  saveState();
}

export function recordActivity(){
  checkDailyReset();
  checkStreak();
}

// === XP ===
export function xpForLevel(lv){return lv*200}

export function addXP(amount){
  state.totalXP+=amount;
  state.levelXP+=amount;
  state.todayXP+=amount;
  let leveled=false;
  while(state.levelXP>=xpForLevel(state.playerLevel)){
    state.levelXP-=xpForLevel(state.playerLevel);
    state.playerLevel++;
    leveled=true;
  }
  if(state.todayXP>=state.dailyGoal&&!state.dailyGoalMet){
    state.dailyGoalMet=true;
  }
  saveState();
  return leveled;
}

// === SRS SM-2 ===
function defaultSRS(){
  return{interval:1,easeFactor:2.5,repetitions:0,nextReview:0,quality:0};
}

export function getSRSQuality(isCorrect,elapsedSec){
  if(!isCorrect) return 1;
  if(elapsedSec>6) return 3;
  if(elapsedSec>3) return 4;
  return 5;
}

export function updateSRS(charKey,quality){
  const rec=state.charSRS[charKey]||defaultSRS();
  if(quality>=3){
    if(rec.repetitions===0) rec.interval=1;
    else if(rec.repetitions===1) rec.interval=6;
    else rec.interval=Math.round(rec.interval*rec.easeFactor);
    rec.repetitions++;
  }else{
    rec.repetitions=0;
    rec.interval=1;
  }
  rec.easeFactor=rec.easeFactor+(0.1-(5-quality)*(0.08+(5-quality)*0.02));
  if(rec.easeFactor<1.3) rec.easeFactor=1.3;
  rec.nextReview=Date.now()+rec.interval*86400000;
  rec.quality=quality;
  state.charSRS[charKey]=rec;
  saveState();
}

export function getSRSStatus(charKey){
  const rec=state.charSRS[charKey];
  if(!rec||rec.repetitions===0) return"new";
  if(rec.interval<=6) return"learning";
  if(rec.interval<=30) return"review";
  return"master";
}

export function getDueCount(allChars){
  const now=Date.now();
  return allChars.filter(ch=>{
    const rec=state.charSRS[ch.c];
    return !rec||rec.nextReview<=now;
  }).length;
}

export function getDueChars(allChars){
  const now=Date.now();
  return allChars.filter(ch=>{
    const rec=state.charSRS[ch.c];
    return !rec||rec.nextReview<=now;
  });
}

// === Stats ===
export function recordCharResult(charKey,isCorrect,elapsed){
  const st=state.charStats[charKey]||{c:0,w:0,t:0,n:0,last:0};
  if(isCorrect) st.c++; else st.w++;
  st.t+=elapsed;
  st.n++;
  st.last=Date.now();
  state.charStats[charKey]=st;
  saveState();
}

export function getWeakChars(allChars,count=5){
  return allChars
    .filter(ch=>state.charStats[ch.c]&&state.charStats[ch.c].n>=2)
    .map(ch=>{
      const st=state.charStats[ch.c];
      return{...ch,accuracy:st.c/st.n,total:st.n};
    })
    .filter(x=>x.accuracy<0.8)
    .sort((a,b)=>a.accuracy-b.accuracy)
    .slice(0,count);
}

// === Confusion pairs ===
export function recordConfusion(correct,wrong){
  const key=`${correct}→${wrong}`;
  state.confusionPairs[key]=(state.confusionPairs[key]||0)+1;
  saveState();
}

// === Backup / Restore ===
export function exportData(){
  return JSON.stringify(state,null,2);
}

export function importData(json){
  try{
    const data=JSON.parse(json);
    state=data;
    saveState();
    return true;
  }catch{return false}
}

export function resetData(){
  state=structuredClone(DEF_STATE);
  saveState();
}
