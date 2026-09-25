import { profile } from './profile'
import { introduce } from './introduce'
import { skill } from './skill'
import { experience } from './experience'
import { project } from './project'
import { education } from './education'
import { etc } from './etc'
import { footer } from './footer'
import type { PayloadType } from './types'

export const Payload: PayloadType = {
  profile,
  introduce,
  skill,
  experience,
  project,
  education,
  etc,
  footer
}

export default Payload
export * from './types'
