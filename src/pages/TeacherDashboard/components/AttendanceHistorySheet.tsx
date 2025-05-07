import { useTeacherDashbord } from '../hooks/useTeacherDashbord'
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
import { FileDown } from 'lucide-react'

import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'

const AttendanceHistorySheet = ({
  isHistorySheetOpen,
  handelHistorySheetOpen,
  students,
  sessionId,
}: {
  isHistorySheetOpen: boolean
  handelHistorySheetOpen: () => void
  students: any[]
  sessionId: string | null
}) => {
  const { handleOnClickForDownloadExcelForAttendance } = useTeacherDashbord()
  return (
    <Sheet open={isHistorySheetOpen} onOpenChange={handelHistorySheetOpen}>
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
          <Button
            variant="outline"
            className="w-full rounded-[4px] border-none bg-[#0261BE] p-[20px] text-white hover:bg-blue-700"
            onClick={() => {
              handleOnClickForDownloadExcelForAttendance(sessionId as string)
            }}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export Attendance
          </Button>
          {/* Attendance Table */}
          <div className="rounded-[6px] bg-[#F7F7F7] shadow-soft">
            <div className="flex items-center justify-between p-3 md:p-4">
              <h3 className="text-md font-semibold text-black sm:text-lg">
                Attendance
              </h3>
              <p className="text-sm text-black">Students: {students?.length}</p>
            </div>
            <div className="mx-2 h-[1px] max-w-full bg-gray-300"></div>

            <div className="flex h-[75vh] w-full flex-col gap-y-3 overflow-y-auto p-4">
              <div className="overflow-x-auto">
                {students.length > 0 ? (
                  <Table className="text-black">
                    <TableHeader>
                      {students?.length > 0 && (
                        <TableRow className="md:text-md border-border text-[12px]">
                          <TableHead>Student Name</TableHead>
                          <TableHead className="text-center"> P/A</TableHead>
                          <TableHead className="text-center">Prob(%)</TableHead>
                          <TableHead className="text-center">
                            Distance
                          </TableHead>
                          <TableHead className="text-center">NCC</TableHead>
                          <TableHead className="text-center">
                            Magnitude
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
                            <span className="flex items-center gap-2 text-[10px] text-green-500 md:text-[12px]">
                              <Checkbox
                                checked={student.is_present}
                                disabled={true}
                                className="border border-black"
                              />
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {`${Number(Math.floor(student?.similarity))} %` ||
                              '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {student?.euclidean_distance?.toFixed(3) || '-'}
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
                ) : (
                  <div className="flex items-center justify-center pt-3 text-black">
                    No Students Present
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AttendanceHistorySheet
