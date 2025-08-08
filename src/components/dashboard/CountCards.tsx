import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CountCards = () => {
  const countCards = [
    { title: 'Total Batches', value: '5' },
    { title: 'Total Semesters', value: '6' },
    { title: 'Total Divisions', value: '3' },
    { title: 'Total Students', value: '1500' },
    { title: 'Total Courses', value: '25' },
  ]

  return (
    <>
      <div className="flex flex-col space-y-2 rounded-xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {countCards.map((card, index) => (
            <Card key={index} className="border-none bg-[#F7F7F7] shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
                <CardTitle className="text-sm font-medium text-black">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-3">
                <div className="text-2xl font-bold text-black">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default CountCards
