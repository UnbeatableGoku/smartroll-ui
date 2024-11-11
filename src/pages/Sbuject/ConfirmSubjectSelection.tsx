import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Grip, GripVertical, Lock, X } from 'lucide-react'

import { ScrollArea } from '@components/ui/scroll-area'

const ConfirmSubjectSelection = ({
  isPanelOpen,
  setIsPanelOpen,
  togglePanel,
  selectedSemester,
  handleSubjectSelection,
  draggable = false,
}: any) => {
  // Static data for subjects
  const [subjects, setSubjects] = useState([
    {
      slug: 'math101',
      subject_name: 'Mathematics I',
      subject_code: 'MTH101',
      category: 'Core',
    },
    {
      slug: 'phy101',
      subject_name: 'Physics I',
      subject_code: 'PHY101',
      category: 'Core',
    },
    {
      slug: 'cs101',
      subject_name: 'Computer Science',
      subject_code: 'CS101',
      category: 'Core',
    },
    {
      slug: 'eng101',
      subject_name: 'English',
      subject_code: 'ENG101',
      category: 'Elective',
    },
  ])

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Handle drag start
  const onDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  // Handle drop
  const onDrop = (index: number) => {
    if (draggedIndex !== null) {
      const updatedSubjects = [...subjects]
      const [movedSubject] = updatedSubjects.splice(draggedIndex, 1)
      updatedSubjects.splice(index, 0, movedSubject)
      setSubjects(updatedSubjects)
      setDraggedIndex(null)
    }
  }
  useEffect(() => {
    console.log(subjects.map((subject) => subject.subject_name))
  }, [subjects])
  const onHandleClick = () => {
    const subject_slug = subjects.map((subject) => subject.slug)
    handleSubjectSelection(selectedSemester, subject_slug)
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
        className={`fixed inset-y-0 right-0 z-30 w-full transform border-l bg-background/80 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out sm:w-96 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
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
                ? subjects.map((subject, index) => (
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
                : subjects.map((subject) => (
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
          <div className="border-t p-4">
            <Button
              className="w-full"
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
