import React, { useEffect, useState } from 'react'

import SubjectCard from './SubjectCard'
import useStream from '@components/common/uploadTimeTable/useStream'

import useSubjectSelection from './hooks/useSubjectSelection'

import { BookOpen } from 'lucide-react'

import { Button } from '@components/ui/button'
import ConfirmSubjectSelection from './ConfirmSubjectSelection'
import Selection from '@components/common/form/selectiom/Selection'
import { Skeleton } from '@components/ui/skeleton'
import { Card, CardHeader, CardTitle } from '@components/ui/card'

const SubjectSelection = () => {

  const { academicYears, handleOnValueChangeAcademicYear, handleOnValueChangeSemenster, handleOnValueChangeStreams, loadSemesterByStream, selectedSubjects, selectedDivision, selectedSemester, selectedStream, selectedYear, semesters, setSelectedSubjects, subjects, toggleSubjectSelection, handleSubjectSelection, isSubjectLock, setIsSubjectLock } = useSubjectSelection()
  const { stream, handleStream } = useStream()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const togglePanel = () => setIsPanelOpen(!isPanelOpen)





  useEffect(() => {
    handleStream()
  }, [])



  return (
    <>
      <div className="flex w-full flex-col space-y-4">
        {/* time table selection */}

        <div className='flex flex-col lg:flex-row items-center flex-wrap justify-evenly'>
          <div className="flex w-full md:w-auto flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
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
                optionTitle={"Semester"}
              />

              <div className={`${isSubjectLock ? "hidden" : 'block'}`}>
                {/* Connecting Lines */}
                <div className={`absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12 `} />
                <div className={`absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden ${isSubjectLock ? "hidden" : 'block'}`} />
              </div>
            </div>



            {/* Year Selection Card */}
            <div className={`relative w-full md:w-[240px] lg:w-[320px] ${isSubjectLock ? "hidden" : 'block'}`}>
              <Selection
                title="Academic Year"
                selectedValue={selectedYear}
                selectedValue2={selectedSemester}
                onValueChange={handleOnValueChangeAcademicYear}
                placeholder="Select Year"
                data={academicYears}
                optionTitle={null}
              />

            </div>
          </div>
          <Button onClick={togglePanel} className="z-10 mt-3 w-full lg:w-auto">
            <BookOpen className="mr-2 h-4 w-4" />
             Lock Subjects
            <span className="ml-2 bg-gray-100 text-gray-900 rounded-full px-2 py-1 text-xs font-bold">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Check if subjects are available */}
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
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
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold leading-none text-center">
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



        {selectedSubjects.length > 0 && <ConfirmSubjectSelection isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} togglePanel={togglePanel} selectedSubjects={selectedSubjects} handleSubjectSelection={handleSubjectSelection} selectedSemester={selectedSemester}></ConfirmSubjectSelection>}
      </div>
    </>
  )
}

export default SubjectSelection
