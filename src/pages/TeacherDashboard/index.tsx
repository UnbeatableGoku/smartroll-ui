import { useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FinalAttendanceData } from '@pages/TeacherDashboard/components/FinalAttendanceData'
import { ManualMarkedAttendance } from '@pages/TeacherDashboard/components/ManualMarkedAttendance'
import { BadgeCheck, Ban, Clock, FileDown, Users } from 'lucide-react'

import { cn } from '@utils'

import { useTeacherDashbord } from './hooks/useTeacherDashbord'

const TeacherDashboard = () => {
  const {
    startSessionHandler,
    getLectureDetails,
    lectureDetails,
    sessionData,
    isSheetOpen,
    setIsSheetOpen,
    socket,
    onGoingSessionData,
    students,
    manualAttendance,
    removeStudentAttendanceRequest,
    markManualStudentsAttendance,
    finalAttendanceData,
    isSessionEnded,
    handleOnSessionEnd,
  } = useTeacherDashbord()

  useEffect(() => {
    getLectureDetails()
  }, [])

  const exportAttendance = () => {
    // In a real app, this would generate and download a CSV/PDF
    console.log('Exporting attendance data...')
    alert('Attendance data exported successfully!')
  }

  const handleSheet = () => {
    setIsSheetOpen(false)
    socket?.disconnect()
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="py-6">
        <div className="mb-6 pl-2">
          <h2 className="text-md font-bold tracking-tight text-foreground md:text-2xl">
            Today's Lectures
          </h2>
          <p className="md:text-md text-sm text-muted-foreground">
            Manage your classes and track attendance.
          </p>
        </div>

        {/* Session List */}
        <div className="grid w-full grid-cols-1 gap-4 p-2">
          {lectureDetails?.map((l: any) =>
            l?.lectures?.map((lecture: any, index: number) => (
              <Card
                key={index}
                className="w-full overflow-hidden border-border bg-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl text-foreground">
                      <span className="text-[18px] md:text-xl">
                        Subject: {lecture?.subject?.subject_map?.subject_name} (
                        {lecture?.subject?.subject_map?.subject_code})
                      </span>
                    </CardTitle>
                    <SessionStatusBadge
                      status={
                        sessionData[lecture.session.session_id] === 'pre'
                          ? 'Inactive'
                          : sessionData[lecture.session.session_id] ===
                              'ongoing'
                            ? 'Active'
                            : sessionData[lecture.session.session_id] === 'post'
                              ? 'Ended'
                              : 'Unknown' // Default case (optional)
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <div className="flex flex-col gap-2">
                        {/* <div className="text-lg">
                          <span>Teacher: </span>
                          <span className="font-medium">
                            {lecture?.teacher?.profile?.name ?? 'N/A'}
                          </span>
                        </div> */}
                        <div className="text-lg">
                          <div className="text-sm md:text-lg">
                            <span>Sem: </span>
                            <span className="font-medium">
                              {lecture?.subject?.semester.no}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 text-sm md:text-lg">
                          <span>Division: </span>
                          <span className="font-medium">
                            {lecture?.batches
                              ?.map((d: any) => d?.division.division_name)
                              .join(', ')}
                          </span>
                          •<span>Batch: </span>
                          <span className="font-medium">
                            {lecture?.batches
                              ?.map((d: any) => d?.batch_name)
                              .join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground md:text-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Time: </span>
                      <span className="font-medium">
                        {lecture?.start_time} • {lecture?.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground md:text-lg">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <span>Classroom: </span>
                        <span className="font-medium">
                          {lecture?.classroom?.class_name ?? 'N/A'}
                        </span>
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter
                  className={`flex gap-2 ${
                    lecture?.status === 'Upcoming' ? null : 'flex-col'
                  }`}
                >
                  <Button
                    className={cn(
                      `w-full`,
                      sessionData[lecture.session.session_id] === 'ongoing' &&
                        'bg-white text-black',
                    )}
                    onClick={() => {
                      startSessionHandler(
                        lecture?.session.session_id,
                        lecture?.slug,
                      )
                    }}
                    disabled={lecture?.session?.active === 'post'}
                    // variant={
                    //   lecture?.session?.active === 'ongoing'
                    //     ? 'default'
                    //     : 'outline'
                    // }
                  >
                    {sessionData[lecture.session.session_id] === 'ongoing' &&
                      'Join Session'}
                    {sessionData[lecture.session.session_id] === 'pre' &&
                      'Start Session'}
                    {/* {lecture?.session?.active === 'ongoing' && 'Join Session'} */}
                    {sessionData[lecture.session.session_id] === 'post' &&
                      'Session Ended'}
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full bg-chart-1/60 text-foreground',
                      `${sessionData[lecture.session.session_id] === 'post' ? 'flex' : 'hidden'}`,
                    )}
                    onClick={exportAttendance}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Attendance
                  </Button>
                </CardFooter>
              </Card>
            )),
          )}
        </div>
      </main>

      {/* Session Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={handleSheet}>
        <SheetContent
          side="bottom"
          className="h-[100vh] overflow-y-auto border-border bg-background sm:max-w-full"
        >
          <SheetHeader className="mb-6 flex flex-row items-center justify-between">
            <SheetTitle className="text-2xl text-foreground">
              Session Details
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            {/* Session Information */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-4 text-[12px] font-semibold text-foreground md:text-lg">
                Session Information
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Teacher</p>
                  <p className="font-medium text-foreground">
                    {onGoingSessionData?.lecture?.teacher?.profile.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium text-foreground">
                    {
                      onGoingSessionData?.lecture?.subject?.subject_map
                        .subject_name
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">
                    {onGoingSessionData?.lecture?.start_time} •{' '}
                    {onGoingSessionData?.lecture?.end_time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classroom</p>
                  <p className="font-medium text-foreground">
                    {onGoingSessionData?.lecture?.classroom?.class_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Division and Batch
                  </p>
                  <p className="font-medium text-foreground">
                    {onGoingSessionData?.lecture?.batches.map(
                      (b: any) => b.division.division_name,
                    )}{' '}
                    •{' '}
                    {onGoingSessionData?.lecture?.batches.map(
                      (b: any) => b.batch_name,
                    )}
                  </p>
                </div>
                <div className="capitalize">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <SessionStatusBadge
                    status={onGoingSessionData?.lecture?.session?.active}
                  />
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="rounded-lg border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 p-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Attendance
                </h3>
                <p className="text-sm text-muted-foreground">
                  {students?.length} students present
                </p>
              </div>
              <div className="flex h-[450px] w-full justify-center p-4">
                {isSessionEnded ? (
                  <FinalAttendanceData
                    finalAttendanceData={finalAttendanceData}
                  />
                ) : (
                  <Tabs defaultValue="Default" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="Default" className="flex-1">
                        Default
                      </TabsTrigger>
                      <TabsTrigger value="manual" className="flex-1">
                        Manual
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="Default">
                      <div className="overflow-x-auto">
                        {students.length > 0 ? (
                          <Table>
                            <TableHeader>
                              {students?.length > 0 && (
                                <TableRow className="md:text-md border-border text-[12px]">
                                  <TableHead>Enrollment Number</TableHead>
                                  <TableHead>Student Name</TableHead>
                                  <TableHead>Branch </TableHead>
                                  <TableHead>Attendance Status</TableHead>
                                </TableRow>
                              )}
                            </TableHeader>
                            <TableBody>
                              {students?.map((student: any) => (
                                <TableRow
                                  key={student?.slug}
                                  className="border-border text-[12px] text-foreground"
                                >
                                  <TableCell className="font-medium">
                                    {student?.student?.enrollment}
                                  </TableCell>
                                  <TableCell>
                                    {student?.student?.profile?.name}
                                  </TableCell>
                                  <TableCell>
                                    {student?.batches.map(
                                      (b: any) => b.division.full_name,
                                    )}
                                  </TableCell>
                                  <TableCell className="capitalize text-white">
                                    {student?.is_present === false ? (
                                      <span className="flex items-center gap-2 text-[10px] text-red-600 md:text-[12px]">
                                        <Ban className="size-4 md:size-6" />
                                        Absent
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-2 text-[10px] text-green-500 md:text-[12px]">
                                        <BadgeCheck className="size-4 md:size-6" />
                                        Present
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="flex items-center justify-center p-3 text-white">
                            No Students Present
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="manual" className="mb-2 p-4">
                      {manualAttendance.length > 0 && (
                        <Button
                          className="w-full"
                          onClick={() => markManualStudentsAttendance()}
                        >
                          Mark All Students
                        </Button>
                      )}

                      <ManualMarkedAttendance
                        manualAttendance={manualAttendance}
                        removeStudentAttendanceRequest={
                          removeStudentAttendanceRequest
                        }
                      />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row">
              {!isSessionEnded && (
                <Button
                  className="flex-1 bg-destructive text-white"
                  onClick={() => handleOnSessionEnd()}
                >
                  End Session
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function SessionStatusBadge({ status }: { status: string }) {
  let variant: 'default' | 'secondary' | 'outline' = 'outline'
  let classname: 'bg-red-500' | 'bg-chart-1' | 'bg-zinc-800' = 'bg-zinc-800'

  if (status === 'Inactive') {
    variant = 'secondary'
  } else if (status === 'Active') {
    variant = 'secondary'
    classname = 'bg-chart-1'
  } else {
    classname = 'bg-chart-1'
  }

  return (
    <Badge
      variant={variant}
      className={cn(
        classname,
        'rounded-md text-[8px] text-white md:text-[12px]',
      )}
    >
      {status}
    </Badge>
  )
}

export default TeacherDashboard
