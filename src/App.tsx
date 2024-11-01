import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="dark:bg-black  text-gray-100 min-h-screen overflow-hidden">
      <Outlet />
    </div>
  )
}

export default App