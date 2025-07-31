import { useEffect } from 'react'

import { Outlet } from 'react-router-dom'

import Header from '@components/header'
import Sidebar from '@components/sidebar'

import useToValidateTokenAndServer from './hooks/useToValidateTokenAndServer'

const MainLayout = () => {
  const { checkServerAvailability, access, accessTokenValid } =
    useToValidateTokenAndServer()

  useEffect(() => {
    checkServerAvailability()
  }, [])

  if (access && accessTokenValid) {
    return (
      <div className="relative h-screen">
        <div className="wrapper flex h-full overflow-hidden">
          {/* Left Section - Sidebar */}

          {/* Right Section - Header and Main Content */}
          <div className="relative flex w-full flex-col">
            <Header />

            <main className="mx-auto h-screen w-full overflow-y-auto bg-[#F7F7F7] px-2 lg:px-8">
              <Outlet />
            </main>
            {/* Sticky Button at the Bottom Center */}
            {/* <Button className='fixed px-4 py-2 transform -translate-x-1/2 rounded shadow-lg bottom-4 left-1/2'>Click me</Button> */}
            {/* <button className="fixed px-4 py-2 text-white transform -translate-x-1/2 bg-blue-500 rounded shadow-lg bottom-4 left-1/2">
              Sticky Button
            </button> */}
          </div>
          <Sidebar></Sidebar>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default MainLayout
