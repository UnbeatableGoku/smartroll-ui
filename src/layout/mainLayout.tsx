import { useEffect } from 'react'

import { RootState } from '@data/redux/Store'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import Header from '@components/header'
import Sidebar from '@components/sidebar'
import useNotification from '@components/sidebar/hooks/useNotification'



const MainLayout = () => {
  const access: any = useSelector((state: RootState) => state.auth.accessToken)
  const {handleOnClickForNotifications} = useNotification()
  
  
  useEffect(() => {
    if(access){

      handleOnClickForNotifications()
    }
  }, [access])

  return (
    <div className="relative h-screen">
      <div className="wrapper flex h-full overflow-hidden">
        {/* Left Section - Sidebar */}

        {/* Right Section - Header and Main Content */}
        <div className="relative flex w-full flex-col">
          <Header />

          <main className="h-100 mx-auto w-full overflow-y-auto bg-shade p-2 dark:bg-black lg:p-8">
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
