
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'

import { Check, X } from 'lucide-react'




const DivisionCreationSuggesition = ({ isOpenSuggesition, setIsOpenSuggesition, handleOnClickForDeclineSuggestion, handleOnClickForAcceptSuggestion ,divisionsData}: any) => {
 
  return (
    <>



      {isOpenSuggesition && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Card className="w-full max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Division Creation Recommendations</CardTitle>
                  <Card onClick={() => { setIsOpenSuggesition(!isOpenSuggesition) }}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Card>
                </CardHeader>
                <CardContent className="space-y-4 text-sm sm:text-base">
                  <div className="container mx-auto py-10">
                    <Table>
                      <TableCaption>Subject Hours Overview</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Subject Name</TableHead>
                          <TableHead className="text-center">Initial Hours</TableHead>
                          <TableHead className="text-center">Teaching Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {divisionsData?.hour_deviations.map((subject:any) => (
                          <TableRow key={subject.subject_name}>
                            <TableCell className="font-medium">{subject.subject_name}</TableCell>
                            <TableCell className="text-center">{subject.initial_hours}</TableCell>
                            <TableCell className="text-center">{subject.final_hours}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end items-center space-x-3 mt-6">
                    <Button className='bg-red-800 text-white'
                      onClick={() => { handleOnClickForDeclineSuggestion() }}
                    >
                      <X className="mr-2 h-4 w-4 " /> Denied
                    </Button>
                    <Button
                      onClick={() => { handleOnClickForAcceptSuggestion() }}
                    >
                      Accept <Check className="ml-2 h-4 w-4" />
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