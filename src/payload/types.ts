export namespace IProfile {
  export interface Payload {
    name: string;
    position: string;
    email: string;
    phone: string;
    github: string;
    location: string;
  }
}

export namespace IIntroduce {
  export interface Payload {
    contents: string[];
  }
}

export namespace ISkill {
  export interface Category {
    category: string;
    items: string[];
  }
  export interface Payload {
    categories: Category[];
  }
}

export namespace IExperience {
  export interface Project {
    title: string;
    period: string;
    role: string;
    achievements: string[];
    skills: string[];
  }
  export interface Item {
    company: string;
    position: string;
    period: string;
    description: string;
    projects: Project[];
  }
  export interface Payload {
    list: Item[];
  }
}

export namespace IProject {
  export interface Item {
    title: string;
    period: string;
    where: string;
    description: string;
    achievements: string[];
    skills: string[];
    link?: string;
  }
  export interface Payload {
    list: Item[];
  }
}

export namespace IEducation {
  export interface Item {
    institution: string;
    course: string;
    period: string;
  }
  export interface Payload {
    list: Item[];
  }
}

export namespace IEtc {
  export interface Certification {
    name: string;
    issuer: string;
    date: string;
  }
  export interface Payload {
    certifications: Certification[];
  }
}

export namespace IFooter {
  export interface Payload {
    sign: string;
    since: number;
    github: string;
    originalRepo: string;
  }
}

export interface IGlobalPayload {
  profile: IProfile.Payload;
  introduce: IIntroduce.Payload;
  skill: ISkill.Payload;
  experience: IExperience.Payload;
  project: IProject.Payload;
  education: IEducation.Payload;
  etc: IEtc.Payload;
  footer: IFooter.Payload;
}
