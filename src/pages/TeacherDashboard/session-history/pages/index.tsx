import { useEffect, useRef } from 'react'

import FilterPannel from '../components/FilterPannel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RootState } from '@data/Store'
import AttendanceHistorySheet from '@pages/TeacherDashboard/components/AttendanceHistorySheet'
import { Filter } from 'lucide-react'
import { useSelector } from 'react-redux'

import useLectureSessions from '@hooks/useLectureSessions'

const LectureSessionHistoryPage = () => {
  const {
    fetchFilterMetadata,
    filterOption,
    fetchLectureSessions,
    displayedLectures,
    hasMore,
    isLoading,
    filters,
    isFilterOpen,
    isHistorySheetOpen,
    students,
    sessionId,
    showAttendancehistorySheet,
    closeHistroySheet,
    loadMoreData,
    applyFilters,
    checkFilters,
    clearFilters,
    handleFilterChange,
    setFilters,
    setIsFilterOpen,
  } = useLectureSessions()

  useEffect(() => {
    fetchFilterMetadata()
    fetchLectureSessions({})
  }, [])

  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          // wrap in async IIFE
          ;(async () => {
            await loadMoreData()
          })()
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreData, hasMore, isLoading])

  const paginationLoader = useSelector(
    (root: RootState) => root.loader.PAGINATION_LOADER_STATE,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto px-4 py-4">
          <div className="flex flex-row flex-wrap items-center justify-between gap-4">
            <div className="pr-16 md:pr-0">
              <h1 className="text-balance text-xl font-bold text-foreground md:text-3xl">
                Lecture History
              </h1>
            </div>
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => {
                setIsFilterOpen(true)
              }}
            >
              <Filter className="mr-2 h-4 w-4 text-black" />
              <span className="text-black sm:inline">Filters</span>
            </Button>
            {
              <FilterPannel
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                filterOptions={filterOption}
                applyFilters={applyFilters}
                checkFilters={checkFilters}
                clearFilters={clearFilters}
                handleFilterChange={handleFilterChange}
                filters={filters}
                setFilters={setFilters}
              />
            }
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto pb-4 md:pb-6">
        <Card className="rounded-none border-none">
          <CardContent className="p-0 shadow-none">
            <div className="overflow-x-auto">
              {displayedLectures.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px] cursor-pointer font-semibold hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          Subject Name
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[100px] font-semibold">
                        Date
                      </TableHead>
                      <TableHead className="min-w-[100px] text-center font-semibold">
                        Day
                      </TableHead>
                      <TableHead className="min-w-[100px] cursor-pointer text-center font-semibold hover:bg-muted/50">
                        <div className="flex items-center justify-center gap-2">
                          Semester
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[80px] text-center font-semibold">
                        Division
                      </TableHead>
                      <TableHead className="min-w-[80px] text-center font-semibold">
                        Branch
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="!border-none">
                    {displayedLectures.map((lecture) => (
                      <TableRow
                        key={lecture.id}
                        className="h-10 cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          showAttendancehistorySheet(lecture.session_id)
                        }}
                      >
                        <TableCell className="font-medium">
                          {lecture.subject_name}
                        </TableCell>
                        <TableCell className="text-sm">{lecture.day}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {lecture.weekday}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {lecture.semester}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {lecture.division}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {lecture.branch}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No lecture sessions found matching your filters.
                </div>
              )}
            </div>

            {displayedLectures.length > 0 && (
              <div className="border-t bg-card p-6">
                {/* Loading indicator */}
                {paginationLoader && (
                  <div className="flex items-center justify-center pb-12">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading more...
                    </span>
                  </div>
                )}
                {/* End of results indicator */}
                {!hasMore && displayedLectures.length > 0 && (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    You've reached the end of the results
                  </div>
                )}

                {/* Intersection observer target */}
                <div ref={observerRef} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isHistorySheetOpen && students.length && sessionId && (
        <AttendanceHistorySheet
          isHistorySheetOpen={isHistorySheetOpen}
          handelHistorySheetOpen={closeHistroySheet}
          students={students}
          sessionId={sessionId}
        ></AttendanceHistorySheet>
      )}
    </div>
  )
}

export default LectureSessionHistoryPage
