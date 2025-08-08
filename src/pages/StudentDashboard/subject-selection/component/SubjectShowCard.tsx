import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DownloadCloud } from 'lucide-react'

interface CourseCardProps {
  toggleSubjectSelection: (subject: any, group_slug: any) => void
  subject: any
  selectedSubjects: any
  isSubjectSave?: any
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
  isSubjectSave,
  group_slug,
}: CourseCardProps) => {
  return (
    <>
      <Card
        key={subject.slug}
        className={`relative cursor-pointer overflow-hidden border-none bg-[#F7F7F7] shadow-soft transition-all duration-300 ${
          isSubjectSave == false &&
          selectedSubjects.some((d: any) => d.subject.slug === subject?.slug)
            ? isSubjectSave
              ? `bg-[#F7F7F7]`
              : `border border-[#0261BE] bg-[#F7F7F7]`
            : `bg-[#F7F7F7]`
        }`}
        onClick={() => {
          isSubjectSave ? null : toggleSubjectSelection(subject, group_slug)
        }}
      >
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

          <div className="hidden w-full justify-between sm:block md:block lg:block">
            <div className="w-full">
              <div className="flex w-full flex-row gap-x-3 text-center">
                <div className="flex w-2/5 justify-around rounded-lg bg-white p-2 shadow-soft">
                  <div>
                    <p className="text-sm font-medium text-black/60">L</p>
                    <p className="text-lg font-bold text-black">{subject?.L}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black/60">T</p>
                    <p className="text-lg font-bold text-black">{subject?.T}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black/60">P</p>
                    <p className="text-lg font-bold text-black">{subject?.P}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black/60">Credit</p>
                    <p className="text-lg font-bold text-black">
                      {parseInt(subject?.credit)}
                    </p>
                  </div>
                </div>

                <div className="flex w-3/5 justify-around rounded-lg bg-white p-2 shadow-soft">
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
                      {subject?.total_marks}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <Badge
              variant="secondary"
              className="bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
            >
              {subject.category}
            </Badge>

            <Badge
              variant="secondary"
              className="bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
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
                <DownloadCloud className="h-4 w-4" />
                Syllabus
              </a>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default SubjectShowCard
