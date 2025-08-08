import { Check, X } from 'lucide-react'

import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'

const DivisionCreationSuggesition = ({
  isOpenSuggesition,
  setIsOpenSuggesition,
  handleOnClickForAcceptSuggestion,
  divisionsData,
}: any) => {
  // const [total_counts,set_total_counts] = useState()
  return (
    <>
      {isOpenSuggesition && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Card className="w-full max-w-4xl bg-white shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between text-xl">
                  <CardTitle className="text-black">
                    Subject Hours Overview
                  </CardTitle>
                  <Card
                    onClick={() => {
                      setIsOpenSuggesition(!isOpenSuggesition)
                    }}
                    className="cursor-pointer bg-white p-1 hover:bg-[#F7F7F7]"
                  >
                    <X className="h-4 w-4 text-black" />
                    <span className="sr-only">Close</span>
                  </Card>
                </CardHeader>
                <CardContent className="space-y-4 text-sm sm:text-base">
                  <div className="container mx-auto py-10">
                    <Table className="shadow-soft">
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className="w-[300px] bg-[#F7F7F7] font-semibold text-black"
                            rowSpan={2}
                          >
                            Subject Name
                          </TableHead>
                          <TableHead
                            className="w-auto bg-[#F7F7F7] text-center font-semibold text-black"
                            rowSpan={2}
                          >
                            No. of Divisions
                          </TableHead>
                          <TableHead
                            className="bg-[#F7F7F7] text-center font-semibold text-black"
                            colSpan={3}
                          >
                            Initial Hours
                          </TableHead>
                          <TableHead
                            className="bg-[#F7F7F7] text-center font-semibold text-black"
                            colSpan={3}
                          >
                            Final Hours
                          </TableHead>
                          <TableHead
                            className="w-auto bg-[#F7F7F7] font-semibold text-black"
                            rowSpan={2}
                          >
                            Total
                          </TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead className="bg-[#F7F7F7] text-center font-semibold text-black">
                            Theory
                          </TableHead>
                          <TableHead className="bg-[#F7F7F7] text-center font-semibold text-black">
                            Tutorial
                          </TableHead>
                          <TableHead className="bg-[#F7F7F7] text-center font-semibold text-black">
                            Practical
                          </TableHead>
                          <TableHead className="bg-[#F7F7F7] text-center font-semibold text-black">
                            Theory
                          </TableHead>
                          <TableHead className="bg-[#F7F7F7] text-center font-semibold text-black">
                            Tutorial
                          </TableHead>
                          <TableHead className="bg-[#F7F7F7] text-center font-semibold text-black">
                            Practical
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {divisionsData?.hour_deviations.map((subject: any) => {
                          return (
                            <TableRow
                              key={subject.subject_name}
                              className="hover:bg-[#F7F7F7]"
                            >
                              <TableCell className="font-medium text-black">
                                {subject.subject_name}
                              </TableCell>
                              <TableCell className="text-center font-medium text-black">
                                {subject.total_divisions}
                              </TableCell>
                              <TableCell className="text-center text-black">
                                {subject.initial_theory_hours}
                              </TableCell>
                              <TableCell className="text-center text-black">
                                {subject.initial_tutorial}
                              </TableCell>
                              <TableCell className="text-center text-black">
                                {subject.initial_practical_hours}
                              </TableCell>
                              <TableCell className="text-center text-black">
                                {subject.final_theory_hours}
                              </TableCell>
                              <TableCell className="text-center text-black">
                                {subject.final_tutorial_hours}
                              </TableCell>
                              <TableCell className="text-center text-black">
                                {subject.final_practical_hours}
                              </TableCell>
                              <TableCell className="text-center text-lg font-bold text-black">
                                {subject.final_practical_hours +
                                  subject.final_tutorial_hours +
                                  subject.final_theory_hours}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                        <TableRow className="bg-[#F7F7F7]">
                          <TableCell className="text-lg font-bold text-black">
                            Total
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-black">
                            {divisionsData.hour_deviations.reduce(
                              (count: any, subject: any) =>
                                count + subject.total_divisions,
                              0,
                            )}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-black">
                            {divisionsData.hour_deviations.reduce(
                              (count: any, subject: any) =>
                                count + subject.initial_theory_hours,
                              0,
                            )}{' '}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-black">
                            {divisionsData.hour_deviations.reduce(
                              (count: any, subject: any) =>
                                count + subject.initial_tutorial,
                              0,
                            )}{' '}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-black">
                            {divisionsData.hour_deviations.reduce(
                              (count: any, subject: any) =>
                                count + subject.initial_practical_hours,
                              0,
                            )}{' '}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-black">
                            {divisionsData.hour_deviations.reduce(
                              (count: any, subject: any) =>
                                count + subject.final_theory_hours,
                              0,
                            )}{' '}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-black">
                            {divisionsData.hour_deviations.reduce(
                              (count: any, subject: any) =>
                                count + subject.final_tutorial_hours,
                              0,
                            )}{' '}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-black">
                            {divisionsData.hour_deviations.reduce(
                              (count: any, subject: any) =>
                                count + subject.final_practical_hours,
                              0,
                            )}{' '}
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold text-black">
                            {divisionsData.hour_deviations.reduce(
                              (count: any, subject: any) =>
                                count +
                                (subject.final_practical_hours +
                                  subject.final_tutorial_hours +
                                  subject.final_theory_hours),
                              0,
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600"
                      onClick={() => {
                        setIsOpenSuggesition(!isOpenSuggesition)
                      }}
                    >
                      <X className="mr-2 h-4 w-4" /> Close
                    </Button>
                    <Button
                      className="bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
                      onClick={() => {
                        handleOnClickForAcceptSuggestion()
                      }}
                    >
                      View Divisions <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DivisionCreationSuggesition
