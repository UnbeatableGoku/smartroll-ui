import ChartCard from '@components/common/chartCard'

export const AnalysisCard = () => {
  const chartData = [
    { name: 'Jan', students: 400, attendance: 240 },
    { name: 'Feb', students: 300, attendance: 139 },
    { name: 'Mar', students: 200, attendance: 980 },
    { name: 'Apr', students: 278, attendance: 390 },
    { name: 'May', students: 189, attendance: 480 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analysis</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChartCard
          chartData={chartData}
          dataKey="students"
          stroke="#8884d8"
          title="Student Enrollment"
          type="monotone"
        />
        <ChartCard
          chartData={chartData}
          dataKey="attendance"
          stroke="#82ca9d"
          title="Attendance Rate"
          type="monotone"
        />
      </div>
    </div>
  )
}
