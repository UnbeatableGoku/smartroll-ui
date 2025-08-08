import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DownloadCloud } from 'lucide-react'

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
  return (
    <Card
      key={subject.slug}
      className={`relative cursor-pointer overflow-hidden border-none shadow-soft transition-all duration-300 ${
        selectedSubjects.some((d: any) => d.slug === subject?.slug)
          ? isSubjectLock
            ? `bg-white shadow-soft`
            : `border border-[#0261BE] bg-[#0261BE]/10`
          : `bg-white shadow-soft`
      } `}
      onClick={() => {
        if (isSubjectLock) {
          null
        } else {
          if (
            subject?.similar_subjects &&
            draggable &&
            !selectedSubjects.some((d: any) => d.slug === subject?.slug)
          ) {
            const stream_codes = subject.similar_subjects.map((data: any) => {
              return data.branch_name
            })
            alert(
              `Same subject from\n ${stream_codes.join('\n')} \n will also be selected`,
            )
          }
          toggleSubjectSelection(subject)
        }
      }}
    >
      {draggable &&
        isSubjectLock &&
        selectedSubjects.some(
          (selectedsubject: any) => selectedsubject.slug === subject.slug,
        ) && (
          <>
            <div
              className={`absolute right-2 ${subject?.is_technical != null ? (subject?.is_technical ? 'top-2' : 'top-9') : 'top-2'} rounded-full bg-[#0261BE] px-2 py-1 text-xs font-semibold text-white`}
            >
              Priority - {index + 1}
            </div>
            <div>
              {subject?.is_technical != null && (
                <div
                  className={`absolute right-2 top-2 rounded-full ${subject?.is_technical ? 'hidden bg-[#0261BE]' : 'bg-red-500 text-white'} px-2 py-1 text-xs font-semibold`}
                >
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
              className={`absolute right-2 top-2 rounded-full ${subject?.is_technical ? 'hidden bg-[#0261BE]' : 'bg-red-500 text-white'} px-2 py-1 text-xs font-semibold`}
            >
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
                className={`absolute right-2 top-2 rounded-full ${subject?.is_technical ? 'hidden bg-[#0261BE]' : 'bg-red-500 text-white'} px-2 py-1 text-xs font-semibold`}
              >
                {subject?.is_technical ? 'Tech' : 'Non-tech'}
              </div>
            )}
          </div>
        )}

      <CardHeader className="mt-0 flex flex-row items-center justify-between px-3 pb-0 lg:mt-3 lg:px-6 lg:pb-3">
        <h2 className="text-sm font-bold tracking-tight text-black md:text-xl">
          {subject?.subject_name}{' '}
        </h2>
      </CardHeader>
      <CardContent className="space-y-2 px-3 py-3 lg:space-y-6 lg:px-6 lg:py-6">
        <p className="hidden text-lg font-normal text-black sm:block md:block lg:block">
          Sem : {subject.sem_year}
        </p>
        <div className="flex flex-row justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase text-black/60 lg:text-sm">Type</p>
            <p className="text-sm font-semibold text-black lg:text-xl">
              {subject?.is_theory
                ? 'Theory'
                : subject?.is_practical
                  ? 'Practical'
                  : 'Semi-Practical'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase text-black/60 lg:text-sm">
              Subject Code
            </p>
            <div className="flex justify-between gap-2">
              <p className="w-full text-right text-sm font-semibold text-black lg:text-center lg:text-xl">
                {subject?.subject_code}
              </p>
            </div>
          </div>
          <div className="hidden space-y-1 sm:block md:block lg:block">
            <p className="text-sm uppercase text-black/60">Effective Year</p>
            <p className="text-right text-xl font-semibold text-black">
              {subject?.eff_from}
            </p>
          </div>
        </div>

        <div className="w-full justify-between">
          <div className="w-full">
            <div className="flex w-full flex-row gap-x-3 text-center">
              <div className="flex w-2/5 justify-around rounded-lg bg-[#0261BE]/10 p-2">
                <div>
                  <p className="text-sm font-medium text-black/60">L</p>
                  <p className="text-lg font-bold text-black">{subject?.L} </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">T</p>
                  <p className="text-lg font-bold text-black">{subject?.T}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">P</p>
                  <p className="text-lg font-bold text-black">{subject?.P} </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">Credit</p>
                  <p className="text-lg font-bold text-black">
                    {parseInt(subject?.credit)}
                  </p>
                </div>
              </div>

              <div className="flex w-3/5 justify-around rounded-lg bg-[#0261BE]/10 p-2">
                <div>
                  <p className="text-sm font-medium text-black/60">E</p>
                  <p className="text-lg font-bold text-black">{subject?.E}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">M</p>
                  <p className="text-lg font-bold text-black">{subject?.M}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">I</p>
                  <p className="text-lg font-bold text-black">{subject?.I}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">V</p>
                  <p className="text-lg font-bold text-black">{subject?.V}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">Total</p>
                  <p className="text-lg font-bold text-black">
                    {' '}
                    {subject?.total_marks}{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <Badge
            variant="secondary"
            className="bg-[#0261BE]/10 text-[#0261BE] hover:bg-[#0261BE]/20"
          >
            {subject?.category}
          </Badge>

          <Badge
            variant="secondary"
            className="bg-[#0261BE]/10 text-[#0261BE] hover:bg-[#0261BE]/20"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <a
              href={`https://s3-ap-southeast-1.amazonaws.com/gtusitecirculars/Syallbus/${subject.subject_code}.pdf`}
              download={`Syllabus_${subject.subject_code}.pdf`}
              className="flex items-center gap-x-2"
              target="_blank"
            >
              <DownloadCloud className="h-4 w-4 text-[#0261BE]" />
              Syllabus
            </a>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default SubjectCard
