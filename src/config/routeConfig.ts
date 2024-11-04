// src/routeConfig.ts
import { LazyExoticComponent, ReactElement, lazy } from 'react'

import { ProtectedRoute } from '@auth/ProtectedRoute'

// HOC for route guarding

// Lazy load components
const Home = lazy(() => import('@pages/Home'))
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Login = lazy(() => import('@pages/Login'))
const NotFound = lazy(() => import('@pages/NotFound'))
const Timetable = lazy(() => import('@pages/Upload_timetable'))
interface RouteConfig {
  path: string
  element: LazyExoticComponent<() => ReactElement>
  guard?: React.FC<{ children: ReactElement }> | null // Guard is optional
  children?: RouteConfig[] // Children is also optional
}
// Route configuration with guards and children routes
export const routeConfig: RouteConfig[] = [
  {
    path: '/',
    element: Home,
    guard: null, // Public route
  },
  {
    path: '/login',
    element: Login,
    guard: null, // Public route
  },
  {
    path: '/dashboard',
    element: Dashboard,
    guard: ProtectedRoute, // Protected route (requires authentication)
  },
  {
    path: '/timetable',
    element: Timetable,
    guard: ProtectedRoute, // Protected route (requires authentication)
  },
  {
    path: '/404',
    element: NotFound,
    guard: null, // Public route for 404
  },
]
