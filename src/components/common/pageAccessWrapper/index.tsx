import { useMemo } from 'react'

import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { PAGE_DASHBOARD, PAGE_LOGIN, PAGE_NOT_FOUND } from '@constants'

import { checkPageAccess, getPageInfoByPathName } from '@utils/helpers'

type Props = {
  children?: React.ReactElement
  checkEditAccess?: boolean
}

const PageAccessWrapper = ({ checkEditAccess = false }: Props) => {
  // const { user, isAuthenticated } = useAuth()
  const user = {
    isEditor: true,
    pageAccess: ['USER_MANAGEMENT', 'DASHBOARD','TIMETABLE'],
  }
  const isAuthenticated = true
  const { pathname } = useLocation()

  const page = useMemo(() => getPageInfoByPathName(pathname), [pathname])

  const haveAccess = useMemo(
    () => user.pageAccess && checkPageAccess(page?.id, user.pageAccess),
    [page.id, user.pageAccess],
  )

  // if not authenticated
  if (!isAuthenticated) {
    return <Navigate replace to={PAGE_LOGIN.path} />
  }

  // if dont have Edit Access
  if (checkEditAccess && !user!.isEditor) {
    return <Navigate replace to={PAGE_NOT_FOUND.path} />
  }

  // valid access
  if (haveAccess || pathname === PAGE_DASHBOARD.path) {
    return <Outlet />
  }

  return <Navigate replace to={PAGE_NOT_FOUND.path} />
}

export default PageAccessWrapper
