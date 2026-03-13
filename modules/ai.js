// AI integration: Claude, OpenAI, Gemini
import {getState,updateState} from './state.js';

const PROVIDERS={
  anthropic:{name:"Claude",model:"claude-sonnet-4-20250514",url:"https://api.anthropic.com/v1/messages"},
  openai:{name:"ChatGPT",model:"gpt-4o-mini",url:"https://api.openai.com/v1/chat/completions"},
  gemini:{name:"Gemini",model:"gemini-2.0-flash",url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"},
};

export function getProviders(){return PROVIDERS}

export async function callAI(systemPrompt,userMsg){
  const st=getState();
  const provider=st.aiProvider||"anthropic";
  const key=st.aiApiKey;
  if(!key) throw new Error("API 키가 설정되지 않았습니다. 마이 탭 > AI 설정에서 키를 입력해주세요.");

  const p=PROVIDERS[provider];
  if(!p) throw new Error("지원하지 않는 AI 제공자입니다.");

  if(provider==="anthropic") return callAnthropic(p,key,systemPrompt,userMsg);
  if(provider==="openai") return callOpenAI(p,key,systemPrompt,userMsg);
  if(provider==="gemini") return callGemini(p,key,systemPrompt,userMsg);
}

async function callAnthropic(p,key,sys,user){
  const res=await fetch(p.url,{
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:p.model,max_tokens:1024,system:sys,messages:[{role:"user",content:user}]})
  });
  if(!res.ok){const e=await res.text();throw new Error(`Claude API 에러: ${res.status} ${e}`)}
  const data=await res.json();
  return data.content?.[0]?.text||"";
}

async function callOpenAI(p,key,sys,user){
  const res=await fetch(p.url,{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
    body:JSON.stringify({model:p.model,max_tokens:1024,messages:[{role:"system",content:sys},{role:"user",content:user}]})
  });
  if(!res.ok){const e=await res.text();throw new Error(`OpenAI API 에러: ${res.status} ${e}`)}
  const data=await res.json();
  return data.choices?.[0]?.message?.content||"";
}

async function callGemini(p,key,sys,user){
  const url=`${p.url}?key=${key}`;
  const res=await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      system_instruction:{parts:[{text:sys}]},
      contents:[{parts:[{text:user}]}],
      generationConfig:{maxOutputTokens:1024}
    })
  });
  if(!res.ok){const e=await res.text();throw new Error(`Gemini API 에러: ${res.status} ${e}`)}
  const data=await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text||"";
}

// AI scenarios for kana practice
export const AI_SCENARIOS=[
  {id:"coach",name:"학습 코치",icon:"🎓",desc:"내 약점 분석 & 학습 조언",
   system:"당신은 한국인을 위한 일본어 가나(히라가나/카타카나) 학습 코치입니다. 학습자의 통계를 분석하고 맞춤 조언을 해주세요. 한국어로 답변하세요. 간결하게 답변하세요."},
  {id:"quiz_explain",name:"오답 해설",icon:"📝",desc:"틀린 문제 상세 설명",
   system:"당신은 일본어 가나 전문 교사입니다. 학습자가 혼동하는 가나 글자 쌍을 분석하고, 구별법을 시각적 힌트와 함께 설명해주세요. 한국어로 답변하세요."},
  {id:"mnemonic",name:"니모닉 생성",icon:"💡",desc:"기억법 만들어주기",
   system:"당신은 창의적인 일본어 가나 기억법 전문가입니다. 학습자가 제시하는 가나 글자에 대해 한국어 기반의 재미있고 기억하기 쉬운 연상법(니모닉)을 만들어주세요. 모양, 발음, 이야기를 활용하세요."},
  {id:"similar",name:"비슷한 글자",icon:"🔍",desc:"헷갈리는 글자 구별법",
   system:"당신은 일본어 가나 학습 도우미입니다. 모양이 비슷해서 혼동하기 쉬운 가나 글자들(예: あ/お, シ/ツ, ソ/ン)을 비교 분석하고 구별하는 방법을 알려주세요. 한국어로 간결하게 답변하세요."},
  {id:"pron",name:"발음 가이드",icon:"🗣️",desc:"한국인이 어려운 발음 설명",
   system:"당신은 한국인을 위한 일본어 발음 전문가입니다. 한국어 화자가 어려워하는 일본어 발음(つ/ず, ふ, ら행 등)을 한국어와 비교하며 설명하고 연습법을 알려주세요."},
  {id:"word",name:"단어 만들기",icon:"📚",desc:"배운 가나로 단어 학습",
   system:"당신은 일본어 초급 어휘 교사입니다. 학습자가 알려주는 가나 글자들로 만들 수 있는 JLPT N5 수준의 쉬운 일본어 단어를 알려주세요. 각 단어의 의미(한국어)와 예문도 포함하세요."},
  {id:"culture",name:"문화 이야기",icon:"🏯",desc:"가나와 일본 문화 이야기",
   system:"당신은 일본 문화 해설가입니다. 히라가나와 카타카나의 역사, 사용 규칙, 재미있는 문화적 배경을 한국어로 알려주세요. 학습 동기를 부여하는 방식으로 답변하세요."},
  {id:"free",name:"자유 질문",icon:"💬",desc:"가나 관련 무엇이든 질문",
   system:"당신은 친절한 일본어 가나 학습 도우미입니다. 히라가나, 카타카나, 일본어 문자 체계에 관한 질문에 한국어로 답변해주세요."},
];
