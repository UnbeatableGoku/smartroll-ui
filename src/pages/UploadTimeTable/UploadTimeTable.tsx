import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Upload } from 'lucide-react'

import ButtonLoader from '@components/common/form/buttonLoader/ButtonLoader'
import Selection from '@components/common/form/selectiom/Selection'
import useDivision from '@components/common/uploadTimeTable/useDivision'
import useShowTimeTable from '@components/common/uploadTimeTable/useShowTimeTable'
import useStream from '@components/common/uploadTimeTable/useStream'

import EventCard from './EventCard'
import useUploadTimeTable from './useUploadTimeTable'

export default function UploadTimeTable() {
  const { stream, handleStream } = useStream()
  const { division, handleDivision } = useDivision()
  const { handleTimeTable, masterTimeTable } = useShowTimeTable()

  const {
    handleSubmit,
    onSubmit,
    handleFileChange,
    fileName,
    timeTable,
    loadTimeTable,
    setLoadTimeTable,
  } = useUploadTimeTable()

  const [selectedStream, setSelectedStream] = useState<string>('')
  const [selectedDivision, setSelectedDivision] = useState<string>('')

  const handleOnValueChangeStreams = (value: string) => {
    setSelectedStream(value)
    setSelectedDivision('')
    handleDivision(value)
  }

  const handlenValueChangeDivision = (value: string) => {
    setSelectedDivision(value)
    setLoadTimeTable(true)
    handleTimeTable(value)
  }

  useEffect(() => {
    if (timeTable === true) {
      handleStream()
    }
  }, [timeTable])

  return (
    <>
      {timeTable == false && (
        // upload master time table
        <main className="mt-24 flex flex-grow items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                Upload Master Time-Table
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Select a file from your computer to upload
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="-space-y-px rounded-md shadow-sm">
                <div className="] flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 pb-6 pt-5 dark:border-gray-600">
                  <Upload className="m-4 mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <Label
                      htmlFor="file-upload"
                      className="relative flex h-[24px] w-[90px] cursor-pointer items-center justify-center rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500 dark:bg-gray-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <span>Select a file</span>
                      <Input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleFileChange}
                      />
                    </Label>
                    <p className="pl-1 text-sm">or drag and drop</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    excel file
                  </p>
                </div>
              </div>

              {fileName && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Selected file: {fileName}
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  className={`relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:bg-zinc-600 dark:border-gray-800 dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white ${
                    loadTimeTable ? 'cursor-not-allowed dark:bg-white' : ''
                  }`}
                  disabled={loadTimeTable}
                >
                  {loadTimeTable ? (
                    <ButtonLoader title="Uploading..." />
                  ) : (
                    'Upload File'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      )}

      {timeTable == true && (
        <div className="flex w-full flex-col space-y-4">
          {/* time table selection */}
          <div className="flex flex-col space-y-2 rounded-xl md:space-y-4">
            <div className="flex w-full flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
              {stream && (
                <>
                  <div className="relative w-full md:w-[240px] lg:w-[320px]">
                    {/* Stream Selection Card */}
                    <Selection
                      title="Stream"
                      selectedValue={selectedStream}
                      selectedValue2=" "
                      onValueChange={handleOnValueChangeStreams}
                      placeholder="Select Stream"
                      data={stream}
                      optionTitle={null}
                    />
                    {/* <StreamSelection
                      title="Stream"
                      selectedValue={selectedStream}
                      onValueChange={handleOnValueChangeStreams}
                      placeholder="Select Stream"
                      data={stream}
                    /> */}
                    {/* Connecting Lines */}
                    <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
                    <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
                  </div>
                </>
              )}
              {/* Division Selection Card */}
              {division && (
                <>
                  <div className="relative w-full md:w-[240px] lg:w-[320px]">
                    <Selection
                      title="Division"
                      selectedValue={selectedDivision}
                      selectedValue2={selectedStream}
                      onValueChange={handlenValueChangeDivision}
                      placeholder="Select Division"
                      data={division}
                      optionTitle={'Division'}
                    />

                    {/* <DivisionSelection
                        title="Division"
                        selectedValue={selectedDivision}
                        selectedValue2={selectedStream}
                        onValueChange={handlenValueChangeDivision}
                        placeholder="Select Division"
                        data={division}
                      /> */}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* time table view  */}
          {loadTimeTable == true ? (
            <Card className="max-h-max min-h-[400px] w-full dark:border-gray-800 dark:bg-black">
              <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3 dark:border-gray-800 md:px-6 md:py-4">
                <h2 className="text-base font-semibold dark:text-white md:text-lg">
                  Timetable
                </h2>
              </CardHeader>
              <ScrollArea className="h-[calc(100%-70px)]">
                <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-6">
                  {masterTimeTable?.map((timeTable: any) => (
                    <div
                      key={timeTable.day}
                      className="flex flex-col gap-3 md:gap-4"
                    >
                      <h3 className="text-center font-medium dark:text-white">
                        {timeTable.day}
                      </h3>
                      {timeTable?.lectures?.length > 0 ? (
                        timeTable?.lectures?.map((lecture: any) => (
                          <EventCard
                            key={lecture?.slug}
                            title={`${lecture?.subject?.subject_name} (${lecture?.teacher?.teacher_code})`}
                            time={`${lecture?.start_time} - ${lecture?.end_time}`}
                            batches={lecture?.batches}
                            location={lecture?.classroom?.class_name}
                          />
                        ))
                      ) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                          No Lectures
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="sm:h-18 h-20 w-full" />
              <Skeleton className="sm:h-18 h-20 w-full" />
              <Skeleton className="sm:h-18 h-20 w-full" />
              <Skeleton className="sm:h-18 h-20 w-full" />
              <Skeleton className="sm:h-18 h-20 w-full" />
            </div>
          )}
        </div>
      )}
    </>
  )
}
