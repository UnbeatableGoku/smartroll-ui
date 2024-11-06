import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

// Import Toaster from Sonner

function App() {
  return (
    <div className="min-h-screen overflow-hidden text-gray-100 dark:bg-black">
      <Outlet />
      <Toaster richColors position="bottom-center" />
    </div>
  )
}

export default App
