-- Seed Data for resume-vuejs (8 Domains)
-- Matches src/payload/*.ts

-- 1. Profile
INSERT INTO public.profile (id, name, position, email, phone, github, location)
VALUES (
  'default',
  '남성호',
  'Front-end & Full-stack Engineer',
  'min2spapa@gmail.com',
  '010-9306-2211',
  'https://github.com/initbtn',
  '부산광역시 사하구'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  github = EXCLUDED.github,
  location = EXCLUDED.location,
  updated_at = now();

-- 2. Introduce
INSERT INTO public.introduce (id, contents)
VALUES (
  'default',
  ARRAY[
    '비즈니스 프로세스의 병목을 소프트웨어와 데이터로 해결하는 4년 차 엔지니어입니다.',
    '이종 대외 API 연동, 결제·인증 트랜잭션 무결성 보장, 대규모 정산 백오피스 UI 및 클라우드 인프라 구축을 주도하며 서비스 안정성과 운영 효율성을 극대화해 왔습니다.',
    '선박 배관 설계(조선 도메인 2년) 경험과 비즈니스 운영 프로세스 혁신(7년)을 거쳐, 엔지니어링의 본질을 ''문제를 시스템으로 해결하는 것''으로 정의하고 주도적인 실행력을 발휘합니다.'
  ]
) ON CONFLICT (id) DO UPDATE SET
  contents = EXCLUDED.contents,
  updated_at = now();

-- 3. Skill
TRUNCATE TABLE public.skill RESTART IDENTITY;
INSERT INTO public.skill (category, items, order_index) VALUES
('Front-end', ARRAY['Vue.js 3', 'React.js', 'JavaScript (ES6+)', 'HTML5/CSS3', 'TailwindCSS', 'Axios', 'Chart.js / ECharts'], 1),
('Back-end & Cloud', ARRAY['Node.js', 'Express', 'RESTful API', 'AWS', 'Akamai Linode', 'Docker', 'Nginx'], 2),
('Database & DevOps', ARRAY['MySQL', 'Sequelize ORM', 'Terraform', 'Ansible', 'Git / GitHub', 'Loki / Promtail'], 3),
('Domain Knowledge', ARRAY['조선·해양 도메인 (선박 배관 및 P&ID 이해)', '결제/인증/보험 Open API 연동', '제로트러스트 보안 체계'], 4);

-- 4. Experience
TRUNCATE TABLE public.experience RESTART IDENTITY;
INSERT INTO public.experience (company, position, period, description, projects, order_index) VALUES
(
  '(주)리트러스트',
  '개발팀 / 프로 (Front-end & Cloud Engineer)',
  '2023.10 ~ 현재',
  '여행자 금융·보험 플랫폼 B2C/B2B 서비스 및 클라우드 인프라 엔드투엔드 개발·운영',
  '[
    {
      "title": "여행자 보험 서비스 핵심 트랜잭션 및 대외 API 연동 개발",
      "period": "2024.04 ~ 2025.03",
      "role": "프론트엔드 클라이언트 개발 및 트랜잭션 예외 처리",
      "achievements": [
        "결제·인증·보험 Open API 다중 비동기 연동 간 이중 요청 방지 및 에러 복구 UI를 구현하여 중복 결제 오류 0% 달성",
        "대외 API 12건 연동 및 핵심 트랜잭션 안정화로 누적 가입자 2,653건 확보 (전년 대비 5배 성장)",
        "백오피스 내 메시지 템플릿 관리 UI를 자체 구축하여 CS 처리 리드타임을 2시간에서 5분으로 95% 단축",
        "구글챗 웹훅 기반 실시간 에러 모니터링 파이프라인을 구축해 장애 인지 시간을 수십 분~수 시간에서 1초 이내(실시간)로 단축",
        "에러 로그 파라미터 기반 원인 파악 체계를 마련해 장애 대응 리드타임을 평균 15분 이내로 약 80% 이상 단축"
      ],
      "skills": ["React.js", "REST API", "Axios", "PG Gateway", "AWS", "Nginx", "Docker"]
    },
    {
      "title": "B2B 파트너 정산 포털 및 통합 백오피스 어드민 플랫폼 개발",
      "period": "2024.08 ~ 2025.01",
      "role": "프론트엔드 전담 (기여도 100%)",
      "achievements": [
        "수천 건의 청약/정산 데이터를 조건별로 지연 없이 조회하는 고성능 데이터 테이블 및 다차원 필터링 UI 구현",
        "B2B 파트너사 및 사내 관리자 등 사용자 권한별 접근 제어를 위한 Role-based 라우팅 및 조건부 메뉴 렌더링 처리",
        "월별 거래 추이 및 정산 현황 등 핵심 비즈니스 KPI를 시각화하는 차트 대시보드 컴포넌트 개발"
      ],
      "skills": ["React.js", "REST API", "Chart.js", "CSS Module", "JavaScript"]
    },
    {
      "title": "인슈어트러스트 제로트러스트 기반 멀티클라우드 MSA & IaC 리팩토링",
      "period": "2026.01 ~ 2026.03",
      "role": "인프라 & DevOps 총괄",
      "achievements": [
        "외부 노출 공용 자산 수 70% 감소 및 서버 직접 SSH 접근 100% 제거 (Bastion 호스트 경유 필수화)",
        "Terraform 및 Ansible 기반 IaC 파이프라인 구축으로 신규 환경 구축 소요 시간 1일에서 1시간으로 단축 (95% 단축)",
        "Promtail-Loki 기반 통합 로그 파이프라인 구축으로 로그 수집 커버리지 100% 달성"
      ],
      "skills": ["AWS", "Linode", "Terraform", "Ansible", "Docker-compose", "Loki", "Promtail"]
    }
  ]'::jsonb,
  1
),
(
  '(주)케이투시스템이엔지',
  '총무/과장 (CS 총괄, 안전관리, 프로세스 혁신)',
  '2016.04 ~ 2023.01',
  '비즈니스 프로세스 데이터화, 고객 접점 디지털 전환 및 법정 안전관리 총괄',
  '[
    {
      "title": "고객 서비스 프로세스 개선 및 상담 자동화 시스템 구축",
      "period": "2021.05 ~ 2022.12",
      "role": "프로세스 혁신 기획 및 자동화 툴 제작",
      "achievements": [
        "엑셀 참조 함수 기반 검사 신청 자동화 테이블 구축으로 수기 작업 공수 대폭 절감",
        "채널톡 도입 및 상담 패턴 분석을 통한 챗봇 자동응대 시나리오 설계로 대기시간 단축 및 응대 품질 표준화",
        "재코팅 서비스 프로세스 재설계(선출고-후반납)로 월 거래량 10건에서 400건(40배) 확장 달성"
      ],
      "skills": ["Business Analysis", "Chatbot Design", "Excel Automation", "Process Innovation"]
    }
  ]'::jsonb,
  2
),
(
  'DG기술 (㈜마린하우스)',
  '설계팀 / 사원 (조선 배관의장 설계)',
  '2014.04 ~ 2016.04',
  '드릴쉽(Drillship) 및 대형 선박 주요 구역 배관의장 2D/3D CAD 상세 설계',
  '[
    {
      "title": "선박 펌프룸(Pump room) 및 카고 구역 배관 상세 설계",
      "period": "2014.04 ~ 2016.04",
      "role": "배관의장 CAD 설계 및 현장 테스트 Follow-up",
      "achievements": [
        "Pump room, Mud & Bulk tank room, Cargo tank 구역 배관 상세 설계 및 BOM 자재 관리",
        "선박 계장도(P&ID) 및 설치 환경 분석을 바탕으로 현장 오차 최소화 및 선주/선급 검사 대응"
      ],
      "skills": ["Aveva Marine CAD", "P&ID", "Shipbuilding Piping", "BOM Management"]
    }
  ]'::jsonb,
  3
);

-- 5. Project
TRUNCATE TABLE public.project RESTART IDENTITY;
INSERT INTO public.project (title, period, "where", description, achievements, skills, link, order_index) VALUES
(
  'Next.js 기반 이력서 웹 플랫폼의 Vue.js 프레임워크 포팅 (resume-vuejs)',
  '2026.09 ~ 현재',
  '개인 오픈소스 포팅 프로젝트',
  'Next.js 기반 오픈소스 이력서 아키텍처를 Vue 3 Composition API, TypeScript Strict, Vitest TDD 및 Supabase BaaS 하이브리드 파이프라인으로 전환',
  ARRAY[
    'Next.js 데이터 구조를 Vue 3 Single File Component(<script setup lang="ts">)로 전면 포팅 및 완전 타입 바인딩',
    'Vitest 기반 단위 테스트 TDD 파이프라인 및 GitHub Actions Pages 자동 배포 체계 수립',
    'Supabase BaaS 연동 및 원격 장애/부재 시 정적 로컬 payload로 100% 자동 Fallback되는 방어 로직 구현'
  ],
  ARRAY['Vue.js 3', 'TypeScript', 'Vite', 'Vitest', 'TailwindCSS', 'Supabase', 'GitHub Actions'],
  'https://github.com/initbtn/resume-vuejs',
  1
),
(
  '해양 친환경 설비 실시간 센서 모니터링 및 GIS 관제 웹 플랫폼',
  '2026.09 ~ (주제선정 및 기획)',
  '친환경 스마트 선박 관제 솔루션 (기획/사전조사)',
  'IMO 환경 규제 대응 탈황 설비(Scrubber) 및 선박 평형수처리(BWTS) 실시간 센서 관제 대시보드 (주제 선정 및 아키텍처 기획 단계)',
  ARRAY[
    'IMO 환경 규제 대응 선박 배기가스 탈황 및 평형수 설비의 실시간 센서 관제 도메인 요구사항 조사 및 주제 선정',
    '해양 GIS 지도 라이브러리(Leaflet/OpenLayers) 기반 전 세계 선박 항적 시각화 및 ECharts 시계열 차트 기술 스택 검토',
    '초 단위 텔레메트리 센서 데이터 처리를 위한 WebSocket 기반 실시간 스트리밍 파이프라인 및 경보 인디케이터 구조 설계 기획'
  ],
  ARRAY['Vue.js 3', 'Leaflet GIS', 'ECharts', 'WebSocket', 'TimeSeries Data', 'System Design'],
  NULL,
  2
);

-- 6. Education
TRUNCATE TABLE public.education RESTART IDENTITY;
INSERT INTO public.education (institution, course, period, order_index) VALUES
('부산인재개발원 (부산IT교육센터)', 'K-디지털 빅데이터 분석 시각화 UI 콘텐츠 개발', '2023.02 ~ 2023.08', 1),
('영산대학교 / 부산인력개발원', '해양플랜트이론, 설계기술관리, 해양플랜트 설계(Aveva Marine CAD)', '2014.01', 2),
('영산대학교', '법률학부 법학 전공 (학점 3.78 / 4.5)', '2006.02 ~ 2014.02', 3);

-- 7. Etc (Certifications)
TRUNCATE TABLE public.etc RESTART IDENTITY;
INSERT INTO public.etc (name, issuer, date, order_index) VALUES
('정보처리기사', '한국산업인력공단', '2024.06', 1),
('일반제조시설안전관리자', '한국가스안전공사', '2017.06', 2),
('자동차운전면허 1종 보통', '부산지방경찰청', '2007.05', 3),
('워드프로세서 3급', '대한상공회의소', '1999.08', 4);

-- 8. Footer
INSERT INTO public.footer (id, sign, since, github, "originalRepo")
VALUES (
  'default',
  'Sung-Ho Nam',
  2026,
  'https://github.com/initbtn/resume-vuejs',
  'https://github.com/uyu423/resume-nextjs'
) ON CONFLICT (id) DO UPDATE SET
  sign = EXCLUDED.sign,
  since = EXCLUDED.since,
  github = EXCLUDED.github,
  "originalRepo" = EXCLUDED."originalRepo",
  updated_at = now();
