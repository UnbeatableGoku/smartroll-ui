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
      <Table className="border">
        <TableHeader className="sticky top-0 bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px] font-bold">Sr. No.</TableHead>
            <TableHead className="font-bold">Subject Name</TableHead>
            <TableHead className="w-[140px] text-right font-bold">
              Remaining Theory Hours
            </TableHead>
            <TableHead className="w-[140px] text-right font-bold">
              Remaining Practical Hours
            </TableHead>
            <TableHead className="w-[100px] text-right font-bold">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {nonAllocatedSubjects.map((subject, index) => (
            <TableRow
              key={index}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell className="text-right">
                {subject.remainingTheoryHours}
              </TableCell>
              <TableCell className="text-right">
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
