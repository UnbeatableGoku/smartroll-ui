import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { getCategoryColor } from '@utils/helpers'

const SubjectCard = ({
  day,
  selectedCards,
  toggleCardSelection,
  events,
}: any) => {
  return (
    <>
      <Card
        key={day}
        className={`relative cursor-pointer bg-gray-800 transition-all duration-200 ${
          selectedCards.includes(day) ? 'bg-gray-700' : 'hover:bg-gray-750'
        }`}
        onClick={() => toggleCardSelection(day)}
      >
        {selectedCards.includes(day) && (
          <div className="absolute right-2 top-2 rounded-full bg-gray-600 px-2 py-1 text-xs font-semibold text-gray-200">
            Selected
          </div>
        )}
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-100">{day}</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {events.map((event: any, index: any) => (
              <div key={index} className="flex items-center justify-between">
                <p className="font-medium text-gray-300">
                  {event.time} - {event.description}
                </p>
                <Badge className={`${getCategoryColor(event.category)}`}>
                  {event.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default SubjectCard
