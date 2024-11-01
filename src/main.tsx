import { StrictMode } from 'react'

import { router } from '@routes'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import Store from './redux/Store'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
