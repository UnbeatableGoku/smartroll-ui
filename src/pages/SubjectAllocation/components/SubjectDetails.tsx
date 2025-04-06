import  { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AllocationTypeDetails, SubjectAllocation, TeacherAllocationItem } from 'types/common'
import { ScrollArea } from '@components/ui/scroll-area'




interface props {
  allocation: SubjectAllocation
  handleOnChangeManageHoursForSubjectToTeacher : any
  handleOnClickToDeleteAllocation:any
  
}
const SubjectDetails = ({allocation,handleOnChangeManageHoursForSubjectToTeacher,handleOnClickToDeleteAllocation}:props) => {
    console.log(allocation)
    const [activeTab, setActiveTab] = useState('theory')
    

    
    const renderTeacherTable = (data: AllocationTypeDetails) => (
        <Table className='dark:text-white'>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher Name</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.teachers.map((teacher:TeacherAllocationItem) => (
              <TableRow key={teacher.teacher.slug}>
                <TableCell>{teacher.teacher.profile.name}({teacher.teacher.teacher_code})</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={teacher.hours}
                    onChange={(e) => handleOnChangeManageHoursForSubjectToTeacher(teacher.hours,Number(e.target.value),allocation.subject.slug,teacher.teacher.slug,allocation.subject.subject_map.is_practical ? 'practical': 'theory' , activeTab,true )}
                    min={0}
                    step={activeTab === 'lab' ? 2 : 1} 
                    className="w-20"
                    aria-label={`${teacher.hours} for ${teacher.teacher.profile.name}`}
                  />
                </TableCell>
                <TableCell>
                    <Button variant={'destructive'} size={'icon'}
                      onClick={(e:any)=> {e.preventDefault(); handleOnClickToDeleteAllocation(allocation.subject.slug,teacher.teacher.slug,allocation.subject.subject_map.is_practical ? 'practical': 'theory' , activeTab)}}
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-10 pb-10">
      <TabsList className="flex">
        {
          Object.entries(allocation.teacher_allocation).map(([key])=>(
             <TabsTrigger value={key} className='w-full'>{key}</TabsTrigger>    
          ))
        }
        
      </TabsList>
      <TabsContent value="theory" className='text-white'>
        <h3 className="text-lg font-semibold mb-2">Theory Teachers</h3>
        <ScrollArea className='h-[100dvh]'>
        {
          allocation.teacher_allocation.theory.teachers.length > 0 ? renderTeacherTable(allocation.teacher_allocation.theory) : (<div className='w-full text-center text-lx font-bold'>No selection</div>)
        }
        </ScrollArea>
      </TabsContent>
      <TabsContent value="lab" className='text-white'>
        <h3 className="text-lg font-semibold mb-2">Lab Teachers</h3>
        <ScrollArea className='h-[100dvh]'>
        {
          allocation.teacher_allocation.lab.teachers.length > 0 ? renderTeacherTable(allocation.teacher_allocation.lab) : (<div className='w-full text-center text-lx font-bold'>No selection</div>)
        }
        </ScrollArea>
      </TabsContent>
      <TabsContent value="practical" className='text-white'>
        <h3 className="text-lg font-semibold mb-2">Practical Teachers</h3>
        <ScrollArea className='h-[100dvh]'>
        {
          allocation.teacher_allocation.practical.teachers.length > 0 ? renderTeacherTable(allocation.teacher_allocation.practical) : (<div className='w-full text-center text-lx font-bold'>No selection</div>)
        }
        </ScrollArea>
      </TabsContent>
      <TabsContent value="tutorial" className='text-white'>
        <h3 className="text-lg font-semibold mb-2">Tutorial Teachers</h3>
        <ScrollArea className='h-[100dvh]'>
        {
          allocation.teacher_allocation.tutorial.teachers.length > 0 ? renderTeacherTable(allocation.teacher_allocation.tutorial) : (<div className='w-full text-center text-lx font-bold'>No selection</div>)
        }
        </ScrollArea>
      </TabsContent>
      
      
    </Tabs>
  )
}

export default SubjectDetails