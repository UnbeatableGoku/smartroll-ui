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

      <div className="my-4 flex space-x-3">
        <Button
          variant={'submit-outline'}
          className="w-full"
          onClick={(e) => {
            e.preventDefault()
            handleOnSubmitAllocation()
          }}
        >
          Confirm Allocation
        </Button>
        <Button
          variant={'cancle-outline'}
          className="w-full"
          onClick={(e) => {
            e.preventDefault()
            handleOnResetState()
          }}
        >
          Reset
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {subjectAllocation && (
          <TabsList className="ml-[1px] flex h-auto flex-row !justify-start !p-0">
            <TabsTrigger
              value="subject-to-teacher"
              className="!mr-1 w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
            >
              Subjects
            </TabsTrigger>
            <TabsTrigger
              value="teacher-to-subject"
              className="w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
            >
              Teachers
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="subject-to-teacher" className="!mt-0">
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
        <TabsContent value="teacher-to-subject" className="!mt-0">
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
