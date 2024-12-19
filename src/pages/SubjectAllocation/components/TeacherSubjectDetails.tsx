import  { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


  



const TeacherSubjectDetails = ({selectedTeacher,}:any) => {
    const [activeTab, setActiveTab] = useState('theory')
    const renderTeacherTable = (data:any) => (
        <Table className='dark:text-white'>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Stream Code</TableHead>
              <TableHead>Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(data).map(([subjectSlug,value]:any) => (
              <TableRow key={subjectSlug}>
                <TableCell>{value.subject.subject_name}</TableCell>
                <TableCell>{value.subject.stream_code}</TableCell>
                <TableCell>
                {value.hours}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )

      
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full my-10">
      <TabsList className="w-full flex">
        <TabsTrigger value="theory" className='w-full'>Theory</TabsTrigger>
        <TabsTrigger value="lab" className='w-full'>Lab</TabsTrigger>
        <TabsTrigger value="practical" className='w-full'>Practical</TabsTrigger>
        <TabsTrigger value="tutorial" className='w-full'>Tutorial</TabsTrigger>
      </TabsList>
      <TabsContent value="theory" className='text-white'>
        <h3 className="text-lg font-semibold mb-2">Theory Teachers</h3>
        {renderTeacherTable(selectedTeacher.theory)}
      </TabsContent>
      <TabsContent value="lab" className='text-white'>
        <h3 className="text-lg font-semibold mb-2">Lab Teachers</h3>
        {renderTeacherTable(selectedTeacher.lab)}
      </TabsContent>
      <TabsContent value="practical" className='text-white'>
        <h3 className="text-lg font-semibold mb-2">Practical Teachers</h3>
        {renderTeacherTable(selectedTeacher.practical)}
      </TabsContent>
      <TabsContent value="tutorial" className='text-white'>
        <h3 className="text-lg font-semibold mb-2">Tutorial Teachers</h3>
        {renderTeacherTable(selectedTeacher.tutorial)}
        
      </TabsContent>
      
    </Tabs>
  )
}

export default TeacherSubjectDetails