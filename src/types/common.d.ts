export interface Page {
  id: string
  path: string
  name: string
}

export interface SidebarLink extends Omit<Page, 'path'> {
  path?: string
  children?: Page[]
  icon?: JSX.Element
}

export interface DecodedToken {
  token_type: string
  exp: number
  iat: number
  jti: string
  user_id: number
  obj: {
    id: number
    profile: {
      name: string | null
      email: string
      role: string
    }
    teacher_code: name | null,
    sr_no?: string
    enrollment?: string
    branch: {
      branch_name: string
      branch_code: string
      slug: string
    }
  }
}

// for displaying the streams,semester and divisions and batches
interface SelectionResponse {
  slug: string
  name: string
}

export interface SelectionProps {
  title: string
  selectedValue: string
  selectedValue2?: string
  onValueChange: (value: string) => void
  placeholder: string
  data: Array<SelectionResponse> | null
  optionTitle?: string | null
}

interface Branch {
  branch_name: string
  slug: string
}

export interface StreamInterface {
  title: string
  slug: string
  branch: Branch
  stream_code: string
  choices_saved: boolean
  choices_locked: boolean
  saved_subjects: Array<any>
}

declare global {
  interface Window {
    base_url: string,
    socket_url: string
  }
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export type StudentData = {
  name: string
  enrollment: number
  division: string
  batch: string
  status: string
  time: string
}

export type SubjectMap = {
  stream_code: string;
  sem_year: number;
  subject_code: string;
  eff_from: string;
  subject_name: string;
  short_name: string | null;
  category: string;
  L: number;
  P: number;
  T: number;
  credit: number;
  E: number;
  M: number;
  I: number;
  V: number;
  total_marks: number;
  is_elective: boolean;
  is_practical: boolean;
  is_theory: boolean;
  is_semipractical: boolean;
  is_functional: boolean;
  practical_exam_duration: string;
  theory_exam_duration: string;
  remark: string;
  acedemic_year: string;
  is_technical: boolean;
  slug: string;
  similar_subjects: SubjectMap[];
  priority: string | null;
  teachers: string | null;
};

export type Semester = {
  slug: string;
  no: number;
  status: boolean;
  stream: {
    title: string;
    stream_code: string;
    slug: string;
    branch: {
      branch_name: string;
      slug: string;
    };
  };
};

export type IncludedBatch = {
  slug: string;
  batch_name: string;
  division: {
    division_name: string;
    slug: string;
    full_name: string;
  };
};

export type Subject = {
  subject_map: SubjectMap;
  stream: string;
  semester: Semester;
  included_batches: IncludedBatch[];
  slug: string;
};

export type Teacher = {
  slug: string;
  profile: {
    name: string;
    email: string;
    role: string;
  };
  branch: {
    branch_name: string;
    slug: string;
  };
  teacher_code: string;
};

export type Classroom = {
  class_name: string;
  slug: string;
};

export type Batch = {
  slug: string;
  batch_name: string;
  division: {
    division_name: string;
    slug: string;
    full_name: string;
  };
};

export type Session = {
  session_id: string;
  active: boolean | null;
  day: string | null;
};

export type Lecture = {
  start_time: string;
  end_time: string;
  type: string;
  subject: Subject;
  teacher: Teacher;
  classroom: Classroom;
  batches: Batch[];
  slug: string;
  session: Session;
  is_active: boolean;
  is_proxy: boolean;
  link: string | null;
  division_name: string;
  semester: number;
  schedule: string;
};

export type LecturesResponseSession = {
  lecture: Lecture[]
}

export type Branch = {
  branch_name: string;
  branch_slug: string;
  lectures: Lecture[];
};
export type LectureDetails = Branch[];


export type StudentData = {
  name: string
  enrollment: number
  division: string
  batch: string
  status: string
  time: string
}

export type SubjectMap = {
  stream_code: string;
  sem_year: number;
  subject_code: string;
  eff_from: string;
  subject_name: string;
  short_name: string | null;
  category: string;
  L: number;
  P: number;
  T: number;
  credit: number;
  E: number;
  M: number;
  I: number;
  V: number;
  total_marks: number;
  is_elective: boolean;
  is_practical: boolean;
  is_theory: boolean;
  is_semipractical: boolean;
  is_functional: boolean;
  practical_exam_duration: string;
  theory_exam_duration: string;
  remark: string;
  acedemic_year: string;
  is_technical: boolean;
  slug: string;
  similar_subjects: SubjectMap[];
  priority: string | null;
  teachers: string | null;
};

export type Semester = {
  slug: string;
  no: number;
  status: boolean;
  stream: {
    title: string;
    stream_code: string;
    slug: string;
    branch: {
      branch_name: string;
      slug: string;
    };
  };
};

export type IncludedBatch = {
  slug: string;
  batch_name: string;
  division: {
    division_name: string;
    slug: string;
    full_name: string;
  };
};

export type Subject = {
  subject_map: SubjectMap;
  stream: string;
  semester: Semester;
  included_batches: IncludedBatch[];
  slug: string;
};

export type Teacher = {
  slug: string;
  profile: {
    name: string;
    email: string;
    role: string;
  };
  branch: {
    branch_name: string;
    slug: string;
  };
  teacher_code: string;
};

export type Classroom = {
  class_name: string;
  slug: string;
};

export type Batch = {
  slug: string;
  batch_name: string;
  division: {
    division_name: string;
    slug: string;
    full_name: string;
  };
};

export type Session = {
  session_id: string;
  active: boolean | null;
  day: string | null;
};

export type Lecture = {
  start_time: string;
  end_time: string;
  type: string;
  subject: Subject;
  teacher: Teacher;
  classroom: Classroom;
  batches: Batch[];
  slug: string;
  session: Session;
  is_active: boolean;
  is_proxy: boolean;
  link: string | null;
  division_name: string;
  semester: number;
  schedule: string;
};

export type LecturesResponseSession = {
  lecture: Lecture[]
}

export type Branch = {
  branch_name: string;
  branch_slug: string;
  lectures: Lecture[];
};
export type LectureDetails = Branch[];



// Profile Interface
interface Profile {
  name: string;
  email: string;
  role: string;
}

// Subject Interface
interface Subject {
  stream_code: string;
  sem_year: number;
  subject_code: string | null;
  eff_from: string | null;
  subject_name: string;
  short_name: string | null;
  category: string;
  L: number;
  P: number;
  T: number;
  credit: number;
  E: number | null;
  M: number | null;
  I: number | null;
  V: number | null;
  total_marks: number | null;
  is_elective: boolean;
  is_practical: boolean;
  is_theory: boolean;
  is_semipractical: boolean;
  is_functional: boolean;
  practical_exam_duration: string | null;
  theory_exam_duration: string | null;
  remark: string | null;
  acedemic_year: string;
  is_technical: boolean;
  slug: string;
  ordering: number | null;
}

// Teacher Interface
interface Teacher {
  slug: string;
  profile: {
    name: string;
    email: string;
    role: string;
  };
  teacher_code: string;
}


// Teacher Allocation Item Interface
interface TeacherAllocationItem {
  teacher: Teacher;
  hours: number;
}

// Allocation Type Details Interface
interface AllocationTypeDetails {
  total_hours: number;
  remaining_hours: number;
  allocation_done: numner;
  teachers: TeacherAllocationItem[];
}

// Teacher Allocation Interface
interface TeacherAllocation {
  theory: AllocationTypeDetails;
  lab: AllocationTypeDetails;
  tutorial: AllocationTypeDetails;
  practical: AllocationTypeDetails;
}


interface SeparateAllocationTeacher {
  practical: AllocationTypeDetails;
}


// Instant/Separate Allocation Interface
interface SubjectAllocation {
  subject: Subject;
  teacher_allocation: TeacherAllocation;
}

interface SeparateAllocation {
    subject: Subject
    teacher_allocation : SeparateAllocationTeacher
}

// Subject-Specific Allocation Interface
interface SubjectSpecificAllocation {
  subject: Subject; // The full subject details
  hours: number;    // Number of hours allocated
}

type TeacherToSubjectMap = {
  [key: string]: {
    teacher: Teacher;
    initial_theory_hour : numner
    initial_lab_hours :number
    initial_practical_sub_hours  : number
    total_hours_left: number;
    total_theory_hours: number;
    total_lab_hours: number;
    total_practical_sub_hours: number;
    total_tutorial_hours: number;
    theory?: Record<string, SubjectSpecificAllocation> | null;
    lab?: Record<string, SubjectSpecificAllocation> | null;
    practical?: Record<string, SubjectSpecificAllocation> | null;
    tutorial?: Record<string, SubjectSpecificAllocation> | null;
  };
};




interface statsInterface {
  total_subject_hours_instant_allocation: number;
  total_subject_hours_separate_allocation: number;
  unallocated_subject_hours_instant_allocation: number;
  unallocated_subject_hours_serparate_allocation: number;
  total_teacher_hours_instant_allocation: number;
  total_teacher_hours_separate_allocation: number;
  unallocated_teacher_hours_instant_allocation: number;
  unallocated_teacher_hours_separate_allocation: number;
}
// Subject to Teacher Mapping Interface
interface SubjectToTeacherMap {
  stats:statsInterface
  instant_allocations: SubjectAllocation[];
  separate_allocations: SubjectAllocation[];
}

// Main Response Interface
interface TeacherAllocationResponse {
  data: {
      teacher_to_subject_map: TeacherToSubjectMap;
      subject_to_teacher_map: SubjectToTeacherMap;
  };
  error: boolean;
  message: string | null;
}