import { useEffect, useState } from 'react'

import ConfirmPanel from '../component/ConfirmPanel'
import SubjectShowCard from '../component/SubjectShowCard'
import useElectiveSubject from '../hooks/useElectiveSubject'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AlertTriangle, BookOpen, GraduationCap } from 'lucide-react'
import { Helmet } from 'react-helmet'

import { Alert, AlertTitle } from '@components/ui/alert'
import { Button } from '@components/ui/button'

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
    FinalChoiceLock,
    handleGetElectiveSubject,
    handleStudentChoice,
    toggleSubjectSelection,
    handleOnClickForUnsaveDraft,
    noElectiveSubjectCard,
  } = useElectiveSubject()

  useEffect(() => {
    handleGetElectiveSubject()
  }, [])

  return (
    <>
      <Helmet>
        <title>Smart Roll | Elective Subject</title>
      </Helmet>
      <div className="py-13 bg-white px-4">
        <div className="mx-auto max-w-full">
          <div className="my-10 text-center">
            <h1 className="p-4 text-2xl font-bold tracking-tight text-black sm:text-2xl md:text-4xl lg:text-5xl">
              {isSubjectSave && finalizedChoice
                ? 'Your Finalized Elective Subjects'
                : 'Elective Subject Selection'}
            </h1>
            <p className="mt-2 text-xs text-black/60 sm:text-sm md:text-lg lg:text-xl">
              {isSubjectSave && finalizedChoice
                ? 'These are your selected elective subjects'
                : 'Choose your preferred subjects for each elective category'}
            </p>
            {!isSubjectSave && selectedSubjects.length > 0 && (
              <Button
                onClick={togglePanel}
                className="mt-6 w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80 lg:w-auto"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Choices
                <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-[#0261BE]">
                  {selectedSubjects.length}
                </span>
              </Button>
            )}
            {deadline && !FinalChoiceLock && (
              <Alert className="mt-5 w-full border-[#F99704] bg-white text-black shadow-soft">
                <div className="">
                  <AlertTitle className="flex items-center space-x-4">
                    <AlertTriangle className="h-4 w-4 text-[#F99704]" />
                    <span>Decision Deadline : {deadline} </span>
                  </AlertTitle>
                </div>
              </Alert>
            )}
            {isSubjectSave && !FinalChoiceLock && (
              <Button
                className="mt-5 w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80 lg:w-auto"
                onClick={handleOnClickForUnsaveDraft}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Unsave Draft
              </Button>
            )}
          </div>

          <div
            className="group hidden h-96 w-full items-center"
            ref={noElectiveSubjectCard}
          >
            <Card className="w-full border-none bg-[#F7F7F7] shadow-soft">
              <CardHeader className="pb-2"></CardHeader>
              <CardContent className="text-center font-bold text-black">
                You'll get your elective subject choices soon ....
              </CardContent>
            </Card>
          </div>
          <div className="space-y-10 py-4">
            {isSubjectSave && finalizedChoice ? (
              <div className="rounded-[6px] border-none bg-white p-6 shadow-soft lg:p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-[#0261BE]" />
                    <h2 className="text-2xl font-bold text-black">
                      Selected Electives
                    </h2>
                  </div>
                  <p className="mt-2 text-black/60">
                    Your finalized subject selections
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                      <Card className="border-none bg-[#F7F7F7] shadow-soft">
                        <CardContent className="pt-6 text-center text-black">
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
                  <div className="rounded-[6px] border-none bg-[#F7F7F7] p-6 shadow-soft lg:p-8">
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-[#0261BE] lg:h-6 lg:w-6" />
                        <h2 className="text-xl font-bold text-black lg:text-2xl">
                          {category}
                        </h2>
                      </div>
                      <p className="mt-2 text-xs text-black/60 lg:text-sm">
                        Select one subject from this category
                      </p>
                    </div>

                    <RadioGroup
                      value={group.slug}
                      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                      {group.subjects.map((subject, index) => {
                        return (
                          <>
                            <RadioGroupItem
                              id={subject.slug}
                              value={subject.slug}
                              className="hidden"
                            />

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
                          </>
                        )
                      })}
                    </RadioGroup>
                  </div>
                )
              })
            ) : (
              selectedSubjects?.length > 0 && (
                <div className="col-span-full">
                  <Card className="border-none bg-[#F7F7F7] shadow-soft">
                    <CardContent className="pt-6 text-center text-black">
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
    </>
  )
}

export default ElectiveSubject
