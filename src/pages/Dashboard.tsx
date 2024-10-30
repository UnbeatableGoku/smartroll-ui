import { Helmet } from 'react-helmet'
import { Navigate } from 'react-router-dom'

import { PAGE_LOGIN } from '@constants'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import AcademicCard from '@components/dashboard_component/AcademicCard'
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

      <div className="container mx-auto p-4 space-y-6">
      {/* Count Cards */}
      <CountCards/>

      {/* <Separator className="my-6" /> */}

      {/* Selection Cards */}
      <AcademicCard/>

      {/* <Separator className="my-6" /> */}

      {/* Analysis Charts */}
      
    </div>
    </>
  )
}

export default Dashboard
