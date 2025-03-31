const SidePanel = () => {
  return (
    <div>
      {/* <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedSubject(subject.name)}
          >
            <Plus className="mr-2 h-4 w-4" /> Allocate
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedSubject}</SheetTitle>
            <SheetDescription>Allocate hours for this subject</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Remaining Hours</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Theory</TableCell>
                  <TableCell className="text-right">
                    {subject.remainingTheoryHours}
                  </TableCell>
                  <TableCell className="text-right">
                    {subject.totalTheoryHours}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Practical</TableCell>
                  <TableCell className="text-right">
                    {subject.remainingPracticalHours}
                  </TableCell>
                  <TableCell className="text-right">
                    {subject.totalPracticalHours}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    {subject.remainingTheoryHours +
                      subject.remainingPracticalHours}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {subject.totalTheoryHours + subject.totalPracticalHours}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </SheetContent>
      </Sheet> */}
    </div>
  )
}

export default SidePanel
