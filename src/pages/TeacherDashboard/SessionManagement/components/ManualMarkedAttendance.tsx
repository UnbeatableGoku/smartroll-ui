import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { X } from 'lucide-react'

import { Button } from '@components/ui/button'

export const ManualMarkedAttendance = ({
  manualAttendance,
  removeStudentAttendanceRequest,
}: {
  manualAttendance: any
  removeStudentAttendanceRequest: any
}) => {
  return (
    <div className="w-full">
      <div>
        {manualAttendance.length > 0 ? (
          <Table className="text-black">
            <TableHeader>
              {manualAttendance?.length > 0 && (
                <TableRow className="text-black hover:bg-white">
                  <TableHead>Student Name</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {manualAttendance?.map((student: any) => (
                <TableRow
                  key={student?.slug}
                  className="text-black shadow-none hover:bg-white"
                >
                  <TableCell>{student?.student?.profile?.name}</TableCell>
                  <TableCell>{student?.regulization_comment}</TableCell>
                  <TableCell className="capitalize text-black">
                    <Button
                      variant={'outline'}
                      className="border border-red-600"
                      onClick={() => {
                        removeStudentAttendanceRequest(
                          student?.student?.enrollment,
                        )
                      }}
                    >
                      <X></X>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-md flex items-center justify-center text-black">
            No Students Present
          </div>
        )}
      </div>
    </div>
  )
}
