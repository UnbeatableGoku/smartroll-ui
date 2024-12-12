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
import {
  CalendarIcon,
  GripVertical,
  Lock,
  X,
} from 'lucide-react'

import { cn } from '@utils'

import { Badge } from '@components/ui/badge'
import { Checkbox } from '@components/ui/checkbox'
import { ScrollArea } from '@components/ui/scroll-area'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
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
      const similar_subject_slug = similarSubjects.map((subject:any)=> subject.slug)
      const subject_slug_lst = subjectList.map((subject:any)=> subject.slug )
      const final_subject_slug_lst = subject_slug_lst.concat(similar_subject_slug)
      save_teacher_subject_choice(final_subject_slug_lst)
    }
    setIsPanelOpen(!isPanelOpen)
  }


  return (
    <>
      {/* Overlay */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 w-full"
          onClick={togglePanel}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-full transform border-l bg-background/80 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out lg:w-full  ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-4xl font-bold">Adjust Priority By Drag & Drop</h2>
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
                ? (
                  <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="subjects">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {subjectList.map((subject:any, index:number) => (
                          <Draggable key={subject.slug} draggableId={subject.slug} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                              >
                                <Card className="group">
                                  <CardHeader className="pb-2">
                                    <div className="flex w-full items-start justify-between">
                                      <div className="flex w-full items-center space-x-2">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="cursor-grab text-muted-foreground" />
                                        </div>
                                        <CardTitle className="flex w-full justify-between gap-x-2 text-lg lg:text-lg font-bold leading-none">
                                          <div>{subject.subject_name}</div>
                                          <div>
                                            <Badge
                                              variant="secondary"
                                              className={`bg-[#ffa31a] hover:bg-[#ffa31a]/70 dark:text-black`}
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
                                  <CardContent className="pb-2 flex justify-between">
                                    <div className="flex flex-col lg:flex-row lg:space-x-4 text-sm text-muted-foreground">
                                    
                                      <span className='font-semibold text-white text-xs lg:text-sm'>Stream Code - {subject.stream_code + '  | '}</span> 
                                      <span className='font-semibold text-white text-xs lg:text-sm'>Subject Code - {subject.subject_code + '  | '}</span> 
                                      <span className='text-xs lg:text-sm'>Type: {subject.category}</span> 
                                    </div>
                                    <div className="flex space-x-2">
                                      <Badge
                                        variant="secondary"
                                        className={`bg-[#f1141f] ${subject.is_technical ? 'hidden bg-[#ffa31a]' : 'w-20 bg-[#f1141f] dark:text-white'} hover:bg-[#f1141f]/30`}
                                      >
                                        {!subject.is_technical ? 'Non-Tech.' : ''}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                                      >
                                        Sem -{subject?.sem_year}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                  {/* <CardFooter className="flex justify-between text-xs text-muted-foreground">
                                    <span>Type: {subject.category}</span>
                                  </CardFooter> */}
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
                )

                : selectedSubjects.map((subject: any) => (
                  <Card key={subject.slug} className="group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={notTechSubjects.includes(subject.slug)}
                            onCheckedChange={() => {
                              handleOnCheckForNonTechSubject(subject.slug)
                            }}
                          />
                          <CardTitle className="text-lg font-semibold leading-none">
                            {subject.subject_name}
                          </CardTitle>
                        </div>
                        {notTechSubjects.includes(subject.slug) ? (
                          <div className="rounded-full bg-[#ffa31a] px-2 py-1 text-xs font-semibold text-black">
                            Tech.
                          </div>
                        ) : (
                          <div className="w-24 rounded-full bg-[#e51717] px-2 py-1 text-center text-xs font-semibold text-black dark:text-white">
                            Non-tech.
                          </div>
                        )}
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

          {draggable == false && (
            <div className="w-full border-t bg-background px-4">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'my-3 w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, 'PPP')
                    ) : (
                      <span>Set timeline for subject selection</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    className="w-full bg-popover"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          <div className="p-4">
            <Button
              className={`w-full ${isSubjectLock} ? 'disabled' : 'enabled'`}
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
