import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DivisionState } from '@/types/division'

import useDivisionCreation from '@hooks/useDivisionCreation'

import Selection from '@components/common/form/selectiom/Selection'
import useStream from '@components/common/uploadTimeTable/useStream'
import { Separator } from '@components/ui/separator'

import DivisionConstrains from './DivisionConstrains'
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
    studentBatchList,
    isConstrainsOpen,
    divisionPhase,
    divisionSuggestiongData,
    setIsOpen,
    setActiveTab,
    handleOnValueChangeOfStream,
    handleOnValueChangeOfSemester,
    setIsOpenSuggesition,
    handleOnClickForAcceptSuggestion,
    handleOnClickForDeclineSuggestion,
    setMaxDivisionCapacity,
    handelOnClickForSaveDivisions,
    updateAvailableCounts,
    setRenderStudentList,
    handleOnClickForDownloadExcel,
    setDivisionConstrains,
    getDivisionData,
  } = useDivisionCreation()

  useEffect(() => {
    handleStream()
  }, [])

  useEffect(() => {
    updateAvailableCounts()
  }, [divisions])

  return (
    <div className="mx-auto bg-white p-4 pb-20">
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
              variant={'cancle-outline'}
              className="w-full"
              onClick={() => {
                setRenderStudentList(!renderStudentList)
              }}
            >
              Change division size
            </Button>
            <Button
              variant={'submit-outline'}
              className="w-full"
              onClick={() => handelOnClickForSaveDivisions()}
            >
              Confirm Divisions
            </Button>
          </div>
        )}
        {selectedSemester && !divisionsAlreadyCreated && (
          <div className="flex flex-col gap-4">
            {!renderStudentList && totalStudentsCount > 0 && (
              <div>
                <h2 className="mb-2 text-xl font-semibold text-black">
                  Subject Choice Groups
                </h2>

                <ul className="space-y-2">
                  {sujectChoiceGroup
                    .filter((group) => group.availableCount > 0)
                    .map((group, index) => (
                      <li
                        key={group.subjects}
                        className="flex items-center justify-between rounded bg-white p-2 shadow-soft"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="ml-2 text-black">
                            {index + 1 + ' . '}{' '}
                          </span>
                          <span className="text-black">{group.subjects}</span>
                        </div>
                        <span className="font-semibold text-black">
                          {group.totalCount}
                        </span>
                      </li>
                    ))}
                </ul>

                <Separator className="mt-4" />
              </div>
            )}
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

        {selectedSemester &&
          !divisionsAlreadyCreated &&
          !renderStudentList &&
          isDeadllineReached && (
            <div ref={setCapacityDivision}>
              <Card className="bg-white shadow-soft">
                <CardHeader>
                  <CardTitle>
                    <h2 className="text-xl font-semibold text-black">
                      Set Division Size
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
                          min={1}
                          max={totalStudentsCount}
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
                        // handleOnClickForDisplaySuggestion()
                        getDivisionData()
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

      {divisionsData && divisionPhase === DivisionState.CONFIRM_DIVISON && (
        <DivisionCreationSuggesition
          isOpenSuggesition={isOpenSuggesition}
          setIsOpenSuggesition={setIsOpenSuggesition}
          handleOnClickForAcceptSuggestion={handleOnClickForAcceptSuggestion}
          handleOnClickForDeclineSuggestion={handleOnClickForDeclineSuggestion}
          divisionsData={divisionsData}
        ></DivisionCreationSuggesition>
      )}

      {divisionSuggestiongData &&
        divisionPhase === DivisionState.INPUT_BATCH_COUNT && (
          <DivisionConstrains
            isViewOpen={isConstrainsOpen}
            closeSuggestion={() => {
              setIsOpen(false)
            }}
            createDivision={(data) => {
              setDivisionConstrains(data)
            }}
            divisionData={divisionSuggestiongData?.divisions ?? []}
          />
        )}
    </div>
  )
}

export default DivisionCreation
