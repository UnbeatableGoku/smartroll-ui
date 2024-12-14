// src/routerConfig.ts
import App from '@App'
import ProtectedRoute from '@auth/ProtectedRoute'
import LogoLayout from '@layout/logoLayout'
import MainLayout from '@layout/mainLayout'
import Login from '@pages/Login/Login'
import ForgotPassword from '@pages/Login/ForgotPassword'
import DivisionCreation from '@pages/Division/pages/DivisionCreation'
import NotFound from '@pages/NotFound'
import StudentDivision from '@pages/StudentDashboard/student-division/pages/StudentDivision'
import ElectiveSubject from '@pages/StudentDashboard/subject-selection/pages/ElectiveSubject'
import SubjectSelection from '@pages/Subject/SubjectSelection'
import SubjectSelectionConfirmation from '@pages/Subject/SubjectSelectionConfirmation'
import TeacherAllocation from '@pages/SubjectAllocation/pages/TeacherAllocation'
import UnifiedSubjectChoice from '@pages/TeacherDashboard/subject-selection/pages/Subject-Choice/UnifiedSubjectChoice'
import UploadTimeTable from '@pages/UploadTimeTable/UploadTimeTable'
import ErrorPage from '@pages/errorPage'
import { Navigate } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import {
  DIVISION_CREATION,
  FORGOT_PASSWORD,
  PAGE_DASHBOARD,
  PAGE_ELECTIVE_SUBJECT,
  PAGE_LOGIN,
  PAGE_STUDENT_DASHBOARD,
  PAGE_STUDENT_DIVISION,
  PAGE_SUBJECT_CHOICE,
  PAGE_SUBJECT_SELECT,
  PAGE_SUBJECT_SELECTION_CONFIRMATION,
  PAGE_TEACHER_DASHBOARD,
  PAGE_TIMETABLE,
  SUBJECT_ALLOCATION
} from '@constants'


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
      {
        element: <LogoLayout />,
        children: [
          {
            path: FORGOT_PASSWORD.path,
            element: <ForgotPassword />,
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
      {
        path: PAGE_STUDENT_DIVISION.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="student">
                <StudentDivision />
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
                <UnifiedSubjectChoice></UnifiedSubjectChoice>
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
            element: <DivisionCreation />,
          },
        ],
      },

      //Teacher Allocation
      {
        path: SUBJECT_ALLOCATION.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="admin">
                <TeacherAllocation />
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
