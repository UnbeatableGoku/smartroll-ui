import ReconnectionLoader from '../src/components/loader/reconnection-loader'
import { RootState } from '@data/Store'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Loader } from '@components/common/loader/Loader'

function App() {
  const { LOADER_STATE, message, RECONNECTION_LOADER_STAT } = useSelector(
    (state: RootState) => state.loader,
  )

  return (
    <div className="min-h-[100dvh] overflow-hidden text-gray-100">
      <Outlet />
      <Toaster
        richColors
        position="top-right"
        closeButton={true}
        duration={5000}
      />
      {LOADER_STATE && <Loader message={message} />}
      {RECONNECTION_LOADER_STAT && <ReconnectionLoader></ReconnectionLoader>}
    </div>
  )
}

export default App
