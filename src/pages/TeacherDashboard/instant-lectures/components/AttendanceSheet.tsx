import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { RootState } from '@data/Store'
import { ManualMarkedAttendance } from '@pages/TeacherDashboard/components/ManualMarkedAttendance'
import { MdGroups2 } from 'react-icons/md'
import { useSelector } from 'react-redux'

import { SheetLoader } from '@components/common/loader/Loader'
import { Checkbox } from '@components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'

const AttendanceSheet = ({
  isSheetOpen,
  handleSheet,
  students,
  manualAttendance,
  updateStudentAttendance,
  removeStudentAttendanceRequest,
  handleOnSessionEnd,
  markManualStudentsAttendance,
  endSessionhandlerAPI,
  isSlowNetwork,
  markRegulizattionRequestEntryAPI,
  updateStudentAttendaceAPI,
}: props) => {
  const sheetLoader = useSelector(
    (state: RootState) => state.loader.SHEET_LOADER_STATE,
  )
  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheet}>
      <SheetContent
        side="bottom"
        className="h-[100dvh] overflow-y-auto border-border bg-[#F7F7F7] sm:max-w-full"
      >
        <SheetHeader className="mb-6 flex flex-row items-center justify-between">
          <SheetTitle className="text-sm text-black md:text-2xl">
            Attendance Details (Active Students : {students?.length})
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
                  {students.length ? (
                    <div className="overflow-x-auto">
                      <Table className="text-black">
                        <TableHeader>
                          <TableRow className="md:text-md border-border text-[12px]">
                            <TableHead>Student Name</TableHead>
                            <TableHead className="text-center"> P/A</TableHead>
                            {/* <TableHead className="text-center">
                                    Prob(%)
                                  </TableHead> */}
                            <TableHead className="text-center">
                              Distance
                            </TableHead>
                            <TableHead className="text-center">NCC</TableHead>
                            <TableHead className="text-center">
                              Magnitude
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students?.map((student: any) => (
                            <TableRow key={student?.slug}>
                              <TableCell>
                                {student?.student?.profile?.name}
                              </TableCell>

                              <TableCell className="text-center">
                                <Checkbox
                                  checked={true}
                                  onCheckedChange={() =>
                                    !isSlowNetwork
                                      ? updateStudentAttendance(
                                          student.slug,
                                          false,
                                        )
                                      : updateStudentAttendaceAPI(student.slug)
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
                        As students mark their attendance, they will appear here
                        in real-time.
                      </span>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="manual" className="space-y-4">
                  {manualAttendance.length > 0 && (
                    <Button
                      className="w-full rounded-[4px] bg-[#0261BE] text-white hover:bg-[#0261BE]/60"
                      onClick={() =>
                        !isSlowNetwork
                          ? markManualStudentsAttendance()
                          : markRegulizattionRequestEntryAPI()
                      }
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
              onClick={() =>
                !isSlowNetwork ? handleOnSessionEnd() : endSessionhandlerAPI()
              }
            >
              End Session
            </Button>
          </div>
        </div>
        {sheetLoader && <SheetLoader></SheetLoader>}
      </SheetContent>
    </Sheet>
  )
}

interface props {
  isSheetOpen: boolean
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
  students: Array<any>
  manualAttendance: Array<any>
  handleSheet: any
  updateStudentAttendance: any
  removeStudentAttendanceRequest: any
  handleOnSessionEnd: any
  markManualStudentsAttendance: any
  endSessionhandlerAPI: any
  isSlowNetwork: boolean
  markRegulizattionRequestEntryAPI: any
  updateStudentAttendaceAPI: any
}
export default AttendanceSheet
