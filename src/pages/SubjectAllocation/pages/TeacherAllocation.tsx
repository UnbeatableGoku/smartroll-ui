import StaticsCard from '../components/StaticsCard'
import SubjectTable from '../components/SubjectTable'
import TeacherSubjectTable from '../components/TeacherSubjectTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import useSubjectToTeacherAllocation from '@hooks/useSubjectToTeacherAllocation'

import { Button } from '@components/ui/button'

const TeacherAllocation = () => {
  const {
    activeTab,
    setActiveTab,
    handleOnChangeManageHoursForSubjectToTeacher,
    subjectAllocation,
    selectedSubject,
    setSelectedSubject,
    teacherAllocation,
    setSelectedTeacher,
    selectedTeacher,
    handleOnClickToDeleteAllocation,
    getTeacherList,
    teacherList,
    addTeacherToSubject,
    handleOnResetState,
    handleOnSubmitAllocation,
  } = useSubjectToTeacherAllocation()
  return (
    <div className="mx-auto bg-white px-4 pb-20 pt-4">
      <h1 className="mb-4 text-center text-2xl font-bold text-black">
        Load Allocation System
      </h1>
      <StaticsCard SubjectToTeacherAllocation={subjectAllocation}></StaticsCard>
      <div className="my-4 flex flex-col space-y-2">
        <Button
          className="w-full bg-red-500 text-white hover:bg-red-600"
          onClick={(e) => {
            e.preventDefault()
            handleOnResetState()
          }}
        >
          Reset
        </Button>
        <Button
          className="w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
          onClick={(e) => {
            e.preventDefault()
            handleOnSubmitAllocation()
          }}
        >
          Confirm Allocation
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex h-auto flex-col bg-[#F7F7F7] lg:flex-row">
          <TabsTrigger
            value="subject-to-teacher"
            className="w-full data-[state=active]:bg-[#0261BE] data-[state=active]:text-white"
          >
            Subject to Teacher Allocation
          </TabsTrigger>
          <TabsTrigger
            value="teacher-to-subject"
            className="w-full data-[state=active]:bg-[#0261BE] data-[state=active]:text-white"
          >
            Teacher to Subject Allocation
          </TabsTrigger>
        </TabsList>
        <TabsContent value="subject-to-teacher">
          <SubjectTable
            SubjectToTeacherAllocation={subjectAllocation}
            handleOnChangeManageHoursForSubjectToTeacher={
              handleOnChangeManageHoursForSubjectToTeacher
            }
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            handleOnClickToDeleteAllocation={handleOnClickToDeleteAllocation}
            teacherAllocation={teacherAllocation}
            getTeacherList={getTeacherList}
            teacherList={teacherList}
            addTeacherToSubject={addTeacherToSubject}
          ></SubjectTable>
        </TabsContent>
        <TabsContent value="teacher-to-subject">
          <TeacherSubjectTable
            TeacherToSubjectAllocation={teacherAllocation}
            setSelectedTeacher={setSelectedTeacher}
            selectedTeacher={selectedTeacher}
            handleOnChangeManageHoursForSubjectToTeacher={
              handleOnChangeManageHoursForSubjectToTeacher
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TeacherAllocation
