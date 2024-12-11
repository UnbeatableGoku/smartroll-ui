import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { ScrollArea } from '@components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { ChevronRight, Unlock, X } from 'lucide-react'
import { useState } from 'react'

const TeacherToSubjectMapPanel = ({ openPanelForTeacherToSubjectMap, setOpenPanelForTeacherToSubjectMap, teacherToSubjectMapData, handleOnDeleteTeacherSubjectChoice,handleOnClickForDownloadExcelForTeacherToSubjectMap}: any) => {
    const [selectedPerson, setSelectedPerson] = useState<any>(null)
    return (
        <>
            {/* Overlay */}
            {openPanelForTeacherToSubjectMap && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 w-full"
                    onClick={() => { setOpenPanelForTeacherToSubjectMap(!openPanelForTeacherToSubjectMap) }}
                />
            )}

            {/* Sliding Panel */}
            <div
                className={`fixed inset-y-0 right-0 z-30 w-full transform border-l bg-background/80 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out lg:w-1/2  ${openPanelForTeacherToSubjectMap ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex h-full flex-col">
                    <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Teacher to subject map</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground"
                                onClick={() => {
                                    setOpenPanelForTeacherToSubjectMap(!openPanelForTeacherToSubjectMap)
                                }}
                            >
                                <X className="h-6 w-6" />
                                <span className="sr-only">Close panel</span>
                            </Button>
                        </div>
                        <div className='flex w-full justify-center mt-2'>
                            <Button variant={'default'} onClick={()=>{handleOnClickForDownloadExcelForTeacherToSubjectMap()}}>
                                Download Excel file
                            </Button>
                        </div>
                    </div>
                    <ScrollArea className="flex-grow">
                        <Table className='border w-full overflow-y-visible'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-auto">
                                        Teacher Name
                                    </TableHead>
                                    <TableHead className="w-32 text-center">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    teacherToSubjectMapData.map((teacher: any, index: any) => (
                                        <>
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {teacher.teacher.profile.name}
                                                </TableCell>
                                                <TableCell >
                                                    <div className='flex items-center justify-center'>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSelectedPerson(
                                                                    selectedPerson?.teacher.slug === teacher.teacher.slug ? null : teacher,
                                                                )
                                                            }
                                                            aria-expanded={selectedPerson?.teacher.slug === teacher.teacher.slug}
                                                            aria-controls={`subjects-${teacher.teacher.slug}`}
                                                        >
                                                            {selectedPerson?.teacher.slug === teacher.teacher.slug ? (
                                                                <X className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )}
                                                            <span className="sr-only">
                                                                {selectedPerson?.teacher.slug === teacher.teacher.slug ? 'Hide' : 'Show'}{' '}
                                                                subjects
                                                            </span>
                                                        </Button>

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {selectedPerson?.teacher.slug === teacher.teacher.slug && (
                                                <TableRow id={`subjects-${teacher.teacher.slug}`}>
                                                    <TableCell colSpan={4} className="p-0">
                                                        <div className="p-4 dark:bg-black">
                                                        <Button variant={'destructive'} size={'sm'} title='Unclock subject choice' className='w-full flex items-center'
                                                                                                onClick={() => { confirm(`Are you sure you want to unlock subject choice of ${teacher.teacher.profile.name}`) ? handleOnDeleteTeacherSubjectChoice(teacher.teacher.slug, teacher.teacher.profile.name) : null }}
                                                                                            >
                                                                                              <span>Unlock choice </span> <Unlock></Unlock>
                                                                                            </Button>
                                                            <ScrollArea className="h-auto flex flex-col">
                                                                {
                                                                    teacher.selected_subjects ?
                                                                        teacher.selected_subjects.map((stream: any) => {
                                                                            if (stream.subjects.length > 0) {
                                                                                return (
                                                                                    <ul className="mt-4 border px-2 py-2 rounded-sm">
                                                                                        <div className='flex w-full justify-between items-center mb-2'>
                                                                                            <h3 className="mb-2 font-semibold">{stream.stream_name.split('|')[0]}</h3>
                                                                                            
                                                                                        </div>
                                                                                        {stream.subjects.map(
                                                                                            (subject: any, index: any) => (
                                                                                                <li
                                                                                                    key={index}
                                                                                                    className="rounded border bg-background p-2 flex justify-between my-1"
                                                                                                >
                                                                                                    <span>{subject.subject_name + ' '} | sem -   {subject.sem_year + ' '}  | {subject.subject_code}  </span>
                                                                                                    <Badge>
                                                                                                        {subject.ordering}
                                                                                                    </Badge>
                                                                                                </li>
                                                                                            ),
                                                                                        )}
                                                                                    </ul>
                                                                                )

                                                                            }
                                                                            else {
                                                                                return (
                                                                                    <div className='border px-2 py-2 rounded-sm mt-4'>
                                                                                    <div className='flex w-full justify-between items-center'>
                                                                                    <h3 className="mb-2 font-semibold items-center justify-between">{stream.stream_name.split('|')[0]}</h3>
                                                                                    </div>
                                                                                    <div className='text-center w-full mt-1 rounded border bg-background p-2'>No Subject choice found</div>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })
                                                                        : (
                                                                            <div className="text-center w-full my-1">No Subjet Choice</div>
                                                                        )
                                                                }
                                                            </ScrollArea>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        </>
    )
}

export default TeacherToSubjectMapPanel

