-- Seed Data for resume-vuejs (8 Domains)
-- Matches src/payload/*.ts

-- 1. Profile
INSERT INTO public.profile (id, name, position, email, phone, github, blog, location)
VALUES (
  'default',
  '남성호',
  'Full-stack & Infrastructure Engineer',
  'min2spapa@gmail.com',
  '010-9306-2211',
  'https://github.com/initbtn',
  'https://domlog.vercel.app',
  '부산광역시 사하구'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  github = EXCLUDED.github,
  blog = EXCLUDED.blog,
  location = EXCLUDED.location,
  updated_at = now();

-- 2. Introduce
INSERT INTO public.introduce (id, contents)
VALUES (
  'default',
  ARRAY[
    '비즈니스 프로세스의 병목과 시스템 안정성 문제를 엔지니어링으로 해결하는 4년 차 풀스택 & 인프라 엔지니어입니다.',
    '인슈어트러스트 서비스 전반의 아키텍처 설계와 백엔드·DB 모델링, 무결성 트랜잭션, IaC 기반 인프라 보안 및 관제 파이프라인을 총괄해 왔습니다.',
    '선박 배관 설계(조선 도메인 2년)와 제조·무역·안전관리 및 비즈니스 DX 총괄(7년)의 현장 실행력을 바탕으로, 엔지니어링의 본질을 ''문제를 견고한 시스템으로 해결하는 것''으로 정의합니다.'
  ]
) ON CONFLICT (id) DO UPDATE SET
  contents = EXCLUDED.contents,
  updated_at = now();

-- 3. Skill
TRUNCATE TABLE public.skill RESTART IDENTITY;
INSERT INTO public.skill (category, items, order_index) VALUES
('Front-end', ARRAY['React.js', 'JavaScript (ES6+)', 'HTML5/CSS3', 'TailwindCSS'], 1),
('Back-end', ARRAY['Node.js', 'Express', 'NestJS', 'Docker', 'Nginx', 'MySQL', 'Sequelize ORM'], 2),
('Infra', ARRAY['AWS', 'Akamai Linode', 'Terraform', 'Ansible', 'Makefile', 'Cloudflare'], 3),
('Domain Knowledge', ARRAY['결제/인증/보험 Open API 연동', '조선해양 도메인', '가스일반제조시설 안전관리(업무용대형연소기 제조시설 안전관리)'], 4);

-- 4. Experience
TRUNCATE TABLE public.experience RESTART IDENTITY;
INSERT INTO public.experience (company, position, period, description, projects, order_index) VALUES
(
  '(주)리트러스트',
  '개발팀 / 프로 (Full-stack & DevOps / Cloud Engineer)',
  '2023.10 ~ 현재',
  '금융·보험 플랫폼 ''인슈어트러스트'' 서비스 전반의 아키텍처 설계, 백엔드/DB 모델링, 인프라 보안 및 고객 접점(CRM) 총괄 운영',
  '[
    {
      "title": "인슈어트러스트 서비스 전반 아키텍처 설계 및 인프라·보안 운영",
      "period": "2023.10 ~ 현재",
      "role": "서비스 아키텍처 설계, 백엔드/DB 모델링, 인프라 보안 총괄",
      "achievements": [
        "결제·본인인증·보험 Open API 다중 연동 간 분산 트랜잭션 예외 처리 및 멱등성 보장 로직을 설계하여 중복 결제 오류 0% 달성",
        "대외 금융·보험 API 12건 연동 및 핵심 트랜잭션 안정화로 서비스 누적 가입자 2,653건 확보",
        "청약·정산 핵심 도메인 관계형 DB 스키마 설계 및 인덱스 최적화, 개인정보(PII) 등 민감 데이터 암호화 및 최소 권한 접근 제어 체계 수립",
        "코드 기반 인프라(IaC) 파이프라인 구축을 통한 서비스 환경 프로비저닝 자동화 및 네트워크 보안 경계 강화로 무인가 접근 원천 차단",
        "분산 서비스 통합 로그 파이프라인 및 실시간 웹훅 모니터링 체계를 구축해 장애 인지 시간을 수십 분~수 시간에서 1초 이내(실시간)로 단축",
        "에러 로그 파라미터 기반 원인 분석 체계로 장애 대응 리드타임을 평균 15분 이내로 약 80% 이상 단축"
      ],
      "skills": ["System Architecture", "RDBMS Design", "REST API", "Zero Trust", "IaC (Terraform/Ansible)", "Logging & Monitoring"]
    },
    {
      "title": "고객 상담 경험(CRM) 혁신 및 운영 지원 시스템 총괄",
      "period": "2024.04 ~ 현재",
      "role": "CRM 총괄, 상담 프로세스 디지털 전환 및 자동화",
      "achievements": [
        "제조/유통 현장에서 축적한 고객 접점 자동화 및 프로세스 혁신 역량을 결합하여 CS 처리 리드타임을 2시간에서 5분으로 95% 단축",
        "고객 문의 패턴 데이터 분석 기반 맞춤형 챗봇 응대 시나리오를 설계하여 단순 반복 문의 자동 처리율 극대화 및 상담 품질 표준화 달성"
      ],
      "skills": ["CRM Operation", "Chatbot Design", "Customer Experience (CX)", "Process Innovation"]
    }
  ]'::jsonb,
  1
),
(
  '(주)케이투시스템이엔지',
  '총무/과장 (가스용품제조시설 안전관리총괄자, DX 및 해외무역 총괄)',
  '2016.04 ~ 2023.01',
  '비즈니스 프로세스 디지털 전환(DX), 법정 안전관리총괄(품질/인증/검사) 및 해외 무역 실무 총괄',
  '[
    {
      "title": "비즈니스 프로세스 데이터화 및 고객 접점 디지털 전환 (DX)",
      "period": "2019.01 ~ 2023.01",
      "role": "디지털 전환(DX) 기획 및 프로세스 자동화 총괄",
      "achievements": [
        "채널톡 도입 및 고객 상담 패턴 데이터 분석 기반 챗봇 시나리오 설계로 대기시간 단축 및 응대 품질 표준화",
        "엑셀 참조 함수 기반 검사 신청 자동화 테이블 구축으로 수기 작업 공수 대폭 절감",
        "재코팅 서비스 프로세스 재설계(선출고-후반납)로 월 거래량 10건에서 400건(40배) 확장 달성",
        "자사 웹사이트 기획·운영 및 디지털 제품 등록 관리 체계 수립"
      ],
      "skills": ["Digital Transformation", "Process Innovation", "Chatbot Design", "Excel Automation", "Web Management"]
    },
    {
      "title": "가스용품제조시설 법정 안전관리총괄 및 품질·인증 관리",
      "period": "2016.10 ~ 2023.01",
      "role": "안전관리총괄자 (한국가스안전공사 법정 선임)",
      "achievements": [
        "일반시설안전관리자 자격 기반 가스안전공사 가스용품제조시설 안전관리총괄자로 선임되어 퇴사 시까지 법정 안전교육 및 안전관리 전담",
        "가스용품 제조시설 품질관리 체계 운영, 신규 제품설계 인증 및 상시제품검사 수검 전 과정 총괄"
      ],
      "skills": ["Facility Safety Management", "Quality Assurance", "Design Certification", "Statutory Safety Training"]
    },
    {
      "title": "해외 무역 실무, 글로벌 바이어 상담 및 해외 전시회 총괄",
      "period": "2018.03 ~ 2023.01",
      "role": "해외 무역 및 전시회 총괄 기획",
      "achievements": [
        "해외 전시회 부스 기획, 현장 바이어 미팅 및 수출 상담 총괄",
        "원산지 인증 및 통관·선적 등 무역사무 전반 주도로 2022년 연간 수출액 7만 불 달성"
      ],
      "skills": ["Global Trade", "Buyer Consultation", "Exhibition Planning", "Certificate of Origin"]
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
    'WAS API 게이트웨이(/api/*) 구축을 통한 브라우저 자격증명 완전 은닉(Zero Client Secrets) 및 장애 시 100% 자동 Fallback 하이브리드 아키텍처 수립'
  ],
  ARRAY['Vue.js 3', 'TypeScript', 'Vite', 'Vitest', 'TailwindCSS', 'Supabase', 'Vercel', 'GitHub Actions'],
  'https://github.com/initbtn/resume-vuejs',
  1
),
(
  '2026 부산교구 젊은이의 날(BYD) 순례자 참여형 웹 앱 (busan-youth-day)',
  '2026.09 ~ 2026.10',
  '천주교 부산교구 젊은이의 날 (개인 개발)',
  '행사 일정·스포원파크 지도·스탬프투어·소통피드를 제공하는 Next.js 14 기반 모바일 PWA 웹 앱 (Vercel 배포)',
  ARRAY[
    '카카오 SSO 인증과 온보딩 순례 공동체(수호성인 모둠) 무작위 배정 및 Supabase 연동 구현',
    '소통피드 이미지·숏츠 영상 클라이언트 압축 및 HEIC→WebP 변환 후 Cloudflare R2 업로드 파이프라인 구축',
    '스포원파크 4대 테마존 인터랙티브 지도, A/B/C 구역별 통합 시간표, QR 스캔 스탬프투어 구현'
  ],
  ARRAY['Next.js 14', 'React 18', 'TypeScript', 'TailwindCSS', 'Supabase', 'Cloudflare R2', 'Kakao SSO', 'Playwright', 'Vercel'],
  'https://github.com/initbtn/busan-youth-day',
  2
),
(
  '해양 친환경 설비 실시간 센서 모니터링 & 해양 GIS 원격 위성관제 플랫폼 (marine-sensor-gis)',
  '2026.10 ~ 현재',
  '해양 친환경 설비 원격관제 (개인 개발)',
  '선박 탈황 스크러버(PaSOx)·평형수(GloEn-Patrol)·탄소포집(PaCCUS) 실시간 10Hz 센서 원격 감시 및 해양 GIS 위성 관제 SPA 플랫폼 (Vercel 배포)',
  ARRAY[
    '부산항~대한해협(TSS) 서수로 실제 해상 항로 데드레커닝 항행 엔진 및 IEC 62288 침로 벡터/16방위 나침반 툴팁 연동',
    'Zustand 기반 10Hz 고빈도 텔레메트리 스트림 영속 App Shell 라우팅 및 무중단 HMI 4대 직무 관제 뷰 구축',
    '개인정보 미수집(Zero-PII) 단방향 해시 식별자(usr_****) 세션 인증 및 실시간 동시 접속자 DAU 감사 트레일 구축',
    'IMO MARPOL 법정 보존 데이터 Cloudflare R2 아카이빙 및 WAS 단일 게이트웨이·클라이언트 스토리지 쓰기 차단 보안 아키텍처 수립'
  ],
  ARRAY['React 18', 'TypeScript', 'Leaflet GIS', 'Apache ECharts', 'Zustand', 'TailwindCSS', 'Supabase', 'Cloudflare R2', 'Vitest', 'Playwright', 'Vercel'],
  'https://github.com/initbtn/marine-sensor-gis',
  3
),
(
  'AI 에이전트 & 웹·데브옵스 최신 동향 리서치 & RAG 어시스턴트 (assist)',
  '2026.10 ~ 현재',
  '개인 개발 어시스턴트 백엔드 & 텔레그램 봇',
  'GitHub 릴리스/RFC/기술 동향을 자동 수집·적재하고 아침 요약 리포트 발송 및 즉각 RAG 질의응답을 제공하는 FastAPI + LangChain 어시스턴트 (GCP 배포)',
  ARRAY[
    '동적 리서치 타겟 관리 및 해시 기반 중복 수집 방지 파이프라인(Supabase pgvector) 구축',
    'Snowflake Arctic Embed v2 로컬 임베딩 및 Ollama(Gemma 3 12B / Hermes 3 8B) 3줄 요약·RAG 질의응답 엔진 구현',
    'Telegram 봇(@DomAssistBot) 일일 브리핑 자동 발송 및 양방향 웹훅 질의응답 인터페이스 구현',
    'GCP e2-micro(marine-edge-pc) 상시 경량 Docker 컨테이너 배포 및 IP 방화벽 보안 배선 수립'
  ],
  ARRAY['Python 3.12', 'FastAPI', 'LangChain', 'Supabase', 'pgvector', 'Ollama', 'Gemma 3', 'Telegram Bot API', 'Docker', 'GCP'],
  'https://github.com/initbtn/assist',
  4
),
(
  '실시간 상담사 대시보드 & Firestore 하이브리드 영속화 엔지니어링 블로그 (domlog)',
  '2026.10 ~ 현재',
  '기술 블로그 및 풀스택 실시간 시스템 (개인 개발)',
  '소프트웨어 아키텍처 및 시스템 엔지니어링 기록을 다루며, 텔레그램 양방향 연동 실시간 상담 채팅 및 Firestore 하이브리드 영속화를 지원하는 Next.js 16 플랫폼 (Vercel 배포)',
  ARRAY[
    'Cloud Firestore 기반 분산 락킹 세션 스토리지 및 메모리 폴링·쓰기 쓰로틀링(Throttling) 하이브리드 영속화 파이프라인 구축',
    '서버리스 WAS 게이트웨이를 경유하는 텔레그램 Bot API 양방향 웹훅 수신 및 실시간 릴레이 대시보드(/admin/chat) 구현',
    '정적 클라이언트 번들 내 DB 자격증명 완전 격리(Zero-Secret Architecture) 및 무료 할당량(프로젝트당 1개 DB) 최적화 아키텍처 수립',
    'Next.js App Router Prerender 캐싱 및 카카오톡 2:1/일반 1.91:1 듀얼 크롭 최적화 Open Graph 썸네일 파이프라인 적용'
  ],
  ARRAY['Next.js 16', 'React 19', 'TypeScript', 'TailwindCSS v4', 'Google Cloud Firestore', 'Telegram Bot API', 'Vitest', 'Vercel'],
  'https://domlog.vercel.app',
  5
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
('일반시설안전관리자', '한국가스안전공사', '2016.10', 2),
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
