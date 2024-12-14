import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { SubjectToTeacherMap} from 'types/common'
  interface props {
    SubjectToTeacherAllocation : SubjectToTeacherMap | null
}
const StaticsCard = ({SubjectToTeacherAllocation}:props) => {
  return (
    <Card className="mb-6">
    <CardHeader>
      <CardTitle>Allocation Statistics</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SubjectToTeacherAllocation && Object.entries(SubjectToTeacherAllocation.stats).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-sm text-gray-500">{key.split('_').join(' ')}</span>
            <span className="text-2xl font-bold">{value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  )
}

export default StaticsCard