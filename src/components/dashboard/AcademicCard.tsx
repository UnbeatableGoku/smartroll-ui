import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import PlusButton from '@components/common/form/addButton'

const AcademicCard = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>()
  const [selectedStream, setSelectedStream] = useState<string>()
  const [selectedSemester, setSelectedSemester] = useState<string>()
  const [selectedDivision, setSelectedDivision] = useState<string>()

  const batches = ['2023-2024', '2024-2025', '2025-2026']
  const stream = ['B.Tech', 'M.Tech', 'MCA', 'MBA']
  const semesters = ['2', '4', '6']
  const divisions = ['A', 'B', 'C']
  const batchNumbers = ['B1', 'B2', 'B3', 'B4']

  return (
    <div className="flex flex-col space-y-2 rounded-xl md:space-y-4">
      <div className="flex w-full flex-col items-center space-y-4 md:items-start lg:flex-row lg:space-x-12 lg:space-y-0">
        {/* term Selection Card */}
        <div className="relative w-full lg:w-[320px]">
          <Card className="h-[220px] w-full border-2 dark:bg-black sm:h-[240px] md:h-[240px] lg:h-[280px]">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-center text-base sm:text-lg">
                Academic Year
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <Command className="rounded-lg border shadow-md">
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {batches.map((batch) => (
                      <CommandItem
                        key={batch}
                        onSelect={() => {
                          setSelectedBatch(batch)
                          setSelectedSemester(undefined)
                          setSelectedDivision(undefined)
                        }}
                        className={cn(
                          'cursor-pointer text-sm sm:text-base',
                          selectedBatch === batch &&
                            'bg-primary text-primary-foreground',
                        )}
                      >
                        {batch}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
          {/* Connecting Lines */}
          <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 lg:right-[-3.5rem] lg:block lg:w-14" />
          <div className="absolute bottom-[-1.5rem] left-1/2 h-6 w-[3px] -translate-x-1/2 transform bg-gray-400 md:block lg:hidden" />
        </div>
        {/* Stream Selection Card */}
        <div className="relative w-full lg:w-[320px]">
          <Card className="h-[220px] w-full border-2 dark:bg-black sm:h-[240px] md:h-[240px] lg:h-[280px]">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-center text-base sm:text-lg">
                Streams
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {selectedBatch ? (
                <Command className="rounded-lg border shadow-md">
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {stream.map((stream) => (
                        <CommandItem
                          key={stream}
                          onSelect={() => {
                            setSelectedStream(stream)
                            setSelectedSemester(undefined)
                            setSelectedDivision(undefined)
                          }}
                          className={cn(
                            'cursor-pointer text-sm sm:text-base',
                            selectedStream === stream &&
                              'bg-primary text-primary-foreground',
                          )}
                        >
                          {stream}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <Skeleton className="h-10 w-full sm:h-10" />
                  <Skeleton className="h-10 w-full sm:h-10" />
                  <Skeleton className="h-10 w-full sm:h-10" />
                </div>
              )}
            </CardContent>
          </Card>
          {/* Connecting Lines */}
          <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 lg:right-[-3.5rem] lg:block lg:w-14" />
          <div className="absolute bottom-[-1.5rem] left-1/2 h-6 w-[3px] -translate-x-1/2 transform bg-gray-400 md:block lg:hidden" />
        </div>

        {/* Semester Selection Card */}
        <div className="relative w-full lg:w-[320px]">
          <Card className="h-[220px] w-full border-2 dark:bg-black sm:h-[240px] md:h-[240px] lg:h-[280px]">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-center text-base sm:text-lg">
                Semester
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {selectedStream ? (
                <Command className="rounded-lg border shadow-md">
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {semesters.map((semester) => (
                        <CommandItem
                          key={semester}
                          onSelect={() => {
                            setSelectedSemester(semester)
                            setSelectedDivision(undefined)
                          }}
                          className={cn(
                            'cursor-pointer text-sm sm:text-base',
                            selectedSemester === semester &&
                              'bg-primary text-primary-foreground',
                          )}
                        >
                          Semester {semester}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <Skeleton className="h-10 w-full sm:h-10" />
                  <Skeleton className="h-10 w-full sm:h-10" />
                  <Skeleton className="h-10 w-full sm:h-10" />
                </div>
              )}
            </CardContent>
          </Card>
          {/* Connecting Lines */}
          <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 lg:right-[-3.5rem] lg:block lg:w-14" />
          <div className="absolute bottom-[-1.5rem] left-1/2 h-6 w-[3px] -translate-x-1/2 transform bg-gray-400 md:block lg:hidden" />
        </div>

        {/* Division Selection Card */}
        <div className="relative w-full lg:w-[320px]">
          <Card className="h-[220px] w-full border-2 dark:bg-black sm:h-[240px] md:h-[240px] lg:h-[280px]">
            <CardHeader className="space-y-0 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-center text-base sm:text-lg">
                  Division
                </CardTitle>
                <PlusButton text="+" variant="ghost" />
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {selectedSemester ? (
                <Command className="rounded-lg border shadow-md">
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {divisions.map((division) => (
                        <CommandItem
                          key={division}
                          onSelect={() => setSelectedDivision(division)}
                          className={cn(
                            'cursor-pointer text-sm sm:text-base',
                            selectedDivision === division &&
                              'bg-primary text-primary-foreground',
                          )}
                        >
                          Division {division}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <Skeleton className="h-10 w-full sm:h-10" />
                  <Skeleton className="h-10 w-full sm:h-10" />
                  <Skeleton className="h-10 w-full sm:h-10" />
                </div>
              )}
            </CardContent>
          </Card>
          {/* Connecting Lines */}
          <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 lg:right-[-3.0rem] lg:block lg:w-12" />
          <div className="absolute bottom-[-1.0rem] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:block lg:hidden" />
        </div>

        {/* Batch Number Selection Card */}
        <div className="w-full lg:w-[320px]">
          <Card className="h-[220px] w-full border-2 dark:bg-black sm:h-[240px] md:h-[240px] lg:h-[280px]">
            <CardHeader className="space-y-0 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-center text-base sm:text-lg">
                  Batch Number
                </CardTitle>
                <PlusButton text="+" variant="ghost" />
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {selectedDivision ? (
                <Command className="rounded-lg border shadow-md">
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {batchNumbers.map((batch) => (
                        <CommandItem
                          key={batch}
                          onSelect={() => {}}
                          className="cursor-pointer text-sm sm:text-base"
                        >
                          {batch}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <Skeleton className="h-10 w-full sm:h-10" />
                  <Skeleton className="h-10 w-full sm:h-10" />
                  <Skeleton className="h-10 w-full sm:h-10" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AcademicCard
