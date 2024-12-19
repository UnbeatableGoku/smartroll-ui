import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import TeacherSubjectDetails from './TeacherSubjectDetails'
import { TeacherToSubjectMap } from 'types/common'

interface props {
    TeacherToSubjectAllocation: TeacherToSubjectMap[] | null
    setSelectedTeacher : any
    selectedTeacher : any
    handleOnChangeManageHoursForSubjectToTeacher : any
}
const TeacherSubjectTable = ({ TeacherToSubjectAllocation,setSelectedTeacher,selectedTeacher,handleOnChangeManageHoursForSubjectToTeacher }: props) => {
    const [selectedTeacherSlug, setSelectedTeacherSlug] = useState<any>(null)
    return (
        <>
            <Table className='border-collapse border border-zinc-500'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-center border-zinc-500 '>Teacher Name</TableHead>
                        <TableHead className='text-center border-zinc-500 '>Theory</TableHead>
                        <TableHead className='text-center border-zinc-500 '>Lab</TableHead>
                        <TableHead className='text-center border-zinc-500 '>Practical</TableHead>
                        <TableHead className='text-center border-zinc-500 '>Tutorial</TableHead>
                        <TableHead className='text-center border-zinc-500 '>Allocated Hours</TableHead>
                        <TableHead className='text-center border-zinc-500 '>Remaining Hours</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {TeacherToSubjectAllocation && Object.entries(TeacherToSubjectAllocation[0]).map(([slug, value]) => (
                        <TableRow
                            key={slug}
                            onClick={() => { setSelectedTeacher(value); setSelectedTeacherSlug(slug) }}
                            className="cursor-pointer hover:bg-zinc-600/45"
                        >
                            <TableCell className='font-bold border border-zinc-500'>{value.teacher.profile.name}</TableCell>
                            <TableCell className='text-center font-bold border border-zinc-500'>
                                {value.theory
                                    ? Object.values(value.theory).reduce((sum, item) => sum + (item.hours || 0), 0)
                                    : 0}
                            </TableCell>
                            <TableCell className='text-center font-bold border border-zinc-500'>
                            {value.lab
                                    ? Object.values(value.lab).reduce((sum, item) => sum + (item.hours || 0), 0)
                                    : 0}
                            </TableCell>
                            <TableCell className='text-center font-bold border border-zinc-500'>
                            {value.practical
                                    ? Object.values(value.practical).reduce((sum, item) => sum + (item.hours || 0), 0)
                                    : 0}
                            </TableCell>
                            <TableCell className='text-center font-bold border border-zinc-500'>
                            {value.tutorial
                                    ? Object.values(value.tutorial).reduce((sum, item) => sum + (item.hours || 0), 0)
                                    : 0}
                            </TableCell>
                            <TableCell className='text-center font-bold border border-zinc-500'>{value.initial_lab_hours + value.initial_practical_sub_hours + value.initial_theory_hour - value.total_hours_left}</TableCell>
                            <TableCell className='text-center font-bold border border-zinc-500'>{value.total_hours_left}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Sheet open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
                <SheetContent className='w-full sm:max-w-xl pb-10'>
                    <SheetHeader>
                        <SheetTitle>{selectedTeacher?.teacher.profile.name}</SheetTitle>
                    </SheetHeader>
                    {selectedTeacher && (<>
                        <TeacherSubjectDetails
                            selectedTeacher={selectedTeacher}
                            selectedTeacherSlug = {selectedTeacherSlug}
                            handleOnChangeManageHoursForSubjectToTeacher = {handleOnChangeManageHoursForSubjectToTeacher}
                            key={selectedTeacherSlug} // Add this line to ensure re-render on subject change
                        />
                    </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}

export default TeacherSubjectTable