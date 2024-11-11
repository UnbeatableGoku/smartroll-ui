import React, { useCallback, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import ConfirmSubjectSelection from '@pages/Sbuject/ConfirmSubjectSelection'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { BookOpen, Info } from 'lucide-react'

import { Button } from '@components/ui/button'
import { Separator } from '@components/ui/separator'

import useSubjectChoice from './hooks/useSubjectChoice'

type Subject = {
  slug: string
  subject_name: string
  subject_code: string
  is_theory: boolean
  is_practical: boolean
  eff_from: string
  credit: number
  L: number
  T: number
  P: number
  E: number
  M: number
  I: number
  V: number
  total_marks: number
  category: string
}

interface SubjectChoiceProps {
  subjects: Subject[] // Updated to accept an array of subjects
}

const SubjectChoice = () => {
  const {
    selectedSubjects,
    semester,
    academicYears,
    loadSemesterByStream,
    setSelectedSubjects,
    toggleSubjectSelection,
    loadSubjects,
  } = useSubjectChoice()

  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [subjectChoice, setSubjectChoice] = useState(true)
  const togglePanel = () => setIsPanelOpen(!isPanelOpen)
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])
  const subjects = [
    {
      slug: 'subject-1',
      subject_name: 'Computer Science 101',
      subject_code: 'CS101',
      is_theory: true,
      is_practical: false,
      eff_from: '2023',
      credit: 3,
      L: 2,
      T: 1,
      P: 0,
      E: 80,
      M: 100,
      I: 90,
      V: 100,
      total_marks: 370,
      category: 'Core',
    },
    {
      slug: 'subject-2',
      subject_name: 'Mathematics 202',
      subject_code: 'MATH202',
      is_theory: true,
      is_practical: false,
      eff_from: '2022',
      credit: 4,
      L: 3,
      T: 1,
      P: 0,
      E: 70,
      M: 90,
      I: 85,
      V: 95,
      total_marks: 340,
      category: 'Core',
    },
    {
      slug: 'subject-3',
      subject_name: 'Physics 101',
      subject_code: 'PHYS101',
      is_theory: true,
      is_practical: false,
      eff_from: '2023',
      credit: 3,
      L: 2,
      T: 1,
      P: 0,
      E: 75,
      M: 85,
      I: 80,
      V: 90,
      total_marks: 330,
      category: 'Core',
    },
    {
      slug: 'subject-4',
      subject_name: 'Data Structures and Algorithms',
      subject_code: 'CS201',
      is_theory: true,
      is_practical: true,
      eff_from: '2023',
      credit: 4,
      L: 2,
      T: 1,
      P: 1,
      E: 85,
      M: 95,
      I: 90,
      V: 100,
      total_marks: 380,
      category: 'Elective',
    },
  ]

  return (
    <>
      <Button onClick={togglePanel} className="fixed right-24 top-16 z-10">
        <BookOpen className="mr-2 h-4 w-4" />
        Subjects
        <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900">
          {subjects.length}
        </span>
      </Button>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card
            key={subject.slug} // Using slug as key for unique identification
            className={`relative cursor-pointer overflow-hidden transition-all duration-300 ${
              selectedSubjects.some((d: any) => d.slug === subject.slug)
                ? `bg-zinc-800`
                : `dark:bg-black`
            } text-white`}
            onClick={() => toggleSubjectSelection(subject)} // Toggle selection for each subject
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <h2 className="text-xl font-bold tracking-tight">
                {subject.subject_name}
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div className="space-y-1">
                  <p className="text-sm uppercase text-white/60">Type</p>
                  <p className="text-xl font-semibold">
                    {subject.is_theory
                      ? 'Theory'
                      : subject.is_practical
                        ? 'Practical'
                        : 'Semi-Practical'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm uppercase text-white/60">
                    Subject Code
                  </p>
                  <p className="text-xl font-semibold md:text-center">
                    {subject.subject_code}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm uppercase text-white/60">
                    Effective Year
                  </p>
                  <p className="text-xl font-semibold md:text-right">
                    {subject.eff_from}
                  </p>
                </div>
              </div>

              <div className="flex w-full justify-between">
                <div className="w-full">
                  <div className="flex w-full flex-row gap-x-3 text-center">
                    <div className="flex w-2/5 justify-around rounded-lg bg-white/10 p-2">
                      <div>
                        <p className="text-sm font-medium text-white/60">L</p>
                        <p className="text-lg font-bold">{subject.L} </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">T</p>
                        <p className="text-lg font-bold">{subject.T}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">P</p>
                        <p className="text-lg font-bold">{subject.P} </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">
                          Credit
                        </p>
                        <p className="text-lg font-bold">{subject.credit}</p>
                      </div>
                    </div>

                    <div className="flex w-3/5 justify-around rounded-lg bg-white/10 p-2">
                      <div>
                        <p className="text-sm font-medium text-white/60">E</p>
                        <p className="text-lg font-bold">{subject.E}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">M</p>
                        <p className="text-lg font-bold">{subject.M}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">I</p>
                        <p className="text-lg font-bold">{subject.I}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">V</p>
                        <p className="text-lg font-bold">{subject.V}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">
                          Total
                        </p>
                        <p className="text-lg font-bold">
                          {subject.total_marks}
                        </p>
                      </div>
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
                    <div onClick={stopPropagation}>
                      <Info className="cursor-pointer text-white" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="z-10 w-80 rounded-md border p-2 dark:bg-black"
                    onClick={stopPropagation}
                  >
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          Course Information
                        </h4>
                        <p className="text-sm">
                          This course is a Professional Elective. It covers
                          advanced topics in the field and contributes to your
                          specialization.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ConfirmSubjectSelection
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        togglePanel={togglePanel}
        subjects={subjects} // Passing the correct subjects array
        subjectChoice={subjectChoice}
        draggable={true}
      />
    </>
  )
}

export default SubjectChoice
