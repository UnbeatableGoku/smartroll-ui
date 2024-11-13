// src/routerConfig.ts
import App from '@App'
import ProtectedRoute from '@auth/ProtectedRoute'
import LogoLayout from '@layout/logoLayout'
import MainLayout from '@layout/mainLayout'
import Dashboard from '@pages/Dashboard'
import NotFound from '@pages/NotFound'
import SubjectSelection from '@pages/Sbuject/SubjectSelection'
import SubjectSelectionConfirmation from '@pages/Sbuject/SubjectSelectionConfirmation'
import StudentDashboard from '@pages/StudentDashboard'
import ElectiveSubject from '@pages/StudentDashboard/pages/ElectiveSubject'
import TeacherDashboard from '@pages/TeacherDashboard'
import SubjectChoice from '@pages/TeacherDashboard/pages/Subject-Choice/SubjectChoice'
import UploadTimeTable from '@pages/UploadTimeTable/UploadTimeTable'
import ErrorPage from '@pages/errorPage'
import Login from '@pages/login/Login'
import { createBrowserRouter } from 'react-router-dom'

import {
  PAGE_DASHBOARD,
  PAGE_ELECTIVE_SUBJECT,
  PAGE_LOGIN,
  PAGE_STUDENT_DASHBOARD,
  PAGE_SUBJECT_CHOICE,
  PAGE_SUBJECT_SELECT,
  PAGE_SUBJECT_SELECTION_CONFIRMATION,
  PAGE_TEACHER_DASHBOARD,
  PAGE_TIMETABLE,
} from '@constants'

import PageAccessWrapper from '@components/common/pageAccessWrapper'

import { EDITOR_ROUTES, VIEW_ONLY_ROUTES } from './router'

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
        path: PAGE_DASHBOARD.path, // Use relative path here
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

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="admin">
                <UploadTimeTable />
              </ProtectedRoute>
            ),
          },
        ],
      },
      // teacher dashboard route
      {
        path: PAGE_TEACHER_DASHBOARD.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            ),
          },
        ],
      },
      // student dashboard
      {
        path: PAGE_STUDENT_DASHBOARD.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="student">
                <StudentDashboard />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // subject selection route (admin side)
      {
        path: PAGE_SUBJECT_SELECT.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="admin">
                <SubjectSelection />
              </ProtectedRoute>
            ),
          },
        ],
      },
      // subject selection choice (teacher side)
      {
        path: PAGE_SUBJECT_CHOICE.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="teacher">
                <SubjectChoice />
              </ProtectedRoute>
            ),
          },
        ],
      },

      //SUBJECT SELECTION CONFIRMATION
      {
        path: PAGE_SUBJECT_SELECTION_CONFIRMATION.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="admin">
                <SubjectSelectionConfirmation />
              </ProtectedRoute>
            ),
          },
        ],
      },

      //Elective subject student side
      {
        path: PAGE_ELECTIVE_SUBJECT.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="student">
                <ElectiveSubject />
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
