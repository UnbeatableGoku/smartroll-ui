import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SubjectCard = ({day,selectedCards,toggleCardSelection,events}:any) => {
    
    const getCategoryColor = (category: string) => {
        switch (category) {
          case 'Work': return 'bg-blue-400 text-blue-900'
          case 'Personal': return 'bg-green-400 text-green-900'
          case 'Health': return 'bg-red-400 text-red-900'
          default: return 'bg-yellow-400 text-yellow-900'
        }
      }

  return (
   <>
        <Card 
          key={day}
          className={`cursor-pointer transition-all duration-200 relative bg-gray-800 ${
            selectedCards.includes(day) 
              ? 'bg-gray-700' 
              : 'hover:bg-gray-750'
          }`}
          onClick={() => toggleCardSelection(day)}
        >
          {selectedCards.includes(day) && (
            <div className="absolute top-2 right-2 bg-gray-600 text-gray-200 text-xs font-semibold py-1 px-2 rounded-full">
              Selected
            </div>
          )}
          <CardHeader>
            <h3 className="font-bold text-xl text-gray-100">{day}</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {events.map((event:any, index:any) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="font-medium text-gray-300">{event.time} - {event.description}</p>
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