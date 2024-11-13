import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Toaster as MessageToaster } from "@/components/ui/toaster"
// Import Toaster from Sonner

function App() {
  return (
    <div className="min-h-screen overflow-hidden text-gray-100 dark:bg-black">
      <Outlet />
      <Toaster richColors position="top-right" />
      
      <MessageToaster></MessageToaster>
    </div>
  )
}

export default App
