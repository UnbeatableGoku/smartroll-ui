import { SubjectToTeacherMap } from 'types/common'

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'

interface props {
  SubjectToTeacherAllocation: SubjectToTeacherMap | null
}
const StaticsCard = ({ SubjectToTeacherAllocation }: props) => {
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
                  <span className="text-2xl font-bold text-black">{value}</span>
                </div>
              ),
            )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StaticsCard
