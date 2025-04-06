import { ScrollArea } from '@components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'


const TeacherList = ({selectedSubject}:any) => {
    console.log(selectedSubject)
  return (
    <ScrollArea className='h-screen pb-16'>
    <Table className='my-9 border-collapse border border-zinc-500'>
        <TableHeader>
            <TableRow>
                <TableHead className='border border-zinc-500 text-center'>Teacher Name</TableHead>
                <TableHead className='border border-zinc-500 text-center'>Theory</TableHead>
                <TableHead className='border border-zinc-500 text-center'>Practical</TableHead>
                <TableHead className='border border-zinc-500 text-center'>Tutorial</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody className='text-white'>
            {
                selectedSubject.other_teachers.length > 0 ? (
                    selectedSubject.other_teachers.map((data:any)=>{
                        return (
                            <TableRow key={data.teacher.slug}>
                                <TableCell className='border border-zinc-500'>{data.teacher.profile.name}</TableCell>
                                <TableCell className='border border-zinc-500 text-center'>{data.theory}</TableCell>
                                <TableCell className='border border-zinc-500 text-center'>{data.practical}</TableCell>
                                <TableCell className='border border-zinc-500 text-center'>{data.tutorial}</TableCell>
                            </TableRow>
                        )
                    })
                ) : (<div className='text-lg text-center'>No other teacher found</div>)
            }
        </TableBody>
    </Table>
    </ScrollArea>
  )
}

export default TeacherList