import { useState } from 'react'
import { Button } from "@/components/ui/button"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
   
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import TeacherList from './TeacherList'
import { Eye } from 'lucide-react'




const SubjectAllocationDetails = ({ Allocationdata }: any) => {
    const [selectedSubject, setSelectedSubject] = useState<any | null>(null)

    return (
        <>
            <Table className='border-collapse border border-zinc-500'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='border border-zinc-500 font-bold'>Subject Name</TableHead>
                        <TableHead className='border border-zinc-500 text-center font-semibold'>Theory</TableHead>
                        <TableHead className='border border-zinc-500 text-center font-semibold'>Practical</TableHead>
                        <TableHead className='border border-zinc-500 text-center font-semibold'>Tutorial</TableHead>
                        <TableHead className='border border-zinc-500 text-center font-semibold'>Total hours</TableHead>
                        <TableHead className='border border-zinc-500 text-center font-semibold'>Other Facutlies</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        Allocationdata.length > 0 ? (
                            Allocationdata.map((data:any)=>{
                                return (
                                    <TableRow key={data.subject.slug}>
                                        <TableCell className='font-semibold'>{data.subject.subject_name}</TableCell>
                                        <TableCell className='border border-zinc-500 text-center font-semibold'>{data.theory}</TableCell>
                                        <TableCell className='border border-zinc-500 text-center font-semibold'>{data.practical}</TableCell>
                                        <TableCell className='border border-zinc-500 text-center font-semibold'>{data.tutorial}</TableCell>
                                        <TableCell className='border border-zinc-500 text-center font-semibold'>{data.theory + data.practical + data.tutorial}</TableCell>
                                        <TableCell className='border border-zinc-500 text-center font-semibold'>
                                            <Button variant={'default'} size={'icon'}
                                                onClick={(e)=>{e.preventDefault(); setSelectedSubject(data)}}
                                            ><Eye></Eye></Button>
                                        </TableCell> 
                                    </TableRow>
                                )
                            })
                        ) : (
                            null
                        )
                    }
                </TableBody>
            </Table>
            <Sheet open={!!selectedSubject} onOpenChange={() => {setSelectedSubject(null)}}>
                <SheetContent className='w-full sm:max-w-xl pb-10'>
                    <SheetHeader>
                    <SheetTitle className='mt-2'>{selectedSubject?.subject.subject_name}</SheetTitle>
                    </SheetHeader>
                    {selectedSubject && (
                        <>
                          <TeacherList selectedSubject={selectedSubject}></TeacherList> 
                           
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}

export default SubjectAllocationDetails