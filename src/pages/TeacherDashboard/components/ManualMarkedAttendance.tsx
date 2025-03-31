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
    <div className="w-full pt-4">
      <div className="rounded-md border">
        {manualAttendance.length > 0 ? (
          <Table>
            <TableHeader>
              {manualAttendance?.length > 0 && (
                <TableRow className="border-border">
                  <TableHead>Enrollment Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Branch </TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {manualAttendance?.map((student: any) => (
                <TableRow
                  key={student?.slug}
                  className="border-border text-foreground"
                >
                  <TableCell className="font-medium">
                    {student?.student?.enrollment}
                  </TableCell>
                  <TableCell>{student?.student?.profile?.name}</TableCell>
                  <TableCell>
                    {student?.batches.map((b: any) => b.division.full_name)}
                  </TableCell>
                  <TableCell>{student?.regulization_comment}</TableCell>
                  <TableCell className="capitalize text-white">
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
          <div className="flex items-center justify-center p-3 text-white">
            No Students Present
          </div>
        )}
      </div>
    </div>
  )
}
