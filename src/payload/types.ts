export interface IProfile {
  name: string
  position: string
  email: string
  phone: string
  github: string
  location: string
}

export interface IIntroduce {
  contents: string[]
}

export interface ISkillCategory {
  category: string
  items: string[]
}

export interface ISkill {
  categories: ISkillCategory[]
}

export interface IExperienceProject {
  title: string
  period: string
  role?: string
  achievements?: string[]
  skills?: string[]
}

export interface IExperienceItem {
  company: string
  position: string
  period: string
  description?: string
  projects?: IExperienceProject[]
}

export interface IExperience {
  list: IExperienceItem[]
}

export interface IProjectItem {
  title: string
  period: string
  where?: string
  description?: string
  achievements?: string[]
  skills?: string[]
  link?: string
}

export interface IProject {
  list: IProjectItem[]
}

export interface IEducationItem {
  institution: string
  course: string
  period: string
}

export interface IEducation {
  list: IEducationItem[]
}

export interface ICertificationItem {
  name: string
  issuer: string
  date: string
}

export interface IEtc {
  certifications: ICertificationItem[]
}

export interface IFooter {
  sign: string
  since: number
  github: string
  originalRepo?: string
}

export interface PayloadType {
  profile: IProfile
  introduce: IIntroduce
  skill: ISkill
  experience: IExperience
  project: IProject
  education: IEducation
  etc: IEtc
  footer: IFooter
}
