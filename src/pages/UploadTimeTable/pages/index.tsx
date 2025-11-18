import React from 'react'

import SlotsModel from '../components/SlotsModel'
import TimetableLayout from '../components/TimetableLayout'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'

TimetableLayout

interface TimeSlot {
  id: string
  day: string
  time: string
  title: string
  description: string
  color: string
  division: string
  type: 'theory' | 'lab'
  [key: string]: any
}

const DIVISIONS = ['Division A', 'Division B', 'Division C', 'Division D']

// const DIVISIONS = ['A', 'B', 'C']
const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3']

const Timetable = () => {
  // const [activeDivision, setActiveDivision] = React.useState(DIVISIONS[0])
  const [selectedSemester, setSelectedSemester] = React.useState(SEMESTERS[0])

  const [events, setEvents] = React.useState<TimeSlot[]>([
    {
      id: '1',
      day: 'Monday',
      time: '10:30 - 11:30',
      title: 'Team Standup',
      description: 'Daily team sync',
      color: 'bg-blue-100 border-blue-400',
      division: 'Division A',
      type: 'theory', // Added type
      subjects: [
        {
          short_name: 'AI',
          teacher_name: 'aman',
          classroom: 210,
        },
      ],
    },
    {
      id: '2',
      day: 'Wednesday',
      time: '2:00 - 3:00',
      title: 'Design Review',
      description: 'Review new designs',
      color: 'bg-purple-100 border-purple-400',
      division: 'Division A',
      type: 'theory', // Added type
      subjects: [
        {
          short_name: 'AI-1',
          teacher_name: 'aman-1',
          classroom: 210,
        },
      ],
    },
    {
      id: '3',
      day: 'Friday',
      time: '10:30 - 11:30',
      title: 'Client Meeting',
      description: 'Q4 planning',
      color: 'bg-green-100 border-green-400',
      division: 'Division B',
      type: 'theory', // Added type
      subjects: [
        {
          short_name: 'AI-2',
          teacher_name: 'aman-2',
          classroom: 210,
        },
      ],
    },
    {
      id: '4',
      day: 'Monday',
      time: '10:30 - 11:30',
      title: 'Physics Lab',
      description: 'Practical session',
      color: 'bg-red-100 border-red-400',
      division: 'Division C',
      type: 'lab', // Added lab type example
      subjects: [
        {
          short_name: 'AI',
          teacher_name: 'aman',
          classroom: 210,
        },
        {
          short_name: 'AI-1',
          teacher_name: 'aman-1',
          classroom: 211,
        },
        {
          short_name: 'AI-2',
          teacher_name: 'aman-1',
          classroom: 212,
        },
        {
          short_name: 'AI-3',
          teacher_name: 'aman-1',
          classroom: 213,
        },
        {
          short_name: 'AI-3',
          teacher_name: 'aman-1',
          classroom: 213,
        },
      ],
    },
  ])

  const [activeDivision, setActiveDivision] = React.useState(DIVISIONS[0])
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleSlotClick = (day: string, time: string) => {
    const existing = events.find(
      (e) => e.day === day && e.time === time && e.division === activeDivision,
    )
    setSelectedSlot(
      existing || {
        id: Math.random().toString(),
        day,
        time,
        title: '',
        description: '',
        color: 'bg-blue-100 border-blue-400',
        division: activeDivision,
        type: 'theory', // Default to theory type
      },
    )
    setIsModalOpen(true)
  }

  const handleEventMove = (
    eventId: string,
    newDay: string,
    newTime: string,
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, day: newDay, time: newTime } : event,
      ),
    )
  }

  const handleSaveEvent = (event: TimeSlot) => {
    if (event.type === 'lab') {
      const TIME_SLOTS = [
        '10:30 - 11:30',
        '11:30 - 12:30',
        '1:00 - 2:00',
        '2:00 - 3:00',
        '3:15 - 4:15',
        '4:15 - 5:15',
      ]
      const currentIndex = TIME_SLOTS.indexOf(event.time)

      if (currentIndex === TIME_SLOTS.length - 1) {
        alert(
          'Lab events require 2 consecutive time slots. Cannot place at the last slot.',
        )
        return
      }

      const nextSlot = TIME_SLOTS[currentIndex + 1]
      const nextSlotOccupied = events.some(
        (e) =>
          e.day === event.day &&
          e.time === nextSlot &&
          e.division === event.division &&
          e.id !== event.id,
      )

      if (nextSlotOccupied) {
        alert(
          'Lab events require 2 consecutive time slots. Next slot is occupied.',
        )
        return
      }
    }

    setEvents((prev) => {
      const existing = prev.findIndex((e) => e.id === event.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = event
        return updated
      }
      return [...prev, event]
    })
    setIsModalOpen(false)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setIsModalOpen(false)
  }

  const activeEvents = events.filter((e) => e.division === activeDivision)

  const allEvents = events

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Weekly Schedule
          </h1>
          <div className="ml-auto w-full sm:w-auto">
            <Select
              value={selectedSemester}
              onValueChange={(value) => setSelectedSemester(value)}
            >
              <SelectTrigger className="w-full text-black sm:w-48">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-border">
          {DIVISIONS.map((division) => (
            <button
              key={division}
              onClick={() => setActiveDivision(division)}
              className={`relative px-4 py-2 text-sm font-semibold transition-all sm:px-6 sm:py-3 ${
                activeDivision === division
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {division}
              {activeDivision === division && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <TimetableLayout
          events={activeEvents}
          allEvents={allEvents}
          activeDivision={activeDivision}
          onSlotClick={handleSlotClick}
          onEventMove={handleEventMove}
        />

        {selectedSlot && (
          <SlotsModel
            isOpen={isModalOpen}
            event={selectedSlot}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </main>
  )
}

export default Timetable
