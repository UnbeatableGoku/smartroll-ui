import { Option } from '@components/common/multi-select'

export interface IinstantSession {
  branch: string
  semester: string
  divisions: string[]
  batches: string[]
  subject: string
  title: string
}

export interface InstantSessionMetataData {
  branches: Option[]
  semesters: Option[]
  divisions: Option[]
  batches: Option[]
  subjects: Option[]
  tittle: string | null
}
