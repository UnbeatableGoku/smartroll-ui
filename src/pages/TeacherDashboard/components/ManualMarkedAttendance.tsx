import { useEffect, useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useStudentDashboard from '@pages/StudentDashboard/hooks/useStudentDashboard'
import { useTeacherDashbord } from '@pages/TeacherDashboard/hooks/useTeacherDashbord'
import { Ban } from 'lucide-react'

// Sample data - in a real app, this would come from an API or props
const initialData = [
  { id: 1, enrollment: 'A12345', name: 'John Doe', course: 'Computer Science' },
  { id: 2, enrollment: 'B67890', name: 'Jane Smith', course: 'Data Science' },
  {
    id: 3,
    enrollment: 'C13579',
    name: 'Robert Johnson',
    course: 'Cybersecurity',
  },
  {
    id: 4,
    enrollment: 'D24680',
    name: 'Emily Williams',
    course: 'Web Development',
  },
  {
    id: 5,
    enrollment: 'E35791',
    name: 'Michael Brown',
    course: 'Artificial Intelligence',
  },
]

export const ManualMarkedAttendance = ({
  manualAttendance,
  removeStudentAttendanceRequest,
}: {
  manualAttendance: any
  removeStudentAttendanceRequest: any
}) => {
  const [selectedRows, setSelectedRows] = useState<typeof initialData>([])
  const [selectAll, setSelectAll] = useState(true)
  // Initialize with all rows selected
  useEffect(() => {
    setSelectedRows([...initialData])
  }, [])

  // Update selectAll state when individual selections change
  useEffect(() => {
    if (selectedRows.length === initialData.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectedRows])

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
                      onCheckedChange={(checked) => {
                        console.log('object')
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

{
  /* <TableHead className="flex items-center gap-2">
                <span>Select All Students</span>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                /> */
}

//
