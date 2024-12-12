import { useEffect, useState } from 'react'

import { AlertTriangle, BookOpen } from 'lucide-react'
import { Helmet } from 'react-helmet'

import Selection from '@components/common/form/selectiom/Selection'
import useStream from '@components/common/uploadTimeTable/useStream'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'

import ConfirmSubjectSelection from './components/ConfirmSubjectSelection'
import SubjectCard from './components/SubjectCard'
import useSubjectSelection from './hooks/useSubjectSelection'
import UpdateDeadlineDialog from './components/UpdateDeadlineDialog'
import { Alert, AlertTitle } from '@components/ui/alert'

const SubjectSelection = () => {
  const {
    academicYears,
    handleOnValueChangeAcademicYear,
    handleOnValueChangeSemenster,
    handleOnValueChangeStreams,
    selectedSubjects,
    selectedSemester,
    selectedStream,
    selectedYear,
    semesters,
    subjects,
    notTechSubjects,
    deadLine,
    openDeadlineDailog,
    setOpenDeadlineDailog,
    toggleSubjectSelection,
    handleSubjectSelection,
    isSubjectLock,
    setIsSubjectLock,
    unlockSubjectAfterDeadline,
    UnlockSubjectAfterDeadline,
    handleOnCheckForNonTechSubject,
    setDeadLine,
    handleOnClickToUpdateDeadline
  } = useSubjectSelection()
  const { stream, handleStream } = useStream()
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const togglePanel = () => setIsPanelOpen(!isPanelOpen)

  useEffect(() => {
    handleStream()
  }, [])

  return (
    <>
      <Helmet>
        <title>Smart Roll | Subject Selection</title>
      </Helmet>
      <div className="flex w-full flex-col space-y-4">
        {/* time table selection */}
        <div className="flex flex-col flex-wrap items-center justify-evenly">
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

              <div
                className={`${isSubjectLock ? 'hidden' : unlockSubjectAfterDeadline ? 'hidden' : 'block'}`}
              >
                {/* Connecting Lines */}
                <div
                  className={`absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12`}
                />
                <div
                  className={`absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden ${isSubjectLock ? 'hidden' : 'block'}`}
                />
              </div>
            </div>

            {/* Year Selection Card */}
            <div
              className={`relative w-full md:w-[240px] lg:w-[320px] ${isSubjectLock ? 'hidden' : unlockSubjectAfterDeadline ? 'hidden' : 'block'}`}
            >
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
          {deadLine && <Alert className="mt-5 w-full border-yellow-500 bg-yellow-50 dark:border-red-400 dark:bg-red-900">
                <div className="">
                  <AlertTitle className="flex items-center space-x-4 text-yellow-800 dark:text-white">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                    <span>Decision Deadline : {deadLine} </span>
                  </AlertTitle>
                </div>
              </Alert>}
          {isSubjectLock == false && selectedSubjects.length > 0 && (
            <div className={`${isSubjectLock ? 'hidden' : 'block'} w-full`}>
              <Button
                onClick={togglePanel}
                className={`z-10 mt-3 w-full`}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Lock Subjects
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900">
                  {selectedSubjects.length}
                </span>
              </Button>
            </div>
          )}
          <div className='flex flex-col  w-full items-center gap-x-8 justify-center'>
          

          {unlockSubjectAfterDeadline == true && isSubjectLock == true && (
            <div className='w-full'>
              <Button
                onClick={UnlockSubjectAfterDeadline}
                className={`z-10 mt-3 w-full`}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Unlock Subject Selection
              </Button>
            </div>
          )}
          {
            selectedSemester &&
            <UpdateDeadlineDialog semesterSlug={selectedSemester} deadline={deadLine} setDeadLine={setDeadLine} handleOnClickToUpdateDeadline={handleOnClickToUpdateDeadline} openDeadlineDailog={openDeadlineDailog} setOpenDeadlineDailog={setOpenDeadlineDailog}></UpdateDeadlineDialog> 
          }
          </div>
          


            
            
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
            </div>
          ) : // If subjects is not null, check if subjects are available
          subjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject, index) => (
                <SubjectCard
                  key={index}
                  subject={subject}
                  toggleSubjectSelection={toggleSubjectSelection}
                  selectedSubjects={selectedSubjects}
                  isSubjectLock={isSubjectLock}
                  setIsSubjectLock={setIsSubjectLock}
                  draggable={false}
                  index={index}
                />
              ))}
            </div>
          ) : (
            // If no subjects are available, show a message
            <div className="group w-full">
              <Card>
                <CardHeader className="pb-2"></CardHeader>
                <CardContent className="text-center">
                  No Subjects are available for this academic year.
                </CardContent>
              </Card>
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
          isSubjectLock={isSubjectLock}
          notTechSubjects={notTechSubjects}
          handleOnCheckForNonTechSubject={handleOnCheckForNonTechSubject}
        ></ConfirmSubjectSelection>
      </div>
    </>
  )
}

export default SubjectSelection
