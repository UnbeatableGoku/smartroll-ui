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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NoDataIllustration from '@assets/images/NoData.svg'
import { BadgeCheck, Calendar, Clock, Users } from 'lucide-react'

// Ensure this path is correct
// Ensure this path is correct
import useStudentDashboard from '@hooks/useStudentDashboard'

// Ensure this path is correct
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
    fetchInstantLecturesAPI,
    currentTab,
    setCurrentTab,
    instantSessions,
  } = useStudentDashboard()

  useEffect(() => {
    get_location_permission()
  }, []) // Request permission on mount

  useEffect(() => {
    if (permission_state) {
      getLectureDetails()
    }
  }, [permission_state]) // Fetch lectures when permission is granted

  useEffect(() => {
    if (currentTab === 'instant_session') {
      fetchInstantLecturesAPI()
    }
  }, [currentTab])

  return (
    <div className="">
      {' '}
      {/* Light background like Teacher's */}
      {!permission_state ? (
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-lg bg-white p-6 pb-20 text-center shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-black">
            Location Permission Required
          </h2>
          <p className="mb-6 max-w-2xl text-black">
            To mark your attendance, we need access to your location. Please
            enable location services using the instructions below.
          </p>

          {/* Location Services Instructions */}
          <div className="mb-6 w-full max-w-4xl rounded-lg bg-[#F0F7FF] p-4 px-3 shadow-md sm:p-6">
            <h3 className="mb-3 flex items-center text-lg font-semibold text-black sm:mb-4 sm:text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5 text-[#0261BE]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              If Location Services Are Disabled on Your Device
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              {/* Android Location Services */}
              <div className="rounded-lg bg-white p-3 shadow-md sm:p-4">
                <h4 className="mb-2 flex items-center text-base font-semibold text-black sm:mb-3 sm:text-lg">
                  <div className="mr-2 rounded-full bg-[#a4c639] p-1 sm:mr-3 sm:p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  Android Location Services
                </h4>
                <ol className="space-y-2 text-left text-sm text-black sm:space-y-3 sm:text-base">
                  <li className="flex items-start rounded-md border-l-4 border-[#0261BE] bg-[#E3F2FD] p-2">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      1
                    </span>
                    <span>
                      Swipe down from the top of your screen to open{' '}
                      <strong>Quick Settings</strong>
                    </span>
                  </li>
                  <li className="flex items-start rounded-md border-l-4 border-[#0261BE] bg-[#E3F2FD] p-2">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      2
                    </span>
                    <span>
                      Look for the <strong>Location</strong> icon and tap it to
                      turn it on
                    </span>
                  </li>
                  <li className="flex items-start rounded-md border-l-4 border-[#0261BE] bg-[#E3F2FD] p-2">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      3
                    </span>
                    <span>
                      If not visible, go to <strong>Settings</strong> →{' '}
                      <strong>Location</strong> and toggle ON
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      4
                    </span>
                    <span>
                      Return to Chrome and tap the <strong>three dots</strong>{' '}
                      menu → <strong>Settings</strong> →{' '}
                      <strong>Site settings</strong> → <strong>Location</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      5
                    </span>
                    <span>
                      Make sure SmartRoll is set to <strong>Allow</strong>
                    </span>
                  </li>
                </ol>
              </div>

              {/* iOS Location Services */}
              <div className="rounded-lg bg-white p-3 shadow-md sm:p-4">
                <h4 className="mb-2 flex items-center text-base font-semibold text-black sm:mb-3 sm:text-lg">
                  <div className="mr-2 rounded-full bg-black p-1 sm:mr-3 sm:p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  iOS Location Services
                </h4>
                <ol className="space-y-2 text-left text-sm text-black sm:space-y-3 sm:text-base">
                  <li className="flex items-start rounded-md border-l-4 border-[#0261BE] bg-[#E3F2FD] p-2">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      1
                    </span>
                    <span>
                      Open <strong>Settings</strong> on your device
                    </span>
                  </li>
                  <li className="flex items-start rounded-md border-l-4 border-[#0261BE] bg-[#E3F2FD] p-2">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      2
                    </span>
                    <span>
                      Tap <strong>Privacy & Security</strong>
                    </span>
                  </li>
                  <li className="flex items-start rounded-md border-l-4 border-[#0261BE] bg-[#E3F2FD] p-2">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      3
                    </span>
                    <span>
                      Tap <strong>Location Services</strong> and toggle ON
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      4
                    </span>
                    <span>
                      Scroll down and tap <strong>Safari Websites</strong> (or
                      your browser app)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      5
                    </span>
                    <span>
                      Under "Allow Location Access", select{' '}
                      <strong>While Using the App</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0261BE] text-xs font-medium text-white sm:mr-3 sm:h-6 sm:w-6 sm:text-sm">
                      6
                    </span>
                    <span>
                      Return to Safari, reload the page, and tap{' '}
                      <strong>Allow</strong> when prompted
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-4 max-w-2xl">
            <h3 className="mb-2 text-lg font-semibold text-black">
              Still having trouble?
            </h3>
            <p className="mb-4 text-black">
              Watch this video for additional help:
            </p>
            <div
              className="relative overflow-hidden rounded-lg shadow-md"
              style={{ paddingTop: '56.25%' }}
            >
              <iframe
                className="absolute left-0 top-0 h-full w-full"
                src="https://www.youtube.com/embed/ERhEIsEXG50?si=i9ez0hxneFCuAe6E"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      ) : (
        // Main content area - matches Teacher's structure
        <main className="py-6 pb-16">
          <Tabs
            className="w-full"
            defaultValue="todays_session"
            value={currentTab}
            onValueChange={(value) => {
              console.log(value)
              setCurrentTab(value)
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger
                value="todays_session"
                className="w-1/2 text-black data-[state=active]:bg-submit data-[state=active]:text-white"
              >
                Today's schedule
              </TabsTrigger>
              <TabsTrigger
                value="instant_session"
                className="w-1/2 text-black data-[state=active]:bg-submit data-[state=active]:text-white"
              >
                Instant lecture
              </TabsTrigger>
            </TabsList>
            <TabsContent value="todays_session">
              {/* Session List */}
              <div className="space-y-6 p-1 md:p-2">
                {' '}
                {/* Use space-y for vertical spacing */}
                {lectureDetails?.length > 0 &&
                  lectureDetails.map((l: any) => (
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
                            timetable?.lectures?.length > 0 ? (
                              timetable.lectures.map(
                                (lecture: any, index: number) => (
                                  <Card
                                    key={lecture?.id || index}
                                    className="w-full overflow-hidden border-zinc-200 bg-[#f7f7f7c0] shadow-soft"
                                  >
                                    <CardHeader className="p-4 pb-2">
                                      <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-[16px] font-semibold text-[#000000] md:text-xl">
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
                                          <Badge
                                            variant="secondary"
                                            className="mt-1 flex h-[22px] w-fit items-center justify-center rounded-[4px] bg-[#F99704] p-0 px-2 text-[10px] capitalize text-white hover:bg-[#e6a63f] md:text-[12px]"
                                          >
                                            {lecture?.type}
                                          </Badge>
                                        </CardTitle>
                                        <Badge
                                          className={cn(
                                            'flex h-[26px] w-auto items-center justify-center rounded-[4px] border-none bg-[#4CB151] p-0 px-3 text-[10px] text-white hover:bg-[#4CB151] md:text-[12px]',
                                            !lecture?.attendance_marked &&
                                              'hidden',
                                          )}
                                          id={`badge_${lecture?.slug}${lecture?.session?.session_id}`}
                                        >
                                          <BadgeCheck className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                                          Present
                                        </Badge>
                                      </div>
                                    </CardHeader>

                                    <CardContent className="px-4 pt-2">
                                      <div className="grid gap-3">
                                        <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                          <span className="text-black">
                                            Teacher:
                                          </span>
                                          <span className="font-semibold text-black">
                                            {lecture?.teacher ?? 'N/A'}
                                          </span>
                                        </div>

                                        <div className="flex flex-col gap-1 text-sm text-foreground md:text-base">
                                          <div className="flex items-center gap-[6px] text-lg">
                                            <div className="flex gap-4 text-sm md:text-lg">
                                              <span className="text-black">
                                                Semester:
                                              </span>
                                              <span className="font-semibold text-black">
                                                {lecture?.subject?.semester?.no}
                                              </span>
                                            </div>
                                            <span className="text-[#000000]">
                                              -
                                            </span>
                                            <div className="flex gap-[23px] text-sm text-black md:text-lg">
                                              {lecture?.type === 'theory' ? (
                                                <span className="font-semibold">
                                                  {
                                                    lecture?.batches[0]
                                                      ?.division?.division_name
                                                  }
                                                </span>
                                              ) : (
                                                <span className="font-semibold">
                                                  {lecture?.batches
                                                    ?.map(
                                                      (d: any) => d?.batch_name,
                                                    )
                                                    .join(', ')}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                          <Users className="size-5 text-[#00000080]" />
                                          <span className="text-black">
                                            Classroom:
                                          </span>
                                          <span className="font-semibold text-black">
                                            {lecture?.classroom?.class_name ??
                                              'N/A'}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                          <Clock className="size-5 text-[#00000080]" />
                                          <span className="font-semibold text-black">
                                            {lecture?.start_time} •{' '}
                                            {lecture?.end_time}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                          <Calendar className="size-5 text-[#00000080]" />
                                          <span className="font-semibold text-black">
                                            {lecture?.session?.day
                                              ? new Date(
                                                  lecture.session.day,
                                                ).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                                })
                                              : 'N/A'}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>

                                    <CardFooter className="flex flex-col gap-2 p-4 md:flex-row">
                                      {!lecture?.attendance_marked && (
                                        <>
                                          <Button
                                            className="w-full rounded-[4px] border-none bg-[#0261BE] p-[10px] text-sm text-white hover:bg-blue-700 md:p-[12px]"
                                            id={`attendance_${lecture?.slug}${lecture?.session?.session_id}`}
                                            disabled={
                                              lecture?.session?.attendances
                                                ?.manual ||
                                              lecture?.session?.attendances
                                                ?.is_present
                                            }
                                            onClick={(e) =>
                                              mark_attendance(
                                                e.target,
                                                lecture?.slug,
                                                lecture?.session?.session_id,
                                              )
                                            }
                                          >
                                            Mark Attendance
                                          </Button>
                                          <Button
                                            className="w-full rounded-[4px] border-none bg-[#0261BE] p-[10px] text-sm text-white hover:bg-blue-700 md:p-[12px]"
                                            id={`${lecture?.slug}${lecture?.session?.session_id}`}
                                            disabled={
                                              lecture?.session?.attendances
                                                ?.manual ||
                                              lecture?.session?.attendances
                                                ?.is_present
                                            }
                                            onClick={(e) =>
                                              handleManualMarking(
                                                e.target,
                                                lecture?.slug,
                                                lecture?.session?.session_id,
                                              )
                                            }
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
                {lectureDetails?.length === 0 && (
                  <div className="flex min-h-[70vh] items-center justify-center rounded-lg p-6">
                    <div className="max-w-md text-center">
                      {/* Simple Illustration */}
                      <div className="relative left-[50%] mb-8 h-40 w-40 -translate-x-1/2 transform sm:h-80 sm:w-80">
                        <img
                          src={NoDataIllustration}
                          alt="No lectures today"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Simple Text */}
                      <div className="space-y-3">
                        <h2 className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-xl font-semibold text-transparent md:text-3xl">
                          No Lectures Today!
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                          Enjoy your free time and make the most of your day!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="instant_session">
              {/* instant sessions */}
              <div className="space-y-6 p-1 md:p-2">
                {' '}
                {/* Use space-y for vertical spacing */}
                {instantSessions?.length > 0 &&
                  instantSessions.map((lecture: any) => (
                    <div
                      key={lecture?.id || Math.random()}
                      className="w-full rounded-[20px] border-none bg-[#FFFFFF] p-[16px] shadow-soft" // Branch container style
                    >
                      {/* Lectures Grid */}
                      <div className="grid grid-cols-1 gap-6 px-1 pt-0 md:grid-cols-2 md:px-4 lg:grid-cols-3">
                        {' '}
                        {/* Grid for cards */}
                        <Card
                          key={lecture?.slug}
                          className="w-full overflow-hidden border-zinc-200 bg-[#f7f7f7c0] shadow-soft"
                        >
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-[16px] font-semibold text-[#000000] md:text-xl">
                                <span className="block break-words">
                                  {lecture?.subject?.subject_map
                                    ?.subject_name || lecture?.title}{' '}
                                </span>
                              </CardTitle>
                              <Badge
                                className={cn(
                                  'flex h-[26px] w-auto items-center justify-center rounded-[4px] border-none bg-[#4CB151] p-0 px-3 text-[10px] text-white hover:bg-[#4CB151] md:text-[12px]',
                                  !lecture?.attendance_marked && 'hidden',
                                )}
                                id={`badge_${lecture?.slug}${lecture?.session?.session_id}`}
                              >
                                <BadgeCheck className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                                Present
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="px-4 pt-2">
                            <div className="grid gap-3">
                              <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                <span className="text-black">Teacher:</span>
                                <span className="font-semibold text-black">
                                  {lecture?.teacher ?? 'N/A'}
                                </span>
                              </div>

                              <div className="flex flex-col gap-1 text-sm text-foreground md:text-base">
                                <div className="flex items-center gap-[6px] text-lg">
                                  <div className="flex gap-4 text-sm md:text-lg">
                                    <span className="text-black">
                                      Semester:
                                    </span>
                                    <span className="font-semibold text-black">
                                      {lecture?.semester}
                                    </span>
                                  </div>
                                  <span className="text-[#000000]">-</span>
                                  <div className="flex gap-[23px] text-sm text-black md:text-lg">
                                    <span className="font-semibold">
                                      {lecture?.divisions.join(', ')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                <span className="text-black">Batches:</span>
                                <span className="font-semibold text-black">
                                  {lecture?.batches.join(', ') ?? 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-foreground md:text-base">
                                <span className="text-black">Branch:</span>
                                <span className="font-semibold text-black">
                                  {lecture?.branch ?? 'N/A'}
                                </span>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="flex flex-col gap-2 p-4 md:flex-row">
                            {!lecture?.attendance_marked && (
                              <>
                                <Button
                                  className="w-full rounded-[4px] border-none bg-[#0261BE] p-[10px] text-sm text-white hover:bg-blue-700 md:p-[12px]"
                                  id={`attendance_${lecture?.slug}${lecture?.session?.session_id}`}
                                  disabled={
                                    lecture?.session?.attendances?.manual ||
                                    lecture?.session?.attendances?.is_present
                                  }
                                  onClick={(e) =>
                                    mark_attendance(
                                      e.target,
                                      lecture?.slug,
                                      lecture?.session?.session_id,
                                      true,
                                    )
                                  }
                                >
                                  Mark Attendance
                                </Button>
                                <Button
                                  className="w-full rounded-[4px] border-none bg-[#0261BE] p-[10px] text-sm text-white hover:bg-blue-700 md:p-[12px]"
                                  id={`${lecture?.slug}${lecture?.session?.session_id}`}
                                  disabled={
                                    lecture?.session?.attendances?.manual ||
                                    lecture?.session?.attendances?.is_present
                                  }
                                  onClick={(e) =>
                                    handleManualMarking(
                                      e.target,
                                      lecture?.slug,
                                      lecture?.session?.session_id,
                                    )
                                  }
                                >
                                  Manual Marking Request
                                </Button>
                              </>
                            )}
                          </CardFooter>
                        </Card>
                      </div>
                    </div>
                  ))}
                {lectureDetails?.length === 0 && (
                  <div className="flex min-h-[70vh] items-center justify-center rounded-lg p-6">
                    <div className="max-w-md text-center">
                      {/* Simple Illustration */}
                      <div className="relative left-[50%] mb-8 h-40 w-40 -translate-x-1/2 transform sm:h-80 sm:w-80">
                        <img
                          src={NoDataIllustration}
                          alt="No lectures today"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Simple Text */}
                      <div className="space-y-3">
                        <h2 className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-xl font-semibold text-transparent md:text-3xl">
                          No Lectures Today!
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                          Enjoy your free time and make the most of your day!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  )
}

export default StudentDashboard
