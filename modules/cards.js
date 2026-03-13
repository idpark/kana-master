// Flashcard logic
import {getState,updateSRS,getSRSQuality,recordCharResult,recordActivity} from './state.js';
import {getDueChars} from './state.js';
import {shuffleArray} from './ui.js';
import {H,K,H_DK,H_HD,H_YO,K_DK,K_HD,K_YO,getByRow,HIRA_ROWS,KATA_ROWS,getAllKana} from '../data/kana.js';

export const CARD_SETS=[
  {id:"hira_a",name:"あ행",chars:()=>getByRow(H,"あ"),type:"hira"},
  {id:"hira_ka",name:"か행",chars:()=>getByRow(H,"か"),type:"hira"},
  {id:"hira_sa",name:"さ행",chars:()=>getByRow(H,"さ"),type:"hira"},
  {id:"hira_ta",name:"た행",chars:()=>getByRow(H,"た"),type:"hira"},
  {id:"hira_na",name:"な행",chars:()=>getByRow(H,"な"),type:"hira"},
  {id:"hira_ha",name:"は행",chars:()=>getByRow(H,"は"),type:"hira"},
  {id:"hira_ma",name:"ま행",chars:()=>getByRow(H,"ま"),type:"hira"},
  {id:"hira_ya",name:"や행",chars:()=>getByRow(H,"や"),type:"hira"},
  {id:"hira_ra",name:"ら행",chars:()=>getByRow(H,"ら"),type:"hira"},
  {id:"hira_wa",name:"わ행",chars:()=>getByRow(H,"わ"),type:"hira"},
  {id:"kata_a",name:"ア행",chars:()=>getByRow(K,"ア"),type:"kata"},
  {id:"kata_ka",name:"カ행",chars:()=>getByRow(K,"カ"),type:"kata"},
  {id:"kata_sa",name:"サ행",chars:()=>getByRow(K,"サ"),type:"kata"},
  {id:"kata_ta",name:"タ행",chars:()=>getByRow(K,"タ"),type:"kata"},
  {id:"kata_na",name:"ナ행",chars:()=>getByRow(K,"ナ"),type:"kata"},
  {id:"kata_ha",name:"ハ행",chars:()=>getByRow(K,"ハ"),type:"kata"},
  {id:"kata_ma",name:"マ행",chars:()=>getByRow(K,"マ"),type:"kata"},
  {id:"kata_ya",name:"ヤ행",chars:()=>getByRow(K,"ヤ"),type:"kata"},
  {id:"kata_ra",name:"ラ행",chars:()=>getByRow(K,"ラ"),type:"kata"},
  {id:"kata_wa",name:"ワ행",chars:()=>getByRow(K,"ワ"),type:"kata"},
  {id:"hira_dk",name:"탁음(ひ)",chars:()=>H_DK,type:"variant"},
  {id:"hira_hd",name:"반탁음(ひ)",chars:()=>H_HD,type:"variant"},
  {id:"hira_yo",name:"요음(ひ)",chars:()=>H_YO,type:"variant"},
  {id:"kata_dk",name:"탁음(カ)",chars:()=>K_DK,type:"variant"},
  {id:"kata_hd",name:"반탁음(カ)",chars:()=>K_HD,type:"variant"},
  {id:"kata_yo",name:"요음(カ)",chars:()=>K_YO,type:"variant"},
  {id:"all_hira",name:"히라가나 전체",chars:()=>[...H,...H_DK,...H_HD,...H_YO],type:"all"},
  {id:"all_kata",name:"카타카나 전체",chars:()=>[...K,...K_DK,...K_HD,...K_YO],type:"all"},
  {id:"due",name:"오늘 복습",chars:()=>getDueChars(getAllKana()),type:"srs"},
];

export function getCardSet(setId){
  const set=CARD_SETS.find(s=>s.id===setId);
  return set?set.chars():[];
}

// Mark card as known (quality 4) or unknown (quality 1)
export function markCard(charKey,known){
  const quality=known?4:1;
  updateSRS(charKey,quality);
  recordCharResult(charKey,known,known?2:8);
  recordActivity();
}
