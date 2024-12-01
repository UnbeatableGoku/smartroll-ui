import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check, Minus } from 'lucide-react'

import { divisionData } from './mockData'

const StudentDivision = () => {
  const renderTable = () => {
    return (
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="w-[200px]">Student Name</TableHead>
            <TableHead className="w-[150px]">Enrollment</TableHead>
            {divisionData.total_batches.map((batch: string) => (
              <TableHead key={batch} className="w-[100px] text-center">
                {batch}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {divisionData.batches.flatMap((batch) =>
            batch.students.map((student, studentIndex) => (
              <TableRow key={`${batch.batch_name}-${studentIndex}`}>
                <TableCell className="font-medium">
                  {student.profile.name}
                </TableCell>
                <TableCell>{student.enrollment}</TableCell>
                {divisionData.total_batches.map((batchName) => (
                  <TableCell key={batchName} className="text-center">
                    {batchName === batch.batch_name ? (
                      <Check className="mx-auto text-green-700" />
                    ) : (
                      <Minus className="mx-auto text-gray-400" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="container mx-auto py-2">
      <h1 className="mb-6 text-center text-4xl font-bold">
        <span className="font-extrabold text-neutral-300 underline">
          {divisionData.division_name} Division
        </span>{' '}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <span>Total Students</span>
            <span>{divisionData.total_student_count}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] overflow-auto">
          {renderTable()}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDivision
