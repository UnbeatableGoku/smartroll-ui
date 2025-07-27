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
      <Table className="border bg-white">
        <TableHeader className="sticky top-0 bg-[#F7F7F7]">
          <TableRow>
            <TableHead className="w-[80px] font-bold text-black">
              Sr. No.
            </TableHead>
            <TableHead className="font-bold text-black">Faculty Name</TableHead>
            <TableHead className="font-bold text-black">
              Allocated Subjects
            </TableHead>
            <TableHead className="w-[80px] text-right font-bold text-black">
              Th
            </TableHead>
            <TableHead className="w-[80px] text-right font-bold text-black">
              Pr
            </TableHead>
            <TableHead className="w-[80px] text-right font-bold text-black">
              Tut
            </TableHead>
            <TableHead className="w-[80px] text-right font-bold text-black">
              DE
            </TableHead>
            <TableHead className="w-[80px] text-right font-bold text-black">
              Total
            </TableHead>
            <TableHead className="w-[80px] text-right font-bold text-black">
              Project
            </TableHead>
            <TableHead className="w-[140px] text-right font-bold text-black">
              Total with Project
            </TableHead>
            <TableHead className="w-[100px] text-right font-bold text-black">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {teacherData.map((teacher, index) => (
            <TableRow
              key={teacher.id}
              className="transition-colors hover:bg-[#F7F7F7]"
            >
              <TableCell className="font-medium text-black">{index + 1}</TableCell>
              <TableCell className="text-black">{teacher.name}</TableCell>
              <TableCell className="text-sm text-black">
                {teacher.subjects.map((subject) => subject.name).join(', ')}
              </TableCell>
              <TableCell className="text-right text-black">
                {teacher.subjects.reduce(
                  (sum, subject) => sum + subject.theoryHours,
                  0,
                )}
              </TableCell>
              <TableCell className="text-right text-black">
                {teacher.subjects.reduce(
                  (sum, subject) => sum + subject.practicalHours,
                  0,
                )}
              </TableCell>
              <TableCell className="text-right text-black">0</TableCell>
              <TableCell className="text-right text-black">0</TableCell>
              <TableCell className="text-right font-semibold text-black">
                {teacher.subjects.reduce(
                  (sum, subject) =>
                    sum + subject.theoryHours + subject.practicalHours,
                  0,
                )}
              </TableCell>
              <TableCell className="text-right text-black">0</TableCell>
              <TableCell className="text-right font-semibold text-black">
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
                  className="text-[#0261BE] hover:bg-[#0261BE]/10"
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
          ))} */}
        </TableBody>
      </Table>
    </div>
  )
}

export default AllocatedSubject
