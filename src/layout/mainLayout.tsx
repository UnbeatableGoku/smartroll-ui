import { Outlet } from 'react-router-dom'
import Header from '@components/header'
import Sidebar from '@components/sidebar'


const MainLayout = () => {
 
  return (
    <div className="relative h-screen">
      <div className="wrapper flex h-full overflow-hidden">
        {/* Left Section - Sidebar */}
       

        {/* Right Section - Header and Main Content */}
        <div className="relative flex w-full flex-col ">
          <Header />
          <main className="bg-shade mx-auto h-screen w-full overflow-y-auto p-8 dark:bg-black">
            <Outlet />
          </main>
          <Sidebar />
          {/* Sticky Button at the Bottom Center */}
          {/* <Button className='fixed bottom-4 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded shadow-lg'>Click me</Button> */}
          {/* <button className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded shadow-lg">
            Sticky Button
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default MainLayout
