import React, { useCallback, useState } from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'





interface CourseCardProps {
  toggleSubjectSelection : (subject:any) => void;
  subject: any
  selectedSubjects : string[];
  isSubjectLock:any,
  setIsSubjectLock:any
}
const SubjectCard = ({ subject,toggleSubjectSelection,selectedSubjects,isSubjectLock,setIsSubjectLock}: CourseCardProps) => {
  
  
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])
  



  return (
    <>
     <Card 
      key={subject.slug}
      className={`relative cursor-pointer transition-all duration-300 overflow-hidden
        ${selectedSubjects.some((d:any) => d.slug === subject?.slug) 
          ? `bg-zinc-800` 
          : `dark:bg-black`
        } text-white`}
      onClick={() => {isSubjectLock ? null : toggleSubjectSelection(subject);console.log(isSubjectLock)}}
    >
     {/* {selectedSubjects.includes(subject?.slug) && (
            <div className="absolute top-2 right-2 bg-green-800 text-gray-200 text-xs font-semibold py-1 px-2 rounded-full">
              Selected
            </div>
          )} */}
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">{subject?.subject_name} </h2>  
        
        
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 ">
          <div className="space-y-1">
            <p className="text-sm uppercase text-white/60 ">Type</p>
            
            <p className="text-xl font-semibold">{subject?.is_theory ? 'theory' : (subject?.is_practical ? 'Practical' : 'Semi-Practical')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm uppercase text-white/60 ">Subject Code</p>
            <p className="text-xl font-semibold md:text-center">{subject?.subject_code}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm uppercase text-white/60">Effective Year</p>
            <p className="text-xl font-semibold md:text-right">{subject?.eff_from}</p>
          </div>
        </div>

        <div className="flex justify-between w-full ">
          <div className='w-full'>
          
          <div className="flex flex-row w-full text-center gap-x-3">
            
                <div className="rounded-lg bg-white/10  p-2 w-2/5 flex  justify-around">
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
                    <p className="text-lg font-bold">{parseInt(subject?.credit)}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-white/10  p-2 w-3/5 flex  justify-around">
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

        <div className="flex  flex-wrap gap-2 items-center justify-between">
          
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
            >
              {subject?.category}
            </Badge>
          
            <HoverCard >
            <HoverCardTrigger asChild>
              <div onClick={stopPropagation}>
                <Info className='text-white cursor-pointer' />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 z-10 dark:bg-black border rounded-md p-2" onClick={stopPropagation}>
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Course Information</h4>
                  <p className="text-sm">
                    This course is a Professional Elective. It covers advanced topics in the field and contributes to your specialization.
                  </p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Hover for more details about the course structure and evaluation.
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


export default SubjectCard
