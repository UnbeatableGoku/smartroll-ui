import { router } from '@routes'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import Store, { persistor } from './data/Store'
import './index.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>,
)
