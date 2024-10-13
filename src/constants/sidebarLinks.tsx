import { DashboardIcon, UserIcon } from '@icons'

import { SidebarLink } from 'types/common'

import { PAGE_USER_MANAGEMENT } from './page'

export const SIDEBAR_LINKS: SidebarLink[] = [
  {
    id: 'DASHBOARD',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    children: [],
  },
  { ...PAGE_USER_MANAGEMENT, icon: <UserIcon /> },
]
