import StaticsCard from '../components/StaticsCard'
import SubjectTable from '../components/SubjectTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeacherSubjectTable from '../components/TeacherSubjectTable'
import useSubjectToTeacherAllocation from '../hooks/useSubjectToTeacherAllocation'
import { Button } from '@components/ui/button'
const TeacherAllocation = () => {
    
    const {activeTab,setActiveTab,handleOnChangeManageHoursForSubjectToTeacher,subjectAllocation,selectedSubject,setSelectedSubject,teacherAllocation,setSelectedTeacher,selectedTeacher,handleOnClickToDeleteAllocation,getTeacherList,teacherList,addTeacherToSubject,handleOnResetState,handleOnSubmitAllocation} = useSubjectToTeacherAllocation()
    return (
        <div className="mx-auto px-4 pt-4 pb-20">
            <h1 className="text-2xl font-bold mb-4 text-center">Load Allocation System</h1>
            <StaticsCard SubjectToTeacherAllocation={subjectAllocation}></StaticsCard>
            <div className='flex flex-col space-y-2 my-4 '>
                <Button className='w-full' variant={'destructive'} onClick={(e)=>{e.preventDefault();handleOnResetState()}}>Reset</Button>
                <Button className='w-full' variant={'default'} onClick={(e)=>{e.preventDefault();handleOnSubmitAllocation()}}>Confirm Allocation</Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex flex-col h-auto lg:flex-row">
                    <TabsTrigger value="subject-to-teacher" className='w-full'>Subject to Teacher Allocation</TabsTrigger>
                    <TabsTrigger value="teacher-to-subject" className='w-full'>Teacher to Subject Allocation</TabsTrigger>
                </TabsList>
                <TabsContent value="subject-to-teacher">
                    <SubjectTable SubjectToTeacherAllocation={subjectAllocation} handleOnChangeManageHoursForSubjectToTeacher={handleOnChangeManageHoursForSubjectToTeacher} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} handleOnClickToDeleteAllocation={handleOnClickToDeleteAllocation} teacherAllocation={teacherAllocation} getTeacherList={getTeacherList} teacherList={teacherList} addTeacherToSubject={addTeacherToSubject}></SubjectTable>
                </TabsContent>
                <TabsContent value="teacher-to-subject">
                    <TeacherSubjectTable TeacherToSubjectAllocation={teacherAllocation} setSelectedTeacher={setSelectedTeacher} selectedTeacher={selectedTeacher} handleOnChangeManageHoursForSubjectToTeacher={handleOnChangeManageHoursForSubjectToTeacher}/>
                </TabsContent>
            </Tabs>
            
        </div>
    )
}

export default TeacherAllocation