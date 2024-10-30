import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="dark bg-gray-900 text-gray-100 min-h-screen">
      <Outlet />
    </div>
  )
}

export default App