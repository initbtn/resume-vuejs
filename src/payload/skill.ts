import { ISkill } from './types.ts'

export const skill: ISkill.Payload = {
  categories: [
    {
      category: "Front-end",
      items: ["Vue.js 3", "React.js", "JavaScript (ES6+)", "HTML5/CSS3", "TailwindCSS", "Axios", "Chart.js / ECharts"]
    },
    {
      category: "Back-end & Cloud",
      items: ["Node.js", "Express", "RESTful API", "AWS", "Akamai Linode", "Docker", "Nginx"]
    },
    {
      category: "Database & DevOps",
      items: ["MySQL", "Sequelize ORM", "Terraform", "Ansible", "Git / GitHub", "Loki / Promtail"]
    },
    {
      category: "Domain Knowledge",
      items: ["조선·해양 도메인 (선박 배관 및 P&ID 이해)", "결제/인증/보험 Open API 연동", "제로트러스트 보안 체계"]
    }
  ]
};
