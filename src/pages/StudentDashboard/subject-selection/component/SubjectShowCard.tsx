import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Download, DownloadCloud, Users } from 'lucide-react'

import { Button } from '@components/ui/button'

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
              ? `bg-white`
              : `border-bg-blue-600/20 border bg-blue-600/20`
            : `bg-white`
        }`}
        onClick={() => {
          isSubjectSave ? null : toggleSubjectSelection(subject, group_slug)
        }}
      >
        <div className="mt-0 flex flex-row items-center justify-between border-b px-3 py-3 lg:mt-3 lg:px-6">
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] font-semibold tracking-tight text-black md:text-[18px]">
              {subject?.subject_name}{' '}
            </span>
            <span className="text-xs text-gray-600">{subject?.category}</span>
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className="flex w-full flex-row justify-between gap-4 border-b px-3 py-3 lg:px-6 lg:py-2">
            <div className="space-y-1">
              <p className="text-sm text-black/60">Semester</p>
              <p className="text-sm text-black lg:text-base">
                {subject.sem_year}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-black/60 lg:text-sm">Code</p>
              <div className="flex justify-between gap-2">
                <p className="text-sm text-black lg:text-base">
                  {subject?.subject_code}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-black/60 lg:text-sm">Type</p>
              <p className="text-sm text-black lg:text-base">
                {subject?.is_theory
                  ? 'Theory'
                  : subject?.is_practical
                    ? 'Practical'
                    : 'Semi-Practical'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3 px-3 py-3 lg:px-6 lg:pb-4 lg:pt-2">
            <Button
              variant={'submit'}
              size={'sm'}
              onClick={(e) => {
                e.stopPropagation()
                const fileUrl = `https://s3-ap-southeast-1.amazonaws.com/gtusitecirculars/Syallbus/${subject.subject_code}.pdf`
                const link = document.createElement('a')
                link.href = fileUrl
                link.download = `${subject.subject_code}.pdf` // optional: specify file name
                link.target = '_blank' // optional: open in new tab instead
                link.click()
              }}
            >
              <Download className="h-4 w-4" />
              <span>Syllabus</span>
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}

export default SubjectShowCard
