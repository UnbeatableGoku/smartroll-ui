import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const TeacherSubjectDetails = ({ selectedTeacher }: any) => {
  const [activeTab, setActiveTab] = useState('theory')
  const renderTeacherTable = (data: any) => (
    <Table className="dark:text-white">
      <TableHeader>
        <TableRow>
          <TableHead>Subject Name</TableHead>
          <TableHead>Stream Code</TableHead>
          <TableHead>Hours</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([subjectSlug, value]: any) => (
          <TableRow key={subjectSlug} className="text-black">
            <TableCell>{value.subject.subject_name}</TableCell>
            <TableCell>{value.subject.stream_code}</TableCell>
            <TableCell>{value.hours}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="my-10 w-full"
    >
      <TabsList className="flex w-full">
        <TabsTrigger
          value="theory"
          className="!mr-1 w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
        >
          Theory
        </TabsTrigger>
        <TabsTrigger
          value="lab"
          className="!mr-1 w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
        >
          Lab
        </TabsTrigger>
        <TabsTrigger
          value="practical"
          className="!mr-1 w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
        >
          Practical
        </TabsTrigger>
        <TabsTrigger
          value="tutorial"
          className="!mr-1 w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
        >
          Tutorial
        </TabsTrigger>
      </TabsList>
      <TabsContent value="theory" className="text-white">
        {renderTeacherTable(selectedTeacher.theory)}
      </TabsContent>
      <TabsContent value="lab" className="text-white">
        {renderTeacherTable(selectedTeacher.lab)}
      </TabsContent>
      <TabsContent value="practical" className="text-white">
        {renderTeacherTable(selectedTeacher.practical)}
      </TabsContent>
      <TabsContent value="tutorial" className="text-white">
        {renderTeacherTable(selectedTeacher.tutorial)}
      </TabsContent>
    </Tabs>
  )
}

export default TeacherSubjectDetails
