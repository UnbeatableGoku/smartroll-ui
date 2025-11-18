import { useState } from 'react'

import { Download, Users } from 'lucide-react'

import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const [openDailog, setOpenDialog] = useState(false)

  const handleCloseDailog = (e: any) => {
    e.stopPropagation()
    setOpenDialog(false)
  }
  return (
    <Card
      key={subject.slug}
      className={`relative cursor-pointer overflow-hidden border-none bg-[#F7F7F7] !p-0 shadow-soft transition-all duration-300 ${
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
              setTimeout(() => setOpenDialog(true), 0) // let dropdown fully close
            }}
          >
            <Users className="h-4 w-4" />
            <span>Faculties</span>
          </Button>
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
        <Dialog open={openDailog} onOpenChange={setOpenDialog}>
          <DialogContent
            className="bg-white sm:max-w-[425px]"
            onClick={(e) => e.stopPropagation()}
          >
            <DialogClose asChild>
              <button
                className="absolute right-3 top-3 rounded-full p-2 transition hover:bg-gray-200"
                onClick={(e) => handleCloseDailog(e)} // ✅ Prevent card trigger
              >
                ✕
              </button>
            </DialogClose>

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
      </div>
    </Card>
  )
}

export default SbujectDetailCard
