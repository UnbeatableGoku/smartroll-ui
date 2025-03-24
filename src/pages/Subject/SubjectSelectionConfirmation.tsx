import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronRight, Trash, X } from 'lucide-react'
import { Helmet } from 'react-helmet'

import Selection from '@components/common/form/selectiom/Selection'
import useStream from '@components/common/uploadTimeTable/useStream'
import { Skeleton } from '@components/ui/skeleton'

import useSubjectSelectionConfirmation from './hooks/useSubjectSelectionConfirmation'
import TeacherToSubjectMapPanel from './components/TeacherToSubjectMapPanel'

interface tableHeader {
  title: string
}

const teachers_table_header: tableHeader[] = [
  { title: 'Teacher Name' },
  { title: 'Priorty' },
  { title: 'Action' },
]

const student_table_header: tableHeader[] = [
  { title: 'Enrollment No.' },
  { title: 'Student Name' },
  { title: 'Email' },
  { title: 'Action' },
]

type PersonType = 'teacher' | 'student'

const SubjectSelectionConfirmation = () => {
  const { stream, handleStream } = useStream()
  const {
    selectedStream,
    handleValueChangeOfStream,
    selectedSemester,
    handleValueChangeOfSemesterForTeacher,
    semesters,
    selectedSubject,
    subjects,
    handleValueChangeOfSubjectForStudent,
    handleValueChangeOfSubjectForTeacher,
    teachers,
    setSelectedSemester,
    setSelectedSubject,
    setSubjects,
    complementrySbujects,
    selectedSubjectCategory,
    handleValueChangeOfCategory,
    handleValueChangeOfSemesterForStudent,
    students,
    setTeachers,
    setStudents,
    setSelectedSubjectCategory,
    getSubjectName,
    handleOnClickForDeleteSubjectOfStudent,
    setOpenPanelForTeacherToSubjectMap,
    openPanelForTeacherToSubjectMap,
    teacherToSubjectMapData,
    handleOnClickForLoadTeacherToSubjectMap,
    handleOnDeleteTeacherSubjectChoice,
    handleOnClickForDownloadExcelForTeacherToSubjectMap,
    downloadTeachetToSubjectMapRef,
    handleOnClickForDownloadExcelForSubjectToTeacherMap,
    handleOnClickForLoadStudentToSubjectMap
  } = useSubjectSelectionConfirmation()

  useEffect(() => {
    handleStream() // Fetching stream data when component mounts
  }, [])

  const [selectedPerson, setSelectedPerson] = useState<any>(null)

  const [activeTab, setActiveTab] = useState<PersonType>('teacher')
  const renderTable = (data: Array<{}>, type: PersonType) => (
    <Table className='border'>
      <TableHeader>
        <TableRow>
          {type === 'teacher'
            ? teachers_table_header.map((header, index) => {
                return (
                  <TableHead className="w-auto" key={index}>
                    {header.title}
                  </TableHead>
                )
              })
            : student_table_header.map((header, index) => {
                return (
                  <TableHead className="w-auto text-center" key={index}>
                    {header.title}
                  </TableHead>
                )
              })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {type === 'teacher' &&
          data.map((teacher: any, index) => (
            <>
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {teacher.profile.name}
                </TableCell>
                <TableCell>{teacher.priority}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSelectedPerson(
                        selectedPerson?.slug === teacher.slug ? null : teacher,
                      )
                    }
                    aria-expanded={selectedPerson?.slug === teacher.slug}
                    aria-controls={`subjects-${teacher.slug}`}
                  >
                    {selectedPerson?.slug === teacher.slug ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {selectedPerson?.slug === teacher.slug ? 'Hide' : 'Show'}{' '}
                      subjects
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
              {selectedPerson?.slug === teacher.slug && (
                <TableRow id={`subjects-${teacher.slug}`}>
                  <TableCell colSpan={4} className="p-0">
                    <div className="p-4 dark:bg-black">
                      <h3 className="mb-2 font-semibold">
                        Remaining Subject Choice Of {teacher.profile.name}
                      </h3>
                      <ScrollArea className="h-[150px]">
                        <ul className="space-y-2">
                          {teacher.finalized_choises.map(
                            (subject: any, index: any) => (
                              <li
                                key={index}
                                className="rounded border bg-background p-2"
                              >
                                {subject.subject_name} - {subject.subject_code}
                              </li>
                            ),
                          )}
                        </ul>
                      </ScrollArea>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}

        {/* student data display  */}
        {type === 'student' &&
          data.map((student: any) => (
            <>
              <TableRow key={student?.slug}>
                <TableCell className="text-center font-medium">
                  {student.profile.enrollment}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {student.profile.profile.name}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {student.profile.profile.email}
                </TableCell>

                <TableCell className="flex justify-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSelectedPerson(
                        selectedPerson?.slug === student.slug ? null : student,
                      )
                    }
                    aria-expanded={selectedPerson?.slug === student.id}
                    aria-controls={`subjects-${student.slug}`}
                  >
                    {selectedPerson?.slug === student.slug ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {selectedPerson?.slug === student.dlug ? 'Hide' : 'Show'}{' '}
                      subjects
                    </span>
                  </Button>
                  {student.choices_locked && <Button
                    size="icon"
                    className="px-1 py-1"
                    variant="destructive"
                    onClick={() => {
                      handleOnClickForDeleteSubjectOfStudent(
                        selectedSubject,
                        student.slug,
                      )
                    }}
                  >
                    <Trash></Trash>
                  </Button>}
                </TableCell>
              </TableRow>
              {selectedPerson?.slug === student.slug && (
                <TableRow id={`subjects-${student.slug}`}>
                  <TableCell colSpan={4} className="p-0">
                    <div className="p-4 dark:bg-black">
                      <h3 className="mb-2 font-semibold">
                        Remaining Subject Selected By{' '}
                        {student.profile.profile.name}
                      </h3>
                      <ScrollArea className="h-[250px]">
                        <ul className="space-y-2">
                          {student.finalized_choises.map(
                            (subject: any, index: any) => (
                              <li
                                key={index}
                                className="flex justify-between rounded border bg-background p-2"
                              >
                                {subject.subject_name} - {subject.subject_code}
                                {/* <Button size="icon" className='px-1 py-1' variant="destructive"
                                  onClick={()=>{handleOnClickForDeleteSubjectOfStudent(subject.slug,student.slug)}}
                                >
                                  <Minus></Minus>
                                </Button> */}
                              </li>
                            ),
                          )}
                        </ul>
                      </ScrollArea>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
      </TableBody>
    </Table>
  )

  return (
    <>
      <Helmet>
        <title>Smart Roll | Subject Confirmation</title>
      </Helmet>
      <div className="flex w-full flex-col space-y-4">
        <div className="container mx-auto p-2 lg:p-4">
          <Tabs
            value={activeTab}
            onValueChange={(value: any) => {
              setActiveTab(value as PersonType)
              setSelectedSemester('')
              setSelectedSubject('')
              setSubjects([])
              setTeachers([])
              setStudents([])
              setSelectedSubjectCategory('')
            }}
          >
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="teacher">Teachers</TabsTrigger>
              <TabsTrigger value="student">Students</TabsTrigger>
            </TabsList>
            {activeTab == 'teacher'  && <div className='flex flex-col  justify-center gap-y-4 lg:gap-x-3 my-4 w-full'>
                  <Button className='w-full'
                    onClick={()=>{handleOnClickForLoadTeacherToSubjectMap()}}
                  >Teacher to subject map</Button> 
                  <Button 
                   onClick={()=>{handleOnClickForDownloadExcelForSubjectToTeacherMap()}}
                  className='w-full'>Subject to teacher map</Button>
                </div>}
                {activeTab == 'student' && selectedSemester  && <div className='flex flex-col lg:flex-row justify-center gap-y-4 lg:gap-x-3 my-4 w-full'>
                  <Button className='w-full'
                    onClick={()=>{handleOnClickForLoadStudentToSubjectMap(selectedSemester)}}
                  >Student to Subject Map</Button> 
                  
                </div>}
            <div className="mt-5 flex w-full flex-col items-center justify-center space-y-4 md:w-auto md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
              {/* Stream Selection Card */}
              {stream && (
                <>
                  <div className="relative w-full md:w-[240px] lg:w-[320px]">
                    <Selection
                      title="Stream"
                      selectedValue={selectedStream}
                      selectedValue2=" "
                      onValueChange={handleValueChangeOfStream}
                      placeholder="Select Stream"
                      data={stream}
                      optionTitle={null}
                    />

                    {/* Connecting Lines */}
                    <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
                    <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
                  </div>
                </>
              )}
              <div className="relative w-full md:w-[240px] lg:w-[320px]">
                <Selection
                  title="Semester"
                  selectedValue={selectedSemester}
                  selectedValue2={selectedStream}
                  onValueChange={
                    activeTab == 'teacher'
                      ? handleValueChangeOfSemesterForTeacher
                      : handleValueChangeOfSemesterForStudent
                  }
                  placeholder="Select Semester"
                  data={semesters}
                  optionTitle={'Semester'}
                />
                {/* Connecting Lines */}
                <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
                <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
              </div>

              {activeTab === 'student' && (
                <div className="relative w-full md:w-[240px] lg:w-[320px]">
                  <Selection
                    title="Subject Category"
                    selectedValue={selectedSubjectCategory}
                    selectedValue2={selectedSemester}
                    onValueChange={handleValueChangeOfCategory}
                    placeholder="Select category"
                    data={complementrySbujects}
                    optionTitle={null}
                  />

                  {/* Connecting Lines */}
                  <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
                  <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
                </div>
              )}

              {/* Subject Selection Card */}
              <div className="relative w-full md:w-[240px] lg:w-[320px]">
                <Selection
                  title="Subject"
                  selectedValue={selectedSubject}
                  selectedValue2={
                    activeTab === 'student'
                      ? selectedSubjectCategory
                      : selectedSemester
                  }
                  onValueChange={
                    activeTab === 'teacher'
                      ? handleValueChangeOfSubjectForTeacher
                      : handleValueChangeOfSubjectForStudent
                  }
                  placeholder="Select Subject"
                  data={subjects}
                  optionTitle={null}
                />
              </div>
            </div>
            <TabsContent
              value="teacher"
              className="mt-4 overflow-hidden rounded-lg"
            >
              {teachers.length > 0 ? (
                <div className="flex flex-col justify-between border border-b p-2 text-xl font-bold lg:flex-row">
                  <p>Subject - {getSubjectName(selectedSubject)}</p>
                  <p>Total Teachers - {teachers.length} </p>
                </div>
              ) : null}
              {teachers.length > 0 && renderTable(teachers, 'teacher')}
              {teachers.length == 0 && (
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="student"
              className="mt-4 overflow-hidden rounded-lg border"
            >
              {students.length > 0 ? (
                <div className="flex flex-col justify-between border border-b p-2 text-xl font-bold lg:flex-row">
                  <p>Subject - {getSubjectName(selectedSubject)}</p>
                  <p>Total Students - {students.length} </p>
                </div>
              ) : null}
              {students.length > 0 && renderTable(students, 'student')}
              {students.length == 0 && (
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                  <Skeleton className="sm:h-18 h-20 w-full" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {teacherToSubjectMapData.length > 0 && <TeacherToSubjectMapPanel openPanelForTeacherToSubjectMap={openPanelForTeacherToSubjectMap} setOpenPanelForTeacherToSubjectMap={setOpenPanelForTeacherToSubjectMap} teacherToSubjectMapData={teacherToSubjectMapData} handleOnDeleteTeacherSubjectChoice={handleOnDeleteTeacherSubjectChoice} handleOnClickForDownloadExcelForTeacherToSubjectMap={handleOnClickForDownloadExcelForTeacherToSubjectMap} downloadTeachetToSubjectMapRef={downloadTeachetToSubjectMapRef}></TeacherToSubjectMapPanel>}
    </>
  )
}

export default SubjectSelectionConfirmation
