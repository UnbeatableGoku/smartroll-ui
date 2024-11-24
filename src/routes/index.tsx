// src/routerConfig.ts
import App from '@App'
import ProtectedRoute from '@auth/ProtectedRoute'
import LogoLayout from '@layout/logoLayout'
import MainLayout from '@layout/mainLayout'
import DivisionCreation from '@pages/division/pages/DivisionCreation' 
import Login from '@pages/login/Login' 

import NotFound from '@pages/NotFound'
import ElectiveSubject from '@pages/StudentDashboard/subject-selection/pages/ElectiveSubject'

import SubjectSelection from '@pages/Subject/SubjectSelection'
import SubjectSelectionConfirmation from '@pages/Subject/SubjectSelectionConfirmation'
// import TeacherDashboard from '@pages/TeacherDashboard'
import SubjectChoice from '@pages/TeacherDashboard/subject-selection/pages/Subject-Choice/SubjectChoice'
import UploadTimeTable from '@pages/UploadTimeTable/UploadTimeTable'
import ErrorPage from '@pages/errorPage'
import { Navigate } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import {
  DIVISION_CREATION,
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


DivisionCreation

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
            element: <Navigate to="/subject/subject-select" replace />,
            // element: (
            //   <ProtectedRoute roleRequired="admin">
            //     <Dashboard />
            //   </ProtectedRoute>
            // ),
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
              <Navigate to="/teacher-dashboard/subject-choice" replace />
            ),
            // element: (
            //   <ProtectedRoute roleRequired="teacher">
            //     <TeacherDashboard />
            //   </ProtectedRoute>
            // ),
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
              <Navigate to="/student-dashboard/elective-subject" replace />
            ),
            // element: (
            //   <ProtectedRoute roleRequired="student">
            //     <StudentDashboard />
            //   </ProtectedRoute>
            // ),
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
      //Division creation
      {
        path: DIVISION_CREATION.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DivisionCreation></DivisionCreation>,
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export { router }
