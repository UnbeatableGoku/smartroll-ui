import { DashboardIcon, UserIcon } from '@icons'

import { SidebarLink } from 'types/common'

import { PAGE_USER_MANAGEMENT } from './page'

import { Upload } from 'lucide-react'

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
    icon: <Upload className='dark:text-[#8a8686] w-24 h-24' strokeWidth={3} absoluteStrokeWidth={false} />,
    path: '/timetable',
  },
  {
    id : 'TEACHER-DASHBOARD',
    name : 'Teacher Dashboard',
    icon : <Upload className='dark:text-[#8a8686] w-24 h-24' strokeWidth={3} absoluteStrokeWidth={false} />,
    path : '/teacher-dashboard',
  },
  {
    id : 'STUDENT-DASHBOARD',
    name : 'Teacher Dashboard',
    icon : <Upload className='dark:text-[#8a8686] w-24 h-24' strokeWidth={3} absoluteStrokeWidth={false} />,
    path : '/student-dashboard',
  },
  { ...PAGE_USER_MANAGEMENT, icon: <UserIcon /> },
]
