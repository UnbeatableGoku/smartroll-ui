import React, { useState } from 'react'

import { Check, X } from 'lucide-react'

import { SheetLoader } from '@components/common/loader/Loader'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'

interface IDivisionConstrains {
  isViewOpen: boolean
  divisionData: any
  closeSuggestion: () => void
  createDivision: (data: Record<string, any>) => void
}

// subject_slug -> batch_count
interface IBatchCountInput {
  [key: string]: number
}

// subject_slug -> student_capacity
interface IStudentBatchCapacity {
  [key: string]: string
}

const DivisionConstrains = (params: IDivisionConstrains) => {
  const { isViewOpen, closeSuggestion, createDivision, divisionData } = params

  const [batchCount, setBatchCount] = useState<IBatchCountInput>({})
  const [batchCapacity, setBatchCapacity] = useState<IStudentBatchCapacity>({})
  const [divisionConstrains] = useState(divisionData ?? [])
  const handleCloseSuggestiong = () => {
    setBatchCount({})
    setBatchCapacity({})
    closeSuggestion()
  }

  const handleChangeBatchCount = (
    studentCount: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target
    const batchCapacity = studentCount / Number(value)
    let capacity: string = `${studentCount}`

    if (Number.isInteger(batchCapacity)) {
      capacity = `${batchCapacity}`
    } else {
      capacity = `${Math.floor(batchCapacity)} - ${Math.ceil(batchCapacity)}`
    }

    setBatchCount((prev) => ({
      ...prev,
      [name]: Number(value),
    }))

    setBatchCapacity((prev) => ({ ...prev, [name]: capacity }))
  }

  if (isViewOpen) {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Card className="w-full max-w-4xl bg-white shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between text-xl">
                  <CardTitle className="text-black">
                    Division wise batch count
                  </CardTitle>
                  <Card
                    onClick={handleCloseSuggestiong}
                    className="cursor-pointer bg-white p-1 hover:bg-[#F7F7F7]"
                  >
                    <X className="h-4 w-4 text-black" />
                    <span className="sr-only">Close</span>
                  </Card>
                </CardHeader>
                <CardContent className="text-sm sm:text-base">
                  <div className="container mx-auto border">
                    <Table className="shadow-soft">
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="w-auto border bg-[#F7F7F7] text-center font-semibold text-black"
                            rowSpan={2}
                          >
                            Division
                          </TableHead>
                          <TableHead
                            className="w-[300px] border bg-[#F7F7F7] font-semibold text-black"
                            rowSpan={2}
                          >
                            Subject Name
                          </TableHead>
                          <TableHead
                            className="border bg-[#F7F7F7] text-center font-semibold text-black"
                            rowSpan={2}
                          >
                            Student count
                          </TableHead>
                          <TableHead
                            className="border bg-[#F7F7F7] text-center font-semibold text-black"
                            rowSpan={2}
                          >
                            Batch count
                          </TableHead>
                          <TableHead
                            className="border bg-[#F7F7F7] text-center font-semibold text-black"
                            rowSpan={2}
                          >
                            Batch wise student count
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {divisionConstrains.length &&
                          divisionConstrains.map((division: any) =>
                            division.subjects.map(
                              (configs: any, index: any) => (
                                <TableRow>
                                  {index === 0 && (
                                    <TableCell
                                      className="border text-center text-2xl font-medium text-black"
                                      rowSpan={division.subjects.length}
                                    >
                                      {division.division_name}
                                    </TableCell>
                                  )}
                                  <TableCell className="border text-black">
                                    {configs.slug === '__common__'
                                      ? 'Mandatory subjects '
                                      : configs?.subject_name}
                                  </TableCell>
                                  <TableCell className="border text-center text-black">
                                    {configs.student_count}
                                  </TableCell>
                                  <TableCell className="w-20 border">
                                    <Input
                                      type="number"
                                      max={10}
                                      min={1}
                                      size={20}
                                      className="w-20 border-2 text-center"
                                      value={
                                        batchCount[
                                          `${division.division_name}_${configs.slug}`
                                        ] ?? 1
                                      }
                                      name={`${division.division_name}_${configs.slug}`}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        handleChangeBatchCount(
                                          configs.student_count,
                                          e,
                                        )
                                      }}
                                    ></Input>
                                  </TableCell>
                                  <TableCell className="border text-center text-black">
                                    {batchCapacity[
                                      `${division.division_name}_${configs.slug}`
                                    ] ?? configs.student_count}
                                  </TableCell>
                                </TableRow>
                              ),
                            ),
                          )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <Button
                      variant={'cancle-outline'}
                      onClick={handleCloseSuggestiong}
                    >
                      <X className="mr-2 h-4 w-4" /> Close
                    </Button>
                    <Button
                      variant={'submit-outline'}
                      onClick={() => {
                        createDivision(batchCount)
                      }}
                    >
                      Save <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <SheetLoader></SheetLoader>
      </>
    )
  }
}

export default DivisionConstrains
