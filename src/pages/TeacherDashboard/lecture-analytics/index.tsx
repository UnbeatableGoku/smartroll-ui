import { useEffect } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import useLectureAnalytics from '@hooks/useLectureAnalytics'

import { Badge } from '@components/ui/badge'

import StudentDetailsSheet from './components/studentDetailsSheet'

const LectureAnalytics = () => {
  const {
    fetchSubjects,
    subjects,
    clearSheet,
    fetchAnalyticsData,
    studentDetails,
    isSheetOpen,
    setSubjectSlug,
    subjectSlug,
    exportAnalyticsData,
  } = useLectureAnalytics()

  useEffect(() => {
    fetchSubjects()
  }, [])
  return (
    <>
      <div className="">
        {/* Header */}
        <div className="border-b">
          <div className="mx-auto px-4 py-4">
            <div className="flex flex-row flex-wrap items-center justify-between gap-4">
              <div className="pr-16 md:pr-0">
                <h1 className="text-balance text-xl font-bold text-foreground md:text-3xl">
                  Your Lecture Insights
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto pb-4 md:pb-6">
          <Card className="rounded-none border-none">
            <CardContent className="p-0 shadow-none">
              <div className="overflow-x-auto">
                {subjects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px] cursor-pointer font-semibold hover:bg-muted/50">
                          <div className="flex items-center gap-2">
                            Subject Name
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[100px] cursor-pointer text-center font-semibold hover:bg-muted/50">
                          <div className="flex items-center justify-center gap-2">
                            Semester
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[80px] text-center font-semibold">
                          Branch
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="!border-none">
                      {subjects.map((subject) => (
                        <TableRow
                          key={subject.slug}
                          className="h-10 cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSubjectSlug(subject.slug)
                            fetchAnalyticsData(subject.slug)
                          }}
                        >
                          <TableCell className="font-medium">
                            {subject.subject_name}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="text-xs">
                              {subject.semester}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-xs">
                              {subject.branch}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    It looks like you haven’t been assigned any subjects to
                    teach.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {Object.keys(studentDetails).length > 0 && subjectSlug && (
          <StudentDetailsSheet
            isSheetOpen={isSheetOpen}
            closeSheet={clearSheet}
            studentDetails={studentDetails}
            fetchAnalyticsData={fetchAnalyticsData}
            subjectSlug={subjectSlug}
            exportAnalyticsData={exportAnalyticsData}
          />
        )}
      </div>
    </>
  )
}

export default LectureAnalytics
