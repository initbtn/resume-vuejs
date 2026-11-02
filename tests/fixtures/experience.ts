import type { IExperience } from '../../src/types/payload.types'

export const experience: IExperience = {
  list: [
    {
      company: "(주)리트러스트",
      position: "개발팀 / 프로 (Full-stack & DevOps / Cloud Engineer)",
      period: "2023.10 ~ 현재",
      description: "금융·보험 플랫폼 '인슈어트러스트' 서비스 전반의 아키텍처 설계, 백엔드/DB 모델링, 인프라 보안 및 고객 접점(CRM) 총괄 운영",
      projects: [
        {
          title: "인슈어트러스트 서비스 전반 아키텍처 설계 및 인프라·보안 운영",
          period: "2023.10 ~ 현재",
          role: "서비스 아키텍처 설계, 백엔드/DB 모델링, 인프라 보안 총괄",
          achievements: [
            "결제·본인인증·보험 Open API 다중 연동 간 분산 트랜잭션 예외 처리 및 멱등성 보장 로직을 설계하여 중복 결제 오류 0% 달성",
            "대외 금융·보험 API 12건 연동 및 핵심 트랜잭션 안정화로 누적 가입자 2,653건 확보",
            "청약·정산 핵심 도메인 관계형 DB 스키마 설계 및 인덱스 최적화, 개인정보(PII) 등 민감 데이터 암호화 및 최소 권한 접근 제어 체계 수립",
            "코드 기반 인프라(IaC) 파이프라인 구축을 통한 서비스 환경 프로비저닝 자동화 및 네트워크 보안 경계 강화로 무인가 접근 원천 차단",
            "분산 서비스 통합 로그 파이프라인 및 실시간 웹훅 모니터링 체계를 구축해 장애 인지 시간을 수십 분~수 시간에서 1초 이내(실시간)로 단축",
            "에러 로그 파라미터 기반 원인 파악 체계를 마련해 장애 대응 리드타임을 평균 15분 이내로 약 80% 이상 단축"
          ],
          skills: ["System Architecture", "RDBMS Design", "REST API", "Zero Trust", "IaC (Terraform/Ansible)", "Logging & Monitoring"]
        },
        {
          title: "고객 상담 경험(CRM) 혁신 및 운영 지원 시스템 총괄",
          period: "2024.04 ~ 현재",
          role: "CRM 총괄, 상담 프로세스 디지털 전환 및 자동화",
          achievements: [
            "제조/유통 현장에서 축적한 고객 접점 자동화 및 프로세스 혁신 역량을 결합하여 CS 처리 리드타임을 2시간에서 5분으로 95% 단축",
            "고객 문의 패턴 데이터 분석 기반 맞춤형 챗봇 응대 시나리오를 설계하여 단순 반복 문의 자동 처리율 극대화 및 상담 품질 표준화 달성"
          ],
          skills: ["CRM Operation", "Chatbot Design", "Customer Experience (CX)", "Process Innovation"]
        }
      ]
    },
    {
      company: "(주)케이투시스템이엔지",
      position: "총무/과장 (가스용품제조시설 안전관리총괄자, DX 및 해외무역 총괄)",
      period: "2016.04 ~ 2023.01",
      description: "비즈니스 프로세스 디지털 전환(DX), 법정 안전관리총괄(품질/인증/검사) 및 해외 무역 실무 총괄",
      projects: [
        {
          title: "비즈니스 프로세스 데이터화 및 고객 접점 디지털 전환 (DX)",
          period: "2019.01 ~ 2023.01",
          role: "디지털 전환(DX) 기획 및 프로세스 자동화 총괄",
          achievements: [
            "채널톡 도입 및 고객 상담 패턴 데이터 분석 기반 챗봇 시나리오 설계로 대기시간 단축 및 응대 품질 표준화",
            "엑셀 참조 함수 기반 검사 신청 자동화 테이블 구축으로 수기 작업 공수 대폭 절감",
            "재코팅 서비스 프로세스 재설계(선출고-후반납)로 월 거래량 10건에서 400건(40배) 확장 달성",
            "자사 웹사이트 기획·운영 및 디지털 제품 등록 관리 체계 수립"
          ],
          skills: ["Digital Transformation", "Process Innovation", "Chatbot Design", "Excel Automation", "Web Management"]
        },
        {
          title: "가스용품제조시설 법정 안전관리총괄 및 품질·인증 관리",
          period: "2016.10 ~ 2023.01",
          role: "안전관리총괄자 (한국가스안전공사 법정 선임)",
          achievements: [
            "일반시설안전관리자 자격 기반 가스안전공사 가스용품제조시설 안전관리총괄자로 선임되어 퇴사 시까지 법정 안전교육 및 안전관리 전담",
            "가스용품 제조시설 품질관리 체계 운영, 신규 제품설계 인증 및 상시제품검사 수검 전 과정 총괄"
          ],
          skills: ["Facility Safety Management", "Quality Assurance", "Design Certification", "Statutory Safety Training"]
        },
        {
          title: "해외 무역 실무, 글로벌 바이어 상담 및 해외 전시회 총괄",
          period: "2018.03 ~ 2023.01",
          role: "해외 무역 및 전시회 총괄 기획",
          achievements: [
            "해외 전시회 부스 기획, 현장 바이어 미팅 및 수출 상담 총괄",
            "원산지 인증 및 통관·선적 등 무역사무 전반 주도로 2022년 연간 수출액 7만 불 달성"
          ],
          skills: ["Global Trade", "Buyer Consultation", "Exhibition Planning", "Certificate of Origin"]
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
