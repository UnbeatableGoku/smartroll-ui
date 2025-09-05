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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import DialogBox from '@pages/TeacherDashboard/components/DialogBox'
import { ManualMarkedAttendance } from '@pages/TeacherDashboard/components/ManualMarkedAttendance'
import { Calendar, Clock, FileDown, Users } from 'lucide-react'
import { MdGroups2 } from 'react-icons/md'

import { cn } from '@utils'

import { Checkbox } from '@components/ui/checkbox'
import CustomLoader from '@components/ui/custom-loader'

import AttendanceHistorySheet from './components/AttendanceHistorySheet'
import { useTeacherDashbord } from './hooks/useTeacherDashbord'

// No need for unused type imports

const TeacherDashboard = () => {
  const {
    startSessionHandler,
    getLectureDetails,
    lectureDetails,
    sessionData,
    isSheetOpen,
    onGoingSessionData,
    students,
    manualAttendance,
    open,
    classRoomData,
    date,
    classesList,
    removeStudentAttendanceRequest,
    markManualStudentsAttendance,
    handleOnSessionEnd,
    handleClassroom,
    setOpen,
    changeClassRoomAPI,
    handleAttendaceHistoryData,
    handleSheet,
    calendarContainerRef,
    activeDateRef,
    updateStudentAttendance,
    isHistorySheetOpen,
    handleHistorySheetOpen,
    sessionId,
    redStudents,
    showCustomLoader,
    setShowCustomLoader,
    handleEarlySheetOpen,
  } = useTeacherDashbord()

  useEffect(() => {
    getLectureDetails()
  }, [])

  useEffect(() => {
    // Scroll to active date when component mounts
    if (activeDateRef.current) {
      activeDateRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [date])

  return (
    <div className="h-auto">
      {/* Main Content */}
      <main className="flex flex-col gap-6">
        {/* Calendar-style Date Selector */}
        <div
          className="flex overflow-x-auto border-b border-white/20 px-2 pb-4 pt-8 md:justify-center"
          ref={calendarContainerRef}
        >
          {date.map((day: any) => (
            <div
              ref={day.isActive ? activeDateRef : null}
              key={`${day.day_name}-${day.day}`}
              onClick={() => getLectureDetails(day.longDay)}
              className={cn(
                'mx-2 flex min-w-[70px] cursor-pointer flex-col items-center justify-center rounded-[12px] p-3 text-center',
                day.isActive
                  ? 'bg-[#0261BE] text-white'
                  : 'border-r border-white/20 text-black hover:bg-[#0261BE]/80 hover:text-white',
              )}
            >
              <div className="font-medium">{day.shortDay}</div>
              <div className="text-xl font-bold">{day.day}</div>
              <div className="text-xs">{day.month}</div>
            </div>
          ))}
        </div>

        {/* Session List */}
        <div className="flex flex-col gap-8 border-none p-1 md:p-4">
          {lectureDetails.length > 0 ? (
            lectureDetails?.map((l: any) => (
              <div
                key={l?.id || Math.random()}
                className={`w-full gap-6 rounded-[20px] border-none bg-[#FFFFFF] p-[16px] shadow-soft`}
              >
                <div className="text-md flex w-full items-center rounded-sm bg-white/10 p-2 font-medium text-black md:text-[20px]">
                  {l.branch_name}
                </div>
                <div className="grid grid-cols-1 gap-6 px-1 pt-4 md:grid-cols-2 md:px-4 lg:grid-cols-3">
                  {l?.lectures.length > 0 &&
                    l?.lectures?.map((lecture: any, index: number) => (
                      <Card
                        key={lecture?.id || index}
                        className="w-full overflow-hidden border-none bg-[#F7F7F7] shadow-soft"
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-2xl text-[#000000]">
                              <span className="text-[16px] md:text-xl">
                                {lecture?.subject?.subject_map?.subject_name}
                              </span>
                              <Badge
                                variant="secondary"
                                className="flex h-[22px] w-[66px] items-center justify-center rounded-[4px] bg-[#F99704] p-0 px-2 capitalize text-white hover:bg-[#e6a63f]"
                              >
                                {lecture?.type}
                              </Badge>
                            </CardTitle>
                            <SessionStatusBadge
                              status={
                                sessionData[lecture.session.session_id] ===
                                'pre'
                                  ? 'Inactive'
                                  : sessionData[lecture.session.session_id] ===
                                      'ongoing'
                                    ? 'Active'
                                    : sessionData[
                                          lecture.session.session_id
                                        ] === 'post'
                                      ? 'Ended'
                                      : 'Unknown'
                              }
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="px-4">
                          <div className="grid gap-4">
                            <div className="flex items-center gap-2 text-sm text-black">
                              <div className="flex flex-col gap-2">
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
                            </div>
                            <div className="flex items-center gap-2 text-sm text-black md:text-lg">
                              <Clock className="size-5 text-[#00000080]" />
                              {/* <span className="text-sm text-black">Time: </span> */}
                              <span className="font-semibold text-black">
                                {lecture?.start_time} • {lecture?.end_time}
                              </span>
                            </div>
                            <div className="flex w-full flex-col gap-3 text-sm text-black md:text-lg">
                              <div className="flex items-center gap-2">
                                <Users className="size-5 text-[#00000080]" />
                                <div className="flex w-full items-center gap-2">
                                  <div className="flex flex-wrap items-center gap-4">
                                    <form className="flex items-center space-x-2">
                                      <span className="text-black">
                                        Classroom:{' '}
                                      </span>
                                      <input
                                        type="hidden"
                                        value={lecture.slug}
                                        name="lecture_slug"
                                      ></input>
                                      <input
                                        type="hidden"
                                        name="mySelect"
                                        id={`${lecture.slug}${lecture?.session?.classroom_final?.slug}`}
                                        defaultValue={
                                          lecture?.session?.classroom_final
                                            ?.slug
                                        }
                                      />
                                      <div className="flex items-center gap-4">
                                        {' '}
                                        <Select
                                          disabled={
                                            sessionData[
                                              lecture.session.session_id
                                            ] === 'post'
                                              ? true
                                              : false
                                          }
                                          defaultValue={
                                            lecture?.session?.classroom_final
                                              ?.slug
                                          }
                                          onValueChange={(value) => {
                                            handleClassroom(
                                              lecture?.slug,
                                              value,
                                              lecture?.session?.classroom_final
                                                ?.slug,
                                            )
                                          }}
                                        >
                                          <SelectTrigger
                                            className="w-[85px] rounded-[4px] border-none bg-white font-semibold text-black shadow-soft"
                                            id={`select-${lecture.slug}${lecture?.session?.classroom_final?.slug}`}
                                            value={
                                              lecture?.session?.classroom_final
                                                ?.slug
                                            }
                                          >
                                            <SelectValue
                                              placeholder="None"
                                              className="text-black"
                                            />
                                          </SelectTrigger>
                                          <SelectContent className="h-[250px] rounded-[4px] bg-white font-semibold text-black">
                                            {classesList.map((c: any) => (
                                              <SelectItem
                                                key={`${c.slug}-${c.class_name}`}
                                                value={c.slug}
                                              >
                                                {c.class_name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="hidden w-fit gap-1 rounded-md text-[14px] text-red-700"
                                id={`class_message-${lecture?.slug}${lecture?.session?.classroom_final?.slug}`}
                              ></div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter
                          className={`flex gap-2 ${lecture?.status === 'Upcoming' ? '' : 'flex-col'}`}
                        >
                          {sessionData[lecture.session.session_id] !==
                            'post' && (
                            <Button
                              className={cn(
                                `w-full rounded-[4px] border-none p-[20px]`,
                                sessionData[lecture.session.session_id] ===
                                  'ongoing'
                                  ? 'bg-[#0261BE] text-white hover:bg-blue-700'
                                  : 'bg-[#0261BE] text-white hover:bg-blue-700',
                              )}
                              onClick={() => {
                                startSessionHandler(
                                  lecture?.session.session_id,
                                  lecture?.slug,
                                  lecture?.session?.classroom_final?.slug,
                                  lecture?.session?.day,
                                )
                              }}
                              disabled={
                                sessionData[lecture.session.session_id] ===
                                'post'
                                  ? true
                                  : false
                              }
                            >
                              {sessionData[lecture.session.session_id] ===
                                'ongoing' && 'Join Session'}
                              {sessionData[lecture.session.session_id] ===
                                'pre' && 'Start Session'}
                              {sessionData[lecture.session.session_id] ===
                                'post' && 'Session Ended'}
                            </Button>
                          )}
                          {sessionData[lecture.session.session_id] ===
                            'post' && (
                            <Button
                              variant="outline"
                              className="w-full rounded-[4px] border-none bg-[#0261BE] p-[20px] text-white hover:bg-blue-700"
                              onClick={() => {
                                handleAttendaceHistoryData(
                                  lecture.session.session_id,
                                )
                              }}
                            >
                              <FileDown className="mr-2 h-4 w-4" />
                              Attendance History
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                </div>
                {l?.lectures.length === 0 && (
                  <div className="px-1 pt-4 md:px-8">
                    <Card className="w-full overflow-hidden rounded-md border-none bg-[#F7F7F7] text-center shadow-soft">
                      <CardHeader className="p-4 text-sm text-black">
                        No lectures scheduled for today.
                      </CardHeader>
                    </Card>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="absolute left-[50%] top-[50%] w-full -translate-x-1/2 -translate-y-1/3 transform p-4 md:p-8">
              <Card className="w-full border border-blue-100 p-4 shadow-lg">
                <CardContent className="space-y-4 px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-8 w-8 text-blue-600" size={52} />
                  </div>

                  <div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800">
                      No Lecture Today
                    </h2>
                    <p className="text-sm text-gray-600">
                      Enjoy your free time!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {classRoomData && (
            <DialogBox
              open={open}
              setOpen={setOpen}
              classRoomData={classRoomData}
              changeClassRoomAPI={changeClassRoomAPI}
            />
          )}
        </div>
      </main>

      {/* Session Details Sheet */}
      {onGoingSessionData && (
        <Sheet open={isSheetOpen} onOpenChange={handleSheet}>
          <SheetContent
            side="bottom"
            className="h-[100dvh] overflow-y-auto border-border bg-[#F7F7F7] sm:max-w-full"
          >
            <SheetHeader className="mb-6 flex flex-row items-center justify-between">
              <SheetTitle className="text-sm text-black md:text-2xl">
                Attendance Details (Active Students :{' '}
                {students?.length + redStudents?.length})
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4 md:space-y-6">
              {/* Attendance Table */}
              <div className="rounded-[6px] bg-[#F7F7F7] shadow-soft">
                <div className="flex h-[75vh] w-full flex-col gap-y-3 overflow-y-auto p-4">
                  <Tabs defaultValue="Default" className="w-full">
                    <TabsList className="mb-4 flex w-full gap-4 bg-[#F7F7F7]">
                      <TabsTrigger
                        value="Default"
                        className="flex-1 rounded-[6px] bg-white text-black shadow-soft data-[state=active]:bg-[#0261BE] data-[state=active]:text-white"
                      >
                        Default
                      </TabsTrigger>
                      <TabsTrigger
                        value="manual"
                        className="relative flex-1 rounded-[6px] bg-white text-black shadow-soft data-[state=active]:bg-[#0261BE] data-[state=active]:text-white"
                      >
                        <span className="relative">
                          Manual
                          {manualAttendance.length > 0 && (
                            <span className="absolute -right-3 size-2 animate-ping rounded-full bg-red-700"></span>
                          )}
                        </span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="Default">
                      {students.length > 0 || redStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table className="text-black">
                            <TableHeader>
                              <TableRow className="md:text-md border-border text-[12px]">
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-center">
                                  {' '}
                                  P/A
                                </TableHead>
                                {/* <TableHead className="text-center">
                                    Prob(%)
                                  </TableHead> */}
                                <TableHead className="text-center">
                                  Distance
                                </TableHead>
                                <TableHead className="text-center">
                                  NCC
                                </TableHead>
                                <TableHead className="text-center">
                                  Magnitude
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {redStudents?.map((student: any) => (
                                <TableRow
                                  key={student?.slug}
                                  style={{
                                    borderWidth: student.chirp_detected
                                      ? '0px'
                                      : '2px',
                                    borderStyle: 'solid',
                                    borderTopWidth: student.chirp_detected
                                      ? '0px'
                                      : '2px',
                                    borderBottomWidth: student.chirp_detected
                                      ? '0px'
                                      : '2px',
                                    borderColor: student.chirp_detected
                                      ? '#d1d5db' /* border-border */
                                      : '#dc2626' /* red-600 */,
                                    fontSize: '12px',
                                    color: 'black',
                                  }}
                                >
                                  <TableCell>
                                    {student?.student?.profile?.name}
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <Checkbox
                                      checked={student.is_present}
                                      onCheckedChange={() =>
                                        updateStudentAttendance(
                                          student.slug,
                                          false,
                                        )
                                      }
                                      className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:hover:bg-blue-600"
                                    />
                                  </TableCell>
                                  {/* <TableCell className="text-center">
                                    {`${Number(Math.floor(student?.similarity))} %` ||
                                      '-'}
                                  </TableCell> */}
                                  <TableCell className="text-center">
                                    {student?.gps_distance?.toFixed(3) || '-'}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {student?.ncc?.toFixed(2) || '-'}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {student?.magnitude?.toFixed(2) || '-'}
                                  </TableCell>
                                </TableRow>
                              ))}
                              {students?.map((student: any) => (
                                <TableRow key={student?.slug}>
                                  <TableCell>
                                    {student?.student?.profile?.name}
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <Checkbox
                                      checked={student.is_present}
                                      onCheckedChange={() =>
                                        updateStudentAttendance(
                                          student.slug,
                                          false,
                                        )
                                      }
                                      className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:hover:bg-blue-600"
                                    />
                                  </TableCell>
                                  {/* <TableCell className="text-center">
                                    {`${Number(Math.floor(student?.similarity))} %` ||
                                      '-'}
                                  </TableCell> */}
                                  <TableCell className="text-center">
                                    {student?.gps_distance?.toFixed(3) || '-'}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {student?.ncc?.toFixed(2) || '-'}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {student?.magnitude?.toFixed(2) || '-'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex h-[50vh] flex-col items-center justify-center space-y-6 pt-3 text-black">
                          <MdGroups2 size={124} color="#0261BE"></MdGroups2>
                          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-xl font-semibold text-transparent md:text-3xl">
                            No Students Present
                          </span>
                          <span className="leading-relaxed text-gray-600">
                            As students mark their attendance, they will appear
                            here in real-time.
                          </span>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="manual" className="space-y-4">
                      {manualAttendance.length > 0 && (
                        <Button
                          className="w-full rounded-[4px] bg-[#0261BE] text-white hover:bg-[#0261BE]/60"
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
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="flex-1 rounded-[6px] bg-[#be0205] text-white hover:bg-red-500"
                  onClick={() => handleOnSessionEnd()}
                >
                  End Session
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      {sessionId && students.length > 0 && (
        <AttendanceHistorySheet
          isHistorySheetOpen={isHistorySheetOpen}
          handelHistorySheetOpen={handleHistorySheetOpen}
          students={students}
          sessionId={sessionId}
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

function SessionStatusBadge({ status }: { status: string }) {
  let variant: 'default' | 'secondary' | 'outline' = 'outline'
  let classname = 'bg-zinc-800'

  if (status === 'Inactive') {
    variant = 'secondary'
    classname = 'bg-[#FF4C4C]'
  } else if (status === 'Active' || status === 'Ongoing') {
    variant = 'secondary'
    classname = 'bg-[#4CB151]'
  } else {
    classname = 'bg-red-500'
  }

  return (
    <Badge
      variant={variant}
      className={cn(
        classname,
        'flex h-[26px] w-[88px] items-center justify-center rounded-[4px] border-none text-[10px] text-white hover:bg-zinc-800 md:text-[12px]',
      )}
    >
      {status}
    </Badge>
  )
}

export default TeacherDashboard
