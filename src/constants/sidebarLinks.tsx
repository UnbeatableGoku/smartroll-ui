import { DashboardIcon, UserIcon } from '@icons'
import {
  BadgePlus,
  BookCheck,
  Eye,
  FileSpreadsheet,
  SquareCheck,
  UsersRound,
} from 'lucide-react'

import { SidebarLink } from 'types/common'

import { PAGE_USER_MANAGEMENT } from './page'

export const SIDEBAR_LINKS: SidebarLink[] = [
  {
    id: 'DASHBOARD',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    id: 'TIMETABLE',
    name: 'Time-Table',
    icon: (
      <FileSpreadsheet
        className="h-24 w-24 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/timetable',
  },
  {
    id: 'TEACHER-DASHBOARD',
    name: 'Teacher Dashboard',
    icon: <DashboardIcon />,
    path: '/teacher-dashboard',
  },
  {
    id: 'STUDENT-DASHBOARD',
    name: 'Student Dashboard',
    icon: <DashboardIcon />,
    path: '/student-dashboard',
  },
  {
    id: 'SUBJECT-SELECT',
    name: 'Subject Selection',
    icon: (
      <BadgePlus
        className="h-24 w-24 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/subject/subject-select',
  },
  {
    id: 'SUBJECT_SELECTION_CONFIRMATION',
    name: 'Subject Confirmation',
    icon: (
      <Eye
        className="h-24 w-24 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/subject/subject-selection-confirmation',
  },
  {
    id: 'TEACHER_ALLOCATION',
    name: 'Teacher Allocation',
    icon: (
      <UsersRound
        className="h-26 w-26 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/subject/teacher-allocation',
  },
  {
    id: 'ELECTIVE_SUBJECT',
    name: 'Elective Subject',
    icon: (
      <BookCheck
        className="h-26 w-26 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/student-dashboard/elective-subject',
  },
  {
    id: 'STUDENT_DIVISION',
    name: 'Division',
    icon: (
      <UsersRound
        className="h-26 w-26 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/student-dashboard/division',
  },

  {
    id: 'SUBJECT-CHOICE',
    name: 'Subject-Choice',
    icon: (
      <SquareCheck
        className="h-24 w-24 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/teacher-dashboard/subject-choice',
  },
  {
    id: 'DIVISION_CREATION',
    name: 'division-creation',
    icon: (
      <SquareCheck
        className="h-24 w-24 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/division-creation',
  },
  {
    id: 'SUBJECT_ALLOCATION',
    name: 'Subject Allocation',
    icon: (
      <SquareCheck
        className="h-24 w-24 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/admin/subject-allocation',
  },
  {
    id: 'LOAD_ALLOCATION_FOR_TEACHER_END',
    name: 'Load allocation',
    icon: (
      <SquareCheck
        className="h-24 w-24 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/teacher-dashboard/load-allocation',
  },

  { ...PAGE_USER_MANAGEMENT, icon: <UserIcon /> },
]
