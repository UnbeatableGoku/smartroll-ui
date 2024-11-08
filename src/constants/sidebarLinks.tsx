import { DashboardIcon, UserIcon } from '@icons'

import { SidebarLink } from 'types/common'

import { PAGE_USER_MANAGEMENT } from './page'

import { Upload , FileSpreadsheet , LibraryBig} from 'lucide-react'

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
    icon: <FileSpreadsheet className='dark:text-[#8a8686] w-24 h-24' strokeWidth={3} absoluteStrokeWidth={false} />,
    path: '/timetable',
  },
  {
    id : 'TEACHER-DASHBOARD',
    name : 'Teacher Dashboard',
    icon : <DashboardIcon />,
    path : '/teacher-dashboard',
  },
  {
    id : 'STUDENT-DASHBOARD',
    name : 'Teacher Dashboard',
    icon : <DashboardIcon />,
    path : '/student-dashboard',
  },
  {
    id : 'SUBJECT-SELECT',
    name : 'Subject',
    icon : <LibraryBig className='dark:text-[#8a8686] w-24 h-24' strokeWidth={3} absoluteStrokeWidth={false} />,
    path : '/subject-select',
  },
  { ...PAGE_USER_MANAGEMENT, icon: <UserIcon /> },
]
