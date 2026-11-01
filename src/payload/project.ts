import type { IProject } from './types'

export const project: IProject = {
  list: [
    {
      title: "Next.js 기반 이력서 웹 플랫폼의 Vue.js 프레임워크 포팅 (resume-vuejs)",
      period: "2026.09 ~ 현재",
      where: "개인 오픈소스 포팅 프로젝트",
      description: "Next.js 기반 오픈소스 이력서 아키텍처를 Vue 3 Composition API, TypeScript Strict, Vitest TDD 및 Supabase BaaS 하이브리드 파이프라인으로 전환",
      achievements: [
        "Next.js 데이터 구조를 Vue 3 Single File Component(<script setup lang=\"ts\">)로 전면 포팅 및 완전 타입 바인딩",
        "Vitest 기반 단위 테스트 TDD 파이프라인 및 GitHub Actions Pages 자동 배포 체계 수립",
        "WAS API 게이트웨이(/api/*) 구축을 통한 브라우저 자격증명 완전 은닉(Zero Client Secrets) 및 장애 시 100% 자동 Fallback 하이브리드 아키텍처 수립"
      ],
      skills: ["Vue.js 3", "TypeScript", "Vite", "Vitest", "TailwindCSS", "Supabase", "Vercel", "GitHub Actions"],
      link: "https://github.com/initbtn/resume-vuejs"
    },
    {
      title: "2026 부산교구 젊은이의 날(BYD) 순례자 참여형 웹 앱 (busan-youth-day)",
      period: "2026.09 ~ 2026.10",
      where: "천주교 부산교구 젊은이의 날 (개인 개발)",
      description: "행사 일정·스포원파크 지도·스탬프투어·소통피드를 제공하는 Next.js 14 기반 모바일 PWA 웹 앱 (Vercel 배포)",
      achievements: [
        "카카오 SSO 인증과 온보딩 순례 공동체(수호성인 모둠) 무작위 배정 및 Supabase 연동 구현",
        "소통피드 이미지·숏츠 영상 클라이언트 압축 및 HEIC→WebP 변환 후 Cloudflare R2 업로드 파이프라인 구축",
        "스포원파크 4대 테마존 인터랙티브 지도, A/B/C 구역별 통합 시간표, QR 스캔 스탬프투어 구현"
      ],
      skills: ["Next.js 14", "React 18", "TypeScript", "TailwindCSS", "Supabase", "Cloudflare R2", "Kakao SSO", "Playwright", "Vercel"],
      link: "https://github.com/initbtn/busan-youth-day"
    },
    {
      title: "파나시아(PANASIA) 친환경 설비 실시간 센서 모니터링 & 해양 GIS 원격 위성관제 플랫폼 (marine-sensor-gis)",
      period: "2026.10 ~ 현재",
      where: "파나시아 친환경 설비 원격관제 (개인 개발)",
      description: "선박 탈황 스크러버(PaSOx)·평형수(GloEn-Patrol)·탄소포집(PaCCUS) 실시간 10Hz 센서 원격 감시 및 해양 GIS 위성 관제 SPA 플랫폼 (Vercel 배포)",
      achievements: [
        "부산항~대한해협(TSS) 서수로 실제 해상 항로 데드레커닝 항행 엔진 및 IEC 62288 침로 벡터/16방위 나침반 툴팁 연동",
        "Zustand 기반 10Hz 고빈도 텔레메트리 스트림 영속 App Shell 라우팅 및 무중단 HMI 4대 직무 관제 뷰 구축",
        "개인정보 미수집(Zero-PII) 단방향 해시 식별자(usr_****) 세션 인증 및 실시간 동시 접속자 DAU 감사 트레일 구축",
        "IMO MARPOL 법정 보존 데이터 Cloudflare R2 아카이빙 및 WAS 단일 게이트웨이·클라이언트 스토리지 쓰기 차단 보안 아키텍처 수립"
      ],
      skills: ["React 18", "TypeScript", "Leaflet GIS", "Apache ECharts", "Zustand", "TailwindCSS", "Supabase", "Cloudflare R2", "Vitest", "Playwright", "Vercel"],
      link: "https://github.com/initbtn/marine-sensor-gis"
    },
    {
      title: "AI 에이전트 & 웹·데브옵스 최신 동향 리서치 & RAG 어시스턴트 (assist)",
      period: "2026.10 ~ 현재",
      where: "개인 개발 어시스턴트 백엔드 & 텔레그램 봇",
      description: "GitHub 릴리스/RFC/기술 동향을 자동 수집·적재하고 아침 요약 리포트 발송 및 즉각 RAG 질의응답을 제공하는 FastAPI + LangChain 어시스턴트 (GCP 배포)",
      achievements: [
        "동적 리서치 타겟 관리 및 해시 기반 중복 수집 방지 파이프라인(Supabase pgvector) 구축",
        "Snowflake Arctic Embed v2 로컬 임베딩 및 Ollama(Gemma 3 12B / Hermes 3 8B) 3줄 요약·RAG 질의응답 엔진 구현",
        "Telegram 봇(@DomAssistBot) 일일 브리핑 자동 발송 및 양방향 웹훅 질의응답 인터페이스 구현",
        "GCP e2-micro(marine-edge-pc) 상시 경량 Docker 컨테이너 배포 및 IP 방화벽 보안 배선 수립"
      ],
      skills: ["Python 3.12", "FastAPI", "LangChain", "Supabase", "pgvector", "Ollama", "Gemma 3", "Telegram Bot API", "Docker", "GCP"],
      link: "https://github.com/initbtn/assist"
    },
    {
      title: "실시간 상담사 대시보드 & Firestore 하이브리드 영속화 엔지니어링 블로그 (domlog)",
      period: "2026.10 ~ 현재",
      where: "기술 블로그 및 풀스택 실시간 시스템 (개인 개발)",
      description: "소프트웨어 아키텍처 및 시스템 엔지니어링 기록을 다루며, 텔레그램 양방향 연동 실시간 상담 채팅 및 Firestore 하이브리드 영속화를 지원하는 Next.js 16 플랫폼 (Vercel 배포)",
      achievements: [
        "Cloud Firestore 기반 분산 락킹 세션 스토리지 및 메모리 폴링·쓰기 쓰로틀링(Throttling) 하이브리드 영속화 파이프라인 구축",
        "서버리스 WAS 게이트웨이를 경유하는 텔레그램 Bot API 양방향 웹훅 수신 및 실시간 릴레이 대시보드(/admin/chat) 구현",
        "정적 클라이언트 번들 내 DB 자격증명 완전 격리(Zero-Secret Architecture) 및 무료 할당량(프로젝트당 1개 DB) 최적화 아키텍처 수립",
        "Next.js App Router Prerender 캐싱 및 카카오톡 2:1/일반 1.91:1 듀얼 크롭 최적화 Open Graph 썸네일 파이프라인 적용"
      ],
      skills: ["Next.js 16", "React 19", "TypeScript", "TailwindCSS v4", "Google Cloud Firestore", "Telegram Bot API", "Vitest", "Vercel"],
      link: "https://domlog.vercel.app"
    }
  ]
};
