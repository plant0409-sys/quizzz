# 📚 Image Quiz App

Quizlet 스타일의 이미지 학습 퀴즈 도구입니다.

---

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열기

---

## 🖼️ 이미지 & 정답 추가하기

### 이미지 파일 넣기
`public/images/` 폴더에 이미지를 추가하세요.

```
public/
  images/
    quiz1.jpg
    quiz2.jpg
    quiz3.jpg
    ...
```

### 정답 데이터 수정하기
`data/quizzes.json` 파일을 수정하세요:

```json
[
  {
    "id": 1,
    "image": "/images/파일명.jpg",
    "answer": "정답",
    "hint": "힌트 (선택사항)"
  },
  {
    "id": 2,
    "image": "/images/파일명2.png",
    "answer": "정답2",
    "hint": "힌트2"
  }
]
```

> ⚠️ `answer`는 대소문자를 구분하지 않습니다. "정답"과 "CORRECT" 모두 인식됩니다.

---

## 🎮 사용 방법

| 동작 | 설명 |
|------|------|
| `Enter` | 시작 화면에서 퀴즈 시작 |
| 정답 입력 후 `→` 버튼 or `Enter` | 정답 제출 |
| 결과 확인 후 `Enter` | 다음 문제 |
| `끝내기` 버튼 | 결과 화면으로 이동 |

---

## ☁️ Vercel 배포

1. 이 레포를 GitHub에 push
2. [vercel.com](https://vercel.com) 접속 → "New Project"
3. GitHub 레포 선택 → Deploy

별도 설정 없이 자동으로 배포됩니다!

---

## 📁 폴더 구조

```
quiz-app/
├── app/
│   ├── layout.js      # 레이아웃
│   ├── page.js        # 메인 퀴즈 페이지
│   └── globals.css    # 전역 스타일
├── data/
│   └── quizzes.json   # ← 여기에 퀴즈 데이터 입력
├── public/
│   └── images/        # ← 여기에 이미지 파일 넣기
└── package.json
```
