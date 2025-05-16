import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Eye } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'

import TeacherList from './TeacherList'

const SubjectAllocationDetails = ({ Allocationdata }: any) => {
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null)

  return (
    <>
      <Table className="overflow-hidden rounded-[6px] border-none bg-[#F7F7F7] shadow-soft">
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-white">
            <TableHead className="font-bold text-black">Subject Name</TableHead>
            <TableHead className="text-center font-semibold text-black">
              Theory
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Practical
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Tutorial
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Total hours
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Other Faculties
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Allocationdata.length > 0
            ? Allocationdata.map((data: any) => {
                return (
                  <TableRow
                    key={data.subject.slug}
                    className="border-b border-gray-200 bg-white hover:bg-gray-50"
                  >
                    <TableCell className="font-semibold text-black">
                      {data.subject.subject_name}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-black">
                      {data.theory}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-black">
                      {data.practical}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-black">
                      {data.tutorial}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-black">
                      {data.theory + data.practical + data.tutorial}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={'outline'}
                        size={'icon'}
                        className="border-[#0261BE] bg-white text-[#0261BE] hover:bg-[#0261BE] hover:text-white"
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedSubject(data)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            : null}
        </TableBody>
      </Table>
      <Sheet
        open={!!selectedSubject}
        onOpenChange={() => {
          setSelectedSubject(null)
        }}
      >
        <SheetContent className="w-full bg-white pb-10 sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="mt-2 text-black">
              {selectedSubject?.subject.subject_name}
            </SheetTitle>
          </SheetHeader>
          {selectedSubject && (
            <>
              <TeacherList selectedSubject={selectedSubject}></TeacherList>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default SubjectAllocationDetails
