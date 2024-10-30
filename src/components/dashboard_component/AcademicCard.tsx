
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { PlusIcon } from '@icons'
import PlusButton from "@components/common/form/addButton"


const AcademicCard = () => {

    const [selectedBatch, setSelectedBatch] = useState<string>()
    const [selectedSemester, setSelectedSemester] = useState<string>()
    const [selectedDivision, setSelectedDivision] = useState<string>()
  
    const batches = ["2023-2024", "2024-2025", "2025-2026"]
    const semesters = ["2", "4", "6"]
    const divisions = ["A", "B", "C"]
    const batchNumbers = ["B1", "B2", "B3"]

    return (
        <div className="flex flex-col space-y-2 md:space-y-4 border border-zinc-600/40 p-4 rounded-xl">
        <h1 className="text-3xl">Academics</h1>
        <div className="w-full flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 lg:space-x-12">
          {/* Batch Selection Card */}
          <div className="relative w-full md:w-[240px] lg:w-[320px]">
            <Card className="w-full border-2 h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] dark:bg-black">
              <CardHeader className="pb-2 space-y-0">
                <CardTitle className="text-base sm:text-lg text-center">Academic Year</CardTitle>
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
                            setSelectedBatch(batch);
                            setSelectedSemester(undefined);
                            setSelectedDivision(undefined);
                          }}
                          className={cn(
                            "cursor-pointer text-sm sm:text-base",
                            selectedBatch === batch && "bg-primary text-primary-foreground"
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
            <div className="absolute hidden md:block right-[-2rem] lg:right-[-3.5rem] top-1/2 w-8 lg:w-14 h-[3px] bg-gray-400" />
            <div className="absolute md:hidden bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-[3px] h-6 bg-gray-400" />
          </div>
  
          {/* Semester Selection Card */}
          <div className="relative w-full md:w-[240px] lg:w-[320px]">
            <Card className="w-full border-2 h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] dark:bg-black">
              <CardHeader className="pb-2 space-y-0">
                <CardTitle className="text-base sm:text-lg text-center">Semester</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                {selectedBatch ? (
                  <Command className="rounded-lg border shadow-md">
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {semesters.map((semester) => (
                          <CommandItem
                            key={semester}
                            onSelect={() => {
                              setSelectedSemester(semester);
                              setSelectedDivision(undefined);
                            }}
                            className={cn(
                              "cursor-pointer text-sm sm:text-base",
                              selectedSemester === semester && "bg-primary text-primary-foreground"
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
                    <Skeleton className="w-full h-10 sm:h-12" />
                    <Skeleton className="w-full h-10 sm:h-12" />
                    <Skeleton className="w-full h-10 sm:h-12" />
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Connecting Lines */}
            <div className="absolute hidden md:block right-[-2rem] lg:right-[-3.5rem] top-1/2 w-8 lg:w-14 h-[3px] bg-gray-400" />
            <div className="absolute md:hidden bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-[3px] h-6 bg-gray-400" />
          </div>
  
          {/* Division Selection Card */}
          <div className="relative w-full md:w-[240px] lg:w-[320px]">
            <Card className="w-full border-2 h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] dark:bg-black">
              <CardHeader className="pb-2 space-y-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base sm:text-lg text-center">Division</CardTitle>
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
                              "cursor-pointer text-sm sm:text-base",
                              selectedDivision === division && "bg-primary text-primary-foreground"
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
                    <Skeleton className="w-full h-10 sm:h-12" />
                    <Skeleton className="w-full h-10 sm:h-12" />
                    <Skeleton className="w-full h-10 sm:h-12" />
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Connecting Lines */}
            <div className="absolute hidden md:block right-[-2rem] lg:right-[-3.0rem] top-1/2 w-8 lg:w-12 h-[3px] bg-gray-400" />
            <div className="absolute md:hidden bottom-[-1.0rem] left-1/2 transform -translate-x-1/2 w-[3px] h-4 bg-gray-400" />
          </div>
  
          {/* Batch Number Selection Card */}
          <div className="w-full md:w-[240px] lg:w-[320px]">
            <Card className="w-full border-2 h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] dark:bg-black">
              <CardHeader className="pb-2 space-y-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base sm:text-lg text-center">Batch Number</CardTitle>
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
                  <div className="space-y-2 sm:space-y-3 ">
                    <Skeleton className="w-full h-10 sm:h-12" />
                    <Skeleton className="w-full h-10 sm:h-12" />
                    <Skeleton className="w-full h-10 sm:h-12" />
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