import App from '@App'
import LogoLayout from '@layout/logoLayout'
import MainLayout from '@layout/mainLayout'
import Dashboard from '@pages/Dashboard'
import Login from '@pages/Login'
import NotFound from '@pages/NotFound'
import ErrorPage from '@pages/errorPage'
import { createBrowserRouter } from 'react-router-dom'

import { PAGE_DASHBOARD, PAGE_LOGIN , PAGE_TIMETABLE } from '@constants'

import PageAccessWrapper from '@components/common/pageAccessWrapper'

import { EDITOR_ROUTES, VIEW_ONLY_ROUTES } from './router'
import UploadTimeTable from '@pages/UploadTimeTable/UploadTimeTable'

const router = createBrowserRouter([
  {
    path: PAGE_DASHBOARD.path,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // for display the login page layout 
      {
        element: <LogoLayout />,
        children: [
          {
            path: PAGE_LOGIN.path,
            element: <Login />,
          },
        ],
      },
      // for display the dashboard page layout with access control
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
      {
        element: <MainLayout />,
        children: [
          {
            path: PAGE_TIMETABLE.path,
            element: <UploadTimeTable />,
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])
export { router }
