// src/routerConfig.ts
import App from '@App'
import ProtectedRoute from '@auth/ProtectedRoute'
import LogoLayout from '@layout/logoLayout'
import MainLayout from '@layout/mainLayout'
import Dashboard from '@pages/Dashboard'
import DivisionCreation from '@pages/Division/pages/DivisionCreation'
import ForgotPassword from '@pages/Login/ForgotPassword'
import Login from '@pages/Login/Login'
import NotFound from '@pages/NotFound'
import StudentDashboard from '@pages/StudentDashboard'
import StudentDivision from '@pages/StudentDashboard/student-division/pages/StudentDivision'
import ElectiveSubject from '@pages/StudentDashboard/subject-selection/pages/ElectiveSubject'
// import StudentDashboard from '@pages/StudentDashboard'
import SubjectSelection from '@pages/Subject/SubjectSelection'
import SubjectSelectionConfirmation from '@pages/Subject/SubjectSelectionConfirmation'
import TeacherAllocation from '@pages/Subject/TeacherAllocation/TeacherAllocation'
import TeacherDashboard from '@pages/TeacherDashboard'
import LoadAllocation from '@pages/TeacherDashboard/load-allocation/pages/LoadAllocation'
import UnifiedSubjectChoice from '@pages/TeacherDashboard/subject-selection/pages/Subject-Choice/UnifiedSubjectChoice'
import UploadTimeTable from '@pages/UploadTimeTable/UploadTimeTable'
import ErrorPage from '@pages/errorPage'
import { createBrowserRouter } from 'react-router-dom'

import {
  DIVISION_CREATION,
  FORGOT_PASSWORD,
  LOAD_ALLOCATION_FOR_TEACHER_END,
  PAGE_502,
  PAGE_DASHBOARD,
  PAGE_ELECTIVE_SUBJECT,
  PAGE_LOGIN,
  PAGE_STUDENT_DASHBOARD,
  PAGE_STUDENT_DIVISION,
  PAGE_SUBJECT_CHOICE,
  PAGE_SUBJECT_SELECT,
  PAGE_SUBJECT_SELECTION_CONFIRMATION,
  PAGE_TEACHER_ALLOCATION,
  PAGE_TEACHER_DASHBOARD,
  PAGE_TIMETABLE,
  SUBJECT_ALLOCATION,
} from '@constants'

import Error502 from '@components/502'

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
            element: (
              <ProtectedRoute roleRequired="admin">
                <Dashboard />
              </ProtectedRoute>
            ),
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
        path: PAGE_TEACHER_ALLOCATION.path,

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
                <UnifiedSubjectChoice />
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

      //subject load Allocation (admin side)
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

      //subject load Allocation (teacher view)
      {
        path: LOAD_ALLOCATION_FOR_TEACHER_END.path,

        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roleRequired="teacher">
                <LoadAllocation />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  { path: PAGE_502.path, element: <Error502 /> },
  { path: '*', element: <NotFound /> },
])

export { router }
