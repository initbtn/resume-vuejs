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
      title: "해양 친환경 설비 실시간 센서 모니터링 및 GIS 관제 웹 플랫폼",
      period: "2026.09 ~ (주제선정 및 기획)",
      where: "친환경 스마트 선박 관제 솔루션 (기획/사전조사)",
      description: "IMO 환경 규제 대응 탈황 설비(Scrubber) 및 선박 평형수처리(BWTS) 실시간 센서 관제 대시보드 (주제 선정 및 아키텍처 기획 단계)",
      achievements: [
        "IMO 환경 규제 대응 선박 배기가스 탈황 및 평형수 설비의 실시간 센서 관제 도메인 요구사항 조사 및 주제 선정",
        "해양 GIS 지도 라이브러리(Leaflet/OpenLayers) 기반 전 세계 선박 항적 시각화 및 ECharts 시계열 차트 기술 스택 검토",
        "초 단위 텔레메트리 센서 데이터 처리를 위한 WebSocket 기반 실시간 스트리밍 파이프라인 및 경보 인디케이터 구조 설계 기획"
      ],
      skills: ["Vue.js 3", "Leaflet GIS", "ECharts", "WebSocket", "TimeSeries Data", "System Design"]
    }
  ]
};
