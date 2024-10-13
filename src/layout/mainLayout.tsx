import { Outlet } from 'react-router-dom'

import Header from '@components/header'
import Sidebar from '@components/sidebar'

const MainLayout = () => {
  return (
    <div className="relative h-screen">
      <div className="wrapper flex h-full overflow-hidden">
        {/* Left Section - Sidebar */}
        <Sidebar />

        {/* Right Section - Header and Main Content */}
        <div className="relative flex w-full flex-col">
          <Header />
          <main className="mx-auto h-screen w-full overflow-y-auto bg-[#f7f7f7] p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
export default MainLayout
