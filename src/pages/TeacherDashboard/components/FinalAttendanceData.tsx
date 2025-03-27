import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BadgeCheck, Ban } from 'lucide-react'

export const FinalAttendanceData = ({
  finalAttendanceData,
}: {
  finalAttendanceData: any
}) => {
  return (
    <Table>
      <TableHeader>
        {finalAttendanceData?.length > 0 && (
          <TableRow className="md:text-md border-border text-[12px]">
            <TableHead>Enrollment Number</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Branch </TableHead>
            <TableHead>Attendance Status</TableHead>
          </TableRow>
        )}
      </TableHeader>
      <TableBody>
        {finalAttendanceData?.map((student: any) => (
          <TableRow
            key={student?.slug}
            className="border-border text-[12px] text-foreground"
          >
            <TableCell className="font-medium">
              {student?.student?.enrollment}
            </TableCell>
            <TableCell>{student?.student?.profile?.name}</TableCell>
            <TableCell>
              {student?.batches.map((b: any) => b.division.full_name)}
            </TableCell>
            <TableCell className="capitalize text-white">
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
