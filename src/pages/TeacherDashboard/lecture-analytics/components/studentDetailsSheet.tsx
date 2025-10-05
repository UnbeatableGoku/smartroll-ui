import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RootState } from '@data/Store'
import { FileDown } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

import { cn } from '@lib/utils'

import { SheetLoader } from '@components/common/loader/Loader'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'

const StudentDetailsSheet = (props: IStudentDetailsPros) => {
  const {
    closeSheet,
    isSheetOpen,
    studentDetails,
    fetchAnalyticsData,
    subjectSlug,
    exportAnalyticsData,
  } = props

  const sheetLoader = useSelector(
    (state: RootState) => state.loader.SHEET_LOADER_STATE,
  )

  const [filter, setFilter] = useState<Record<string, any>>({
    less_than: '',
    start_date: '',
    end_date: '',
  })

  const applyFilter = () => {
    const { less_than, start_date, end_date } = filter
    const params: Record<string, any> = {}
    if (less_than === '' && start_date === '' && end_date === '') {
      toast.error('Please enter value for one of field')
      return
    }

    if (less_than !== '') {
      params['less_than'] = less_than
    }
    if (start_date !== '') {
      params['start_date'] = start_date
    }

    if (end_date !== '') {
      params['end_date'] = end_date
    }
    fetchAnalyticsData(subjectSlug, params, true)
  }

  const clearFilter = () => {
    const { less_than, start_date, end_date } = filter
    setFilter({ less_than: '', start_date: '', end_date: '' })
    if (less_than === '' && start_date === '' && end_date === '') {
      return
    }
    fetchAnalyticsData(subjectSlug, {}, true)
  }
  return (
    <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
      <SheetContent
        side="bottom"
        className="h-[100dvh] overflow-y-auto border-border bg-[#F7F7F7] sm:max-w-full"
      >
        <SheetHeader className="mb-6 flex flex-row items-center justify-between">
          <SheetTitle className="text-md text-black md:text-2xl">
            Attendance Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 md:space-y-6">
          {/* Attendance Table */}
          {/* Filters */}
          <Card className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium md:text-lg">Filters</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={'submit'}
                  onClick={() => {
                    applyFilter()
                  }}
                  aria-label="Apply filters"
                >
                  Apply Filters
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    clearFilter()
                  }}
                  aria-label="Reset filters"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Percentage threshold */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="threshold">% Threshold (less than)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="threshold"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={100}
                    maxLength={3}
                    placeholder="e.g. 50"
                    value={filter.less_than}
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        less_than: e.target.value,
                      }))
                    }
                    aria-describedby="threshold-help"
                  />
                  <span aria-hidden className="text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="start-date">Start date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filter.start_date}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }}
                  aria-describedby="date-help"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="end-date">End date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filter.end_date}
                  onChange={(e) => {
                    setFilter((prev) => ({ ...prev, end_date: e.target.value }))
                  }}
                  aria-describedby="date-help"
                />
              </div>
            </div>
          </Card>
          <div className="rounded-[6px] bg-[#F7F7F7] shadow-soft">
            <div className="mx-2 h-[1px] max-w-full bg-gray-300"></div>

            <div className="flex h-[75vh] w-full flex-col gap-y-3 overflow-y-auto p-4">
              <Button
                variant="outline"
                className="w-full rounded-[4px] border-none bg-[#0261BE] p-[20px] text-white hover:bg-blue-700"
                onClick={() => {
                  exportAnalyticsData()
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Attendance
              </Button>
              <div className="overflow-x-auto">
                {studentDetails ? (
                  <Table className="text-black">
                    <TableHeader>
                      {studentDetails?.columns.length > 0 && (
                        <TableRow className="md:text-md border-border text-[12px]">
                          {studentDetails?.columns.map(
                            (column: string, index: number) => (
                              <TableHead
                                className={cn(index > 1 && 'text-center')}
                              >
                                {column}
                              </TableHead>
                            ),
                          )}
                        </TableRow>
                      )}
                    </TableHeader>
                    <TableBody>
                      {studentDetails?.details.map(
                        (row: any, index: number) => (
                          <TableRow
                            key={index}
                            className={`'border-border' text-[12px] text-black`}
                          >
                            {row.map((item: string, index: number) => (
                              <TableCell
                                className={cn(index > 1 && 'text-center')}
                              >
                                {item}
                              </TableCell>
                            ))}
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center pt-3 text-black">
                    No Students Present
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {sheetLoader && <SheetLoader></SheetLoader>}
      </SheetContent>
    </Sheet>
  )
}

interface IStudentDetailsPros {
  isSheetOpen: boolean
  closeSheet: () => void
  studentDetails: Record<string, any>
  fetchAnalyticsData: (
    subjectSlug: string,
    params: Record<string, any>,
    sheetLoader: boolean,
  ) => void
  subjectSlug: string
  exportAnalyticsData: () => void
}
export default StudentDetailsSheet
