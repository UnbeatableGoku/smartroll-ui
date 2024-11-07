import { Helmet } from 'react-helmet'
import { Navigate } from 'react-router-dom'

import { PAGE_LOGIN } from '@constants'

import AcademicCard from '@components/dashboard_component/AcademicCard'
import { AnalysisCard } from '@components/dashboard_component/AnalysisCard'
import CountCards from '@components/dashboard_component/CountCards'

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

      <div className="container mx-auto space-y-6 p-4">
        {/* Count Cards */}
        <CountCards />

        {/* <Separator className="my-6" /> */}

        {/* Selection Cards */}
        <AcademicCard />

        {/* <Separator className="my-6" /> */}

        {/* Analysis Charts */}

        <AnalysisCard />
      </div>
    </>
  )
}

export default Dashboard
