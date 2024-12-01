import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Minus } from 'lucide-react'

const StudentListForDivision = ({
  divisionsData,
  setActiveTab,
  activeTab,
  studentBatchList
}: any) => {
  const renderTable = (data: any) => {
    return (
      <Table>
        {/* Table Header */}

        <TableHeader className="sticky top-0 bg-black">
          <TableRow>
            <TableHead className="w-auto">Student Name</TableHead>
            <TableHead className="w-auto">Enrollment</TableHead>

            {/* Dynamically create batch headers */}
            {data?.total_batches.map((batch: string) => (
              <TableHead className="w-auto" key={batch}>
                {batch}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body */}

        <TableBody className="h-80 overflow-y-scroll">
          {data?.students?.map((student: any) => {
              return (
                <TableRow key={student.slug}>
                  <TableCell className="font-medium">
                    {student.profile.name}
                  </TableCell>
                  <TableCell>{student.enrollment}</TableCell>

                  {/* Loop over total_batches to check each batch */}
                  {data.total_batches.map((batchName: string) => {
                    // Check if the current batch name matches the batch_name in the student data
                    if (student.batches.includes(batchName)) {
                      return (
                        <TableCell key={batchName}>
                          <Check className="text-green-700" />{' '}
                          {/* Render Check icon if the student is in this batch */}
                        </TableCell>
                      )
                    } else {
                      return (
                        <TableCell key={batchName}>
                          <Minus />{' '}
                          {/* Render Minus icon if the student is not in this batch */}
                        </TableCell>
                      )
                    }
                  })}
                </TableRow>
              )
            
          })}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="">
      <div className="mx-auto p-2 lg:p-4">
        <Tabs
          value={activeTab}
          onValueChange={(value: any) => {
            setActiveTab(value)
          }}
        >
          <TabsList className={`flex flex-row`}>
            {divisionsData?.divisions.map((division: any) => {
              return (
                <TabsTrigger
                  value={division.division_name}
                  key={division.division_name}
                  className='w-full'
                >
                  {division.division_name}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {studentBatchList?.map((division: any) => {
            return (
              <TabsContent
                value={`${division.division}`}
                className="mt-4 overflow-hidden"
                key={division.division}
              >
                {studentBatchList ? (
                  <div className="flex flex-col justify-between border border-b p-2 text-xl font-bold lg:flex-row">
                    <p>Division - {division.division}</p>
                    <p>Total Studentes - {division.students.length} </p>
                  </div>
                ) : null}
                <div className="h-[500px]">
                  {divisionsData && renderTable(division)}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

export default StudentListForDivision
