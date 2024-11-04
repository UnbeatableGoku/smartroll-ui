import { useMemo, useState } from 'react'

import { CloseIcon, MenuIcon} from '@icons'
import LogoutIcon from '@icons/logouticon'

import { generateSidebarLinks } from '@utils/helpers'
import { RxHamburgerMenu } from "react-icons/rx";


import TabLink from './tabLink'
import { Button } from "@/components/ui/button"
import { User, ChevronRight, Menu , LogOut } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"


const menuItems = [
  { icon: User, label: 'Profile' },  
  { icon: LogOut, label: 'Logout' },
]


const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [colllapsed, setCollapsed] = useState(false)

  const user = { pageAccess: ['DASHBOARD','USER_MANAGEMENT','TIMETABLE'] }

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


    <div className="fixed bottom-4 left-0 right-0 flex justify-center ">
      <div className="flex items-center gap-1 rounded-full bg-black/80  transition-transform duration-300 ease-in-out hover:scale-105 dark:bg-black border border-zinc-300/60">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="group relative flex h-12 w-12 transition-transform duration-300 ease-in-out hover:scale-110 items-center justify-center rounded-full text-white  hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
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
          <DialogContent className="sm:max-w-[425px] dark:bg-black">
            {/* <DialogHeader >
              <DialogTitle className='dark:text-white'>Options</DialogTitle>
            </DialogHeader> */}
            <div className="grid gap-4 py-4 dark:bg-black dark:text-white" >
              <ul>
              {[...validLinks].map((page, index) => (
                <TabLink
                name={page.name}
                icon={page.icon}
                path={page.path}
                key={page.id}
                subTabs={page.children}
                collapsed={colllapsed}
                //Returns true for first parent with children
                defalutOpen={firstParentWithChild === index}
                onClick={() => setOpen(false)} // Close dialog on item click
              />
              ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
        </div>
    </div>
    

    
  )
}

export default Sidebar

