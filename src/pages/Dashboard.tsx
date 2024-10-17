import { Helmet } from 'react-helmet'
import { Navigate } from 'react-router-dom'

import { PAGE_LOGIN } from '@constants/page'

const Dashboard = () => {
  // const { isAuthenticated } = useAuth()

  const isAuthenticated = true
  if (!isAuthenticated) {
    return <Navigate replace to={PAGE_LOGIN.path} />
  }
  return (
    <>
      <Helmet>
        <title>Smart Roll | Home</title>
      </Helmet>

      <h1>Welcome to Smart Roll Dashboard</h1>
    </>
  )
}

export default Dashboard
