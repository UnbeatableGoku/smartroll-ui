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
import { ChevronRight, Download, Trash, X } from 'lucide-react'
import { Helmet } from 'react-helmet'

import useSubjectSelectionConfirmation from '@hooks/useSubjectSelectionConfirmation'

import Selection from '@components/common/form/selectiom/Selection'
import useStream from '@components/common/uploadTimeTable/useStream'
import { Skeleton } from '@components/ui/skeleton'

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
  const {
    selectedStream,
    selectedSemester,
    handleValueChangeOfSemesterForTeacher,
    handleValueChangeOfStream,
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
    handleOnClickForLoadStudentToSubjectMap,
  } = useSubjectSelectionConfirmation()
  const { stream, handleStream } = useStream()

  useEffect(() => {
    handleStream()
  }, [])

  const [selectedPerson, setSelectedPerson] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<PersonType>('teacher')

  const renderTable = (data: Array<{}>, type: PersonType) => (
    <Table className="border bg-white">
      <TableHeader className="bg-[#F7F7F7]">
        <TableRow>
          {type === 'teacher'
            ? teachers_table_header.map((header, index) => (
                <TableHead
                  key={index}
                  className="w-auto border font-semibold text-black"
                >
                  {header.title}
                </TableHead>
              ))
            : student_table_header.map((header, index) => (
                <TableHead
                  key={index}
                  className="w-auto border font-semibold text-black"
                >
                  {header.title}
                </TableHead>
              ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {type === 'teacher' &&
          data.map((teacher: any, index) => (
            <>
              <TableRow key={index} className="hover:bg-[#F7F7F7]">
                <TableCell className="border font-medium text-black">
                  {teacher.profile.name}
                </TableCell>
                <TableCell className="border text-black">
                  {teacher.priority}
                </TableCell>
                <TableCell className="border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#0261BE] hover:bg-[#0261BE]/10"
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
                  <TableCell colSpan={4} className="border p-0">
                    <div className="bg-[#F7F7F7] p-4">
                      <h3 className="mb-2 font-semibold text-black">
                        Remaining Subject Choice Of {teacher.profile.name}
                      </h3>
                      <ScrollArea className="h-[150px]">
                        <ul className="space-y-2">
                          {teacher.finalized_choises.map(
                            (subject: any, index: any) => (
                              <li
                                key={index}
                                className="rounded border bg-white p-2 text-black"
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

        {type === 'student' &&
          data.map((student: any) => (
            <>
              <TableRow key={student?.slug} className="hover:bg-[#F7F7F7]">
                <TableCell className="border font-medium text-black">
                  {student.profile.enrollment}
                </TableCell>
                <TableCell className="border font-medium text-black">
                  {student.profile.profile.name}
                </TableCell>
                <TableCell className="border font-medium text-black">
                  {student.profile.profile.email}
                </TableCell>
                <TableCell className="border">
                  <Button
                    variant="submit-outline"
                    size={'icon'}
                    title="view"
                    className="mr-3"
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
                      {selectedPerson?.slug === student.slug ? 'Hide' : 'Show'}{' '}
                      subjects
                    </span>
                  </Button>
                  {student.choices_locked && (
                    <Button
                      size={'icon'}
                      variant={'cancle-outline'}
                      title="delete"
                      onClick={() => {
                        handleOnClickForDeleteSubjectOfStudent(
                          selectedSubject,
                          student.slug,
                        )
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
              {selectedPerson?.slug === student.slug && (
                <TableRow id={`subjects-${student.slug}`}>
                  <TableCell colSpan={4} className="border p-0">
                    <div className="bg-[#F7F7F7] p-4">
                      <h3 className="mb-2 font-semibold text-black">
                        Remaining Subject Selected By{' '}
                        {student.profile.profile.name}
                      </h3>
                      <ScrollArea className="h-[250px]">
                        <ul className="space-y-2">
                          {student.finalized_choises.map(
                            (subject: any, index: any) => (
                              <li
                                key={index}
                                className="flex justify-between rounded border bg-white p-2 text-black"
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
      </TableBody>
    </Table>
  )

  return (
    <>
      <Helmet>
        <title>Smart Roll | Subject Confirmation</title>
      </Helmet>
      <div className="flex w-full flex-col space-y-4 bg-white pb-20">
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
            className="w-full"
          >
            <TabsList className="ml-[1px] flex h-auto w-full flex-row !justify-start border-b border-border !p-0">
              <TabsTrigger
                value="teacher"
                className="!mr-1 w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
              >
                Teachers
              </TabsTrigger>
              <TabsTrigger
                value="student"
                className="!mr-1 w-auto border border-b-0 data-[state=active]:border-submit data-[state=active]:bg-submit/5 md:w-64"
              >
                Students
              </TabsTrigger>
            </TabsList>
            {activeTab == 'teacher' && (
              <div className="my-4 flex w-full flex-col justify-end gap-y-4 lg:flex-row lg:gap-x-3">
                <Button
                  variant={'submit-outline'}
                  onClick={() => {
                    handleOnClickForLoadTeacherToSubjectMap()
                  }}
                >
                  Teacher to subject map
                </Button>
                <Button
                  onClick={() => {
                    handleOnClickForDownloadExcelForSubjectToTeacherMap()
                  }}
                  variant={'submit-outline'}
                >
                  Subject to teacher map
                </Button>
              </div>
            )}
            {activeTab == 'student' && (
              <div className="my-4 flex w-full flex-col justify-end gap-y-4 lg:flex-row lg:gap-x-3">
                <Button
                  variant={'submit-outline'}
                  disabled={selectedSemester ? false : true}
                  onClick={() => {
                    handleOnClickForLoadStudentToSubjectMap(selectedSemester)
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download sheet</span>
                </Button>
              </div>
            )}
            <div className="mt-5 flex w-full flex-col items-center space-y-4 md:w-auto md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
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
                    <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-[#0261BE]/20 md:block lg:right-[-3rem] lg:w-12" />
                    <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-[#0261BE]/20 md:hidden" />
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
                <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-[#0261BE]/20 md:block lg:right-[-3rem] lg:w-12" />
                <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-[#0261BE]/20 md:hidden" />
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
                  <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-[#0261BE]/20 md:block lg:right-[-3rem] lg:w-12" />
                  <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-[#0261BE]/20 md:hidden" />
                </div>
              )}

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
              className="mt-4 overflow-hidden rounded-lg border border-[#0261BE]/10"
            >
              {teachers.length > 0 ? (
                <div className="flex flex-col justify-between border-b bg-[#F7F7F7] p-2 text-xl font-bold lg:flex-row">
                  <p className="text-black">
                    Subject - {getSubjectName(selectedSubject)}
                  </p>
                  <p className="text-black">
                    Total Teachers - {teachers.length}{' '}
                  </p>
                </div>
              ) : null}
              {teachers.length > 0 && renderTable(teachers, 'teacher')}
              {teachers.length == 0 && (
                <div className="flex flex-col items-center gap-4 p-4">
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="student"
              className="mt-4 overflow-hidden rounded-lg border border-[#0261BE]/10"
            >
              {students.length > 0 ? (
                <div className="flex flex-col justify-between border-b bg-[#F7F7F7] p-2 text-xl font-bold lg:flex-row">
                  <p className="text-black">
                    Subject - {getSubjectName(selectedSubject)}
                  </p>
                  <p className="text-black">
                    Total Students - {students.length}{' '}
                  </p>
                </div>
              ) : null}
              {students.length > 0 && renderTable(students, 'student')}
              {students.length == 0 && (
                <div className="flex flex-col items-center gap-4 p-4">
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                  <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {teacherToSubjectMapData.length > 0 && (
        <TeacherToSubjectMapPanel
          openPanelForTeacherToSubjectMap={openPanelForTeacherToSubjectMap}
          setOpenPanelForTeacherToSubjectMap={
            setOpenPanelForTeacherToSubjectMap
          }
          teacherToSubjectMapData={teacherToSubjectMapData}
          handleOnDeleteTeacherSubjectChoice={
            handleOnDeleteTeacherSubjectChoice
          }
          handleOnClickForDownloadExcelForTeacherToSubjectMap={
            handleOnClickForDownloadExcelForTeacherToSubjectMap
          }
          downloadTeachetToSubjectMapRef={downloadTeachetToSubjectMapRef}
        />
      )}
    </>
  )
}

export default SubjectSelectionConfirmation
