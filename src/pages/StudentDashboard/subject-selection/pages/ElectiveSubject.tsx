import { useEffect, useState } from 'react'

import useElectiveSubject from '../hooks/useElectiveSubject'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AlertTriangle, BookOpen, GraduationCap } from 'lucide-react'

import { Alert, AlertTitle } from '@components/ui/alert'
import { Button } from '@components/ui/button'

import ConfirmPanel from '../component/ConfirmPanel'
import SubjectShowCard from '../component/SubjectShowCard'

// Define TypeScript interfaces for better type safety
interface Subject {
  stream_code: string
  sem_year: number
  subject_code: string
  eff_from: string
  subject_name: string
  short_name?: string
  category: string
  L: number
  P: number
  T: number
  credit: string
  E: number
  M: number
  I: number
  V: number
  total_marks: number
  is_elective: boolean
  is_practical: boolean
  is_theory: boolean
  is_semipractical: boolean
  is_functional: boolean
  practical_exam_duration: string
  theory_exam_duration: string
  remark: string
  academic_year: string
  slug: string
}

interface SubjectGroup {
  slug: string
  subjects: Subject[]
}

const ElectiveSubject = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const togglePanel = () => setIsPanelOpen(!isPanelOpen)

  const {
    electiveSubject,
    subjectChoicesSlug,
    isSubjectSave,
    finalizedChoice,
    selectedSubjects,
    deadline,
    noElectiveSubjectCard,
    handleGetElectiveSubject,
    handleStudentChoice,
    toggleSubjectSelection,
    handleOnClickForUnsaveDraft,
  } = useElectiveSubject()

  useEffect(() => {
    handleGetElectiveSubject()
  }, [])

  return (
    <div className="py-13 bg-gradient-to-b px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-2xl md:text-4xl lg:text-5xl">
            {isSubjectSave && finalizedChoice
              ? 'Your Finalized Elective Subjects'
              : 'Elective Subject Selection'}
          </h1>
          <p className="mt-2 text-xs text-gray-400 sm:text-sm md:text-lg lg:text-xl">
            {isSubjectSave && finalizedChoice
              ? 'These are your selected elective subjects'
              : 'Choose your preferred subjects for each elective category'}
          </p>
          {!isSubjectSave && selectedSubjects.length > 0 && (
            <Button
              onClick={togglePanel}
              className="mt-6 w-full bg-white p-2 shadow-md lg:w-auto"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Save As Draft
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900">
                {selectedSubjects.length}
              </span>
            </Button>
          )}
          {deadline && (
            <Alert className="w-full border-yellow-500 bg-yellow-50 dark:border-red-400 dark:bg-red-900 mt-5">
            <div className="">
              <AlertTitle className="flex items-center space-x-4 text-yellow-800 dark:text-white">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                <span>Decision Deadline : {deadline} </span>
              </AlertTitle>
            </div>
          </Alert>
          )}
          {isSubjectSave && (
            <Button
              className="mt-5 w-full bg-white p-2 shadow-md lg:w-auto"
              onClick={handleOnClickForUnsaveDraft}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Unsave Draft
              
            </Button>
          )}
        </div>

        <div className="group w-full h-96 flex items-center" ref={noElectiveSubjectCard}>
                <Card className='w-full border-white'>
                  <CardHeader className="pb-2"></CardHeader>
                  <CardContent className="text-center font-bold">
                  You'll get your elective subject choices soon ....
                  </CardContent>
                </Card>
              </div>
        <div className="space-y-10">
          {isSubjectSave && finalizedChoice ? (
            <div className="rounded-2xl border border-zinc-600 p-8 backdrop-blur-sm dark:bg-black">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">
                    Selected Electives
                  </h2>
                </div>
                <p className="mt-2 text-gray-400">
                  Your finalized subject selections
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(finalizedChoice) &&
                finalizedChoice.length > 0 ? (
                  finalizedChoice.map((subject: Subject, index: number) => (
                    <SubjectShowCard
                      key={index}
                      subject={subject}
                      toggleSubjectSelection={() => {}}
                      selectedSubjects={finalizedChoice}
                      isSubjectSave={isSubjectSave}
                      draggable={false}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        No Elective Subjects are available.
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          ) : Array.isArray(electiveSubject) && electiveSubject.length > 0 ? (
            electiveSubject.map((group: SubjectGroup) => {
              const category = group?.subjects[0]?.category
              return (
                <div className="rounded-2xl border border-zinc-600 p-8 dark:bg-black">
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold text-white">
                        {category}
                      </h2>
                    </div>
                    <p className="mt-2 text-gray-400">
                      Select one subject from this category
                    </p>
                  </div>

                  <RadioGroup
                    value={group.slug}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                  >
                    {group.subjects.map((subject, index) => {
                      return (
                        <div key={subject.slug} className="relative">
                          <RadioGroupItem
                            id={subject.slug}
                            value={subject.slug}
                            className="hidden"
                          />
                          <Label
                            htmlFor={subject.slug}
                            className="block cursor-pointer"
                          >
                            <SubjectShowCard
                              key={index}
                              subject={subject}
                              toggleSubjectSelection={toggleSubjectSelection}
                              selectedSubjects={selectedSubjects}
                              draggable={false}
                              index={index}
                              group_slug={group.slug}
                              isSubjectSave={isSubjectSave}
                              studentChoice={true}
                            />
                          </Label>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
              )
            })
          ) : (
            selectedSubjects?.length > 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="pt-6 text-center">
                    No Elective Subjects are available are there for this
                    semester.
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </div>
      </div>
      <ConfirmPanel
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        togglePanel={togglePanel}
        selectedSubjects={selectedSubjects}
        handleSubjectSelection={handleStudentChoice}
        subjectChoicesSlug={subjectChoicesSlug}
      />
    </div>
  )
}

export default ElectiveSubject