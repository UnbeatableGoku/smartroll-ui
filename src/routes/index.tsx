// src/routerConfig.ts
import App from '@App'

import LogoLayout from '@layout/logoLayout'
import MainLayout from '@layout/mainLayout'
import Dashboard from '@pages/Dashboard'
import TeacherDashboard from '@pages/TeacherDashboard'
import Login from '@pages/login/Login'
import NotFound from '@pages/NotFound'

import ErrorPage from '@pages/errorPage'
import UploadTimeTable from '@pages/UploadTimeTable/UploadTimeTable'
import StudentDashboard from '@pages/StudentDashboard'
import { createBrowserRouter } from 'react-router-dom'

import { PAGE_DASHBOARD, PAGE_LOGIN, PAGE_STUDENT_DASHBOARD, PAGE_TEACHER_DASHBOARD, PAGE_TIMETABLE } from '@constants'

import PageAccessWrapper from '@components/common/pageAccessWrapper'

import { EDITOR_ROUTES, VIEW_ONLY_ROUTES } from './router'

import ProtectedRoute from '@auth/ProtectedRoute'



const router = createBrowserRouter([
  {
    path: PAGE_DASHBOARD.path,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // for displaying the login page layout 
      {
        element: <LogoLayout />,
        children: [
          {
            path: PAGE_LOGIN.path,
            element: <Login />,
          },
        ],
      },
      // for displaying the dashboard page layout with access control
      {
        path: PAGE_DASHBOARD.path,  // Use relative path here
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
      // Admin time table route
      {
        path: PAGE_TIMETABLE.path,

        element: (
          <MainLayout />
        ),
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="admin">
                <UploadTimeTable />
              </ProtectedRoute>
            ),
          },
        ]
      },
      // teacher dashboard route
      {
        path: PAGE_TEACHER_DASHBOARD.path,

        element: (
          <MainLayout />
        ),
        children: [
          {
            index: true,
            element: (
              //  <ProtectedRoute roleRequired="teacher">
              <TeacherDashboard />
              //  </ProtectedRoute>
            ),
          },
        ]
      },
      {
        path: PAGE_STUDENT_DASHBOARD.path,

        element: (
          <MainLayout />
        ),
        children: [
          {
            index: true,
            element: (
              // <ProtectedRoute roleRequired="student">
              <StudentDashboard />
              // </ProtectedRoute>
            ),
          },
        ]
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export { router }
