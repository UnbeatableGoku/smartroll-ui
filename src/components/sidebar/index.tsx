import { useMemo } from 'react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { setAuth } from '@data/redux/slices/authSlice'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { LogOut, Menu } from 'lucide-react'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { generateSidebarLinks } from '@utils/helpers'

import NotificationDrawer from './NotificationDrawer'
import useSidebarLinkSelector from './hooks/useSidebarLinkSelector'
import TabLink from './tabLink'
import { RootState } from '@data/redux/Store'

const Sidebar = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handelLogout = () => {
    //clear local storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    // clear redux state
    dispatch(setAuth({ access: '', refresh: '', isAuth: false }))
    // redirect to login page
    navigate('/login')
  }

  const menuItems = [
    // { icon: Bell, label: 'Notifications', event: () => {},alert:true},
    { icon: LogOut, label: 'Logout', event: handelLogout, alert: false },
  ]

  const {
    activeIndex,
    collapsed,
    open,
    setActiveIndex,
    setOpen,
    setSidebarLinks,
  } = useSidebarLinkSelector()
  const validLinks = useMemo(
    () => generateSidebarLinks(setSidebarLinks()),
    [setSidebarLinks()],
  )

  // will get the index of first parent with children for defalut open
  const firstParentWithChild = useMemo(
    () =>
      validLinks.findIndex((link) => link.children && link.children.length > 0),
    [validLinks],
  )

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="flex items-center gap-1 rounded-full border border-zinc-300/60 bg-black/80 transition-transform duration-300 ease-in-out hover:scale-105 dark:bg-black">
        <NotificationDrawer></NotificationDrawer>
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="group relative flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => {
              item.event()
            }}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110" />
            {activeIndex === index && (
              <span className="absolute -top-8 rounded-md bg-black/80 px-2 py-1 text-xs opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                {item.label}
              </span>
            )}
          </button>
        ))}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="group relative flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="User Menu"
            >
              <Menu className="h-6 w-6 transition-transform duration-200 ease-in-out group-hover:scale-110" />
            </button>
          </DialogTrigger>
          <VisuallyHidden.Root>
            <DialogContent className="dark:bg-black sm:max-w-[425px]">
              {/* <DialogHeader >
              <DialogTitle className='dark:text-white'>Options</DialogTitle>
            </DialogHeader> */}
              <div className="grid gap-4 py-4 dark:bg-black dark:text-white">
                <ul>
                  {[...validLinks].map((page, index) => (
                    <TabLink
                      name={page.name}
                      icon={page.icon}
                      path={page.path}
                      key={page.id}
                      subTabs={page.children}
                      collapsed={collapsed}
                      //Returns true for first parent with children
                      defalutOpen={firstParentWithChild === index}
                      onClick={() => setOpen(false)} // Close dialog on item click
                    />
                  ))}
                </ul>
              </div>
            </DialogContent>
          </VisuallyHidden.Root>
        </Dialog>
      </div>
    </div>
  )
}

export default Sidebar
