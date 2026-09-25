export const experience = {
  list: [
    {
      company: "(주)리트러스트",
      position: "개발팀 / 프로 (Front-end & Cloud Engineer)",
      period: "2023.10 ~ 현재",
      description: "여행자 금융·보험 플랫폼 B2C/B2B 서비스 및 클라우드 인프라 엔드투엔드 개발·운영",
      projects: [
        {
          title: "여행자 보험 서비스 핵심 트랜잭션 및 대외 API 연동 개발",
          period: "2024.04 ~ 2025.03",
          role: "프론트엔드 클라이언트 개발 및 트랜잭션 예외 처리",
          achievements: [
            "결제·인증·보험 Open API 다중 비동기 연동 간 이중 요청 방지 및 에러 복구 UI를 구현하여 중복 결제 오류 0% 달성",
            "대외 API 12건 연동 및 핵심 트랜잭션 안정화로 누적 가입자 2,653건 확보 (전년 대비 5배 성장)",
            "백오피스 내 메시지 템플릿 관리 UI를 자체 구축하여 CS 처리 리드타임을 2시간에서 5분으로 95% 단축",
            "구글챗 웹훅 기반 실시간 에러 모니터링 파이프라인을 구축해 장애 인지 시간을 수십 분~수 시간에서 1초 이내(실시간)로 단축",
            "에러 로그 파라미터 기반 원인 파악 체계를 마련해 장애 대응 리드타임을 평균 15분 이내로 약 80% 이상 단축"
          ],
          skills: ["React.js", "REST API", "Axios", "PG Gateway", "AWS", "Nginx", "Docker"]
        },
        {
          title: "B2B 파트너 정산 포털 및 통합 백오피스 어드민 플랫폼 개발",
          period: "2024.08 ~ 2025.01",
          role: "프론트엔드 전담 (기여도 100%)",
          achievements: [
            "수천 건의 청약/정산 데이터를 조건별로 지연 없이 조회하는 고성능 데이터 테이블 및 다차원 필터링 UI 구현",
            "B2B 파트너사 및 사내 관리자 등 사용자 권한별 접근 제어를 위한 Role-based 라우팅 및 조건부 메뉴 렌더링 처리",
            "월별 거래 추이 및 정산 현황 등 핵심 비즈니스 KPI를 시각화하는 차트 대시보드 컴포넌트 개발"
          ],
          skills: ["React.js", "REST API", "Chart.js", "CSS Module", "JavaScript"]
        },
        {
          title: "인슈어트러스트 제로트러스트 기반 멀티클라우드 MSA & IaC 리팩토링",
          period: "2026.01 ~ 2026.03",
          role: "인프라 & DevOps 총괄",
          achievements: [
            "외부 노출 공용 자산 수 70% 감소 및 서버 직접 SSH 접근 100% 제거 (Bastion 호스트 경유 필수화)",
            "Terraform 및 Ansible 기반 IaC 파이프라인 구축으로 신규 환경 구축 소요 시간 1일에서 1시간으로 단축 (95% 단축)",
            "Promtail-Loki 기반 통합 로그 파이프라인 구축으로 로그 수집 커버리지 100% 달성"
          ],
          skills: ["AWS", "Linode", "Terraform", "Ansible", "Docker-compose", "Loki", "Promtail"]
        }
      ]
    },
    {
      company: "(주)케이투시스템이엔지",
      position: "총무/과장 (CS 총괄, 안전관리, 프로세스 혁신)",
      period: "2016.04 ~ 2023.01",
      description: "비즈니스 프로세스 데이터화, 고객 접점 디지털 전환 및 법정 안전관리 총괄",
      projects: [
        {
          title: "고객 서비스 프로세스 개선 및 상담 자동화 시스템 구축",
          period: "2021.05 ~ 2022.12",
          role: "프로세스 혁신 기획 및 자동화 툴 제작",
          achievements: [
            "엑셀 참조 함수 기반 검사 신청 자동화 테이블 구축으로 수기 작업 공수 대폭 절감",
            "채널톡 도입 및 상담 패턴 분석을 통한 챗봇 자동응대 시나리오 설계로 대기시간 단축 및 응대 품질 표준화",
            "재코팅 서비스 프로세스 재설계(선출고-후반납)로 월 거래량 10건에서 400건(40배) 확장 달성"
          ],
          skills: ["Business Analysis", "Chatbot Design", "Excel Automation", "Process Innovation"]
        }
      ]
    },
    {
      company: "DG기술 (㈜마린하우스)",
      position: "설계팀 / 사원 (조선 배관의장 설계)",
      period: "2014.04 ~ 2016.04",
      description: "드릴쉽(Drillship) 및 대형 선박 주요 구역 배관의장 2D/3D CAD 상세 설계",
      projects: [
        {
          title: "선박 펌프룸(Pump room) 및 카고 구역 배관 상세 설계",
          period: "2014.04 ~ 2016.04",
          role: "배관의장 CAD 설계 및 현장 테스트 Follow-up",
          achievements: [
            "Pump room, Mud & Bulk tank room, Cargo tank 구역 배관 상세 설계 및 BOM 자재 관리",
            "선박 계장도(P&ID) 및 설치 환경 분석을 바탕으로 현장 오차 최소화 및 선주/선급 검사 대응"
          ],
          skills: ["Aveva Marine CAD", "P&ID", "Shipbuilding Piping", "BOM Management"]
        }
      ]
    }
  ]
};
