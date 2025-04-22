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
import { BadgeCheck, Ban, Clock, FileDown, Users } from 'lucide-react'

import { cn } from '@utils'

import { useTeacherDashbord } from './hooks/useTeacherDashbord'

// No need for unused type imports

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
    handleOnSessionEnd,
    handleClassroom,
    open,
    setOpen,
    classRoomData,
    changeClassRoomAPI,
    handleOnClickForDownloadExcelForAttendance,
    date,
    classesList,
    stopStreamFunction,
    setStopStreamFunction,
    setSocket,
  } = useTeacherDashbord()

  useEffect(() => {
    getLectureDetails()
  }, [])

  const handleSheet = async () => {
    setIsSheetOpen(false)
    socket?.disconnect()
    setSocket(null)
    if (stopStreamFunction) {
      await stopStreamFunction()
      setStopStreamFunction(null)
    }
  }

  return (
    <div className="h-auto">
      {/* Main Content */}
      <main className="flex flex-col gap-6 pb-20">
        {/* Calendar-style Date Selector */}
        <div className="flex overflow-x-auto border-b border-white/20 px-2 pb-4 pt-8 md:justify-center">
          {date.map((day: any) => (
            <div
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
        <div className="flex flex-col gap-8 border-none p-1 md:p-2">
          {lectureDetails.length > 0 ? (
            lectureDetails?.map((l: any) => (
              <div
                key={l?.id || Math.random()}
                className="w-full gap-6 rounded-[20px] border-none bg-[#FFFFFF] p-[16px] shadow-soft"
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
                              {/* <span className="text-sm   text-black">Time: </span> */}
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
                                  // sessionData[lecture.session.session_id],
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
                                handleOnClickForDownloadExcelForAttendance(
                                  lecture?.session?.session_id,
                                )
                              }}
                            >
                              <FileDown className="mr-2 h-4 w-4" />
                              Export Attendance
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
            <div className="px-1 pt-4 md:px-8">
              <Card className="w-full overflow-hidden border-border bg-zinc-600/10 text-center">
                <CardHeader className="p-4 text-sm text-black">
                  No lectures scheduled for today.
                </CardHeader>
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
              <SheetTitle className="text-md text-black md:text-2xl">
                Attendance Details
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4 md:space-y-6">
              {/* Attendance Table */}
              <div className="rounded-[6px] bg-[#F7F7F7] shadow-soft">
                <div className="flex items-center justify-between p-3 md:p-4">
                  <h3 className="text-md font-semibold text-black sm:text-lg">
                    Attendance
                  </h3>
                  <p className="text-sm text-black">
                    Students: {students?.length}
                  </p>
                </div>
                <div className="mx-2 h-[1px] max-w-full bg-gray-300"></div>

                <div className="flex h-[75vh] w-full justify-center overflow-y-auto p-4">
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
                      <div className="overflow-x-auto">
                        {students.length > 0 ? (
                          <Table className="text-black">
                            <TableHeader>
                              {students?.length > 0 && (
                                <TableRow className="md:text-md border-border text-[12px]">
                                  <TableHead>Student Name</TableHead>
                                  <TableHead className="text-center">
                                    {' '}
                                    P/A
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Prob(%)
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Distance
                                  </TableHead>
                                </TableRow>
                              )}
                            </TableHeader>
                            <TableBody>
                              {students?.map((student: any) => (
                                <TableRow
                                  key={student?.slug}
                                  className={`'border-border' text-[12px] text-black`}
                                >
                                  <TableCell>
                                    {student?.student?.profile?.name}
                                  </TableCell>

                                  <TableCell className="inline-flex w-full items-center justify-center capitalize text-white">
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
                                  <TableCell className="text-center">
                                    {`${Number(Math.floor(student?.similarity))} %` ||
                                      '-'}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {student?.euclidean_distance?.toFixed(3) ||
                                      '-'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="flex items-center justify-center pt-3 text-black">
                            No Students Present
                          </div>
                        )}
                      </div>
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
