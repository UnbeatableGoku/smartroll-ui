import { useEffect, useState } from 'react'

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
import { format } from 'date-fns'
import { Clock, FileDown, Users } from 'lucide-react'

import { cn } from '@utils'

import { useTeacherDashbord } from './hooks/useTeacherDashbord'

// Mock data for sessions
const initialSessions = [
  {
    id: 1,
    lectureName: 'Introduction to React',
    subject: 'Web Development',
    scheduledTime: new Date(new Date().setHours(9, 0, 0, 0)),
    duration: '1 hour',
    status: 'Upcoming',
    class: 'CS-301',
    department: 'Computer Science',
  },
  {
    id: 2,
    lectureName: 'Data Structures',
    subject: 'Computer Science',
    scheduledTime: new Date(new Date().setHours(11, 0, 0, 0)),
    duration: '2 hours',
    status: 'Ongoing',
    class: 'CS-201',
    department: 'Computer Science',
  },
  {
    id: 3,
    lectureName: 'Database Management',
    subject: 'Information Systems',
    scheduledTime: new Date(new Date().setHours(14, 0, 0, 0)),
    duration: '1.5 hours',
    status: 'Upcoming',
    class: 'IS-401',
    department: 'Information Technology',
  },
  {
    id: 4,
    lectureName: 'Machine Learning Basics',
    subject: 'Artificial Intelligence',
    scheduledTime: new Date(new Date().setHours(16, 0, 0, 0)),
    duration: '2 hours',
    status: 'Upcoming',
    class: 'AI-501',
    department: 'Computer Science',
  },
]

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
  } = useTeacherDashbord()
  const [sessions, setSessions] = useState(initialSessions)
  const [activeSession, setActiveSession] = useState<
    (typeof initialSessions)[0] | null
  >(null)
  // const today = new Date()

  console.log(students)

  useEffect(() => {
    getLectureDetails()
  }, [])

  // const startSession = (session: (typeof initialSessions)[0]) => {
  //   // Update session status to "Ongoing"
  //   const updatedSessions = sessions.map((s) =>
  //     s.id === session.id ? { ...s, status: 'Ongoing' } : s,
  //   )
  //   setSessions(updatedSessions)
  //   setActiveSession({ ...session, status: 'Ongoing' })
  //   setIsSheetOpen(true)
  // }

  const endSession = () => {
    if (activeSession) {
      // Update session status to "Completed"
      const updatedSessions = sessions.map((s) =>
        s.id === activeSession.id ? { ...s, status: 'Completed' } : s,
      )
      setSessions(updatedSessions)
      setActiveSession(null)
      setIsSheetOpen(false)
    }
  }

  const exportAttendance = () => {
    // In a real app, this would generate and download a CSV/PDF
    console.log('Exporting attendance data...')
    alert('Attendance data exported successfully!')
  }

  const handleSheet = () => {
    setIsSheetOpen(false)
    socket?.disconnect()
  }
  console.log(
    'Attendance Data',
    students?.marked_attendances?.map((student) =>
      student.is_present.toString(),
    ),
  )

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="py-6">
        <div className="mb-6 pl-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Today's Lectures
          </h2>
          <p className="text-muted-foreground">
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
                      <span>
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
                          <div>
                            <span>Sem: </span>
                            <span className="font-medium">
                              {lecture?.subject?.semester.no}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 text-lg">
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
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Time: </span>
                      <span className="font-medium">
                        {lecture?.start_time} • {lecture?.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
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
                    className="w-full"
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
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Session Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
                      (b) => b.division.division_name,
                    )}{' '}
                    •{' '}
                    {onGoingSessionData?.lecture?.batches.map(
                      (b) => b.batch_name,
                    )}
                  </p>
                </div>
                <div>
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
                  {students?.marked_attendances?.length} students present
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Enrollment Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Branch </TableHead>
                      <TableHead>Attendance Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.marked_attendances?.map((student) => (
                      <TableRow
                        key={student?.slug}
                        className="border-border text-foreground"
                      >
                        <TableCell className="font-medium">
                          {student?.student?.enrollment}
                        </TableCell>
                        <TableCell>{student?.student?.profile?.name}</TableCell>
                        <TableCell>
                          {student?.batches.map((b) => b.division.full_name)}
                        </TableCell>
                        <TableCell>{student?.is_present}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" onClick={endSession}>
                End Session
              </Button>
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
    <Badge variant={variant} className={cn(classname, 'text-white')}>
      {status}
    </Badge>
  )
}

export default TeacherDashboard
