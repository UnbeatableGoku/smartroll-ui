import { useEffect } from 'react'

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

import useStudentDivision from '@hooks/useStudentDivision'

import { Badge } from '@components/ui/badge'

const StudentDivision = () => {
  const { handleStudentDivision, studentDivision, profile } =
    useStudentDivision()

  useEffect(() => {
    handleStudentDivision()
  }, [])

  const renderTable = () => {
    return (
      <Table className="overflow-hidden rounded-[6px] border-none bg-[#F7F7F7] shadow-soft">
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow className="border-b border-gray-200">
            <TableHead className="w-[200px] text-black">Student Name</TableHead>
            <TableHead className="w-[150px] text-black">Enrollment</TableHead>

            {studentDivision?.divisionDetails?.total_batches?.map(
              (batch: string) => (
                <TableHead
                  key={batch}
                  className="w-[100px] text-center text-black"
                >
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
              className={`border-b border-gray-200 bg-white hover:bg-gray-50 ${profile?.obj.enrollment == student.enrollment ? 'bg-[#0261BE]/10' : ''}`}
            >
              <TableCell className="text-wrap font-normal text-black">
                {student.profile.name}
              </TableCell>
              <TableCell className="text-black">{student.enrollment}</TableCell>
              {studentDivision?.divisionDetails?.total_batches?.map(
                (batchName: any) => (
                  <TableCell key={batchName} className="text-center">
                    {student.batches.includes(batchName) ? (
                      <Check
                        className={`mx-auto ${profile?.obj.enrollment == student.enrollment ? 'text-[#0261BE]' : 'text-green-600'}`}
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
          <Card className="mb-8 border-none bg-[#F7F7F7] shadow-soft">
            <CardHeader className="text-center">
              <p className="text-2xl text-black">
                You've been allocated to{' '}
                <Badge
                  variant={'secondary'}
                  className="bg-[#0261BE] text-lg font-semibold text-white hover:bg-[#0261BE]"
                >
                  Division -{' '}
                  {studentDivision.divisionDetails.division_name || 'Unnamed'}
                </Badge>
              </p>
            </CardHeader>
          </Card>
          <Card className="border-none bg-[#F7F7F7] shadow-soft">
            <CardHeader className="p-3 lg:p-6">
              <h1 className="flex flex-col justify-between gap-5 p-3 font-bold lg:flex-row lg:items-center lg:p-0">
                <div className="flex items-center justify-center gap-2">
                  <Users className="text-[#0261BE]" />
                  <span className="text-lg font-bold text-black lg:text-2xl">
                    Students in Your Division
                  </span>
                </div>
                <Badge
                  variant={'secondary'}
                  className="bg-[#0261BE] text-right text-sm font-semibold text-white hover:bg-[#0261BE] lg:text-xl"
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
          <Card className="border-none bg-[#F7F7F7] shadow-soft">
            <CardContent className="pt-6 text-center text-black">
              No Divisions has been allocated yet. Please Stay Tuned!
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default StudentDivision
