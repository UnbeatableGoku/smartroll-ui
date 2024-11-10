import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CurveType } from 'recharts/types/shape/Curve'

interface ChartCardProps<T> {
  type: CurveType
  stroke: string
  chartData: T[]
  dataKey: keyof T
  title: string
}

const ChartCard = <T extends Record<string, string | number>>({
  dataKey,
  type,
  stroke,
  chartData,
  title,
}: ChartCardProps<T>) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type={type} dataKey={dataKey as string} stroke={stroke} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default ChartCard
