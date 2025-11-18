import { useState } from 'react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TeacherToSubjectMap } from 'types/common'

import TeacherSubjectDetails from './TeacherSubjectDetails'

interface props {
  TeacherToSubjectAllocation: TeacherToSubjectMap[] | null
  setSelectedTeacher: any
  selectedTeacher: any
  handleOnChangeManageHoursForSubjectToTeacher: any
}
const TeacherSubjectTable = ({
  TeacherToSubjectAllocation,
  setSelectedTeacher,
  selectedTeacher,
  handleOnChangeManageHoursForSubjectToTeacher,
}: props) => {
  const [selectedTeacherSlug, setSelectedTeacherSlug] = useState<any>(null)
  return (
    <>
      <Table className="shadow-soft">
        <TableHeader className="bg-[#F7F7F7]">
          <TableRow>
            <TableHead className="text-center font-semibold text-black">
              Teacher Name
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Theory
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Lab
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Practical
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Tutorial
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Allocated Hours
            </TableHead>
            <TableHead className="text-center font-semibold text-black">
              Remaining Hours
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TeacherToSubjectAllocation &&
            Object.entries(TeacherToSubjectAllocation[0]).map(
              ([slug, value]) => (
                <TableRow
                  key={slug}
                  onClick={() => {
                    setSelectedTeacher(value)
                    setSelectedTeacherSlug(slug)
                  }}
                  className="cursor-pointer hover:bg-[#F7F7F7]"
                >
                  <TableCell className="text-black">
                    {value.teacher.profile.name}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {value.theory
                      ? Object.values(value.theory).reduce(
                          (sum, item) => sum + (item.hours || 0),
                          0,
                        )
                      : 0}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {value.lab
                      ? Object.values(value.lab).reduce(
                          (sum, item) => sum + (item.hours || 0),
                          0,
                        )
                      : 0}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {value.practical
                      ? Object.values(value.practical).reduce(
                          (sum, item) => sum + (item.hours || 0),
                          0,
                        )
                      : 0}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {value.tutorial
                      ? Object.values(value.tutorial).reduce(
                          (sum, item) => sum + (item.hours || 0),
                          0,
                        )
                      : 0}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {value.initial_lab_hours +
                      value.initial_practical_sub_hours +
                      value.initial_theory_hour -
                      value.total_hours_left}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {value.total_hours_left}
                  </TableCell>
                </TableRow>
              ),
            )}
        </TableBody>
      </Table>

      <Sheet
        open={!!selectedTeacher}
        onOpenChange={() => setSelectedTeacher(null)}
      >
        <SheetContent className="w-full bg-white pb-10 sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="text-black">
              {selectedTeacher?.teacher.profile.name}
            </SheetTitle>
          </SheetHeader>
          {selectedTeacher && (
            <>
              <TeacherSubjectDetails
                selectedTeacher={selectedTeacher}
                selectedTeacherSlug={selectedTeacherSlug}
                handleOnChangeManageHoursForSubjectToTeacher={
                  handleOnChangeManageHoursForSubjectToTeacher
                }
                key={selectedTeacherSlug} // Add this line to ensure re-render on subject change
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default TeacherSubjectTable
