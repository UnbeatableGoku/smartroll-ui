import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { CalendarIcon, GripVertical, Lock, X } from 'lucide-react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { cn } from '@utils'

import { Badge } from '@components/ui/badge'
import { Checkbox } from '@components/ui/checkbox'
import { ScrollArea } from '@components/ui/scroll-area'

const ConfirmSubjectSelection = ({
  isPanelOpen,
  setIsPanelOpen,
  togglePanel,
  selectedSemester,
  selectedSubjects,
  handleSubjectSelection,
  draggable = false,
  save_teacher_subject_choice,
  isSubjectLock,
  notTechSubjects,
  handleOnCheckForNonTechSubject,
  similarSubjects,
  subjectList,
  onDragEnd,
}: any) => {
  const [date, setDate] = useState<Date>()
  const [open, setOpen] = useState(false)

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setOpen(false)
  }

  const onHandleClick = () => {
    const subject_slug = selectedSubjects.map((subject: any) => subject.slug)

    if (draggable == false) {
      const time_stamp = date?.getTime()
      handleSubjectSelection(
        selectedSemester,
        subject_slug,
        time_stamp,
        notTechSubjects,
      )
    } else {
      const similar_subject_slug = similarSubjects.map(
        (subject: any) => subject.slug,
      )
      const subject_slug_lst = subjectList.map((subject: any) => subject.slug)
      const final_subject_slug_lst =
        subject_slug_lst.concat(similar_subject_slug)
      save_teacher_subject_choice(final_subject_slug_lst)
    }
    setIsPanelOpen(!isPanelOpen)
  }

  return (
    <>
      {/* Overlay */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-20 w-full bg-black bg-opacity-50"
          onClick={togglePanel}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-full transform border-l bg-white shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out lg:w-full ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b bg-[#F7F7F7] p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-black lg:text-4xl">
                Adjust Priority By Drag & Drop
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:bg-[#F7F7F7]"
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
              {draggable ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="subjects">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {subjectList.map((subject: any, index: number) => (
                          <Draggable
                            key={subject.slug}
                            draggableId={subject.slug}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                              >
                                <Card className="group bg-[#F7F7F7] shadow-soft">
                                  <CardHeader className="pb-2">
                                    <div className="flex w-full items-start justify-between">
                                      <div className="flex w-full items-center space-x-2">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="cursor-grab text-black" />
                                        </div>
                                        <CardTitle className="flex w-full justify-between gap-x-2 text-lg font-bold leading-none lg:text-lg">
                                          <div className="text-black">
                                            {subject.subject_name}
                                          </div>
                                          <div>
                                            <Badge
                                              variant="secondary"
                                              className={`bg-[#0261BE] text-white hover:bg-[#0261BE]/80`}
                                            >
                                              <span className="hidden lg:block">
                                                Priority -{' '}
                                              </span>{' '}
                                              {index + 1}
                                            </Badge>
                                          </div>
                                        </CardTitle>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="flex justify-between pb-2">
                                    <div className="flex flex-col text-sm text-black lg:flex-row lg:space-x-4">
                                      <span className="text-xs font-semibold text-black lg:text-sm">
                                        Stream Code -{' '}
                                        {subject.stream_code + '  | '}
                                      </span>
                                      <span className="text-xs font-semibold text-black lg:text-sm">
                                        Subject Code -{' '}
                                        {subject.subject_code + '  | '}
                                      </span>
                                      <span className="text-xs lg:text-sm">
                                        Type: {subject.category}
                                      </span>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Badge
                                        variant="secondary"
                                        className={`${subject.is_technical ? 'hidden bg-[#0261BE]' : 'w-20 bg-red-500 text-white'} hover:opacity-80`}
                                      >
                                        {!subject.is_technical
                                          ? 'Non-Tech.'
                                          : ''}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
                                      >
                                        Sem -{subject?.sem_year}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                selectedSubjects.map((subject: any) => (
                  <Card
                    key={subject.slug}
                    className="group bg-[#F7F7F7] shadow-soft"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={notTechSubjects.includes(subject.slug)}
                            onCheckedChange={() => {
                              handleOnCheckForNonTechSubject(subject.slug)
                            }}
                          />
                          <CardTitle className="text-lg font-semibold leading-none text-black">
                            {subject.subject_name}
                          </CardTitle>
                        </div>
                        {notTechSubjects.includes(subject.slug) ? (
                          <div className="rounded-full bg-[#0261BE] px-2 py-1 text-xs font-semibold text-white">
                            Tech.
                          </div>
                        ) : (
                          <div className="w-24 rounded-full bg-red-500 px-2 py-1 text-center text-xs font-semibold text-white">
                            Non-tech.
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm text-black">
                        <span>Subject Code - {subject.subject_code}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="text-xs text-black">
                      Type: {subject.category}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {draggable == false && (
            <div className="w-full border-t bg-white px-4">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'my-3 w-full justify-start bg-white text-left font-normal text-black',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                    {date ? (
                      format(date, 'PPP')
                    ) : (
                      <span>Set timeline for subject selection</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    className="w-full bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          <div className="bg-white p-4">
            <Button
              className={`w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80 ${isSubjectLock} ? 'disabled:opacity-50' : ''`}
              size="lg"
              disabled={isSubjectLock}
              onClick={() => {
                onHandleClick()
              }}
            >
              <Lock className="mr-2 h-4 w-4" />
              {draggable ? 'Save Choices' : 'Lock Subject'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmSubjectSelection
