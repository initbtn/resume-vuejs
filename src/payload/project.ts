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
        "Supabase BaaS 연동 및 원격 장애/부재 시 정적 로컬 payload로 100% 자동 Fallback되는 방어 로직 구현"
      ],
      skills: ["Vue.js 3", "TypeScript", "Vite", "Vitest", "TailwindCSS", "Supabase", "GitHub Actions"],
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
    }
  ]
};
