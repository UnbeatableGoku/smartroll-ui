import { useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
// Ensure this path is correct
import { Button } from '@/components/ui/button'
// Ensure this path is correct
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// Ensure this path is correct
import useStudentDashboard from '@pages/StudentDashboard/hooks/useStudentDashboard'
import { BadgeCheck, Clock, Users } from 'lucide-react'

// Added BadgeCheck for Present status
import { cn } from '@utils'

// Ensure this path is correct

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
  }, []) // Request permission on mount

  useEffect(() => {
    if (permission_state) {
      getLectureDetails()
    }
  }, [permission_state]) // Fetch lectures when permission is granted

  return (
    <div className="">
      {' '}
      {/* Light background like Teacher's */}
      {!permission_state ? (
        // Keep the permission prompt/video as is
        <div className="flex h-screen flex-col items-center justify-center bg-white p-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-black">
            Location Permission Required
          </h2>
          <p className="mb-6 text-gray-600">
            Please grant location permission to mark your attendance. Watch the
            video below for instructions if needed.
          </p>
          <iframe
            width="100%"
            style={{ maxWidth: '560px' }} // Optional: constrain video width
            height="315"
            src="https://www.youtube.com/embed/ERhEIsEXG50?si=i9ez0hxneFCuAe6E"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <Button
            onClick={get_location_permission}
            className="mt-6 rounded-[4px] bg-[#0261BE] text-white hover:bg-blue-700"
          >
            Grant Permission
          </Button>
        </div>
      ) : (
        // Main content area - matches Teacher's structure
        <main className="py-6 pb-16">
          {/* Session List */}
          <div className="space-y-6 p-1 md:p-2">
            {' '}
            {/* Use space-y for vertical spacing */}
            {lectureDetails.map((l: any) => (
              <div
                key={l?.id || Math.random()}
                className="w-full rounded-[20px] border-none bg-[#FFFFFF] p-[16px] shadow-soft" // Branch container style
              >
                {/* Branch Name */}
                <div className="text-md mb-4 flex w-full items-center rounded-sm p-2 font-medium text-black md:text-[20px]">
                  {l.stream?.branch?.branch_name || 'Branch Name Missing'}
                </div>

                {/* Lectures Grid */}
                <div className="grid grid-cols-1 gap-6 px-1 pt-0 md:grid-cols-2 md:px-4 lg:grid-cols-3">
                  {' '}
                  {/* Grid for cards */}
                  {l?.timetables?.length > 0 ? (
                    l.timetables.map((timetable: any) =>
                      timetable?.schedule?.lectures.length > 0 ? (
                        timetable?.schedule?.lectures?.map(
                          (lecture: any, index: number) => (
                            <Card
                              key={lecture?.id || index}
                              className="w-full overflow-hidden border-none bg-[#F7F7F7] shadow-soft" // Card style
                            >
                              <CardHeader className="p-4 pb-2">
                                {' '}
                                {/* Padding like Teacher's */}
                                <div className="flex items-start justify-between gap-2">
                                  <CardTitle className="text-[16px] font-semibold text-[#000000] md:text-xl">
                                    {' '}
                                    {/* Title style */}
                                    {/* Subject Name and Code */}
                                    <span className="block break-words">
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
                                    {/* Lecture Type Badge */}
                                    <Badge
                                      variant="secondary"
                                      className="mt-1 flex h-[22px] w-fit items-center justify-center rounded-[4px] bg-[#F99704] p-0 px-2 text-[10px] capitalize text-white hover:bg-[#e6a63f] md:text-[12px]"
                                    >
                                      {lecture?.type}
                                    </Badge>
                                  </CardTitle>
                                  {/* Attendance Marked Badge */}
                                  <Badge
                                    className={cn(
                                      'flex h-[26px] shrink-0 items-center justify-center rounded-[4px] border-none bg-[#4CB151] p-0 px-3 text-[10px] text-white md:text-[12px]', // Green like "Active"
                                      !lecture?.attendance_marked && 'hidden', // Hide if not marked
                                    )}
                                    id={`badge_${lecture?.slug}${lecture?.session?.session_id}`}
                                  >
                                    <BadgeCheck className="mr-1 h-3 w-3 md:h-4 md:w-4" />{' '}
                                    {/* Icon */}
                                    Present
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="px-4 pt-2">
                                {' '}
                                {/* Padding like Teacher's */}
                                <div className="grid gap-3">
                                  {' '}
                                  {/* Content spacing */}
                                  {/* Teacher Name */}
                                  <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                    {/* <User className="size-5 text-[#00000080]" /> Optional icon */}
                                    <span className="text-black">Teacher:</span>
                                    <span className="font-semibold text-black">
                                      {lecture?.teacher ?? 'N/A'}
                                    </span>
                                  </div>
                                  {/* Semester, Division, Batch */}
                                  <div className="flex flex-col gap-1 text-sm text-foreground md:text-base">
                                    <div className="flex items-center gap-[6px] text-lg">
                                      <div className="flex gap-4 text-sm md:text-lg">
                                        <span className="text-black">
                                          Semester:{' '}
                                        </span>
                                        <span className="font-semibold text-black">
                                          {lecture?.subject?.semester.no}
                                        </span>
                                      </div>
                                      <span className="text-[#000000]">-</span>
                                      <div className="flex gap-[23px] text-sm text-black md:text-lg">
                                        {lecture?.type === 'theory' ? (
                                          <span className="font-semibold">
                                            {
                                              lecture?.batches[0]?.division
                                                .division_name
                                            }
                                          </span>
                                        ) : (
                                          <span className="font-semibold">
                                            {lecture?.batches
                                              ?.map((d: any) => d?.batch_name)
                                              .join(', ')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Classroom */}
                                  <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                    <Users className="size-5 text-[#00000080]" />{' '}
                                    {/* Icon Style */}
                                    <span className="text-black">
                                      Classroom:
                                    </span>
                                    <span className="font-semibold text-black">
                                      {lecture?.classroom?.class_name ?? 'N/A'}
                                    </span>
                                  </div>
                                  {/* Time */}
                                  <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                    <Clock className="size-5 text-[#00000080]" />{' '}
                                    {/* Icon Style */}
                                    {/* <span className="text-black">Time:</span> */}
                                    <span className="font-semibold text-black">
                                      {lecture?.start_time} •{' '}
                                      {lecture?.end_time}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex flex-col gap-2 p-4 md:flex-row">
                                {' '}
                                {/* Footer padding & layout */}
                                {/* Conditional Buttons */}
                                {!lecture?.attendance_marked && (
                                  <>
                                    <Button
                                      className="w-full rounded-[4px] border-none bg-[#0261BE] p-[10px] text-sm text-white hover:bg-blue-700 md:p-[12px]" // Button style like Teacher's Join/Start
                                      id={`attendance_${lecture?.slug}${lecture?.session?.session_id}`}
                                      onClick={(e) =>
                                        mark_attendance(
                                          e.target, // Pass the button element itself
                                          lecture?.slug,
                                          lecture?.session?.session_id,
                                        )
                                      }
                                      // Add disabled state if needed, e.g., during API call
                                    >
                                      Mark Attendance
                                    </Button>
                                    <Button
                                      className="w-full rounded-[4px] border-none bg-[#0261BE] p-[10px] text-sm text-white hover:bg-blue-700 md:p-[12px]" // Consistent button style
                                      id={`${lecture?.slug}${lecture?.session?.session_id}`} // Keep ID for potential targeting
                                      onClick={
                                        (e) =>
                                          handleManualMarking(
                                            e.target,
                                            lecture?.slug,
                                            lecture?.session?.session_id,
                                          ) // Pass button element
                                      }
                                      // Add disabled state if needed
                                    >
                                      Manual Marking Request
                                    </Button>
                                  </>
                                )}
                              </CardFooter>
                            </Card>
                          ),
                        )
                      ) : (
                        <div className="col-span-full px-1 pt-4 md:px-4">
                          <Card className="w-full overflow-hidden border-none bg-[#F7F7F7] text-center shadow-soft">
                            <CardHeader className="p-4 text-black">
                              No lectures scheduled in this timetable.
                            </CardHeader>
                          </Card>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="col-span-full px-1 pt-4 md:px-4">
                      <Card className="w-full overflow-hidden border-none bg-[#F7F7F7] text-center shadow-soft">
                        <CardHeader className="p-4 text-black">
                          No lectures scheduled in this timetable.
                        </CardHeader>
                      </Card>
                    </div>
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

export default StudentDashboard
