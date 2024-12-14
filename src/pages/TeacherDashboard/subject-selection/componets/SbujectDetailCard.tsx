import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { DownloadCloud, FileText } from 'lucide-react'





interface CourseCardProps {
    toggleSubjectSelection: (subject: any) => void
    subject: any
    selectedSubjects: Array<[]>
    isSubjectLock: any
    setIsSubjectLock: any
    index: number,
    similarSubjects: Array<[]>
  }

const SbujectDetailCard = ({subject,toggleSubjectSelection,selectedSubjects,isSubjectLock}:CourseCardProps) => {
    
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
        if(isSubjectLock){
          null
        }
        else{
          if(subject?.similar_subjects && !selectedSubjects.some((d:any)=>d.slug === subject?.slug)){
            const stream_codes = subject.similar_subjects.map((data:any)=>{
              return data.branch_name
            })
            alert(`Same subject from\n ${stream_codes.join('\n')} \n will also be selected`)
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
              className={`absolute right-2 ${subject?.is_technical != null ? (subject?.is_technical ? 'top-2' : 'top-9') : 'top-2'} top-6 rounded-full bg-[#ffa31a] px-2 py-1 text-xs font-semibold text-black`}
            >
             Priority - {subject.priority}
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
      

      

      <CardHeader className="mt-0 flex flex-row items-center justify-between px-3 pb-0 lg:mt-3 lg:px-6 lg:pb-3">
        <h2 className="text-sm font-bold tracking-tight md:text-xl">
          {subject?.subject_name}{' '}
        </h2>
      </CardHeader>
      <CardContent className="space-y-2 px-3 py-3 lg:space-y-6 lg:px-6 lg:py-6">
        <p className="hidden text-2xl font-bold sm:block md:block lg:block">
          Sem : {subject.sem_year}
        </p>
        <div className="flex flex-row justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase text-white/60 lg:text-sm">Type</p>
            <p className="text-sm font-semibold lg:text-xl">
              {subject?.is_theory
                ? 'Theory'
                : subject?.is_practical
                  ? 'Practical'
                  : 'Semi-Practical'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase text-white/60 lg:text-sm">
              Subject Code
            </p>
            <div className="flex justify-between gap-2">
              <p className="w-full text-right text-sm font-semibold lg:text-center lg:text-xl">
                {subject?.subject_code}
              </p>
            </div>
          </div>
          <div className="hidden space-y-1 sm:block md:block lg:block">
            <p className="text-sm uppercase text-white/60">Effective Year</p>
            <p className="text-right text-xl font-semibold">
              {subject?.eff_from}
            </p>
          </div>
        </div>

        <div className="w-full justify-between">
          <div className="w-full">
            <div className="flex w-full flex-row gap-x-3 text-center">
                {/* display the subject total  L T P and total */}
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
                {/* display the subject total  E M I V and total */}
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

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <Badge
            variant="secondary"
            className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
          >
            {subject?.category}
            
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" size={'sm'}
                onClick={(e:any)=>e.stopPropagation()}
              >
                <FileText className="h-4 w-4" />
                Other faculties
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className='dark:text-white text-xl'>{subject.subject_name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <ScrollArea className={`${subject.teachers.length > 0 ? 'h-64':'h-auto'} `}>
                <div className="space-y-4">
                  <ul className="list-disc pl-4 space-y-2 dark:text-white">
                    {
                     subject.teachers.length > 0 ?  subject.teachers.map((teacher:any)=>(
                        <li>{teacher.profile__name} </li>
                      )) : (
                        <li>No teacher have selected this subject </li>
                      )
                    }
                    
                    
                  </ul>
                </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
          <Badge
            variant="secondary"
            className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
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
              <DownloadCloud className="h-4 w-4 text-white" />
              Syllabus
            </a>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default SbujectDetailCard