import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
          <Table>
            <TableHeader>
              {manualAttendance?.length > 0 && (
                <TableRow className="border-border">
                  <TableHead>Student Name</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {manualAttendance?.map((student: any) => (
                <TableRow key={student?.slug}>
                  <TableCell>{student?.student?.profile?.name}</TableCell>
                  <TableCell>{student?.regulization_comment}</TableCell>
                  <TableCell className="capitalize text-black">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => {
                        removeStudentAttendanceRequest(
                          student?.student?.enrollment,
                        )
                      }}
                    />
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
