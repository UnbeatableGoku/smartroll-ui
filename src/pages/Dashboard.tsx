import { Helmet } from 'react-helmet'
import { Navigate } from 'react-router-dom'

import { PAGE_LOGIN } from '@constants'

import AcademicCard from '@components/dashboard/AcademicCard'
import { AnalysisCard } from '@components/dashboard/AnalysisCard'
import CountCards from '@components/dashboard/CountCards'

const Dashboard = () => {
  // const { isAuthenticated } = useAuth()

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
