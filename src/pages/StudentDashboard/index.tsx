import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useStudentDashboard from '@pages/StudentDashboard/hooks/useStudentDashboard'
import { Clock, Users } from 'lucide-react'

import { cn } from '@utils'

import { Badge } from '@components/ui/badge'

const StudentDashboard = () => {
  const {
    get_location_permission,
    permission_state,
    getLectureDetails,
    lectureDetails,
    mark_attendance,
    handleManualMarking,
  } = useStudentDashboard()

  useEffect(() => {
    get_location_permission()
    if (permission_state) {
      getLectureDetails()
    }
  }, [permission_state])

  return (
    <div className="min-h-screen">
      {!permission_state ? (
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/ERhEIsEXG50?si=i9ez0hxneFCuAe6E"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
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
            {lectureDetails?.map((l: any) => (
              <div className="w-full" key={l?.id || Math.random()}>
                <div className="w-full rounded-md bg-zinc-700 p-4">
                  {l.stream.branch.branch_name}
                </div>
                <div className="px-2 md:px-8">
                  {l?.timetables?.map((timetable: any) =>
                    timetable?.schedule?.lectures?.map(
                      (lecture: any, index: number) => (
                        <Card
                          className="mt-4 w-full overflow-hidden border-border bg-card"
                          key={lecture?.id || index}
                        >
                          <CardHeader className="pb-2 sm:pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="break-words text-lg text-foreground sm:text-xl md:text-2xl">
                                <div className="md:flex md:items-center md:gap-4">
                                  <span className="text-[18px] md:text-xl">
                                    Subject:{' '}
                                    {
                                      lecture?.subject?.subject_map
                                        ?.subject_name
                                    }{' '}
                                    (
                                    {
                                      lecture?.subject?.subject_map
                                        ?.subject_code
                                    }
                                    )
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="my-2 flex w-12 items-center justify-center rounded-sm bg-chart-3 capitalize"
                                  >
                                    {lecture?.type}
                                  </Badge>
                                </div>
                              </CardTitle>
                              <SessionStatusBadge
                                status={
                                  lecture?.attendance_marked
                                    ? 'Attendance Marked'
                                    : 'Attendance Not Marked'
                                }
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 pt-2 sm:space-y-4 sm:pt-4">
                            <div className="grid gap-2 sm:gap-4">
                              <div className="flex flex-col gap-1 text-sm text-foreground sm:gap-2 sm:text-base">
                                <div className="flex flex-col gap-1 sm:gap-2">
                                  <div className="text-base sm:text-lg">
                                    <span>Teacher: </span>
                                    <span className="font-medium">
                                      {lecture?.teacher ?? 'N/A'}
                                    </span>
                                  </div>
                                  <div className="text-base sm:text-lg">
                                    <div>
                                      <span>Sem: </span>
                                      <span className="font-medium">
                                        {lecture?.subject?.semester.no}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1 text-base sm:flex-row sm:items-center sm:gap-2 sm:text-lg">
                                    <div>
                                      <span>Division: </span>
                                      <span className="font-medium">
                                        {lecture?.batches
                                          ?.map(
                                            (d: any) =>
                                              d?.division.division_name,
                                          )
                                          .join(', ')}
                                      </span>
                                    </div>
                                    <span className="hidden sm:inline">•</span>
                                    <div>
                                      <span>Batch: </span>
                                      <span className="font-medium">
                                        {lecture?.batches
                                          ?.map((d: any) => d?.batch_name)
                                          .join(', ')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-foreground sm:text-sm">
                                <Clock className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
                                <span>Time: </span>
                                <span className="font-medium">
                                  {lecture?.start_time} • {lecture?.end_time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-foreground sm:text-sm">
                                <Users className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
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
                            className={`grid grid-cols-2 gap-2 ${lecture?.status === 'Upcoming' ? '' : 'flex-col'}`}
                          >
                            {!lecture?.attendance_marked && (
                              <>
                                <Button
                                  className="cursor-pointer"
                                  onClick={(e) =>
                                    mark_attendance(e.target, lecture?.slug)
                                  }
                                >
                                  Mark Attendance
                                </Button>
                                <Button
                                  className="cursor-pointer rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
                                  onClick={(e) =>
                                    handleManualMarking(e.target, lecture?.slug)
                                  }
                                >
                                  Manual Marking
                                </Button>
                              </>
                            )}
                          </CardFooter>
                        </Card>
                      ),
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  )
}

function SessionStatusBadge({ status }: { status: any }) {
  let variant: 'default' | 'secondary' | 'outline' = 'outline'

  return (
    <Badge
      variant={variant}
      className={cn(
        'rounded-md bg-chart-1 text-center text-[10px] text-white md:text-[12px]',
      )}
    >
      {status}
    </Badge>
  )
}
export default StudentDashboard
