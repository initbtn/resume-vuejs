import type { PayloadType } from '../types/payload.types'

/**
 * 초기 마운트 시 화면 깜빡임(Flicker / Layout Shift) 없이 첫 프레임부터
 * 온전한 프로필 레이아웃을 표시하기 위한 정적 기본 데이터 (Client Safe, Zero Secret)
 * 
 * 마운트 후 useResumeData 가 백그라운드에서 WAS 게이트웨이(/api/resume)를 통해
 * DB 최신 변경사항을 가져와 부드럽게 갱신(Revalidate)합니다.
 */
export const initialResumePayload: PayloadType = {
  profile: {
    name: '남성호',
    position: 'Front-end & Full-stack Engineer',
    email: 'min2spapa@gmail.com',
    phone: '010-9306-2211',
    github: 'https://github.com/initbtn',
    location: '부산광역시 사하구',
    blog: 'https://domlog.vercel.app'
  },
  introduce: {
    contents: [
      '비즈니스 프로세스의 병목을 소프트웨어와 데이터로 해결하는 4년 차 엔지니어입니다.',
      '이종 대외 API 연동, 결제·인증 트랜잭션 무결성 보장, 대규모 정산 백오피스 UI 및 클라우드 인프라 구축을 주도하며 서비스 안정성과 운영 효율성을 극대화해 왔습니다.',
      '선박 배관 설계(조선 도메인 2년) 경험과 비즈니스 운영 프로세스 혁신(7년)을 거쳐, 엔지니어링의 본질을 \'문제를 시스템으로 해결하는 것\'으로 정의하고 주도적인 실행력을 발휘합니다.'
    ]
  },
  highlight: {
    list: [
      {
        id: 1,
        order_index: 0,
        title: 'User-Centered Development',
        description: '조선·해양 현장, 교육, 보험 서비스 등 다양한 도메인을 경험하며 사용자의 입장에서 불편을 먼저 살피고, 화면과 오류 처리까지 사용자 관점에서 고민하며 개발하려 노력합니다',
        keywords: ['User Perspective', 'Diverse Experience', 'UX Details']
      },
      {
        id: 2,
        order_index: 1,
        title: 'Partner Communication',
        description: '작은 팀에서 보험사·보험협회·PG·본인인증·블록체인 등 외부 파트너와의 소통을 직접 맡아 정산, 클레임, 시스템 연계를 조율하며 협업하는 법을 배우고 있습니다',
        keywords: ['External Collaboration', 'Coordination', 'Communication']
      },
      {
        id: 3,
        order_index: 2,
        title: 'Documentation & Records',
        description: '팀 업무와 개인 프로젝트 모두에서 이슈와 PR로 작업의 이유와 과정을 기록해, 동료가 읽고 이어받을 수 있는 흔적을 남기려 노력합니다',
        keywords: ['Documentation', 'Issue Tracking', 'Knowledge Sharing']
      }
    ]
  },
  skill: {
    categories: [
      {
        id: 1,
        order_index: 1,
        category: 'Front-end',
        items: ['React.js', 'JavaScript (ES6+)', 'HTML5/CSS3', 'TailwindCSS']
      },
      {
        id: 2,
        order_index: 2,
        category: 'Back-end',
        items: ['Node.js', 'Express', 'NestJS', 'Docker', 'Nginx', 'MySQL', 'Sequelize ORM']
      },
      {
        id: 3,
        order_index: 3,
        category: 'Infra',
        items: ['AWS', 'Akamai Linode', 'Terraform', 'Ansible', 'Makefile', 'Cloudflare']
      },
      {
        id: 4,
        order_index: 4,
        category: 'Domain Knowledge',
        items: ['결제/인증/보험 Open API 연동', '조선해양 도메인', '가스일반제조시설 안전관리(업무용대형연소기 제조시설 안전관리)']
      }
    ]
  },
  experience: {
    list: []
  },
  project: {
    list: []
  },
  education: {
    list: [
      {
        id: 1,
        order_index: 1,
        institution: '부산인재개발원 (부산IT교육센터)',
        course: 'K-디지털 빅데이터 분석 시각화 UI 콘텐츠 개발',
        period: '2023.02 ~ 2023.08'
      },
      {
        id: 2,
        order_index: 2,
        institution: '영산대학교 / 부산인력개발원',
        course: '해양플랜트이론, 설계기술관리, 해양플랜트 설계(Aveva Marine CAD)',
        period: '2014.01'
      },
      {
        id: 3,
        order_index: 3,
        institution: '영산대학교',
        course: '법률학부 법학 전공 (학점 3.78 / 4.5)',
        period: '2006.02 ~ 2014.02'
      }
    ]
  },
  etc: {
    certifications: [
      {
        id: 1,
        order_index: 1,
        name: '정보처리기사',
        issuer: '한국산업인력공단',
        date: '2024.06'
      },
      {
        id: 2,
        order_index: 1,
        name: '일반제조시설안전관리자',
        issuer: '한국가스안전공사',
        date: '2017.06'
      },
      {
        id: 3,
        order_index: 1,
        name: '자동차운전면허 1종 보통',
        issuer: '부산지방경찰청',
        date: '2007.05'
      },
      {
        id: 4,
        order_index: 1,
        name: '워드프로세서 3급',
        issuer: '대한상공회의소',
        date: '1999.08'
      }
    ]
  },
  footer: {
    sign: 'Sung-Ho Nam',
    since: 2026,
    github: 'https://github.com/initbtn/resume-vuejs',
    originalRepo: 'https://github.com/uyu423/resume-nextjs'
  }
}
