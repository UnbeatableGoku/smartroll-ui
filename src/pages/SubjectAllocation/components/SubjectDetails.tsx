import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  AllocationTypeDetails,
  SubjectAllocation,
  TeacherAllocationItem,
} from '@/types/common'
import { Trash } from 'lucide-react'

import { NoSelectionFound } from '@components/404'
import { ScrollArea } from '@components/ui/scroll-area'

interface props {
  allocation: SubjectAllocation
  handleOnChangeManageHoursForSubjectToTeacher: any
  handleOnClickToDeleteAllocation: any
}
const SubjectDetails = ({
  allocation,
  handleOnChangeManageHoursForSubjectToTeacher,
  handleOnClickToDeleteAllocation,
}: props) => {
  const [activeTab, setActiveTab] = useState('theory')

  const renderTeacherTable = (data: AllocationTypeDetails) => (
    <Table className="dark:text-black">
      <TableHeader>
        <TableRow>
          <TableHead>Teacher Name</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.teachers.map((teacher: TeacherAllocationItem) => (
          <TableRow key={teacher.teacher.slug} className="text-black">
            <TableCell>
              {teacher.teacher.profile.name}({teacher.teacher.teacher_code})
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={teacher.hours}
                onChange={(e) =>
                  handleOnChangeManageHoursForSubjectToTeacher(
                    teacher.hours,
                    Number(e.target.value),
                    allocation.subject.slug,
                    teacher.teacher.slug,
                    allocation.subject.subject_map.is_practical
                      ? 'practical'
                      : 'theory',
                    activeTab,
                    true,
                  )
                }
                min={0}
                step={activeTab === 'lab' ? 2 : 1}
                className="w-20"
                aria-label={`${teacher.hours} for ${teacher.teacher.profile.name}`}
              />
            </TableCell>
            <TableCell>
              <Button
                variant={'destructive'}
                size={'icon'}
                onClick={(e: any) => {
                  e.preventDefault()
                  handleOnClickToDeleteAllocation(
                    allocation.subject.slug,
                    teacher.teacher.slug,
                    allocation.subject.subject_map.is_practical
                      ? 'practical'
                      : 'theory',
                    activeTab,
                  )
                }}
              >
                <Trash></Trash>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="mt-10 w-full bg-white pb-10"
    >
      <TabsList className="flex">
        {Object.entries(allocation.teacher_allocation).map(([key]) => (
          <TabsTrigger
            value={key}
            className="!mr-1 w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
          >
            {key}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="theory" className="text-white active:bg-white">
        <ScrollArea className="h-[100dvh]">
          {allocation.teacher_allocation.theory.teachers.length > 0 ? (
            renderTeacherTable(allocation.teacher_allocation.theory)
          ) : (
            <NoSelectionFound
              title="No Allocation Data Found"
              description="Select a subject or teacher to view allocation details"
            />
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="lab" className="text-white">
        <ScrollArea className="h-[100dvh]">
          {allocation.teacher_allocation.lab.teachers.length > 0 ? (
            renderTeacherTable(allocation.teacher_allocation.lab)
          ) : (
            <NoSelectionFound
              title="No Allocation Data Found"
              description="Select a subject or teacher to view allocation details"
            />
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="practical" className="text-white">
        <ScrollArea className="h-[100dvh]">
          {allocation.teacher_allocation.practical.teachers.length > 0 ? (
            renderTeacherTable(allocation.teacher_allocation.practical)
          ) : (
            <NoSelectionFound
              title="No Allocation Data Found"
              description="Select a subject or teacher to view allocation details"
            />
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="tutorial" className="text-white">
        <ScrollArea className="h-[100dvh]">
          {allocation.teacher_allocation.tutorial.teachers.length > 0 ? (
            renderTeacherTable(allocation.teacher_allocation.tutorial)
          ) : (
            <NoSelectionFound
              title="No Allocation Data Found"
              description="Select a subject or teacher to view allocation details"
            />
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}

export default SubjectDetails
