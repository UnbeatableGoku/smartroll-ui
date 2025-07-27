import { DownloadCloud, FileText } from 'lucide-react'

import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'

interface CourseCardProps {
  toggleSubjectSelection: (subject: any) => void
  subject: any
  selectedSubjects: Array<[]>
  isSubjectLock: any
  setIsSubjectLock: any
  index: number
  similarSubjects: Array<[]>
}

const SbujectDetailCard = ({
  subject,
  toggleSubjectSelection,
  selectedSubjects,
  isSubjectLock,
}: CourseCardProps) => {
  return (
    <Card
      key={subject.slug}
      className={`relative cursor-pointer overflow-hidden border-none bg-[#F7F7F7] shadow-soft transition-all duration-300 ${
        selectedSubjects.some((d: any) => d.slug === subject?.slug)
          ? isSubjectLock
            ? `bg-[#F7F7F7]`
            : `border-bg-blue-600/20 border bg-blue-600/20`
          : `bg-[#F7F7F7]`
      } `}
      onClick={() => {
        if (isSubjectLock) {
          null
        } else {
          if (
            subject?.similar_subjects &&
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
      {isSubjectLock &&
        selectedSubjects.some(
          (selectedsubject: any) => selectedsubject.slug === subject.slug,
        ) && (
          <>
            <div
              className={`absolute right-2 ${subject?.is_technical != null ? (subject?.is_technical ? 'top-2' : 'top-9') : 'top-2'} rounded-full bg-[#F99704] px-2 py-1 text-xs font-semibold text-white`}
            >
              Priority - {subject.priority}
            </div>
            <div>
              {subject?.is_technical != null && (
                <div
                  className={`absolute right-2 top-2 rounded-full ${subject?.is_technical ? 'hidden bg-[#F99704]' : 'bg-[#be0205] text-white'} px-2 py-1 text-xs font-semibold`}
                >
                  {subject?.is_technical ? 'Tech' : 'Non-tech'}
                </div>
              )}
            </div>
          </>
        )}

      <div>
        {subject?.is_technical != null && (
          <div
            className={`absolute right-2 top-2 rounded-full ${subject?.is_technical ? 'hidden bg-[#F99704]' : 'bg-[#be0205] text-white'} px-2 py-1 text-xs font-semibold`}
          >
            {subject?.is_technical ? 'Tech' : 'Non-tech'}
          </div>
        )}
      </div>

      <CardHeader className="mt-0 flex flex-row items-center justify-between px-3 pb-0 lg:mt-3 lg:px-6 lg:pb-3">
        <h2 className="text-sm font-bold tracking-tight text-black md:text-xl">
          {subject?.subject_name}{' '}
        </h2>
      </CardHeader>
      <CardContent className="space-y-2 px-3 py-3 lg:space-y-6 lg:px-6 lg:py-6">
        <p className="hidden text-2xl font-bold text-black sm:block md:block lg:block">
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
              <div className="flex w-2/5 justify-around rounded-lg bg-white p-2 shadow-soft">
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
            className="bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
          >
            {subject?.category}
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-[#0261BE] bg-white text-[#0261BE] hover:bg-[#0261BE] hover:text-white"
                size={'sm'}
                onClick={(e: any) => e.stopPropagation()}
              >
                <FileText className="h-4 w-4" />
                Other faculties
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl text-black">
                  {subject.subject_name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ScrollArea
                  className={`${subject.teachers.length > 0 ? 'h-64' : 'h-auto'} `}
                >
                  <div className="space-y-4">
                    <ul className="list-disc space-y-2 pl-4 text-black">
                      {subject.teachers.length > 0 ? (
                        subject.teachers.map((teacher: any) => (
                          <li>{teacher.profile__name} </li>
                        ))
                      ) : (
                        <li>No teacher have selected this subject </li>
                      )}
                    </ul>
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
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
  )
}

export default SbujectDetailCard
