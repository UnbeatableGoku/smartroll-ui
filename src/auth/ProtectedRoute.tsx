// src/auth/ProtectedRoute.tsx
import React from 'react'

import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactElement // Define children as a React element
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = false

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
