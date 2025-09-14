import { useEffect } from 'react'

import AttendanceSheet from '../components/AttendanceSheet'
import CreateInstantSession from '../components/CreateInstantSession'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BookOpen, GraduationCap, Plus } from 'lucide-react'

import useCreateInstantSession from '@hooks/useCreateInstantSession'

import { cn } from '@lib/utils'

import CustomLoader from '@components/ui/custom-loader'

const InstantLecture = () => {
  const {
    instantSession,
    handleInstantSessionChange,
    isSheetOpen,
    setIsSheetOpen,
    instantSessions,
    fetchInstantSessions,
    instantSessionsMetadata,
    fetchInstantSessionMetadata,
    handleInputValueChange,
    clearInstantSessionData,
    createInstantSessionAPI,
    sessionStates,
    handleSheet,
    startSessionHandler,
    showCustomLoader,
    isAttendanceSheetOpen,
    setAttendanceSheetOpen,
    handleOnSessionEnd,
    students,
    manualAttendance,
    markManualStudentsAttendance,
    removeStudentAttendanceRequest,
    updateStudentAttendance,
    handleEarlySheetOpen,
    setShowCustomLoader,
    onGoingSessionData,
    endSessionhandlerAPI,
    isSlowNetwork,
    markRegulizattionRequestEntryAPI,
    updateStudentAttendaceAPI,
  } = useCreateInstantSession()

  useEffect(() => {
    fetchInstantSessionMetadata()
    fetchInstantSessions()
  }, [])

  const NoLecturesIllustration = () => (
    <div className="flex flex-col items-center justify-center px-4 py-4">
      <div className="relative mb-8">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <GraduationCap className="h-6 w-6 text-accent-foreground" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">
        No Instant Lectures Available
      </h3>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        There are currently no instant lectures scheduled. Create your first
        instant lecture session to get started.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-foreground sm:text-3xl">
              Instant Lecture Sessions
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and create instant lecture sessions
            </p>
          </div>

          {instantSessions.length > 0 && (
            <Button
              className="bg-submit text-primary-foreground hover:bg-submit/90"
              onClick={() => {
                setIsSheetOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Instant Session
            </Button>
          )}
        </div>

        {/* Content */}
        {instantSessions.length === 0 ? (
          <div className="text-center">
            <NoLecturesIllustration />
            <Button
              className="bg-submit text-primary-foreground hover:bg-submit/90"
              onClick={() => {
                setIsSheetOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Instant Session
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instantSessions.map((lecture: any) => (
              <Card
                key={lecture.id}
                className="border-border bg-[#F7F7F7] transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-1 text-lg text-card-foreground">
                        {lecture?.subject?.subject_map?.subject_name ??
                          lecture?.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        by {lecture.teacher.profile.name}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        getBadgeColor(
                          sessionStates[lecture.session.session_id] ?? '',
                        ),
                      )}
                    >
                      {getLectureStatus(
                        sessionStates[lecture.session.session_id] ?? '',
                      )?.badge || 'Un-known'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Branch:</span>
                      <span className="font-medium text-foreground">
                        {lecture.branch}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Semester:</span>
                      <span className="font-medium text-foreground">
                        {lecture.semester}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Division:</span>
                      <span className="font-medium text-foreground">
                        {lecture.divisions?.join(',')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Batch:</span>
                      <span className="font-medium text-foreground">
                        {lecture?.batches?.join(',')}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full bg-submit text-primary-foreground hover:bg-submit/90"
                    onClick={() => {
                      startSessionHandler(
                        lecture?.session.session_id,
                        lecture?.slug,
                      )
                    }}
                  >
                    {getLectureStatus(
                      sessionStates[lecture.session.session_id] ?? '',
                    )?.button || 'Un-known'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <CreateInstantSession
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        handleInstantSessionChange={handleInstantSessionChange}
        instantSessionMetadata={instantSessionsMetadata}
        instantSession={instantSession}
        handleInputValueChange={handleInputValueChange}
        fetchInstantSessionMetadata={fetchInstantSessionMetadata}
        clearInstantSessionData={clearInstantSessionData}
        createInstantSessionAPI={createInstantSessionAPI}
      />
      {onGoingSessionData && (
        <AttendanceSheet
          handleSheet={handleSheet}
          isSheetOpen={isAttendanceSheetOpen}
          setIsSheetOpen={setAttendanceSheetOpen}
          handleOnSessionEnd={handleOnSessionEnd}
          manualAttendance={manualAttendance}
          students={students}
          markManualStudentsAttendance={markManualStudentsAttendance}
          removeStudentAttendanceRequest={removeStudentAttendanceRequest}
          updateStudentAttendance={updateStudentAttendance}
          endSessionhandlerAPI={endSessionhandlerAPI}
          isSlowNetwork={isSlowNetwork}
          markRegulizattionRequestEntryAPI={markRegulizattionRequestEntryAPI}
          updateStudentAttendaceAPI={updateStudentAttendaceAPI}
        />
      )}

      {/* Custom Loader for Session Start */}
      <CustomLoader
        isVisible={showCustomLoader}
        onEarlyComplete={() => {
          // This will be called when 2 seconds are remaining in countdown
          // Trigger socket setup to ensure sheet opens quickly
          handleEarlySheetOpen()
        }}
        onComplete={() => {
          setShowCustomLoader(false)
          // Ensure smooth transition by removing any potential delays
        }}
        delay={3000}
      />
    </div>
  )
}

function getBadgeColor(state: string) {
  switch (state) {
    case 'ongoing':
    case 'pre':
      return 'h-[26px] w-[88px] border px-2.5 py-0.5 bg-[#4CB151] text-white flex items-center justify-center  border-none font-bold hover:bg-bg-[#4CB151]/10 rounded-[4px]'

    case 'post':
      return 'bg-red-500/15 text-red-600 border-red-500/20 font-bold hover:bg-red-500/10'

    default:
      return 'bg-transparent'
  }
}
// flex h-[26px] w-[88px] items-center justify-center rounded-[4px] border-none text-[10px] text-white  md:text-[12px]
function getLectureStatus(state: string) {
  switch (state) {
    case 'pre':
      return { badge: 'Active', button: 'Start session' }
    case 'ongoing':
      return { badge: 'Active', button: 'Join session' }
    case 'post':
      return { badge: 'Ended', button: 'View attendance' }
    default:
      return {}
  }
}
export default InstantLecture
