import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const AllocatedSubject = () => {
  return (
    <div>
      <Table className="border">
        <TableHeader className="sticky top-0 bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px] font-bold">Sr. No.</TableHead>
            <TableHead className="font-bold">Faculty Name</TableHead>
            <TableHead className="font-bold">Allocated Subjects</TableHead>
            <TableHead className="w-[80px] text-right font-bold">Th</TableHead>
            <TableHead className="w-[80px] text-right font-bold">Pr</TableHead>
            <TableHead className="w-[80px] text-right font-bold">Tut</TableHead>
            <TableHead className="w-[80px] text-right font-bold">DE</TableHead>
            <TableHead className="w-[80px] text-right font-bold">
              Total
            </TableHead>
            <TableHead className="w-[80px] text-right font-bold">
              Project
            </TableHead>
            <TableHead className="w-[140px] text-right font-bold">
              Total with Project
            </TableHead>
            <TableHead className="w-[100px] text-right font-bold">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {teacherData.map((teacher, index) => (
            <TableRow
              key={teacher.id}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell className="text-sm">
                {teacher.subjects.map((subject) => subject.name).join(', ')}
              </TableCell>
              <TableCell className="text-right">
                {teacher.subjects.reduce(
                  (sum, subject) => sum + subject.theoryHours,
                  0,
                )}
              </TableCell>
              <TableCell className="text-right">
                {teacher.subjects.reduce(
                  (sum, subject) => sum + subject.practicalHours,
                  0,
                )}
              </TableCell>
              <TableCell className="text-right">0</TableCell>
              <TableCell className="text-right">0</TableCell>
              <TableCell className="text-right font-semibold">
                {teacher.subjects.reduce(
                  (sum, subject) =>
                    sum + subject.theoryHours + subject.practicalHours,
                  0,
                )}
              </TableCell>
              <TableCell className="text-right">0</TableCell>
              <TableCell className="text-right font-semibold">
                {teacher.subjects.reduce(
                  (sum, subject) =>
                    sum + subject.theoryHours + subject.practicalHours,
                  0,
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTeacher(teacher.id)}
                >
                  {expandedTeacher === teacher.id ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
                 {selectedPerson?.slug === teacher.slug && (
                <TableRow id={`subjects-${teacher.slug}`}>
                  <TableCell colSpan={4} className="p-0">
                    <div className="p-4 dark:bg-black">
                      <h3 className="mb-2 font-semibold">
                        Remaining Subject Choice Of {teacher.profile.name}
                      </h3>
                      <ScrollArea className="h-[150px]">
                        <ul className="space-y-2">
                          {teacher.finalized_choises.map(
                            (subject: any, index: any) => (
                              <li
                                key={index}
                                className="rounded border bg-background p-2"
                              >
                                {subject.subject_name} - {subject.subject_code}
                              </li>
                            ),
                          )}
                        </ul>
                      </ScrollArea>
                    </div>
                  </TableCell>
                </TableRow>
              )}
          ))} */}
        </TableBody>
      </Table>
    </div>
  )
}

export default AllocatedSubject
