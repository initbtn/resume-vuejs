import type { ISkill } from './types'

export const skill: ISkill = {
  categories: [
    {
      category: "Front-end",
      items: ["React.js", "JavaScript (ES6+)", "HTML5/CSS3", "TailwindCSS"]
    },
    {
      category: "Back-end",
      items: ["Node.js", "Express", "NestJS", "Docker", "Nginx", "MySQL", "Sequelize ORM"]
    },
    {
      category: "Infra",
      items: ["AWS", "Akamai Linode", "Terraform", "Ansible", "Makefile", "Cloudflare"]
    },
    {
      category: "Domain Knowledge",
      items: ["결제/인증/보험 Open API 연동", "조선해양 도메인", "가스일반제조시설 안전관리(업무용대형연소기 제조시설 안전관리)"]
    }
  ]
};
