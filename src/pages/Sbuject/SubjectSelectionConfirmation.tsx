import Selection from '@components/common/form/selectiom/Selection'
import useStream from '@components/common/uploadTimeTable/useStream'
import { useEffect, useState } from 'react'
import useSubjectSelectionConfirmation from './hooks/useSubjectSelectionConfirmation'
import { ChevronRight, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



interface tableHeader{
  title: string
}



const teachers_table_header: tableHeader[] = [
  {title : 'Teacher Name'},
  {title : 'Priorty'},
  {title : 'Action'},
]

const student_table_header: tableHeader[] = [
  {title : 'Enrollment No.'},
  {title : 'Student Name'},
  {title : 'Email'},
  {title : 'Action'},
]


type PersonType = 'teacher' | 'student'

const SubjectSelectionConfirmation = () => {
  const { stream, handleStream } = useStream()
  const { selectedStream, handleValueChangeOfStream, selectedSemester, handleValueChangeOfSemesterForTeacher, semesters, selectedSubject, subjects,handleValueChangeOfSubjectForStudent,handleValueChangeOfSubjectForTeacher,teachers,setSelectedSemester,setSelectedSubject,setSubjects,complementrySbujects,selectedSubjectCategory,handleValueChangeOfCategory,handleValueChangeOfSemesterForStudent,students,setTeachers,setStudents,setSelectedSubjectCategory} = useSubjectSelectionConfirmation()

  useEffect(() => {

    handleStream() // Fetching stream data when component mounts

  }, [])


  const [selectedPerson, setSelectedPerson] = useState<any>(null)
  
  const [activeTab, setActiveTab] = useState<PersonType>('teacher')


  


  const renderTable = (data: Array<{}>, type: PersonType) => (
    <Table>
      <TableHeader>
        <TableRow>
          {
            type === 'teacher' ? teachers_table_header.map((header,index)=>{
              return (<TableHead className="w-auto" key={index}>{header.title}</TableHead>)
            }) :  student_table_header.map((header,index)=>{
              return (<TableHead className="w-auto" key={index}>{header.title}</TableHead>)
            })
          }
        </TableRow>
      </TableHeader>
      <TableBody>
        { type === 'teacher' && data.map((teacher:any,index) => (
          <>
            <TableRow key={index}>
              <TableCell className="font-medium">{teacher.profile.name}</TableCell>
              <TableCell>{teacher.priority}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPerson(selectedPerson?.slug === teacher.slug ? null : teacher)}
                  aria-expanded={selectedPerson?.slug === teacher.slug}
                  aria-controls={`subjects-${teacher.slug}`}
                >
                  {selectedPerson?.slug === teacher.slug ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {selectedPerson?.slug === teacher.slug ? 'Hide' : 'Show'} subjects
                  </span>
                </Button>
              </TableCell>
            </TableRow>
            {selectedPerson?.slug === teacher.slug && (
              <TableRow id={`subjects-${teacher.slug}`}>
                <TableCell colSpan={4} className="p-0">
                  <div className="dark:bg-black p-4">
                    <h3 className="font-semibold mb-2">
                      Remaining Subject Choice Of {teacher.profile.name}
                    </h3>
                    <ScrollArea className="h-[150px]">
                      <ul className="space-y-2">
                        {teacher.finalized_choises.map((subject:any, index:any) => (
                          <li key={index} className="bg-background border p-2 rounded">{subject.subject_name} - {subject.subject_code}</li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}

        {/* student data display  */}
        { type === 'student' && data.map((student:any) => (
          <>
            <TableRow key={student?.slug}>
              <TableCell className="font-medium">{student.profile.enrollment}</TableCell>
              <TableCell className="font-medium">{student.profile.profile.name}</TableCell>
              <TableCell className="font-medium">{student.profile.profile.email}</TableCell>
             
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPerson(selectedPerson?.slug === student.slug ? null : student)}
                  aria-expanded={selectedPerson?.slug === student.id}
                  aria-controls={`subjects-${student.slug}`}
                >
                  {selectedPerson?.slug === student.slug ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {selectedPerson?.slug === student.dlug ? 'Hide' : 'Show'} subjects
                  </span>
                </Button>
              </TableCell>
            </TableRow>
            {selectedPerson?.slug === student.slug && (
              <TableRow id={`subjects-${student.slug}`}>
                <TableCell colSpan={4} className="p-0">
                  <div className="dark:bg-black p-4">
                    <h3 className="font-semibold mb-2">
                      Remaining Subject Selected By {student.profile.profile.name}
                    </h3>
                    <ScrollArea className="h-[150px]">
                      <ul className="space-y-2">
                        {student.finalized_choises.map((subject:any, index:any) => (
                          <li key={index} className="bg-background p-2 rounded border">{subject.subject_name} - {subject.subject_code}</li>
                        ))}
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
    <div className="flex w-full flex-col space-y-4">

      <div className="container mx-auto lg:p-4 p-2">
        <Tabs value={activeTab} onValueChange={(value) => {setActiveTab(value as PersonType);setSelectedSemester("");setSelectedSubject("");setSubjects([]);setTeachers([]);setStudents([]);setSelectedSubjectCategory("")}}>
          <TabsList className="grid w-auto grid-cols-2" >
            <TabsTrigger value="teacher">Teachers</TabsTrigger>
            <TabsTrigger value="student">Students</TabsTrigger>
          </TabsList>
          <div className="flex w-full flex-col items-center justify-center space-y-4 md:w-auto md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12 mt-5">
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
                onValueChange={ activeTab == 'teacher' ? handleValueChangeOfSemesterForTeacher : handleValueChangeOfSemesterForStudent}
                placeholder="Select Semester"
                data={semesters}
                optionTitle={'Semester'}
              />
              {/* Connecting Lines */}
              <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
              <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />

            </div>

            {
              activeTab === 'student' && 
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
            }

            {/* Subject Selection Card */}
            <div className="relative w-full md:w-[240px] lg:w-[320px]">


              <Selection
                title="Subject"
                selectedValue={selectedSubject}
                selectedValue2={activeTab === 'student' ? selectedSubjectCategory : selectedSemester}
                onValueChange={activeTab === 'teacher' ? handleValueChangeOfSubjectForTeacher : handleValueChangeOfSubjectForStudent}
                placeholder="Select Subject"
                data={subjects}
                optionTitle={null}
              />
            </div>
          </div>
          <TabsContent value="teacher" className="border rounded-lg overflow-hidden mt-4">
            { teachers.length > 0 && renderTable(teachers, 'teacher')}
          </TabsContent>
          <TabsContent value="student" className="border rounded-lg overflow-hidden mt-4">
            {students.length > 0  && renderTable(students, 'student')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SubjectSelectionConfirmation