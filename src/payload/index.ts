import { profile } from './profile.ts'
import { introduce } from './introduce.ts'
import { skill } from './skill.ts'
import { experience } from './experience.ts'
import { project } from './project.ts'
import { education } from './education.ts'
import { etc } from './etc.ts'
import { footer } from './footer.ts'
import { IGlobalPayload } from './types.ts'

export const Payload: IGlobalPayload = {
  profile,
  introduce,
  skill,
  experience,
  project,
  education,
  etc,
  footer
};

export default Payload;
export * from './types.ts';
