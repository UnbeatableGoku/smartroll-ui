import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import InfoCard from '@pages/StudentDashboard/component/InfoCard'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { Info } from 'lucide-react'

interface CourseCardProps {
  toggleSubjectSelection: (subject: any) => void
  subject: any
  selectedSubjects: string[]
  isSubjectLock: any
  setIsSubjectLock: any
  draggable: boolean
  index: number
}
const SubjectCard = ({
  subject,
  toggleSubjectSelection,
  selectedSubjects,
  isSubjectLock,
  draggable = false,
  index,
}: CourseCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  return (
    <Card
      key={subject.slug}
      className={`relative cursor-pointer overflow-hidden transition-all duration-300 ${
        selectedSubjects.some((d: any) => d.slug === subject?.slug)
          ? isSubjectLock
            ? `dark:bg-black`
            : `border border-white text-white dark:bg-blue-600/20`
          : `text-white dark:bg-black`
      } `}
      onClick={() => {
        isSubjectLock ? null : toggleSubjectSelection(subject)
      }}
    >
      {draggable &&
        isSubjectLock &&
        selectedSubjects.some(
          (selectedsubject: any) => selectedsubject.slug === subject.slug,
        ) && (
          <>
            <div
              className={`absolute right-2 ${subject?.is_technical != null ? (subject?.is_technical ? 'top-2' : 'top-9') : 'top-2'} top-6 rounded-full bg-[#ffa31a] px-2 py-1 text-xs font-semibold text-black`}
            >
              Priority - {index + 1}
            </div>
            <div>
              {subject?.is_technical != null && (
                <div
                  className={`absolute right-2 top-2 rounded-full ${subject?.is_technical ? 'hidden bg-[#ffa31a]' : 'bg-[#e3103a] text-white'} px-2 py-1 text-xs font-semibold text-black`}
                >
                  {/* Your label or content here */}
                  {subject?.is_technical ? 'Tech' : 'Non-tech'}
                </div>
              )}
            </div>
          </>
        )}

      {draggable && (
        <div>
          {subject?.is_technical != null && (
            <div
              className={`absolute right-2 top-2 rounded-full ${subject?.is_technical ? 'hidden bg-[#ffa31a]' : 'bg-[#e3103a] text-white'} px-2 py-1 text-xs font-semibold text-black`}
            >
              {/* Your label or content here */}
              {subject?.is_technical ? 'Tech' : 'Non-tech'}
            </div>
          )}
        </div>
      )}

      {!draggable &&
        isSubjectLock &&
        selectedSubjects.some(
          (selectedsubject: any) => selectedsubject.slug === subject.slug,
        ) && (
          <div>
            {subject?.is_technical != null && (
              <div
                className={`absolute right-2 top-2 rounded-full ${subject?.is_technical ? 'hidden bg-[#ffa31a]' : 'bg-[#e3103a] text-white'} px-2 py-1 text-xs font-semibold text-black`}
              >
                {/* Your label or content here */}
                {subject?.is_technical ? 'Tech' : 'Non-tech'}
              </div>
            )}
          </div>
        )}

      <CardHeader className="mt-3 flex flex-row items-center justify-between pb-3">
        <h2 className="text-xl font-bold tracking-tight">
          {subject?.subject_name}{' '}
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg">Sem : {subject.sem_year}</p>
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
            {isMobile && (
              <div className="absolute bottom-5 right-5">
                <button
                  className="relative"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                  aria-expanded={isExpanded}
                  aria-label={
                    isExpanded
                      ? 'Hide course information'
                      : 'Show course information'
                  }
                >
                  <Info className="h-5 w-5 text-white" />
                </button>
                {isExpanded && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <Card className="w-80 max-w-[90vw]">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <InfoCard
                            theory_exam_duration={subject.theory_exam_duration}
                            practical_exam_duration={
                              subject.practical_exam_duration
                            }
                            subject_code={subject.subject_code}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsExpanded(false)
                            }}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Close"
                          >
                            ✕
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="hidden text-sm uppercase text-white/60 sm:block md:block lg:block">
              Effective Year
            </p>
            <p className="hidden text-xl font-semibold sm:block md:block md:text-right lg:block">
              {subject?.eff_from}
            </p>
          </div>
        </div>

        <div className="hidden w-full justify-between sm:block md:block lg:block">
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
                  <p className="text-lg font-bold"> {subject?.total_marks} </p>
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

          {!isMobile && (
            <div className="relative">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="p-2" aria-label="Show course information">
                    <Info className="cursor-pointer text-white" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="absolute z-50 w-80 rounded-md border p-2 shadow-lg dark:bg-black">
                  <InfoCard
                    theory_exam_duration={subject.theory_exam_duration}
                    practical_exam_duration={subject.practical_exam_duration}
                    subject_code={subject.subject_code}
                  />
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SubjectCard
