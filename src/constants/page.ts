import { Page } from 'types/common'

export const PAGE_LOGIN: Page = {
  id: 'LOGIN',
  path: '/login',
  name: 'Login',
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
export const PAGE_ELECTIVE_SUBJECT: Page = {
  id: 'ELECTIVE_SUBJECT',
  path: '/student-dashboard/elective-subject',
  name: 'Elective Subject',
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
