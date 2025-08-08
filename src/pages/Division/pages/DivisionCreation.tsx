import { useEffect } from 'react'

import useDivisionCreation from '../hooks/useDivisionCreation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { GripVertical } from 'lucide-react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import Selection from '@components/common/form/selectiom/Selection'
import useStream from '@components/common/uploadTimeTable/useStream'
import { Separator } from '@components/ui/separator'

import DivisionCreationSuggesition from './DivisionCreationSuggesition'
import StudentListForDivision from './StudentListForDivision'

const DivisionCreation = () => {
  const { stream, handleStream } = useStream()

  const {
    semesters,
    divisions,
    selectedStream,
    selectedSemester,
    isOpenSuggesition,
    setCapacityDivision,
    sujectChoiceGroup,
    maxDivisionCapacity,
    divisionsData,
    activeTab,
    renderStudentList,
    divisionsAlreadyCreated,
    totalStudentsCount,
    isDeadllineReached,
    setActiveTab,
    handleOnValueChangeOfStream,
    handleOnValueChangeOfSemester,
    setIsOpenSuggesition,
    handleOnClickForAcceptSuggestion,
    handleOnClickForDeclineSuggestion,
    handleOnClickForDisplaySuggestion,
    setMaxDivisionCapacity,
    handelOnClickForSaveDivisions,
    onDragEnd,
    updateAvailableCounts,
    setRenderStudentList,
    studentBatchList,
    handleOnClickForDownloadExcel,
  } = useDivisionCreation()

  useEffect(() => {
    handleStream()
  }, [])

  useEffect(() => {
    updateAvailableCounts()
  }, [divisions])

  return (
    <div className="mx-auto bg-white p-4">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center space-y-4 md:w-auto md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
          {stream && (
            <div className="relative w-full md:w-[240px] lg:w-[320px]">
              <Selection
                title="Stream"
                selectedValue={selectedStream}
                selectedValue2=" "
                onValueChange={handleOnValueChangeOfStream}
                placeholder="Select Stream"
                data={stream}
                optionTitle={null}
              />

              <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-[#0261BE]/20 md:block lg:right-[-3rem] lg:w-12" />
              <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-[#0261BE]/20 md:hidden" />
            </div>
          )}
          <div className="relative w-full md:w-[240px] lg:w-[320px]">
            <Selection
              title="Semester"
              selectedValue={selectedSemester}
              selectedValue2={selectedStream}
              onValueChange={handleOnValueChangeOfSemester}
              placeholder="Select Semester"
              data={semesters}
              optionTitle={'Semester'}
            />
          </div>
        </div>

        {renderStudentList && !divisionsAlreadyCreated && (
          <div className="flex w-full gap-x-4">
            <Button
              className="mt-4 w-full bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                setRenderStudentList(!renderStudentList)
              }}
            >
              Change division size
            </Button>
            <Button
              className="mt-4 w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
              onClick={() => handelOnClickForSaveDivisions()}
            >
              Confirm Divisions
            </Button>
          </div>
        )}
        {selectedSemester && !divisionsAlreadyCreated && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col gap-4">
              {!renderStudentList && totalStudentsCount > 0 && (
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-black">
                    Subject Choice Groups
                  </h2>
                  <Droppable droppableId="groups">
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {sujectChoiceGroup
                          .filter((group) => group.availableCount > 0)
                          .map((group, index) => (
                            <Draggable
                              key={group.slug}
                              draggableId={group.slug}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-between rounded bg-white p-2 shadow-soft"
                                >
                                  <div className="flex items-center">
                                    <GripVertical className="mr-2 text-[#0261BE]" />
                                    <span className="text-black">
                                      {group.subjects}
                                    </span>
                                  </div>
                                  <span className="font-semibold text-black">
                                    {group.totalCount}
                                  </span>
                                </li>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                  <Separator className="mt-4" />
                  {totalStudentsCount > 0 && (
                    <div className="mt-3 flex justify-between">
                      <span className="px-4 text-xl font-bold text-black">
                        Total Students
                      </span>
                      <span className="px-3 text-xl font-bold text-black">
                        {totalStudentsCount}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DragDropContext>
        )}

        {selectedSemester &&
          !divisionsAlreadyCreated &&
          !renderStudentList &&
          isDeadllineReached && (
            <div ref={setCapacityDivision}>
              <Card className="bg-white shadow-soft">
                <CardHeader>
                  <CardTitle>
                    <h2 className="text-xl font-semibold text-black">
                      Set Division Capacity Range
                    </h2>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="w-full">
                    <div className="mb-3 flex w-full flex-col justify-center gap-3 lg:flex-row lg:space-x-4">
                      <div className={`w-full`}>
                        <span className="text-black">
                          Maximum Division Count
                        </span>
                        <Input
                          id="maxCount"
                          type="number"
                          value={maxDivisionCapacity}
                          className="border-[#0261BE] bg-white text-black"
                          onChange={(e) => {
                            setMaxDivisionCapacity(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
                      onClick={(e: any) => {
                        e.preventDefault()
                        handleOnClickForDisplaySuggestion()
                      }}
                    >
                      Set Division Capacity
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

        {divisionsData && renderStudentList && (
          <StudentListForDivision
            divisionsData={divisionsData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handelOnClickForSaveDivisions={handelOnClickForSaveDivisions}
            studentBatchList={studentBatchList}
            handleOnClickForDownloadExcel={handleOnClickForDownloadExcel}
            divisionsAlreadyCreated={divisionsAlreadyCreated}
          ></StudentListForDivision>
        )}
      </div>

      {divisionsData && (
        <DivisionCreationSuggesition
          isOpenSuggesition={isOpenSuggesition}
          setIsOpenSuggesition={setIsOpenSuggesition}
          handleOnClickForAcceptSuggestion={handleOnClickForAcceptSuggestion}
          handleOnClickForDeclineSuggestion={handleOnClickForDeclineSuggestion}
          divisionsData={divisionsData}
        ></DivisionCreationSuggesition>
      )}
    </div>
  )
}

export default DivisionCreation
