# 가나 마스터 (Kana Master)

히라가나/카타카나 암기를 위한 모바일 PWA 앱입니다.

🔗 **https://idpark.github.io/kana-master/**

## 주요 기능

- **참조표** — 히라가나/카타카나 전체 그리드 (청음·탁음·반탁음·요음), 글자별 니모닉 SVG 일러스트
- **플래시카드** — 행별/전체/SRS 복습 카드, 알아요/모르겠어요 분류로 스마트 복습
- **퀴즈 4모드** — 가나→로마지, 로마지→가나, ひ↔カ 매칭, 듣기 퀴즈
- **AI 학습 도우미** — Claude / ChatGPT / Gemini 연동 (학습 코치, 오답 해설, 니모닉 생성 등 8가지 시나리오)
- **게임화** — XP, 레벨, 스트릭, 콤보(x2/x3), 뱃지 12종
- **마이페이지** — 일일 목표, 히라가나/카타카나 진도, 약점 분석, 데이터 백업/복원

## 사용법

1. 위 링크를 스마트폰 브라우저에서 열기
2. **"홈 화면에 추가"** 로 앱 설치 (오프라인 지원)
3. 참조표에서 글자 익히기 → 플래시카드로 반복 → 퀴즈로 테스트

## 기술 스택

- Vanilla JS (ES Modules)
- PWA (Service Worker, 오프라인 캐시)
- SRS SM-2 간격 반복 알고리즘
- Web Speech API (TTS 발음)
- GitHub Pages 배포

## Contributors

- [@idpark](https://github.com/idpark) — 기획, 개발
- Claude Code (Anthropic) — AI 페어 프로그래밍
