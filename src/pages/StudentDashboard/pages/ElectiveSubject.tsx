import { useEffect, useState } from 'react'

import useElectiveSubject from '../hooks/useElectiveSubject'
import useSubjectSelection from '../hooks/useSubjectSelection'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { BookOpen, GraduationCap, Info } from 'lucide-react'

import { Loader } from '@components/common/loader/Loader'
import { Button } from '@components/ui/button'

import ConfirmPanel from './ConfirmPanel'

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
    isLoading,
    totalCategories,
  } = useElectiveSubject()

  const { handleSubjectSelection, selectedSubjects, categorySelections } =
    useSubjectSelection()

  useEffect(() => {
    handleGetElectiveSubject()
  }, [])

  useEffect(() => {
    console.log(selectedSubjects)
    console.log(totalCategories.length)
  }, [selectedSubjects])
  if (isLoading) {
    return <Loader />
  }

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
          {!isLocked && selectedSubjects?.subject_choices?.length > 0 && (
            <Button
              onClick={togglePanel}
              className="sticky z-50 mt-3 w-full bg-white p-2 shadow-md lg:w-auto"
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
                  finalizedChoice.map((subject: Subject) => (
                    <div key={subject.slug} className="relative">
                      <Label
                        htmlFor={subject.slug}
                        className="block cursor-pointer"
                      >
                        <Card
                          className={`transition-all duration-300 ${'bg-zinc-800 text-white'} hover:border-primary`}
                        >
                          <CardHeader className="mt-3 flex flex-row items-center justify-between pb-3">
                            <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                              {subject.subject_name}
                            </h2>
                          </CardHeader>
                          <CardContent className="space-y-4 text-sm sm:text-base">
                            <div className="flex flex-col justify-between gap-4 md:flex-row">
                              <div className="space-y-1">
                                <p className="text-xs uppercase text-white/60 sm:text-sm">
                                  Type
                                </p>
                                <p className="text-lg font-semibold">
                                  {subject.is_theory
                                    ? 'Theory'
                                    : subject.is_practical
                                      ? 'Practical'
                                      : 'Semi-Practical'}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs uppercase text-white/60 sm:text-sm">
                                  Subject Code
                                </p>
                                <p className="text-lg font-semibold">
                                  {subject.subject_code}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs uppercase text-white/60 sm:text-sm">
                                  Effective Year
                                </p>
                                <p className="text-lg font-semibold">
                                  {subject.eff_from}
                                </p>
                              </div>
                            </div>

                            <div className="flex w-full justify-between">
                              <div className="flex w-full flex-col gap-2 sm:flex-row">
                                <div className="flex w-full justify-around rounded-lg bg-white/10 p-2">
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      L
                                    </p>
                                    <p className="text-lg font-bold">
                                      {subject.L}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      T
                                    </p>
                                    <p className="text-lg font-bold">
                                      {subject.T}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      P
                                    </p>
                                    <p className="text-lg font-bold">
                                      {subject.P}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      Credit
                                    </p>
                                    <p className="text-lg font-bold">
                                      {parseInt(subject.credit)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex w-full justify-around rounded-lg bg-white/10 p-2">
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      E
                                    </p>
                                    <p className="text-lg font-bold">
                                      {subject.E}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      M
                                    </p>
                                    <p className="text-lg font-bold">
                                      {subject.M}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      I
                                    </p>
                                    <p className="text-lg font-bold">
                                      {subject.I}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      V
                                    </p>
                                    <p className="text-lg font-bold">
                                      {subject.V}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-white/60 sm:text-sm">
                                      Total
                                    </p>
                                    <p className="text-lg font-bold">
                                      {subject.total_marks}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                              >
                                {subject.category}
                              </Badge>

                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <div>
                                    <Info className="cursor-pointer text-white" />
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="z-10 w-80 rounded-md border p-2 dark:bg-black">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">
                                      Course Information
                                    </h4>
                                    <p className="text-sm">
                                      Theory Exam Duration:{' '}
                                      {subject.theory_exam_duration}
                                    </p>
                                    <p className="text-sm">
                                      Practical Exam Duration:{' '}
                                      {subject.practical_exam_duration}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                      For More Info. -{' '}
                                      <a
                                        href="https://syllabus.gtu.ac.in/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500"
                                      >
                                        GTU Syllabus
                                      </a>
                                    </span>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </div>
                          </CardContent>
                        </Card>
                      </Label>
                    </div>
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
                    value={categorySelections[category] || ''}
                    onValueChange={(value) => {
                      const selectedSubject = group.subjects.find(
                        (subject) => subject.slug === value,
                      )
                      if (selectedSubject) {
                        handleSubjectSelection(
                          category,
                          value,
                          selectedSubject.subject_name,
                          selectedSubject.subject_code,
                          selectedSubject.slug,
                        )
                      }
                    }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {group.subjects.map((subject) => {
                      const isSelected =
                        categorySelections[category] === subject.slug
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
                            <Card
                              className={`transition-all duration-300 ${
                                isSelected
                                  ? 'bg-zinc-800 text-white'
                                  : 'dark:bg-black'
                              } hover:border-primary`}
                            >
                              <CardHeader className="mt-3 flex flex-row items-center justify-between pb-3">
                                <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                                  {subject.subject_name}
                                </h2>
                              </CardHeader>
                              <CardContent className="space-y-4 text-sm sm:text-base">
                                <div className="flex flex-col justify-between gap-4 md:flex-row">
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase text-white/60 sm:text-sm">
                                      Type
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {subject.is_theory
                                        ? 'Theory'
                                        : subject.is_practical
                                          ? 'Practical'
                                          : 'Semi-Practical'}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase text-white/60 sm:text-sm">
                                      Subject Code
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {subject.subject_code}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase text-white/60 sm:text-sm">
                                      Effective Year
                                    </p>
                                    <p className="text-lg font-semibold">
                                      {subject.eff_from}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex w-full justify-between">
                                  <div className="flex w-full flex-col gap-2 sm:flex-row">
                                    <div className="flex w-full justify-around rounded-lg bg-white/10 p-2">
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          L
                                        </p>
                                        <p className="text-lg font-bold">
                                          {subject.L}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          T
                                        </p>
                                        <p className="text-lg font-bold">
                                          {subject.T}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          P
                                        </p>
                                        <p className="text-lg font-bold">
                                          {subject.P}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          Credit
                                        </p>
                                        <p className="text-lg font-bold">
                                          {parseInt(subject.credit)}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex w-full justify-around rounded-lg bg-white/10 p-2">
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          E
                                        </p>
                                        <p className="text-lg font-bold">
                                          {subject.E}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          M
                                        </p>
                                        <p className="text-lg font-bold">
                                          {subject.M}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          I
                                        </p>
                                        <p className="text-lg font-bold">
                                          {subject.I}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          V
                                        </p>
                                        <p className="text-lg font-bold">
                                          {subject.V}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-white/60 sm:text-sm">
                                          Total
                                        </p>
                                        <p className="text-lg font-bold">
                                          {subject.total_marks}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                                  >
                                    {subject.category}
                                  </Badge>

                                  <HoverCard>
                                    <HoverCardTrigger asChild>
                                      <div>
                                        <Info className="cursor-pointer text-white" />
                                      </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="z-10 w-80 rounded-md border p-2 dark:bg-black">
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">
                                          Course Information
                                        </h4>
                                        <p className="text-sm">
                                          Theory Exam Duration: 2.5
                                        </p>
                                        <p className="text-sm">
                                          Practical Exam Duration: 0
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                          for more info. -{' '}
                                          <a
                                            href="https://syllabus.gtu.ac.in/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            GTU Syllabus
                                          </a>
                                        </span>
                                      </div>
                                    </HoverCardContent>
                                  </HoverCard>
                                </div>
                              </CardContent>
                            </Card>
                          </Label>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
              )
            })
          ) : (
            selectedSubjects?.subject_choices?.length > 0 && (
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
        subject
      />
    </div>
  )
}

export default ElectiveSubject
