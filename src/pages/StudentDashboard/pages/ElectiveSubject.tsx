import { useEffect, useState } from 'react'

import useElectiveSubject from '../hooks/useElectiveSubject'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import SubjectCard from '@pages/Sbuject/SubjectCard'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { BookOpen, GraduationCap, Info } from 'lucide-react'

import { Loader } from '@components/common/loader/Loader'
import { Button } from '@components/ui/button'

import ConfirmPanel from './ConfirmPanel'
import SubjectShowCard from './SubjectShowCard'

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
    handleGetElectiveSubject,
    electiveSubject,
    handleStudentChoice,
    subjectSlug,
    isLocked,
    finalizedChoice,
    selectedSubjects,
    toggleSubjectSelection,
  } = useElectiveSubject()

  // const { selectedSubjects, categorySelections, toggleSubjectSelection } =
  //   useSubjectSelection()

  useEffect(() => {
    handleGetElectiveSubject()
  }, [])

  // useEffect(() => {
  //   console.log(selectedSubjects)
  //   console.log(subjectSlug)
  // }, [selectedSubjects ])
  // if (!isLoading) {
  //   return <Loader />
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {isLocked && finalizedChoice
              ? 'Your Finalized Elective Subjects'
              : 'Elective Subject Selection'}
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            {isLocked && finalizedChoice
              ? 'These are your selected elective subjects'
              : 'Choose your preferred subjects for each elective category'}
          </p>
          {!isLocked && selectedSubjects.length > 0 && (
            <Button
              onClick={togglePanel}
              className="mt-3 w-full bg-white p-2 shadow-md lg:w-auto"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Lock Subjects
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900">
                {selectedSubjects.length}
              </span>
            </Button>
          )}
        </div>

        <div className="space-y-10">
          {isLocked && finalizedChoice ? (
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
                      isSubjectLock={isLocked}
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
                <div className="rounded-2xl border border-zinc-600 p-8 backdrop-blur-sm dark:bg-black">
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
                    // onValueChange={(value: any) => {
                    //   const selectedSubject = group.subjects.find(
                    //     (subject) => subject.slug === value,
                    //   )
                    //   if (selectedSubject) {
                    //     toggleSubjectSelection(selectedSubject, group.slug)
                    //     console.log(value)
                    //   }
                    // }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {group.subjects.map((subject, index) => {
                      // const isSelected = selectedSubjects.subject_choices.some(
                      //   (s) => s === categorySelections[category],
                      // )

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
                              isSubjectLock={isLocked}
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
        subjectSlug={subjectSlug}
      />
    </div>
  )
}

export default ElectiveSubject
