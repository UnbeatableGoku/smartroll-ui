import App from '@App'
import LogoLayout from '@layout/logoLayout'
import MainLayout from '@layout/mainLayout'
import Dashboard from '@pages/Dashboard'
import Login from '@pages/Login'
import NotFound from '@pages/NotFound'
import ErrorPage from '@pages/errorPage'
import { createBrowserRouter } from 'react-router-dom'

import { PAGE_DASHBOARD, PAGE_LOGIN } from '@constants/page'

import PageAccessWrapper from '@components/common/pageAccessWrapper'

import { EDITOR_ROUTES, VIEW_ONLY_ROUTES } from './router'

const router = createBrowserRouter([
  {
    path: PAGE_DASHBOARD.path,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <LogoLayout />,
        children: [
          {
            path: PAGE_LOGIN.path,
            element: <Login />,
          },
        ],
      },
      {
        path: PAGE_DASHBOARD.path,
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            element: <PageAccessWrapper />,
            children: VIEW_ONLY_ROUTES,
          },
          {
            element: <PageAccessWrapper checkEditAccess />,
            children: EDITOR_ROUTES,
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])
export { router }
