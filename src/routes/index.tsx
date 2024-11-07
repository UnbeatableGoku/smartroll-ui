// src/routerConfig.ts
import App from '@App'
import ProtectedRoute from '@auth/ProtectedRoute'
import LogoLayout from '@layout/logoLayout'
import MainLayout from '@layout/mainLayout'
import Dashboard from '@pages/Dashboard'
import NotFound from '@pages/NotFound'
import UploadTimeTable from '@pages/UploadTimeTable/UploadTimeTable'
import ErrorPage from '@pages/errorPage'
import Login from '@pages/login/Login'
import { createBrowserRouter } from 'react-router-dom'

import { PAGE_DASHBOARD, PAGE_LOGIN, PAGE_TIMETABLE } from '@constants'

import PageAccessWrapper from '@components/common/pageAccessWrapper'

import { EDITOR_ROUTES, VIEW_ONLY_ROUTES } from './router'

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
            element: (
              <ProtectedRoute roleRequired="admin">
                <Dashboard />
              </ProtectedRoute>
            ),
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
            element: (
              <ProtectedRoute roleRequired="admin">
                <UploadTimeTable />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export { router }
