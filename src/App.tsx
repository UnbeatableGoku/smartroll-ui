import { RootState } from '@data/redux/Store'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Loader } from '@components/common/loader/Loader'

// Import Toaster from Sonner

function App() {
  const isLoading = useSelector((state: RootState) => state.loader.LOADER_STATE)
  console.log(isLoading)
  return (
    <div className="min-h-screen overflow-hidden text-gray-100 dark:bg-black">
      <Outlet />
      <Toaster richColors position="top-right" />
      {isLoading && <Loader />}
    </div>
  )
}

export default App
