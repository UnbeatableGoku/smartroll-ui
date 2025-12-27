import type { SubjectToTeacherMap } from '@/types/common'

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'

interface props {
  SubjectToTeacherAllocation: SubjectToTeacherMap | null
}
const StaticsCard = ({ SubjectToTeacherAllocation }: props) => {
  if (SubjectToTeacherAllocation) {
    return (
      <Card className="mb-6 border-none bg-[#F7F7F7] shadow-soft">
        <CardHeader>
          <CardTitle className="text-black">Allocation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SubjectToTeacherAllocation &&
              Object.entries(SubjectToTeacherAllocation.stats).map(
                ([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm capitalize text-black/60">
                      {key.split('_').join(' ')}
                    </span>
                    <span className="text-2xl font-bold text-black">
                      {value}
                    </span>
                  </div>
                ),
              )}
          </div>
        </CardContent>
      </Card>
    )
  } else {
    return (
      <Card className="mb-6 border-none bg-[#F7F7F7] shadow-soft">
        <CardHeader>
          <CardTitle className="text-black">Allocation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-4"
              >
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default StaticsCard
