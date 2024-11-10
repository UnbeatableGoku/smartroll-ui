import React, { useEffect, useState } from 'react'

import SubjectCard from './SubjectCard'
import useStream from '@components/common/uploadTimeTable/useStream'

import useSubjectSelection from './hooks/useSubjectSelection'

import { BookOpen } from 'lucide-react'
import StreamSelection from '@components/common/uploadTimeTable/StreamSelection'
import SemesterSelection from '@components/common/uploadTimeTable/SemesterSelection'
import AcademicYear from '@components/common/uploadTimeTable/AcademicYear'
import { Button } from '@components/ui/button'
import ConfirmSubjectSelection from './ConfirmSubjectSelection'

const SubjectSelection = () => {

  const { academicYears, handleOnValueChangeAcademicYear, handleOnValueChangeSemenster, handleOnValueChangeStreams, loadSemesterByStream, selectedSubjects, selectedDivision, selectedSemester, selectedStream, selectedYear, semester, setSelectedSubjects, subjects, toggleSubjectSelection } = useSubjectSelection()
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

        <div className='flex flex-col md:flex-row items-center'>
          <div className="flex w-full flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
            {/* Stream Selection Card */}
            {stream && (
              <>
                <div className="relative w-full md:w-[240px] lg:w-[320px]">
                  <StreamSelection
                    title="Stream"
                    selectedValue={selectedStream}
                    onValueChange={handleOnValueChangeStreams}
                    placeholder="Select Stream"
                    data={stream}
                  />
                  {/* Connecting Lines */}
                  <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
                  <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
                </div>
              </>
            )}
            <div className="relative w-full md:w-[240px] lg:w-[320px]">
              {/* Semester Selection Card */}
              <SemesterSelection
                title="Semester"
                selectedValue={selectedSemester}
                selectedValue2={selectedStream}
                onValueChange={handleOnValueChangeSemenster}
                placeholder="Select Semester"
                data={semester}
              />
              {/* Connecting Lines */}
              <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
              <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
            </div>



            {/* Year Selection Card */}
            <div className="relative w-full md:w-[240px] lg:w-[320px]">
              <AcademicYear
                title="Academic Year"
                selectedValue={selectedYear}
                selectedValue2={selectedStream}
                onValueChange={handleOnValueChangeAcademicYear}
                placeholder="Select Year"
                data={academicYears}
              />
            </div>
          </div>
          <Button onClick={togglePanel} className="fixed top-32 right-24 z-10">
            <BookOpen className="mr-2 h-4 w-4" />
            Subjects
            <span className="ml-2 bg-gray-100 text-gray-900 rounded-full px-2 py-1 text-xs font-bold">
              {subjects.length}
            </span>
          </Button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {
            subjects.length > 0 ? (
              <>
                {
                  subjects.map((subject, index) => {
                    return (
                      <SubjectCard subject={subject} toggleSubjectSelection={toggleSubjectSelection} selectedSubjects={selectedSubjects}>

                      </SubjectCard>
                    )
                  })
                }
              </>) : (<></>)
          }




        </div>


      </div>
      {subjects.length > 0 && <ConfirmSubjectSelection isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} togglePanel={togglePanel} subjects = {subjects}></ConfirmSubjectSelection>}
    </>
  )
}

export default SubjectSelection
