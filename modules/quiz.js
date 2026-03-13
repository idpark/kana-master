// Quiz engine with Reask Queue
import {shuffleArray,pickRandom} from './ui.js';
import {getState,recordActivity,addXP,getSRSQuality,updateSRS,recordCharResult,recordConfusion} from './state.js';
import {getAllKana,H,K,H_DK,K_DK,H_HD,K_HD,H_YO,K_YO,getPair} from '../data/kana.js';

export const QUIZ_MODES=[
  {id:"kana2rom",name:"가나→로마지",icon:"📖",desc:"가나를 보고 로마지 맞추기"},
  {id:"rom2kana",name:"로마지→가나",icon:"🔤",desc:"로마지를 보고 가나 찾기"},
  {id:"hira2kata",name:"ひ↔カ 매칭",icon:"🔀",desc:"히라가나↔카타카나 변환"},
  {id:"listen",name:"듣기 퀴즈",icon:"🎧",desc:"발음 듣고 맞추기"},
];

export function generateQuiz(pool,mode,count=10){
  if(pool.length<4) return[];
  const questions=shuffleArray(pool).slice(0,count);
  const allRomaji=[...new Set(getAllKana().map(x=>x.r))];

  return questions.map(q=>{
    let question,answer,choices,questionSub="",audioText=null;

    if(mode==="kana2rom"){
      question=q.c;
      answer=q.r;
      const distractors=pickRandom(allRomaji.filter(r=>r!==q.r),3);
      choices=shuffleArray([q.r,...distractors]);
      const isHira=H.some(x=>x.c===q.c)||H_DK.some(x=>x.c===q.c)||H_HD.some(x=>x.c===q.c)||H_YO.some(x=>x.c===q.c);
      questionSub=isHira?"히라가나":"카타카나";
    }else if(mode==="rom2kana"){
      question=q.r;
      answer=q.c;
      const distractors=pickRandom(pool.filter(x=>x.c!==q.c),3).map(x=>x.c);
      choices=shuffleArray([q.c,...distractors]);
      questionSub="가나를 찾으세요";
    }else if(mode==="hira2kata"){
      const pair=getPair(q.c);
      if(!pair) return null;
      question=q.c;
      answer=pair;
      const isHira=H.some(x=>x.c===q.c);
      const targetPool=isHira?[...K,...K_DK,...K_HD]:[...H,...H_DK,...H_HD];
      const distractors=pickRandom(targetPool.filter(x=>x.c!==pair),3).map(x=>x.c);
      choices=shuffleArray([pair,...distractors]);
      questionSub=isHira?"→ 카타카나는?":"→ 히라가나는?";
    }else if(mode==="listen"){
      question="🔊";
      answer=q.c;
      audioText=q.c;
      const distractors=pickRandom(pool.filter(x=>x.c!==q.c),3).map(x=>x.c);
      choices=shuffleArray([q.c,...distractors]);
      questionSub="듣고 맞추세요";
    }

    const correctIdx=choices.indexOf(mode==="kana2rom"?answer:answer);
    return{word:q,question,questionSub,answer,choices,correctIdx,audioText};
  }).filter(Boolean);
}

export function processAnswer(quizItem,selectedIdx,elapsed){
  const isCorrect=selectedIdx===quizItem.correctIdx;
  const quality=getSRSQuality(isCorrect,elapsed);

  // Update SRS & stats
  updateSRS(quizItem.word.c,quality);
  recordCharResult(quizItem.word.c,isCorrect,elapsed);
  recordActivity();

  // Track confusion
  if(!isCorrect){
    const wrongAnswer=quizItem.choices[selectedIdx];
    recordConfusion(quizItem.answer,wrongAnswer);
  }

  // XP
  const baseXP=isCorrect?10:2;
  const speedBonus=isCorrect&&elapsed<3?5:0;

  return{isCorrect,baseXP,speedBonus,quality};
}
