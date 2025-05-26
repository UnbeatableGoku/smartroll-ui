import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { PlusCircle } from 'lucide-react'

import {
  SeparateAllocation,
  SubjectAllocation,
  SubjectToTeacherMap,
  TeacherToSubjectMap,
} from 'types/common'

import { Button } from '@components/ui/button'

import SubjectDetails from './SubjectDetails'

type ClassType = 'Theory' | 'Lab' | 'Practical' | 'Tutorial'
const classTypes: ClassType[] = ['Theory', 'Lab', 'Practical', 'Tutorial']

interface props {
  SubjectToTeacherAllocation: SubjectToTeacherMap | null
  handleOnChangeManageHoursForSubjectToTeacher: any
  selectedSubject: any
  setSelectedSubject: any
  handleOnClickToDeleteAllocation: any
  teacherAllocation: TeacherToSubjectMap[] | null
  getTeacherList: any
  teacherList: any
  addTeacherToSubject: any
}
const SubjectTable = ({
  SubjectToTeacherAllocation,
  handleOnChangeManageHoursForSubjectToTeacher,
  setSelectedSubject,
  selectedSubject,
  handleOnClickToDeleteAllocation,
  getTeacherList,
  teacherList,
  addTeacherToSubject,
}: props) => {
  const [saveSatateButon, setSaveStateButton] = useState(false)
  const [teacher, setTeacher] = useState<string>('')
  const [hours, setHours] = useState<number>(0)
  const [category, setCategory] = useState<ClassType | ''>('')
  console.log(SubjectToTeacherAllocation)

  return (
    <>
      <Table className="border-collapse border border-zinc-500 bg-black">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="border border-zinc-500">
              Subject Name
            </TableHead>
            <TableHead
              colSpan={5}
              className="border border-zinc-500 text-center"
            >
              Before Allocation
            </TableHead>
            <TableHead
              colSpan={5}
              className="border border-zinc-500 text-center"
            >
              After Allocation
            </TableHead>
            <TableHead
              rowSpan={2}
              className="border border-zinc-500 text-center"
            >
              Remaining Hours
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="border border-zinc-500 text-center">
              Theory
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Lab
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Practical
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Tutorial
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Total
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Theory
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Lab
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Practical
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Tutorial
            </TableHead>
            <TableHead className="border border-zinc-500 text-center">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SubjectToTeacherAllocation?.instant_allocations.map(
            (allocation: SubjectAllocation, index: number) => (
              <TableRow
                key={index}
                onClick={() => setSelectedSubject(allocation)}
                className="cursor-pointer hover:bg-zinc-600/45"
              >
                <TableCell className="border border-zinc-500 font-semibold">
                  {allocation?.subject?.subject_map?.subject_name}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation.theory?.total_hours}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation.lab?.total_hours}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation.practical?.total_hours}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation.tutorial?.total_hours}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation.theory?.total_hours +
                    allocation?.teacher_allocation.lab?.total_hours +
                    allocation?.teacher_allocation.practical?.total_hours +
                    allocation?.teacher_allocation.tutorial?.total_hours}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation.teacher_allocation.theory?.allocation_done}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation.teacher_allocation.lab?.allocation_done}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation.teacher_allocation.practical?.allocation_done}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation.teacher_allocation.tutorial?.allocation_done}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation.theory?.allocation_done +
                    allocation.teacher_allocation.lab?.allocation_done +
                    allocation.teacher_allocation.tutorial?.allocation_done +
                    allocation.teacher_allocation.practical.allocation_done}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation.teacher_allocation.tutorial.remaining_hours +
                    allocation?.teacher_allocation.theory.remaining_hours +
                    allocation.teacher_allocation.lab.remaining_hours +
                    allocation.teacher_allocation.practical.remaining_hours}
                </TableCell>
              </TableRow>
            ),
          )}
          {SubjectToTeacherAllocation?.separate_allocations.map(
            (allocation: SeparateAllocation, index: number) => (
              <TableRow
                key={index}
                onClick={() => setSelectedSubject(allocation)}
                className="cursor-pointer hover:bg-zinc-600/45"
              >
                <TableCell className="border border-zinc-500 font-semibold">
                  {allocation?.subject?.subject_map?.subject_name}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  0
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  0
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation?.practical?.total_hours}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  0
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation?.practical?.total_hours}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  0
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  0
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation?.practical?.allocation_done}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  0
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation?.practical?.allocation_done}
                </TableCell>
                <TableCell className="border border-zinc-500 text-center font-semibold">
                  {allocation?.teacher_allocation?.practical?.remaining_hours}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>

      <Sheet
        open={!!selectedSubject}
        onOpenChange={() => {
          setSelectedSubject(null)
          setSaveStateButton(false)
        }}
      >
        <SheetContent className="w-full pb-10 sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{selectedSubject?.subject.subject_name}</SheetTitle>
          </SheetHeader>
          {selectedSubject && (
            <>
              {!saveSatateButon && (
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    setSaveStateButton(!saveSatateButon)
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Teacher
                </Button>
              )}
              {saveSatateButon && (
                <Button
                  className="my-4 w-full"
                  variant={'destructive'}
                  onClick={() => {
                    setSaveStateButton(!saveSatateButon)
                  }}
                >
                  Go-Back
                </Button>
              )}
              {!saveSatateButon && (
                <SubjectDetails
                  key={selectedSubject.id} // Add this line to ensure re-render on subject change
                  allocation={selectedSubject}
                  handleOnChangeManageHoursForSubjectToTeacher={
                    handleOnChangeManageHoursForSubjectToTeacher
                  }
                  handleOnClickToDeleteAllocation={
                    handleOnClickToDeleteAllocation
                  }
                />
              )}

              <div className="flex w-full flex-col space-y-9">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        colSpan={4}
                        className="border border-zinc-500 text-center"
                      >
                        Remaining Allocation
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="border border-zinc-500 text-center">
                        Theory
                      </TableHead>
                      <TableHead className="border border-zinc-500 text-center">
                        Lab
                      </TableHead>
                      <TableHead className="border border-zinc-500 text-center">
                        Practical
                      </TableHead>
                      <TableHead className="border border-zinc-500 text-center">
                        Tutorial
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="border border-zinc-500 text-center text-white">
                        {selectedSubject?.teacher_allocation.theory
                          ?.total_hours -
                          selectedSubject.teacher_allocation.theory
                            ?.allocation_done}{' '}
                      </TableCell>
                      <TableCell className="border border-zinc-500 text-center text-white">
                        {selectedSubject?.teacher_allocation.lab?.total_hours -
                          selectedSubject.teacher_allocation.lab
                            ?.allocation_done}{' '}
                      </TableCell>
                      <TableCell className="border border-zinc-500 text-center text-white">
                        {selectedSubject?.teacher_allocation.practical
                          ?.total_hours -
                          selectedSubject.teacher_allocation.practical
                            ?.allocation_done}{' '}
                      </TableCell>
                      <TableCell className="border border-zinc-500 text-center text-white">
                        {selectedSubject?.teacher_allocation.tutorial
                          ?.total_hours -
                          selectedSubject.teacher_allocation.tutorial
                            ?.allocation_done}{' '}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex flex-col space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="class-type" className="text-white">
                      Class Type
                    </Label>
                    <Select
                      value={category}
                      onValueChange={(value) => {
                        setCategory(value as ClassType)
                        getTeacherList(value)
                      }}
                    >
                      <SelectTrigger id="class-type" className="text-white">
                        <SelectValue placeholder="Select class type" />
                      </SelectTrigger>
                      <SelectContent>
                        {classTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher" className="text-white">
                      Teacher
                    </Label>
                    <Select
                      value={teacher}
                      onValueChange={(value) => setTeacher(value)}
                    >
                      <SelectTrigger id="teacher" className="text-white">
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teacherList &&
                          teacherList.map(([key, value]: any) => (
                            <SelectItem key={key} value={value.teacher.slug}>
                              {value.teacher.profile.name} | Remaining Hours :{' '}
                              {value.total_hours_left}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours" className="text-white">
                      Hours
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      min={0}
                      value={hours}
                      step={
                        category == 'Lab' || category == 'Practical' ? 2 : 1
                      }
                      onChange={(e) => setHours(parseInt(e.target.value) || 1)}
                      className="text-white"
                    />
                  </div>

                  <Button
                    onClick={(e: any) => {
                      e.preventDefault()
                      addTeacherToSubject(
                        teacher,
                        selectedSubject?.subject.slug,
                        hours,
                        selectedSubject?.subject.is_practical
                          ? 'practical'
                          : 'theory',
                        category,
                      )
                      setHours(0)
                      setCategory('')
                      setTeacher('')
                    }}
                    className="w-full"
                  >
                    Save Allocation
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default SubjectTable
