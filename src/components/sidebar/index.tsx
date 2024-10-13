import { useMemo, useState } from 'react'

import { CloseIcon, MenuIcon } from '@icons'
import LogoutIcon from '@icons/logouticon'

import { generateSidebarLinks } from '@utils/helpers'

import TabLink from './tabLink'

const Sidebar = () => {
  const [colllapsed, setCollapsed] = useState(false)

  const user = { pageAccess: ['USER_MANAGEMENT', 'DASHBOARD'] }

  const validLinks = useMemo(
    () => generateSidebarLinks(user!.pageAccess),
    [user!.pageAccess],
  )

  // will get the index of first parent with children for defalut open
  const firstParentWithChild = useMemo(
    () =>
      validLinks.findIndex((link) => link.children && link.children.length > 0),
    [validLinks],
  )

  const logout = async () => {
    console.log('logout')
  }

  // if (!isAuthenticated) {
  //   return <></>
  // }

  return (
    <aside className="relative flex flex-col border-r-2 border-gray-200">
      <div className="header-top flex items-center px-6">
        <button
          onClick={() => setCollapsed(!colllapsed)}
          className="inline-flex h-4 w-4 items-center text-sidebar-secondary"
        >
          {colllapsed ? <MenuIcon /> : <CloseIcon />}
        </button>
      </div>

      {/* Sidebar */}
      <div className="z-10 flex flex-col overflow-hidden">
        <div
          className={`${colllapsed ? 'w-16' : 'w-[280px]'} max-w-xs overflow-hidden overflow-y-auto bg-white px-3 py-4 transition-all duration-300`}
        >
          <ul>
            {validLinks.map((page, index) => {
              return (
                <TabLink
                  name={page.name}
                  icon={page.icon}
                  path={page.path}
                  key={page.id}
                  subTabs={page.children}
                  collapsed={colllapsed}
                  //Returns true for first parent with children
                  defalutOpen={firstParentWithChild === index}
                />
              )
            })}

            {/* Logout */}
            <TabLink
              className="!font-bold !text-sidebar-primary"
              buttonAction={logout}
              name="Log Out"
              icon={<LogoutIcon />}
              collapsed={colllapsed}
            />
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
