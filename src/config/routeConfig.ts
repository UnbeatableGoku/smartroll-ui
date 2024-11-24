// src/routeConfig.ts
import { lazy } from 'react'

// Lazy load components
const Home = lazy(() => import('@pages/Home'))
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Login = lazy(() => import('@pages/Login/Login'))
const NotFound = lazy(() => import('@pages/NotFound'))

interface RouteConfig {
  path: string
  element: React.LazyExoticComponent<() => React.ReactElement>
  guard?: React.FC<{ children: React.ReactElement }> | null // Guard is optional
  children?: RouteConfig[] // Children is also optional
}

// Route configuration with guards and children routes
export const routeConfig: RouteConfig[] = [
  {
    path: '/',
    element: Home,
    guard: null, // Protect the Home route (public -> protected)
  },
  {
    path: '/login',
    element: Login,
    guard: null, // No guard for Login (public route)
  },

  {
    path: '/dashboard',
    element: Dashboard,
    guard: null, // Protected route (requires authentication)
  },
  {
    path: '/404',
    element: NotFound,
    guard: null, // Public route for 404
  },
]
