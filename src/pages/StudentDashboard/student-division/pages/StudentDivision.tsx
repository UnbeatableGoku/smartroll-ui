import { useEffect } from 'react'

import useStudentDivision from '../hooks/useStudentDivision'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check, Minus, Users } from 'lucide-react'

import { Badge } from '@components/ui/badge'

const StudentDivision = () => {
  const { handleStudentDivision, studentDivision, profile } =
    useStudentDivision()

  useEffect(() => {
    handleStudentDivision()
  }, [])

  const renderTable = () => {
    return (
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="w-[200px]">Student Name</TableHead>
            <TableHead className="w-[150px]">Enrollment</TableHead>

            {studentDivision?.divisionDetails?.total_batches?.map(
              (batch: string) => (
                <TableHead key={batch} className="w-[100px] text-center">
                  {batch}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentDivision?.studentDetails?.map((student: any) => (
            <TableRow
              key={`${student.slug}`}
              className={`${profile?.obj.enrollment == student.enrollment ? 'border-t border-white dark:bg-[#000e29]' : ''}`}
            >
              <TableCell className="text-wrap font-normal">
                {student.profile.name}
              </TableCell>
              <TableCell>{student.enrollment}</TableCell>
              {studentDivision?.divisionDetails?.total_batches?.map(
                (batchName: any) => (
                  <TableCell key={batchName} className="text-center">
                    {student.batches.includes(batchName) ? (
                      <Check
                        className={`mx-auto ${profile?.obj.enrollment == student.enrollment ? 'text-white' : 'text-green-600'}`}
                      />
                    ) : (
                      <Minus className="mx-auto text-gray-400" />
                    )}
                  </TableCell>
                ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div>
      {studentDivision ? (
        <div className="container mx-auto py-2">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <p className="text-2xl text-muted-foreground">
                You've been allocated to{' '}
                <Badge
                  variant={'destructive'}
                  className="bg-green-700 text-lg font-semibold"
                >
                  Division -{' '}
                  {studentDivision.divisionDetails.division_name || 'Unnamed'}
                </Badge>
              </p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-3 lg:p-6">
              <h1 className="flex flex-col justify-between gap-5 p-3 font-bold lg:flex-row lg:items-center lg:p-0">
                <div className="flex items-center justify-center gap-2">
                  <Users />
                  <span className="text-lg font-bold text-zinc-200 lg:text-2xl">
                    Students in Your Division
                  </span>
                </div>
                <Badge
                  variant={'secondary'}
                  className="text-right text-sm font-semibold text-white lg:text-xl"
                >
                  Total Students: {studentDivision?.studentDetails?.length || 0}
                </Badge>
              </h1>
            </CardHeader>
            <CardContent className="h-fit overflow-auto">
              {renderTable()}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="col-span-full">
          <Card>
            <CardContent className="pt-6 text-center">
              No Divisions has been allocated yet. Please Stay Tuned!
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default StudentDivision
