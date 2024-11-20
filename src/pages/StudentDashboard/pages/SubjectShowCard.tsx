import React, { useCallback } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { Info } from 'lucide-react'

interface CourseCardProps {
  toggleSubjectSelection: (subject: any, group_slug: any) => void
  subject: any
  selectedSubjects: any
  isSubjectLock?: any
  setIsSubjectLock?: any
  draggable: boolean
  index: number
  group_slug?: any
  studentChoice?: any
}
const SubjectShowCard = ({
  subject,
  toggleSubjectSelection,
  selectedSubjects,
  isSubjectLock,
  draggable = false,
  index,
  group_slug,
}: CourseCardProps) => {
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <>
      <Card
        key={subject.slug}
        className={`relative cursor-pointer overflow-hidden transition-all duration-300 ${
          isSubjectLock == false &&
          selectedSubjects.some((d: any) => d.subject.slug === subject?.slug)
            ? isSubjectLock
              ? `dark:bg-black`
              : `bg-zinc-800`
            : `dark:bg-black`
        } text-white`}
        onClick={() => {
          isSubjectLock ? null : toggleSubjectSelection(subject, group_slug)
        }}
      >
        {draggable == true &&
          isSubjectLock == true &&
          selectedSubjects.some(
            (selectedsubject: any) => selectedsubject.slug === subject.slug,
          ) && (
            <div className="absolute right-2 top-2 rounded-full bg-[#ffa31a] px-2 py-1 text-xs font-semibold text-black">
              Priority - {index + 1}
            </div>
          )}

        <CardHeader className="mt-3 flex flex-row items-center justify-between pb-3">
          <h2 className="text-xl font-bold tracking-tight">
            {subject?.subject_name}{' '}
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="space-y-1">
              <p className="text-sm uppercase text-white/60">Type</p>

              <p className="text-xl font-semibold">
                {subject?.is_theory
                  ? 'Theory'
                  : subject?.is_practical
                    ? 'Practical'
                    : 'Semi-Practical'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase text-white/60">Subject Code</p>
              <p className="text-xl font-semibold md:text-center">
                {subject?.subject_code}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase text-white/60">Effective Year</p>
              <p className="text-xl font-semibold md:text-right">
                {subject?.eff_from}
              </p>
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="w-full">
              <div className="flex w-full flex-row gap-x-3 text-center">
                <div className="flex w-2/5 justify-around rounded-lg bg-white/10 p-2">
                  <div>
                    <p className="text-sm font-medium text-white/60">L</p>
                    <p className="text-lg font-bold">{subject?.L} </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">T</p>
                    <p className="text-lg font-bold">{subject?.T}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">P</p>
                    <p className="text-lg font-bold">{subject?.P} </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">Credit</p>
                    <p className="text-lg font-bold">
                      {parseInt(subject?.credit)}
                    </p>
                  </div>
                </div>

                <div className="flex w-3/5 justify-around rounded-lg bg-white/10 p-2">
                  <div>
                    <p className="text-sm font-medium text-white/60">E</p>
                    <p className="text-lg font-bold">{subject?.E}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">M</p>
                    <p className="text-lg font-bold">{subject?.M}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">I</p>
                    <p className="text-lg font-bold">{subject?.I}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">V</p>
                    <p className="text-lg font-bold">{subject?.V}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">Total</p>
                    <p className="text-lg font-bold">
                      {' '}
                      {subject?.total_marks}{' '}
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
              {subject?.category}
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
                      Theory Exam Duration : {subject?.theory_exam_duration}h
                    </p>
                    <p className="text-sm">
                      Practical Exam Duration :{' '}
                      {subject.practical_exam_duration}
                    </p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        For more Info. -{' '}
                        <a href="https://syllabus.gtu.ac.in/" target="_blank">
                          GTU Syllabus
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default SubjectShowCard
