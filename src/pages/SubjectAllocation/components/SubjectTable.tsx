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
import type {
  SeparateAllocation,
  SubjectAllocation,
  SubjectToTeacherMap,
  TeacherToSubjectMap,
} from '@/types/common'
import { PlusCircle } from 'lucide-react'

import { Button } from '@components/ui/button'
import { Skeleton } from '@components/ui/skeleton'

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

  if (SubjectToTeacherAllocation) {
    return (
      <>
        <Table className="bg-white shadow-soft">
          <TableHeader className="bg-[#F7F7F7]">
            <TableRow>
              <TableHead rowSpan={2} className="font-semibold text-black">
                Subject Name
              </TableHead>
              <TableHead
                colSpan={5}
                className="text-center font-semibold text-black"
              >
                Before Allocation
              </TableHead>
              <TableHead
                colSpan={5}
                className="text-center font-semibold text-black"
              >
                After Allocation
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center font-semibold text-black"
              >
                Remaining Hours
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-semibold text-black">
                + Theory
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
                Total
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
                  className="cursor-pointer hover:bg-[#F7F7F7]"
                >
                  <TableCell className="text-black">
                    {allocation?.subject?.subject_map?.subject_name}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation?.teacher_allocation.theory?.total_hours}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation?.teacher_allocation.lab?.total_hours}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation?.teacher_allocation.practical?.total_hours}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation?.teacher_allocation.tutorial?.total_hours}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation?.teacher_allocation.theory?.total_hours +
                      allocation?.teacher_allocation.lab?.total_hours +
                      allocation?.teacher_allocation.practical?.total_hours +
                      allocation?.teacher_allocation.tutorial?.total_hours}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation.teacher_allocation.theory?.allocation_done}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation.teacher_allocation.lab?.allocation_done}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation.teacher_allocation.practical?.allocation_done}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation.teacher_allocation.tutorial?.allocation_done}
                  </TableCell>
                  <TableCell className="text-center text-black">
                    {allocation?.teacher_allocation.theory?.allocation_done +
                      allocation.teacher_allocation.lab?.allocation_done +
                      allocation.teacher_allocation.tutorial?.allocation_done +
                      allocation.teacher_allocation.practical.allocation_done}
                  </TableCell>
                  <TableCell className="text-center text-black">
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
                  className="cursor-pointer hover:bg-[#F7F7F7]"
                >
                  <TableCell className="font-semibold text-black">
                    {allocation?.subject?.subject_map?.subject_name}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    0
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    0
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    {allocation?.teacher_allocation?.practical?.total_hours}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    0
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    {allocation?.teacher_allocation?.practical?.total_hours}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    0
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    0
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    {allocation?.teacher_allocation?.practical?.allocation_done}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    0
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
                    {allocation?.teacher_allocation?.practical?.allocation_done}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-black">
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
          <SheetContent className="w-full bg-white pb-10 sm:max-w-xl">
            <SheetHeader>
              <SheetTitle className="text-black">
                {selectedSubject?.subject.subject_name}
              </SheetTitle>
            </SheetHeader>
            {selectedSubject && (
              <>
                {!saveSatateButon && (
                  <Button
                    className="mt-4 w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
                    onClick={() => {
                      setSaveStateButton(!saveSatateButon)
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Teacher
                  </Button>
                )}
                {saveSatateButon && (
                  <Button
                    className="my-4 w-full bg-red-500 text-white hover:bg-red-600"
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
                    key={selectedSubject.id}
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
                  <Table className="shadow-soft">
                    <TableHeader className="bg-[#F7F7F7]">
                      <TableRow>
                        <TableHead
                          colSpan={4}
                          className="text-center font-semibold text-black"
                        >
                          Remaining Allocation
                        </TableHead>
                      </TableRow>
                      <TableRow>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-center text-black">
                          {selectedSubject?.teacher_allocation.theory
                            ?.total_hours -
                            selectedSubject.teacher_allocation.theory
                              ?.allocation_done}{' '}
                        </TableCell>
                        <TableCell className="text-center text-black">
                          {selectedSubject?.teacher_allocation.lab
                            ?.total_hours -
                            selectedSubject.teacher_allocation.lab
                              ?.allocation_done}{' '}
                        </TableCell>
                        <TableCell className="text-center text-black">
                          {selectedSubject?.teacher_allocation.practical
                            ?.total_hours -
                            selectedSubject.teacher_allocation.practical
                              ?.allocation_done}{' '}
                        </TableCell>
                        <TableCell className="text-center text-black">
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
                      <Label htmlFor="class-type" className="text-black">
                        Class Type
                      </Label>
                      <Select
                        value={category}
                        onValueChange={(value) => {
                          setCategory(value as ClassType)
                          getTeacherList(value)
                        }}
                      >
                        <SelectTrigger id="class-type" className="bg-white">
                          <SelectValue placeholder="Select class type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          {classTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="hover:bg-blue-600/20"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teacher" className="text-black">
                        Teacher
                      </Label>
                      <Select
                        value={teacher}
                        onValueChange={(value) => setTeacher(value)}
                      >
                        <SelectTrigger
                          id="teacher"
                          className="bg-white text-black"
                        >
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
                      <Label htmlFor="hours" className="text-black">
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
                        onChange={(e) =>
                          setHours(parseInt(e.target.value) || 1)
                        }
                        className="bg-white text-black"
                      />
                    </div>

                    <Button
                      onClick={(e: any) => {
                        e.preventDefault()
                        addTeacherToSubject(
                          teacher,
                          selectedSubject?.subject.slug,
                          hours,
                          selectedSubject?.subject?.subject_map?.is_practical
                            ? 'practical'
                            : 'theory',
                          category,
                        )
                        setHours(0)
                        setCategory('')
                        setTeacher('')
                      }}
                      className="w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
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
  } else {
    return (
      <>
        <div className="flex">
          <Skeleton className="mr-1 h-11 w-64" />
          <Skeleton className="mr-1 h-11 w-64" />
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {/* Subject Name Header */}
              <th className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-24" />
              </th>

              {/* Before Allocation Headers */}
              <th colSpan={5} className="px-4 py-3 text-center">
                <Skeleton className="mx-auto h-4 w-32" />
              </th>

              {/* After Allocation Headers */}
              <th colSpan={5} className="px-4 py-3 text-center">
                <Skeleton className="mx-auto h-4 w-32" />
              </th>

              {/* Remaining Hours Header */}
              <th className="px-4 py-3 text-right">
                <Skeleton className="ml-auto h-4 w-24" />
              </th>
            </tr>

            {/* Sub-headers */}
            <tr className="border-b border-border">
              <th className="px-4 py-2" />
              {Array.from({ length: 10 }).map((_, i) => (
                <th key={i} className="px-4 py-2 text-center">
                  <Skeleton className="mx-auto h-3 w-12" />
                </th>
              ))}
              <th className="px-4 py-2" />
            </tr>
          </thead>

          {/* Table Body Skeleton */}
          <tbody>
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-border hover:bg-muted/30"
              >
                {/* Subject Name Cell */}
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-40" />
                </td>

                {/* Data Cells - Before Allocation (5 columns) */}
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <td
                    key={`before-${colIndex}`}
                    className="px-4 py-3 text-center"
                  >
                    <Skeleton className="mx-auto h-4 w-8" />
                  </td>
                ))}

                {/* Data Cells - After Allocation (5 columns) */}
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <td
                    key={`after-${colIndex}`}
                    className="px-4 py-3 text-center"
                  >
                    <Skeleton className="mx-auto h-4 w-8" />
                  </td>
                ))}

                {/* Remaining Hours Cell */}
                <td className="px-4 py-3 text-right">
                  <Skeleton className="ml-auto h-4 w-8" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  }
}

export default SubjectTable
