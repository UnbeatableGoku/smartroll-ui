// import { useMemo } from 'react'
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useMemo } from 'react'

import { setAuth } from '@data/redux/slices/authSlice'
import { setClassRoomList } from '@data/redux/slices/classRoomsSlice'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Home, LogOut, Menu, UserPen } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { generateSidebarLinks } from '@utils/helpers'

import TabLink from '@components/sidebar/tabLink'
import StackholderProfile from '@components/stackholder/StackholderProfile'
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog'

import NotificationDrawer from './NotificationDrawer'
import useSidebarLinkSelector from './hooks/useSidebarLinkSelector'

// import TabLink from './tabLink'

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handelLogout = () => {
    //clear local storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('callbackUrl')
    localStorage.removeItem('fromApp')
    localStorage.removeItem('persist:root')
    localStorage.clear()
    // clear redux state
    dispatch(setClassRoomList({ isalreadyLoaded: false, classes: [] }))
    dispatch(setAuth({ access: '', refresh: '', isAuth: false }))
    // redirect to login page
    navigate('/login')
  }

  const {
    activeIndex,
    collapsed,
    open,
    isProfileModalOpen,
    setActiveIndex,
    setOpen,
    setSidebarLinks,
    setIsProfileModalOpen,
  } = useSidebarLinkSelector()

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      event: () => navigate('/'),
    },
    {
      icon: UserPen,
      label: 'Profile',
      event: () => {
        setIsProfileModalOpen(true)
      },
    },
    { icon: LogOut, label: 'Logout', event: handelLogout, alert: false },
  ]

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
    <div className="menu fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="flex items-center gap-1 rounded-[12px] border border-zinc-700 bg-[#F7F7F7] p-1 shadow-soft backdrop-blur-lg transition-transform duration-300 ease-in-out hover:scale-105">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="group relative flex h-11 w-11 items-center justify-center rounded-md text-black transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => {
              item.event()
            }}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110" />
            {activeIndex === index && (
              <span className="absolute -top-8 rounded-md bg-white px-2 py-1 text-xs opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                {item.label}
              </span>
            )}
          </button>
        ))}
        <NotificationDrawer></NotificationDrawer>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="group relative flex h-12 w-12 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="User Menu"
            >
              <Menu className="h-6 w-6 text-black transition-transform duration-200 ease-in-out group-hover:scale-110" />
            </button>
          </DialogTrigger>
          <VisuallyHidden.Root>
            <DialogContent className="max-w-[380px] rounded-md bg-[#F7F7F7] shadow-soft">
              <div className="grid gap-4 bg-[#F7F7F7] py-4 text-black">
                <ul className="text-black">
                  {[...validLinks].map((page, index) => (
                    <TabLink
                      name={page.name}
                      icon={page.icon}
                      path={page.path}
                      key={page.id}
                      subTabs={page.children}
                      collapsed={collapsed}
                      className="text-black"
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
      <StackholderProfile
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false)
        }}
      ></StackholderProfile>
    </div>
  )
}

export default Sidebar
