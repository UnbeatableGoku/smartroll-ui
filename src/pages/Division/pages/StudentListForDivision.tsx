import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check } from 'lucide-react'

import { Button } from '@components/ui/button'

const StudentListForDivision = ({
  divisionsData,
  setActiveTab,
  activeTab,
  studentBatchList,
  handleOnClickForDownloadExcel,
  divisionsAlreadyCreated,
}: any) => {
  const renderTable = (data: any) => {
    return (
      <Table>
        <TableHeader className="sticky top-0 bg-[#F7F7F7]">
          <TableRow>
            <TableHead className="w-auto font-semibold text-black">
              Student Name
            </TableHead>
            <TableHead className="w-auto font-semibold text-black">
              Enrollment
            </TableHead>

            {/* Dynamically create batch headers */}
            {data?.total_batches.map((batch: string) => (
              <TableHead
                className="w-auto font-semibold text-black"
                key={batch}
              >
                {batch}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="h-80 overflow-y-scroll">
          {data?.students?.map((student: any) => {
            return (
              <TableRow key={student.slug} className="hover:bg-[#F7F7F7]">
                <TableCell className="font-medium text-black">
                  {student.profile.name}
                </TableCell>
                <TableCell className="text-black">
                  {student.enrollment}
                </TableCell>

                {/* Loop over total_batches to check each batch */}
                {data.total_batches.map((batchName: string) => {
                  // Check if the current batch name matches the batch_name in the student data
                  if (student.batches.includes(batchName)) {
                    return (
                      <TableCell key={batchName}>
                        <Check className="text-[#0261BE]" />
                      </TableCell>
                    )
                  } else {
                    return <TableCell key={batchName}></TableCell>
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
    <div className="bg-white">
      <div className="mx-auto p-2 lg:p-4">
        <Tabs
          value={activeTab}
          onValueChange={(value: any) => {
            setActiveTab(value)
          }}
        >
          <TabsList className="flex flex-row bg-[#F7F7F7]">
            {divisionsData?.divisions.map((division: any) => {
              return (
                <TabsTrigger
                  value={division.division_name}
                  key={division.division_name}
                  className="w-full data-[state=active]:bg-[#0261BE] data-[state=active]:text-white"
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
                {divisionsAlreadyCreated && (
                  <Button
                    className="my-4 w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
                    onClick={(e) => {
                      e.preventDefault()
                      handleOnClickForDownloadExcel(division.division)
                    }}
                  >
                    Download Divison Excel
                  </Button>
                )}
                {studentBatchList ? (
                  <div className="mb-4 flex justify-between bg-[#F7F7F7] p-4 text-sm shadow-soft lg:text-xl">
                    <p className="font-bold text-black">
                      Division - {division.division}
                    </p>
                    <p className="font-bold text-black">
                      Students - {division.students.length}{' '}
                    </p>
                  </div>
                ) : null}
                <div className="h-[500px] shadow-soft">
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
