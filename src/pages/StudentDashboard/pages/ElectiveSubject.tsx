import { useEffect, useState } from 'react'

import useElectiveSubject from '../hooks/useElectiveSubject'
import useSubjectSelection from '../hooks/useSubjectSelection'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Settings2,
} from 'lucide-react'

import { Loader } from '@components/common/loader/Loader'
import { Button } from '@components/ui/button'

import ConfirmPanel from './ConfirmPanel'

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
    isLoading, // finalized subjects
  } = useElectiveSubject()

  const { handleSubjectSelection, selectedSubjects, categorySelections } =
    useSubjectSelection()

  useEffect(() => {
    handleGetElectiveSubject()
  }, [])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-gradient-to-b px-4 py-12">
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
              {!isLocked &&
                selectedSubjects.subject_choices &&
                finalizedChoice && (
                  <Button
                    onClick={togglePanel}
                    className="z-10 mt-3 w-full lg:w-auto"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Lock Subjects
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900">
                      {selectedSubjects.subject_choices.length}
                    </span>
                  </Button>
                )}
            </div>

            <div className="space-y-10">
              {isLocked && finalizedChoice ? (
                // Finalized subjects view
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
                    {isLocked &&
                      finalizedChoice.map((subject) => (
                        <Card
                          key={subject.slug}
                          className="dark:bg-zinc-40 border-2 border-primary/40 bg-primary/5 transition-all duration-300 hover:border-primary hover:bg-primary/10"
                        >
                          <CardHeader className="relative pb-4">
                            <div className="absolute right-2 top-2">
                              <BadgeCheck
                                className="h-5 w-5 border-none text-[#ffa31a]"
                                size={64}
                              />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-white">
                                {subject.subject_name}
                              </CardTitle>
                              <div className="flex gap-4">
                                <p className="mt-2 text-sm font-medium text-primary">
                                  {subject.subject_code}
                                </p>
                                <p className="mt-2 text-sm font-medium text-primary">
                                  {subject?.is_theory
                                    ? 'Theory'
                                    : subject?.is_practical
                                      ? 'Practical'
                                      : 'Semi-Practical'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-gray-700"
                              >
                                <Clock className="mr-1 h-3 w-3" />
                                {subject.category}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="bg-gray-700"
                              >
                                <BookOpen className="mr-1 h-3 w-3" />
                                {subject.credit} Credits
                              </Badge>
                              {subject.is_practical && (
                                <Badge
                                  variant="secondary"
                                  className="bg-gray-700"
                                >
                                  <Settings2 className="mr-1 h-3 w-3" />
                                  Practical
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>
                </div>
              ) : (
                // Subject selection view
                electiveSubject.map((group) => {
                  const category = group?.subjects[0].category
                  return (
                    <div
                      key={group.slug}
                      className="rounded-2xl border border-zinc-600 p-8 backdrop-blur-sm dark:bg-black"
                    >
                      <div className="mb-4">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-6 w-6 text-primary" />
                          <h2 className="text-2xl font-bold text-white">
                            {category || 'Elective Subjects'}
                          </h2>
                        </div>
                        <p className="mt-2 text-gray-400">
                          Select one subject from this category
                        </p>
                      </div>

                      <RadioGroup
                        value={categorySelections[category] || ''}
                        onValueChange={(value) => {
                          const selectedSubject = group.subjects.find(
                            (subject: any) => subject.slug === value,
                          )
                          handleSubjectSelection(
                            category,
                            value,
                            selectedSubject.subject_name,
                            selectedSubject.subject_code,
                            selectedSubject.slug,
                          )
                        }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                      >
                        {group.subjects.map((subject: any) => (
                          <Label
                            key={subject.slug}
                            htmlFor={subject.slug}
                            className="cursor-pointer"
                          >
                            <Card
                              className={`group h-full overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:shadow-xl ${
                                categorySelections[category] === subject.slug
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-700 dark:bg-black'
                              }`}
                            >
                              <CardHeader className="relative pb-4">
                                <RadioGroupItem
                                  value={subject.slug}
                                  id={subject.slug}
                                  className="sr-only"
                                />
                                <div className="absolute right-2 top-2">
                                  <CheckCircle2
                                    className={`h-4 w-4 transition-all duration-300 ${
                                      categorySelections[category] ===
                                      subject.slug
                                        ? 'scale-110 text-primary opacity-100'
                                        : 'text-gray-500 opacity-0 group-hover:opacity-50'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <CardTitle className="text-xl font-bold text-white">
                                    {subject.subject_name}
                                  </CardTitle>
                                  <p className="mt-2 text-sm font-medium text-primary">
                                    {subject.subject_code}
                                  </p>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="bg-gray-700"
                                  >
                                    <Clock className="mr-1 h-3 w-3" />
                                    {subject.theory_exam_duration}h Theory
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="bg-gray-700"
                                  >
                                    <BookOpen className="mr-1 h-3 w-3" />
                                    {subject.credit} Credits
                                  </Badge>
                                  {subject.is_practical && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-700"
                                    >
                                      <Settings2 className="mr-1 h-3 w-3" />
                                      Practical
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                            </Card>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
      <ConfirmPanel
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        togglePanel={togglePanel}
        selectedSubjects={selectedSubjects}
        handleSubjectSelection={handleStudentChoice}
        subjectSlug={subjectSlug}
      />
    </>
  )
}

export default ElectiveSubject
