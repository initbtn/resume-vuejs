import type { IProject } from './types'

export const project: IProject = {
  list: [
    {
      title: "Next.js 기반 이력서 웹 플랫폼의 Vue.js 프레임워크 포팅 (resume-vuejs)",
      period: "2024.02 ~ 2024.03",
      where: "개인 오픈소스 포팅 프로젝트",
      description: "Next.js 기반의 오픈소스 이력서 템플릿 아키텍처를 Vue 3 Composition API 및 Vite 환경으로 100% 완전 포팅",
      achievements: [
        "Next.js의 데이터 바인딩 및 컴포넌트 구조를 Vue 3 Single File Component(<script setup>) 아키텍처로 포팅",
        "JSON 데이터 기반의 반응형 렌더링 파이프라인 구축 및 TailwindCSS 반응형 레이아웃 적용",
        "Vite 번들 최적화를 통한 초기 렌더링 성능 최적화 달성"
      ],
      skills: ["Vue.js 3", "Vite", "TailwindCSS", "JavaScript", "Responsive Web"],
      link: "https://github.com/initbtn/resume-vuejs"
    },
    {
      title: "해양 친환경 설비 실시간 센서 모니터링 및 GIS 관제 웹 플랫폼",
      period: "2024.06 ~ 2024.08",
      where: "친환경 선박 관제 솔루션 프로토타입",
      description: "IMO 환경 규제 대응 탈황 설비(Scrubber) 및 평형수처리(BWTS) 실시간 센서 관제 대시보드",
      achievements: [
        "해양 GIS 지도 라이브러리를 활용한 전 세계 운항 선박의 실시간 위치 및 항적 시각화 UI 구현",
        "배기가스 온도, 차압, pH 수치 등 초 단위 유입 시계열 센서 데이터의 고성능 캔버스 차트 렌더링 최적화",
        "센서 임계치 초과 발생 시 운영자 즉각 인지를 위한 실시간 시각 경고 알람 인디케이터 구축"
      ],
      skills: ["Vue.js / React", "Leaflet GIS", "ECharts", "WebSocket", "TimeSeries Data"]
    }
  ]
};
