import { DashboardIcon, UserIcon } from '@icons'
import { BookCheck, LibraryBig, UsersRound } from 'lucide-react'

import { SidebarLink } from 'types/common'

import { PAGE_USER_MANAGEMENT } from './page'

export const SIDEBAR_LINKS: SidebarLink[] = [
  {
    id: 'DASHBOARD',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  // {
  //   id: 'TIMETABLE',
  //   name: 'Time-Table',
  //   icon: (
  //     <FileSpreadsheet
  //       className="h-24 w-24 dark:text-[#8a8686]"
  //       strokeWidth={3}
  //       absoluteStrokeWidth={false}
  //     />
  //   ),
  //   path: '/timetable',
  // },
  {
    id: 'TEACHER-DASHBOARD',
    name: 'Teacher Dashboard',
    icon: <DashboardIcon />,
    path: '/teacher-dashboard',
  },
  {
    id: 'STUDENT-DASHBOARD',
    name: 'Teacher Dashboard',
    icon: <DashboardIcon />,
    path: '/student-dashboard',
  },
  {
    id: 'SUBJECT-SELECT',
    name: 'Subject',
    icon: (
      <LibraryBig
        className="h-24 w-24 dark:text-[#8a8686]"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/subject-select',
  },
  {
    id: 'ELECTIVE_SUBJECT',
    name: 'Elective Subject',
    icon: (
      <BookCheck
        className="h-24 w-24 dark:text-[#8a8686]"
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
      <LibraryBig
        className="h-24 w-24 text-black"
        strokeWidth={3}
        absoluteStrokeWidth={false}
      />
    ),
    path: '/subject-choice',
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
    path: '/teacher-allocation',
  },
  { ...PAGE_USER_MANAGEMENT, icon: <UserIcon /> },
]
