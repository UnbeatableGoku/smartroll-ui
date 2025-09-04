type Lecture = {
  semester_no: number
  division_name: string
  day: string
  start_time: string
  end_time: string
  type: string
  subject_name: string | null
  teacher_name: string | null
  teacher_code: string | null
  batch_name: string | null
  classroom_name: string | null
  classroom_slug: string | null
  session_id: string | null
  session_status: string | null
  lecture_slug: string | null
  is_active: boolean
}

export type BranchLectures = {
  branch_name: string
  lectures: Lecture[]
}

export type LectureStatue = 'pre' | 'post' | 'ongoing'

export interface LectureStatusMap {
  [key: string]: LectureStatue
}

export type micPermission = MediaStream | null
