import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CalendarIcon, GripVertical, Lock, X } from 'lucide-react'
import { format } from "date-fns"
import { ScrollArea } from '@components/ui/scroll-area'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { cn } from '@utils'

const ConfirmSubjectSelection = ({
  isPanelOpen,
  setIsPanelOpen,
  togglePanel,
  selectedSemester,
  selectedSubjects,
  handleSubjectSelection,
  draggable = false,
  onDrop,
  setDraggedIndex,
  save_teacher_subject_choice,
  isSubjectLock
}: any) => {
  const [date, setDate] = useState<Date>()
  const [open, setOpen] = useState(false)



  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setOpen(false)
  }




  // Handle drag start
  const onDragStart = (index: number) => {
    setDraggedIndex(index)
  }



  useEffect(() => {
    console.log(selectedSubjects.map((subject: any) => subject.slug))
  }, [selectedSubjects])

  const onHandleClick = () => {
    const subject_slug = selectedSubjects.map((subject: any) => subject.slug)
    
    if (draggable == false) {
      const time_stamp = date?.getTime()
      handleSubjectSelection(selectedSemester, subject_slug,time_stamp)
    }
    else {
      console.log("Dragging Mode")
      save_teacher_subject_choice(subject_slug)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={togglePanel}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-full transform border-l bg-background/80 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out sm:w-96 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Selected Subjects</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => {
                  setIsPanelOpen(!isPanelOpen)
                }}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close panel</span>
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {draggable
                ? selectedSubjects.map((subject: any, index: any) => (
                  <>
                    <Card
                      key={subject.slug}
                      className="group"
                      draggable
                      onDragStart={() => onDragStart(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => onDrop(index)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          {/* Grip Icon for Draggable Indicator */}
                          <div className="flex items-center space-x-2">
                            <GripVertical className="cursor-grab text-muted-foreground" />
                            <CardTitle className="text-lg font-semibold leading-none">
                              {subject.subject_name}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Subject Code - {subject.subject_code}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        Type: {subject.category}
                      </CardFooter>
                    </Card>
                  </>
                ))
                : selectedSubjects.map((subject: any) => (
                  <Card key={subject.slug} className="group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold leading-none">
                          {subject.subject_name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Subject Code - {subject.subject_code}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                      Type: {subject.category}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </ScrollArea>


          { draggable == false && <div className="w-full px-4 border-t bg-background">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal my-3",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Set timeline for subject selection</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            className="bg-popover w-full"
          />
        </PopoverContent>
      </Popover>
    </div>}
          <div className=" p-4">
            <Button
              className={`w-full ${isSubjectLock} ? 'disabled' : 'enabled'`}
              size="lg"
              onClick={() => {
                onHandleClick()
              }}
            >
              <Lock className="mr-2 h-4 w-4" />
              Lock Subjects
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmSubjectSelection
