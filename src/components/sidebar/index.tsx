import { useState, useMemo } from 'react'

import { generateSidebarLinks } from '@utils/helpers'



import TabLink from './tabLink'
import { User, Menu , LogOut } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import useSidebarLinkSelector from './hooks/useSidebarLinkSelector'
import { useDispatch } from 'react-redux'
import { setAuth } from '@data/redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'






const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handelLogout = ()=>{
    //clear local storage 
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    // clear redux state 
    dispatch(setAuth({access : "" , refresh : "",isAuth : false}))
    // redirect to login page
      navigate('/login')
  }

  const menuItems = [
    { icon: User, label: 'Profile',event : ()=>{} },  
    { icon: LogOut, label: 'Logout',event: handelLogout },
  ]
  
  const {activeIndex,collapsed,open,setActiveIndex,setCollapsed,setOpen,setSidebarLinks} = useSidebarLinkSelector()
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


    <div className="fixed bottom-4 left-0 right-0 flex justify-center ">
      <div className="flex items-center gap-1 rounded-full bg-black/80  transition-transform duration-300 ease-in-out hover:scale-105 dark:bg-black border border-zinc-300/60">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="group relative flex h-12 w-12 transition-transform duration-300 ease-in-out hover:scale-110 items-center justify-center rounded-full text-white  hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() =>{item.event()}}

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
                collapsed={collapsed}
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

