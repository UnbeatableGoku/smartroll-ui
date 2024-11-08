import React, { useEffect, useState } from 'react'

import SubjectCard from './SubjectCard'
import useStream from '@components/common/uploadTimeTable/useStream'
import StreamSelection from '@components/common/uploadTimeTable/StreamSelection'
import DivisionSelection from '@components/common/uploadTimeTable/DivisionSelection'
import useDivision from '@components/common/uploadTimeTable/useDivision'
const SubjectSelection = () => {
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [selectedStream, setSelectedStream] = useState<string>('')
  const [selectedDivision, setSelectedDivision] = useState<string>('')

  const { stream, handleStream } = useStream()
  const { division, handleDivision } = useDivision()
  const toggleCardSelection = (day: string) => {
    setSelectedCards(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const handleOnValueChangeStreams = (value: string) => {
    setSelectedStream(value)
    setSelectedDivision('')
    handleDivision(value)
  }

  const handlenValueChangeDivision = (value: string) => {
    setSelectedDivision(value)
    // setLoadTimeTable(true)
    // handleTimeTable(value)
  }


  const days = [
    {
      day: 'Theory Of Computation', events: [
        { time: '10:00 AM', description: 'Meeting', category: 'Work' },
        { time: '2:00 PM', description: 'Lunch with Steve', category: 'Personal' }
      ]
    },
    {
      day: 'Tuesday', events: [
        { time: '9:00 AM', description: 'Gym', category: 'Health' },
        { time: '11:00 AM', description: 'Project Review', category: 'Work' }
      ]
    },
    {
      day: 'Wednesday', events: [
        { time: '1:00 PM', description: "Doctor's Appointment", category: 'Health' },
        { time: '3:00 PM', description: 'Call with Client', category: 'Work' }
      ]
    },
    {
      day: 'Thursday', events: [
        { time: '10:00 AM', description: 'Team Meeting', category: 'Work' },
        { time: '12:00 PM', description: 'Lunch with Sarah', category: 'Personal' }
      ]
    },
    {
      day: 'Friday', events: [
        { time: '9:00 AM', description: 'Yoga Class', category: 'Health' },
        { time: '11:00 AM', description: 'Project Deadline', category: 'Work' }
      ]
    },
    {
      day: 'Saturday', events: [
        { time: '10:00 AM', description: 'Brunch with Family', category: 'Personal' },
        { time: '2:00 PM', description: 'Grocery Shopping', category: 'Personal' }
      ]
    },
    {
      day: 'Sunday', events: [
        { time: '9:00 AM', description: 'Morning Run', category: 'Health' },
        { time: '7:00 PM', description: 'Dinner with Friends', category: 'Personal' }
      ]
    }
  ]

  useEffect(() => {
    handleStream()
  }, [])


  return (
    <>
      <div className='flex flex-col space-y-4 w-full'>

        {/* time table selection */}
        <div className="flex flex-col space-y-2 rounded-xl md:space-y-4">
          <div className="flex w-full flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
            {/* Stream Selection Card */}
            {
              stream && (
                <>
                  <div className="relative w-full md:w-[240px] lg:w-[320px]">
                    <StreamSelection
                      title="Stream"
                      selectedValue={selectedStream}
                      onValueChange={handleOnValueChangeStreams}
                      placeholder="Select Stream"
                      data={stream}
                    />
                    {/* Connecting Lines */}
                    <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
                    <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
                  </div>
                </>
              )
            }
            {
              division && (
                <>
                  <div className="relative w-full md:w-[240px] lg:w-[320px]">
                    {/* Semester Selection Card */}
                    <DivisionSelection
                      title="Semester"
                      selectedValue={selectedDivision}
                      selectedValue2={selectedStream}
                      onValueChange={handlenValueChangeDivision}
                      placeholder="Select Semester"
                      data={division}
                    />
                    {/* Connecting Lines */}
                    <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
                    <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
                  </div>
                </>
              )
            }


            {/* Year Selection Card */}
            {
              division && (
                <>
                  <div className="relative w-full md:w-[240px] lg:w-[320px]">
                    <DivisionSelection
                      title="Academic Year"
                      selectedValue={selectedDivision}
                      selectedValue2={selectedStream}
                      onValueChange={handlenValueChangeDivision}
                      placeholder="Select Year"
                      data={division}
                    />
                  </div>
                </>
              )
            }
          </div>
        </div>

        <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
          {days.map((dayData) => (
            <>
              <SubjectCard day={dayData.day} selectedCards={selectedCards} toggleCardSelection={toggleCardSelection} events={dayData.events}></SubjectCard>
              {/* <Card 
          key={dayData.day}
          className={`cursor-pointer transition-all duration-200 relative bg-gray-800 ${
            selectedCards.includes(dayData.day) 
            ? 'bg-gray-700' 
            : 'hover:bg-gray-750'
          }`}
          onClick={() => toggleCardSelection(dayData.day)}
          >
          {selectedCards.includes(dayData.day) && (
            <div className="absolute top-2 right-2 bg-gray-600 text-gray-200 text-xs font-semibold py-1 px-2 rounded-full">
              Selected
            </div>
          )}
          <CardHeader>
            <h3 className="font-bold text-xl text-gray-100">{dayData.day}</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {dayData.events.map((event, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="font-medium text-gray-300">{event.time} - {event.description}</p>
                  <Badge className={`${getCategoryColor(event.category)}`}>
                    {event.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
            </>
          ))}
        </main>
      </div>
    </>
  )
}

export default SubjectSelection