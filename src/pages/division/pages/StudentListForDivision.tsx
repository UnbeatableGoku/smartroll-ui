import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check,  Minus} from 'lucide-react'





const StudentListForDivision = ({divisionsData,setActiveTab,activeTab}:any) => {
  
  const renderTable = (data: any) => {
  
    return (
      <Table>
        {/* Table Header */}
        
        <TableHeader className='sticky top-0 bg-black'>
          <TableRow>
            <TableHead className="w-auto">
              Student Name
            </TableHead>
            <TableHead className="w-auto ">
              Enrollment
            </TableHead>
  
            {/* Dynamically create batch headers */}
            {data?.total_batches.map((batch: string) => (
              <TableHead className="w-auto" key={batch}>
                {batch}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
  
        {/* Table Body */}
        
        <TableBody className='h-80 overflow-y-scroll'>
          {data?.batches?.map((batch: any, batchIndex: number) => {
            return batch.students.map((student: any, studentIndex: number) => {
              return (
                <TableRow key={`${batchIndex}-${studentIndex}`}>
                  <TableCell className="font-medium">
                    {student.profile.name}
                  </TableCell>
                  <TableCell>{student.enrollment}</TableCell>
  
                  {/* Loop over total_batches to check each batch */}
                  {data.total_batches.map((batchName: string) => {
                    // Check if the current batch name matches the batch_name in the student data
                    if (batchName === batch?.batch_name) {
                      return (
                        <TableCell key={batchName}>
                          <Check className='text-green-700' /> {/* Render Check icon if the student is in this batch */}
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={batchName}>
                          <Minus /> {/* Render Minus icon if the student is not in this batch */}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              );
            });
          })}
        
        </TableBody>
      </Table>
    );
  };
  
  return (
    
    <div className="">
      <div className="mx-auto p-2 lg:p-4">
        <Tabs
          value={activeTab}
          onValueChange={(value:any) => {
            setActiveTab(value)
            
          }}
        >
          <TabsList className="grid w-auto grid-cols-2">
            {
              divisionsData?.divisions.map((division:any)=>{
                return (
                  <TabsTrigger value={division.division_name} key={division.division_name}>{division.division_name}</TabsTrigger>
                )
              })
            }
            
            
          </TabsList>
          {
            divisionsData?.divisions.map((division:any)=>{
              return (
                <TabsContent value={division.division_name} className="overflow-hidden mt-4" key={division.division_name}>
                  {divisionsData ? <div className='p-2 border-b border flex flex-col lg:flex-row justify-between text-xl font-bold'><p>Division -  {division.division_name}</p><p>Total Studentes -  {division.total_student_count} </p></div> : null}
                  <div className=' h-[500px] '>
                  {divisionsData && renderTable(division)}
                
                  </div>
                </TabsContent>
              )
            })
          }
        </Tabs>
      </div>
    </div>
  )
}

export default StudentListForDivision