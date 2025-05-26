import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const NonAllocatedSubjects = () => {
  return (
    <div>
      <Table className="border bg-white">
        <TableHeader className="sticky top-0 bg-[#F7F7F7]">
          <TableRow>
            <TableHead className="w-[80px] font-bold text-black">
              Sr. No.
            </TableHead>
            <TableHead className="font-bold text-black">Subject Name</TableHead>
            <TableHead className="w-[140px] text-right font-bold text-black">
              Remaining Theory Hours
            </TableHead>
            <TableHead className="w-[140px] text-right font-bold text-black">
              Remaining Practical Hours
            </TableHead>
            <TableHead className="w-[100px] text-right font-bold text-black">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {nonAllocatedSubjects.map((subject, index) => (
            <TableRow
              key={index}
              className="transition-colors hover:bg-[#F7F7F7]"
            >
              <TableCell className="font-medium text-black">{index + 1}</TableCell>
              <TableCell className="text-black">{subject.name}</TableCell>
              <TableCell className="text-right text-black">
                {subject.remainingTheoryHours}
              </TableCell>
              <TableCell className="text-right text-black">
                {subject.remainingPracticalHours}
              </TableCell>
              <TableCell className="text-right">
                <SidePanel/>
              </TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </div>
  )
}
