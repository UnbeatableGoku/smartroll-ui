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
              <Card className="w-full max-w-4xl">
                <CardHeader className="text-xl flex flex-row items-center justify-between">
                  <CardTitle>Subject Hours Overview</CardTitle>
                  <Card
                    onClick={() => {
                      setIsOpenSuggesition(!isOpenSuggesition)
                    }}
                  >
                    <X className="h-4 w-4 cursor-pointer hover:bg-zinc-600 hover:rounded-md" />
                    <span className="sr-only">Close</span>
                  </Card>
                </CardHeader>
                <CardContent className="space-y-4 text-sm sm:text-base">
                  <div className="container mx-auto py-10">
                      <Table className="border-collapse border border-zinc-500">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]" rowSpan={2}>
                              Subject Name
                            </TableHead>
                            <TableHead className="w-auto border border-zinc-500 text-center bg-zinc-700/45 text-white" rowSpan={2}>
                              No. of Divisions
                            </TableHead>
                            <TableHead className="text-center border border-zinc-500 bg-zinc-700/45 text-white" colSpan={3}>
                              Initial Hours
                            </TableHead>
                            <TableHead className="text-center border border-zinc-500  bg-zinc-700/45 text-white" colSpan={3}>
                              Final Hours
                            </TableHead>
                            <TableHead className="w-auto bg-zinc-700/45 text-white" rowSpan={2}>
                              Total
                            </TableHead>
                          </TableRow>
                          <TableRow>
                            <TableHead className="text-center border  border-zinc-500">Theory</TableHead>
                            <TableHead className="text-center border  border-zinc-500">Tutorial</TableHead>
                            <TableHead className="text-center border  border-zinc-500">Practical</TableHead>
                            <TableHead className="text-center border  border-zinc-500">Theory</TableHead>
                            <TableHead className="text-center border  border-zinc-500">Tutorial</TableHead>
                            <TableHead className="text-center border  border-zinc-500">Practical</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {divisionsData?.hour_deviations.map((subject: any) => 
                          {
                            return (
                              <TableRow key={subject.subject_name}>
                                <TableCell className="font-medium border border-zinc-500">
                                  {subject.subject_name}
                                </TableCell>
                                <TableCell className="font-medium text-center border border-zinc-500">
                                  {subject.total_divisions}
                                </TableCell>
                                <TableCell className="text-center"> 
                                  {subject.initial_theory_hours}
                                </TableCell>
                                <TableCell className="text-center">
                                  {subject.initial_tutorial}
                                </TableCell>
                                <TableCell className="text-center border-r border-b-0 border-zinc-500">
                                  {subject.initial_practical_hours}
                                </TableCell>
                                <TableCell className="text-center">
                                  {subject.final_theory_hours}
                                </TableCell>
                                <TableCell className="text-center">
                                  {subject.final_tutorial_hours}
                                </TableCell>
                                <TableCell className="text-center">
                                  {subject.final_practical_hours}
                                </TableCell>
                                <TableCell className="text-center text-lg font-bold border border-zinc-500">
                                  {subject.final_practical_hours + subject.final_tutorial_hours + subject.final_theory_hours} 
                                </TableCell>
                              </TableRow>
                            )
                          }
                          )}
                          <TableRow>
                              <TableCell  className='border border-zinc-500 font-bold text-lg'>Total</TableCell>
                              <TableCell  className='border border-zinc-500 text-center font-bold text-lg'>{divisionsData.hour_deviations.reduce((count:any,subject:any)=> count + subject.total_divisions , 0)}</TableCell>
                              <TableCell className='border border-zinc-500 text-center font-bold text-lg'>{divisionsData.hour_deviations.reduce((count:any,subject:any)=> count + subject.initial_theory_hours , 0)} </TableCell>
                              <TableCell className='border border-zinc-500 text-center font-bold text-lg'>{divisionsData.hour_deviations.reduce((count:any,subject:any)=> count + subject.initial_tutorial , 0)} </TableCell>
                              <TableCell className='border border-zinc-500 text-center font-bold text-lg'>{divisionsData.hour_deviations.reduce((count:any,subject:any)=> count + subject.initial_practical_hours , 0)} </TableCell>
                              <TableCell className='border border-zinc-500 text-center font-bold text-lg'>{divisionsData.hour_deviations.reduce((count:any,subject:any)=> count + subject.final_theory_hours , 0)} </TableCell>
                              <TableCell className='border border-zinc-500 text-center font-bold text-lg'>{divisionsData.hour_deviations.reduce((count:any,subject:any)=> count + subject.final_tutorial_hours , 0)} </TableCell>
                              <TableCell className='border border-zinc-500 text-center font-bold text-lg'>{divisionsData.hour_deviations.reduce((count:any,subject:any)=> count + subject.final_practical_hours , 0)} </TableCell> 
                              <TableCell className='border border-zinc-500 text-center font-bold text-lg'>{divisionsData.hour_deviations.reduce((count:any,subject:any)=> count + (subject.final_practical_hours + subject.final_tutorial_hours + subject.final_theory_hours) , 0)} </TableCell> 
                          </TableRow>
                        </TableBody>
                      </Table>
                  </div>

                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        // handleOnClickForDeclineSuggestion()
                        setIsOpenSuggesition(!isOpenSuggesition)
                      }}
                    >
                      <X className="mr-2 h-4 w-4" /> Close
                    </Button>
                    <Button
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
