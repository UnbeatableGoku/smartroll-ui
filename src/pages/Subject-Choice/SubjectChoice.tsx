import React, { useEffect, useState } from 'react'




import { BookOpen } from 'lucide-react'
import { Skeleton } from '@components/ui/skeleton'
import Button from '@components/common/form/button'
import Selection from '@components/common/form/selectiom/Selection'
import useSubjectSelection from '@pages/Sbuject/hooks/useSubjectSelection'
import useStream from '@components/common/uploadTimeTable/useStream'
import SubjectCard from '@pages/Sbuject/SubjectCard'
import { Card, CardHeader, CardTitle } from '@components/ui/card'
import ConfirmSubjectSelection from '@pages/Sbuject/ConfirmSubjectSelection'
import useSubjectChoice from '@pages/TeacherDashboard/pages/Subject-Choice/hooks/useSubjectChoice'








 

const SubjectChoice = () => {
  const {
    handleSubjectSelection,
    isSubjectLock,
    setIsSubjectLock,
  } = useSubjectSelection()

  const  {selectedSubjects,selectedSemester,semesters,subjects,toggleSubjectSelection,handleOnValueChangeSemenster,handleOnValueChangeStreams,selectedStream,setSelectedSubjects,onDrop,draggedIndex,setDraggedIndex} = useSubjectChoice()
  const { stream, handleStream } = useStream()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const togglePanel = () => setIsPanelOpen(!isPanelOpen)

  useEffect(() => {
    handleStream()
  }, [])
  return (
    <div className="flex w-full flex-col space-y-4">
      {/* time table selection */}

      <div className="flex flex-col flex-wrap items-center justify-evenly space-y-5 lg:flex-col">
        <div className="flex w-full flex-col items-center justify-center space-y-4 md:w-auto md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
          {/* Stream Selection Card */}
          {stream && (
            <>
              <div className="relative w-full md:w-[240px] lg:w-[320px]">
                <Selection
                  title="Stream"
                  selectedValue={selectedStream}
                  selectedValue2=" "
                  onValueChange={handleOnValueChangeStreams}
                  placeholder="Select Stream"
                  data={stream}
                  optionTitle={null}
                />

                {/* Connecting Lines */}
                <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
                <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
              </div>
            </>
          )}
          <div className="relative w-full md:w-[240px] lg:w-[320px]">
            {/* Semester Selection Card */}

            <Selection
              title="Semester"
              selectedValue={selectedSemester}
              selectedValue2={selectedStream}
              onValueChange={handleOnValueChangeSemenster}
              placeholder="Select Semester"
              data={semesters}
              optionTitle={'Semester'}
            />
          </div>
        </div>
        <Button onClick={togglePanel} className="z-10 mt-3 w-full lg:w-auto">
          <BookOpen className="mr-2 h-4 w-4" />
          Select Subjects
          <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900">
            {selectedSubjects.length}
          </span>
        </Button>
      </div>

      <div className="p-4">
        {/* Check if subjects is null or loading */}
        {subjects === null ? (
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="sm:h-18 h-20 w-full" />
            <Skeleton className="sm:h-18 h-20 w-full" />
            <Skeleton className="sm:h-18 h-20 w-full" />
            <Skeleton className="sm:h-18 h-20 w-full" />
            <Skeleton className="sm:h-18 h-20 w-full" />
            <Skeleton className="sm:h-18 h-20 w-full" />
            <Skeleton className="sm:h-18 h-20 w-full" />
          </div>
        ) : (
          // If subjects is not null, display them in the grid
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Check if subjects are available */}
            {subjects.length > 0 ? (
              subjects.map((subject:any, index:any) => (
                <SubjectCard
                  key={index}
                  subject={subject}
                  toggleSubjectSelection={toggleSubjectSelection}
                  selectedSubjects={selectedSubjects}
                  isSubjectLock={isSubjectLock}
                  setIsSubjectLock={setIsSubjectLock}
                />
              ))
            ) : (
              <div className="group w-full">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-center text-lg font-semibold leading-none">
                        No Subjects are available for this academic year.
                      </CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmSubjectSelection
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        togglePanel={togglePanel}
        selectedSubjects={selectedSubjects}
        handleSubjectSelection={handleSubjectSelection}
        selectedSemester={selectedSemester}
        draggable={true}
        onDrop = {onDrop}
        setDraggedIndex = {setDraggedIndex}
      ></ConfirmSubjectSelection>
    </div>
  )
}

export default SubjectChoice