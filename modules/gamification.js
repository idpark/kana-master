// XP, levels, streaks, badges
import {getAllKana} from '../data/kana.js';
import {getState} from './state.js';

export const BADGES=[
  {id:"first_quiz",name:"첫 퀴즈",icon:"🎯",desc:"첫 퀴즈 완료",condition:s=>s.totalXP>0},
  {id:"hira_10",name:"히라가나 10",icon:"📝",desc:"히라가나 10자 학습",condition:s=>{
    const ct=Object.keys(s.charStats).filter(k=>[...Array(46)].some((_,i)=>"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん"[i]===k)).length;
    return ct>=10;
  }},
  {id:"kata_10",name:"카타카나 10",icon:"📚",desc:"카타카나 10자 학습",condition:s=>{
    const ct=Object.keys(s.charStats).filter(k=>[...Array(46)].some((_,i)=>"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"[i]===k)).length;
    return ct>=10;
  }},
  {id:"streak_3",name:"3일 연속",icon:"🔥",desc:"3일 연속 학습",condition:s=>s.streak.current>=3},
  {id:"streak_7",name:"7일 연속",icon:"💪",desc:"7일 연속 학습",condition:s=>s.streak.current>=7},
  {id:"streak_30",name:"30일 연속",icon:"⭐",desc:"30일 연속 학습",condition:s=>s.streak.current>=30},
  {id:"xp_500",name:"500 XP",icon:"💎",desc:"총 500 XP 달성",condition:s=>s.totalXP>=500},
  {id:"xp_1000",name:"1000 XP",icon:"👑",desc:"총 1000 XP 달성",condition:s=>s.totalXP>=1000},
  {id:"daily_goal",name:"일일 목표",icon:"🎉",desc:"일일 목표 달성",condition:s=>s.dailyGoalMet},
  {id:"perfect",name:"퍼펙트",icon:"💯",desc:"퀴즈 10/10 달성",condition:s=>s._perfectQuiz},
  {id:"speed",name:"번개 손",icon:"⚡",desc:"3초 이내 10연속 정답",condition:s=>s._speedStreak>=10},
  {id:"all_hira",name:"히라가나 마스터",icon:"🏆",desc:"히라가나 46자 마스터",condition:s=>{
    const hiraChars="あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
    return[...hiraChars].every(c=>{const st=s.charStats[c];return st&&st.c>=3&&st.c/(st.c+st.w)>=0.8});
  }},
];

export function checkBadges(state){
  const newBadges=[];
  for(const badge of BADGES){
    if(!state.badges.includes(badge.id)&&badge.condition(state)){
      state.badges.push(badge.id);
      newBadges.push(badge);
    }
  }
  return newBadges;
}

export function getEarnedBadges(state){
  return BADGES.filter(b=>state.badges.includes(b.id));
}

export function getAllBadges(){return BADGES}
