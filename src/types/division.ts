export enum DivisionState {
  INITIAL = 'INITIAL',
  INPUT_DIVISION_SIZE = 'INPUT_DIVISION_SIZE',
  INPUT_BATCH_COUNT = 'INPUT_BATCH_COUNT',
  CONFIRM_DIVISON = 'CONFIRM_DIVISION',
}

export type DivisonPhase =
  | 'INITIAL'
  | 'INPUT_DIVISION_SIZE'
  | 'INPUT_BATCH_COUNT'
  | 'CONFIRM_DIVISION'

export interface subjectConfigs {
  slug: string
  student_count: number
  batch_count?: number
  students: Array<any>
}

export interface DivisionConfigs {
  division_name: string
  total_student_count: number
  subjects: subjectConfigs[]
}
export interface DivisionData {
  divisions: DivisionConfigs[]
  hour_deviations: Record<string, any>
}
