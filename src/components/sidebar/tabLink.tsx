import { MouseEventHandler, useCallback, useEffect, useState } from 'react'

import { ChevronIcon } from '@icons'
import { Link, useLocation } from 'react-router-dom'

import { Page } from 'types/common'

type TabLinkCommon = {
  buttonAction?: MouseEventHandler<HTMLButtonElement>
  path?: string
}

interface TabLinkType extends TabLinkCommon {
  collapsed: boolean
  name: string
  icon?: JSX.Element
  path?: string
  subTabs?: Page[]
  className?: string
  defalutOpen?: boolean
}

interface LinkWrapperType extends TabLinkCommon {
  children: JSX.Element
}

const LinkWrapper = ({ path, buttonAction, children }: LinkWrapperType) => {
  if (!path) {
    return <button onClick={buttonAction}>{children}</button>
  }

  return <Link to={path}>{children}</Link>
}
const TabLink = ({
  name,
  path,
  subTabs,
  defalutOpen,
  className = '',
  icon,
  collapsed = false,
  buttonAction,
}: TabLinkType) => {
  const [togglemenu, setTogglemenu] = useState(false)
  const { pathname } = useLocation()

  //to open the first dropdown
  const handleInitialToggle = useCallback(() => {
    let subPaths

    //will create an array of paths of children
    if (subTabs) subPaths = subTabs.map((tab) => tab.path)

    // if the defalutOpen is true and the path is matched
    if ((defalutOpen && subPaths?.includes(pathname)) || pathname === '/') {
      setTogglemenu(true)
    }

    // if path matches any of children path
    if (subPaths?.includes(pathname)) {
      setTogglemenu(true)
    }
  }, [pathname])

  useEffect(() => {
    handleInitialToggle()
  }, [])

  const parentPath = `/${pathname.split('/')[1] || ''}`

  return (
    <>
      <li className="my-1">
        <LinkWrapper
          path={path}
          buttonAction={
            buttonAction ? buttonAction : () => setTogglemenu(!togglemenu)
          }
        >
          <div
            className={`hover:bg-hover-primary flex items-center rounded-md ${parentPath === path ? 'bg-hover-primary font-bold' : 'font-semibold'}`}
          >
            <div
              className={`flex min-h-[40px] flex-1 items-center gap-3 px-3 py-2.5 text-sm transition-all duration-300 ${path ? 'text-sidebar-primary' : 'text-sidebar-secondary'}${className} `}
            >
              <span className="inline-flex h-4 w-4 items-center justify-center text-sidebar-secondary">
                {icon !== undefined && icon}
              </span>

              <span
                className={`origin-left whitespace-nowrap transition-opacity duration-300 ${collapsed && 'hidden scale-0'} capitalize`}
              >
                {name}
              </span>
            </div>

            {subTabs && !collapsed && (
              <div
                className={`z-auto mr-2 flex h-2.5 w-2.5 shrink-0 items-center transition-all duration-200 ${togglemenu ? 'rotate-0' : '-rotate-90'}`}
              >
                <ChevronIcon />
              </div>
            )}
          </div>
        </LinkWrapper>
      </li>

      {subTabs && togglemenu && !collapsed && (
        <ul className="mb-3">
          {subTabs?.map((page: Page) => (
            <TabLink
              name={page.name}
              path={page?.path}
              key={page.id}
              collapsed={collapsed}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export default TabLink
