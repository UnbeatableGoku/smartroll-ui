import { useState } from 'react'

import { ChevronRight, Unlock, X } from 'lucide-react'

import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { ScrollArea } from '@components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'

const TeacherToSubjectMapPanel = ({
  openPanelForTeacherToSubjectMap,
  setOpenPanelForTeacherToSubjectMap,
  teacherToSubjectMapData,
  handleOnDeleteTeacherSubjectChoice,
  handleOnClickForDownloadExcelForTeacherToSubjectMap,
}: any) => {
  const [selectedPerson, setSelectedPerson] = useState<any>(null)
  return (
    <>
      {/* Overlay */}
      {openPanelForTeacherToSubjectMap && (
        <div
          className="fixed inset-0 z-20 w-full bg-black/50"
          onClick={() => {
            setOpenPanelForTeacherToSubjectMap(!openPanelForTeacherToSubjectMap)
          }}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-full transform border-l bg-white shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out lg:w-1/2 ${
          openPanelForTeacherToSubjectMap ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">
                Teacher to subject map
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#0261BE] hover:bg-[#0261BE]/10"
                onClick={() => {
                  setOpenPanelForTeacherToSubjectMap(
                    !openPanelForTeacherToSubjectMap,
                  )
                }}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close panel</span>
              </Button>
            </div>
            <div className="mt-2 flex w-full justify-center">
              <Button
                className="bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
                onClick={() => {
                  handleOnClickForDownloadExcelForTeacherToSubjectMap()
                }}
              >
                Download Excel file
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-grow">
            <Table className="w-full overflow-y-visible border">
              <TableHeader className="bg-[#F7F7F7]">
                <TableRow>
                  <TableHead className="w-auto font-semibold text-black">
                    Teacher Name
                  </TableHead>
                  <TableHead className="w-32 text-center font-semibold text-black">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacherToSubjectMapData.map((teacher: any, index: any) => (
                  <>
                    <TableRow key={index} className="hover:bg-[#F7F7F7]">
                      <TableCell className="font-medium text-black">
                        {teacher.teacher.profile.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#0261BE] hover:bg-[#0261BE]/10"
                            onClick={() =>
                              setSelectedPerson(
                                selectedPerson?.teacher.slug ===
                                  teacher.teacher.slug
                                  ? null
                                  : teacher,
                              )
                            }
                            aria-expanded={
                              selectedPerson?.teacher.slug ===
                              teacher.teacher.slug
                            }
                            aria-controls={`subjects-${teacher.teacher.slug}`}
                          >
                            {selectedPerson?.teacher.slug ===
                            teacher.teacher.slug ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {selectedPerson?.teacher.slug ===
                              teacher.teacher.slug
                                ? 'Hide'
                                : 'Show'}{' '}
                              subjects
                            </span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {selectedPerson?.teacher.slug === teacher.teacher.slug && (
                      <TableRow id={`subjects-${teacher.teacher.slug}`}>
                        <TableCell colSpan={4} className="p-0">
                          <div className="bg-[#F7F7F7] p-4">
                            <Button
                              className="flex w-full items-center bg-red-500 text-white hover:bg-red-600"
                              size="sm"
                              title="Unclock subject choice"
                              onClick={() => {
                                confirm(
                                  `Are you sure you want to unlock subject choice of ${teacher.teacher.profile.name}`,
                                )
                                  ? handleOnDeleteTeacherSubjectChoice(
                                      teacher.teacher.slug,
                                      teacher.teacher.profile.name,
                                    )
                                  : null
                              }}
                            >
                              <span>Unlock choice</span>{' '}
                              <Unlock className="ml-2 h-4 w-4" />
                            </Button>
                            <ScrollArea className="flex h-auto flex-col">
                              {teacher.selected_subjects ? (
                                teacher.selected_subjects.map((stream: any) => {
                                  if (stream.subjects.length > 0) {
                                    return (
                                      <ul className="mt-4 rounded-sm border bg-white px-2 py-2">
                                        <div className="mb-2 flex w-full items-center justify-between">
                                          <h3 className="mb-2 font-semibold text-black">
                                            {stream.stream_name.split('|')[0]}
                                          </h3>
                                        </div>
                                        {stream.subjects.map(
                                          (subject: any, index: any) => (
                                            <li
                                              key={index}
                                              className="my-1 flex justify-between rounded border bg-white p-2 text-black"
                                            >
                                              <span>
                                                {subject.subject_name + ' '} |
                                                sem - {subject.sem_year + ' '} |{' '}
                                                {subject.subject_code}{' '}
                                              </span>
                                              <Badge className="bg-[#0261BE] text-white">
                                                {subject.ordering}
                                              </Badge>
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    )
                                  } else {
                                    return (
                                      <div className="mt-4 rounded-sm border bg-white px-2 py-2">
                                        <div className="flex w-full items-center justify-between">
                                          <h3 className="mb-2 items-center justify-between font-semibold text-black">
                                            {stream.stream_name.split('|')[0]}
                                          </h3>
                                        </div>
                                        <div className="mt-1 w-full rounded border bg-white p-2 text-center text-black/60">
                                          No Subject choice found
                                        </div>
                                      </div>
                                    )
                                  }
                                })
                              ) : (
                                <div className="my-1 w-full text-center text-black/60">
                                  No Subject Choice
                                </div>
                              )}
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
