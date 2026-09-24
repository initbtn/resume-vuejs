# resume-vuejs

Next.js 기반 오픈소스 이력서 웹 플랫폼([uyu423/resume-nextjs](https://github.com/uyu423/resume-nextjs)) 아키텍처를 **Vue 3 Composition API 및 Vite 환경으로 100% 완전 포팅**한 반응형 웹 이력서 프로젝트입니다.

---

## 🚀 Features

- **Vue 3 SFC & Composition API**: `<script setup>` 기반의 간결하고 유지보수하기 쉬운 컴포넌트 아키텍처
- **Data-Driven Resume**: `src/payload.js` 내 데이터만 수정하면 전체 이력서 콘텐츠가 반응형으로 동적 렌더링
- **High Performance (Vite)**: 빠르고 가벼운 Vite 빌드 파이프라인 및 정적 번들 최적화
- **Clean & Modern UI**: TailwindCSS 기반의 모바일/태블릿/데스크톱 완벽 반응형 레이아웃 및 Pretendard 타이포그래피

---

## 🛠 Tech Stack

- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **Styling**: TailwindCSS, PostCSS, Autoprefixer
- **Typography**: Pretendard Web Font

---

## 📦 Getting Started

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

---

## 📂 Project Structure

```
resume-vuejs/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.js
    ├── App.vue
    ├── style.css
    └── payload.js     # 이력서 데이터 정의 (Profile, Careers, Projects, Skills)
```
