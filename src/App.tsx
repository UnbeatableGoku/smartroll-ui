import { RootState } from '@data/redux/Store'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Loader } from '@components/common/loader/Loader'

function App() {
  const { LOADER_STATE, message } = useSelector(
    (state: RootState) => state.loader,
  )

  return (
    <div className="min-h-[100dvh] overflow-hidden text-gray-100">
      <Outlet />
      <Toaster richColors position="top-right" />
      {LOADER_STATE && <Loader message={message} />}
    </div>
  )
}

export default App
