import { Page } from 'types/common'

export const PAGE_LOGIN: Page = {
  id: 'LOGIN',
  path: '/login',
  name: 'Login',
}

export const PAGE_502: Page = {
  id: '502',
  path: '/502',
  name: 'Error502',
}

export const PAGE_DASHBOARD: Page = {
  id: 'DASHBOARD',
  path: '/',
  name: 'Dashboard',
}

export const PAGE_TEACHER_DASHBOARD: Page = {
  id: 'TEACHER-DASHBOARD',
  path: '/teacher-dashboard',
  name: 'Teacher Dashboard',
}

export const PAGE_SUBJECT_SELECT: Page = {
  id: 'SUBJECT-SELECT',
  path: '/subject/subject-select',
  name: 'subject',
}

export const PAGE_SUBJECT_CHOICE: Page = {
  id: 'SUBJECT-CHOICE',
  path: '/teacher-dashboard/subject-choice',
  name: 'subject-choice',
}
export const PAGE_TEACHER_ALLOCATION: Page = {
  id: 'TEACHER_ALLOCATION',
  path: '/subject/teacher-allocation',
  name: 'Teacher Allocation',
}
export const PAGE_ELECTIVE_SUBJECT: Page = {
  id: 'ELECTIVE_SUBJECT',
  path: '/student-dashboard/elective-subject',
  name: 'Elective Subject',
}

export const PAGE_STUDENT_DIVISION: Page = {
  id: 'STUDENT_DIVISION',
  path: '/student-dashboard/division',
  name: 'Student Division',
}

export const PAGE_STUDENT_DASHBOARD: Page = {
  id: 'STUDENT-DASHBOARD',
  path: '/student-dashboard',
  name: 'Student Dashboard',
}

export const PAGE_TIMETABLE: Page = {
  id: 'TIMETABLE',
  path: '/timetable',
  name: 'Time-Table',
}

export const PAGE_NOT_FOUND: Page = {
  id: 'NOT_FOUND',
  path: '/not-found',
  name: 'Page Not Found',
}

export const PAGE_SUBJECT_SELECTION_CONFIRMATION: Page = {
  id: 'SUBJECT_SELECTION_CONFIRMATION',
  path: '/subject/subject-selection-confirmation',
  name: 'Subject Confirmation',
}

export const DIVISION_CREATION: Page = {
  id: 'DIVISION_CREATION',
  path: '/division-creation',
  name: 'division-creation',
}

export const FORGOT_PASSWORD: Page = {
  // update_password
  id: 'FORGOT_PASSWORD',
  path: '/update_password',
  name: 'forgot-password',
}

export const SUBJECT_ALLOCATION: Page = {
  id: 'SUBJECT_ALLOCATION',
  path: '/admin/subject-allocation',
  name: 'Subject Allocation',
}
export const LOAD_ALLOCATION_FOR_TEACHER_END: Page = {
  id: 'LOAD_LOAD_ALLOCATION_FOR_TEACHER_END',
  path: '/teacher-dashboard/load-allocation',
  name: 'Load allocation',
}

export const LECTURE_SESSIONS_HISTORY: Page = {
  id: 'LECTURE_SESSIONS_HISTORY',
  path: '/teacher-dashboard/lecture-history',
  name: 'lecture session history',
}

export const INSTANT_LECTURE: Page = {
  id: 'INSTANT_LECTURE',
  path: '/teacher-dashboard/instant-lecture',
  name: 'instant lecture',
}

export const LECTRUE_ANALYTICS: Page = {
  id: "LECTRUE_ANALYTICS",
  path: "/teacher-dashboard/analytics",
  name: "lecture analytics"
}
/**
 * --------------------------------------------------------------------------
 *                      PROTECTED PAGES
 * --------------------------------------------------------------------------
 *
 */

/**
 * -------------------- User Management --------------------------------------
 */

export const PAGE_USER_MANAGEMENT: Page = {
  id: 'USER_MANAGEMENT',
  path: '/user-management',
  name: 'User Management',
}

export const PAGE_ADD_USER: Page = {
  id: 'CREATE_USER',
  path: PAGE_USER_MANAGEMENT.path + '/add',
  name: 'Add User',
}
export const PAGE_EDIT_USER: Page = {
  id: 'USER_MANAGEMENT',
  path: PAGE_USER_MANAGEMENT.path + '/edit',
  name: 'Edit User',
}

export const PROTECTED_PAGES: Page[] = [PAGE_USER_MANAGEMENT]