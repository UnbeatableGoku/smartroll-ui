import { useMemo, useState } from 'react'

// import { CloseIcon, MenuIcon} from '@icons'
// import LogoutIcon from '@icons/logouticon'

// import { generateSidebarLinks } from '@utils/helpers'
// import { RxHamburgerMenu } from "react-icons/rx";


// import TabLink from './tabLink'
// import { Button } from "@/components/ui/button"
import { Home, Search, Bell, Settings, User, ChevronRight, Menu , LogOut } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
const menuItems = [
  { icon: User, label: 'Profile' },  
  { icon: LogOut, label: 'Logout' },
]

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  // const [open, setOpen] = useState(false)
  // const [colllapsed, setCollapsed] = useState(false)

  // const user = { pageAccess: ['DASHBOARD','USER_MANAGEMENT'] }

  // const validLinks = useMemo(
  //   () => generateSidebarLinks(user!.pageAccess),
  //   [user!.pageAccess],
  // )

  // will get the index of first parent with children for defalut open
  // const firstParentWithChild = useMemo(
  //   () =>
  //     validLinks.findIndex((link) => link.children && link.children.length > 0),
  //   [validLinks],
  // )

  // const logout = async () => {
  //   console.log('logout')
  // }

  // if (!isAuthenticated) {
  //   return <></>
  // }

  return (


    <div className="fixed bottom-4 left-0 right-0 flex justify-center ">
      <div className="flex items-center gap-1 rounded-full bg-black/80  transition-transform duration-300 ease-in-out hover:scale-105 dark:bg-black border border-zinc-300/60">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="group relative flex h-12 w-12 transition-transform duration-300 ease-in-out hover:scale-110 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
         <Dialog>
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
              {[...menuItems, { icon: Menu, label: 'Profile' }].map((item, index) => (
                <Button key={item.label} variant="ghost" className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        </div>
    </div>
    // <div className='cursor-pointer fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded shadow-lg'>
    // <Dialog open={open} onOpenChange={setOpen}>
    //   <DialogTrigger asChild>
    //   <RxHamburgerMenu  className='text-4xl'/>
    //   </DialogTrigger>
    //   <DialogContent className="sm:max-w-[425px]">
    //     <DialogHeader>
    //       <DialogTitle>Navigation</DialogTitle>
    //     </DialogHeader>
    //     <Navbar />
    //   </DialogContent>
    // </Dialog>
    // </div>
    // <aside className="relative flex flex-col border-r-2 border-gray-200">
    //   <div className="header-top flex items-center px-6">
    //     <button
    //       onClick={() => setCollapsed(!colllapsed)}
    //       className="inline-flex h-4 w-4 items-center text-sidebar-secondary"
    //     >
    //       {colllapsed ? <MenuIcon /> : <CloseIcon />}
    //     </button>
    //   </div>

    //   {/* Sidebar */}
    //   <div className="z-10 flex flex-col overflow-hidden">
    //     <div
    //       className={`${colllapsed ? 'w-16' : 'w-[280px]'} max-w-xs overflow-hidden overflow-y-auto bg-white px-3 py-4 transition-all duration-300`}
    //     >
    //       <ul>
    //         {validLinks.map((page, index) => {
    //           return (
    //             <TabLink
    //               name={page.name}
    //               icon={page.icon}
    //               path={page.path}
    //               key={page.id}
    //               subTabs={page.children}
    //               collapsed={colllapsed}
    //               //Returns true for first parent with children
    //               defalutOpen={firstParentWithChild === index}
    //             />
    //           )
    //         })}

    //         {/* Logout */}
    //         <TabLink
    //           className="!font-bold !text-sidebar-primary"
    //           buttonAction={logout}
    //           name="Log Out"
    //           icon={<LogoutIcon />}
    //           collapsed={colllapsed}
    //         />
            
    //       </ul>
    //     </div>
    //   </div>
    // </aside>
  )
}

// function Navbar() {
//   return (
//     <nav className="flex flex-col space-y-4">
//       <NavItem href="/" icon={<Home className="mr-2 h-4 w-4" />}>Home</NavItem>
//       <NavItem href="/about" icon={<Info className="mr-2 h-4 w-4" />}>About</NavItem>
//       <NavItem href="/services" icon={<Briefcase className="mr-2 h-4 w-4" />}>Services</NavItem>
//       <NavItem href="/contact" icon={<Mail className="mr-2 h-4 w-4" />}>Contact</NavItem>
//     </nav>
//   )
// }

// function NavItem({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
//   return (
//     <a
//       href={href}
//       className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
//     >
//       {icon}
//       {children}
//     </a>
//   )
// }

export default Sidebar

