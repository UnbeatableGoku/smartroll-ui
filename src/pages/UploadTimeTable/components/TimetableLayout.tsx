import React from 'react'

import { ChevronRight, Layers, X } from 'lucide-react'

interface TimeSlot {
  id: string
  day: string
  time: string
  title: string
  description: string
  color: string
  division: string
  type: 'theory' | 'lab' // theory = 1 slot, lab = 2 slots
  [key: string]: any
}

interface WeeklyTimetableProps {
  events: TimeSlot[]
  allEvents: TimeSlot[]
  activeDivision: string
  onSlotClick: (day: string, time: string) => void
  onEventMove: (eventId: string, newDay: string, newTime: string) => void
}

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const TIME_SLOTS = [
  '10:30 - 11:30',
  '11:30 - 12:30',
  '1:00 - 2:00',
  '2:00 - 3:00',
  '3:15 - 4:15',
  '4:15 - 5:15',
]

const TimetableLayout = (props: WeeklyTimetableProps) => {
  const { events, allEvents, activeDivision, onSlotClick, onEventMove } = props
  const [draggedEvent, setDraggedEvent] = React.useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = React.useState<{
    day: string
    time: string
  } | null>(null)
  const [conflictSlot, setConflictSlot] = React.useState<{
    day: string
    time: string
  } | null>(null)

  const getNextTimeSlot = (currentTime: string): string | null => {
    const currentIndex = TIME_SLOTS.indexOf(currentTime)
    if (currentIndex === -1 || currentIndex === TIME_SLOTS.length - 1)
      return null
    return TIME_SLOTS[currentIndex + 1]
  }

  const isSlotOccupiedByLab = (day: string, time: string): boolean => {
    // Check if current slot has a lab event
    const currentSlotEvents = events.filter(
      (e) => e.day === day && e.time === time && e.type === 'lab',
    )
    if (currentSlotEvents.length > 0) return true

    // Check if previous slot has a lab event (which would occupy this slot)
    const prevTimeIndex = TIME_SLOTS.indexOf(time) - 1
    if (prevTimeIndex >= 0) {
      const prevTime = TIME_SLOTS[prevTimeIndex]
      const prevSlotLabs = events.filter(
        (e) => e.day === day && e.time === prevTime && e.type === 'lab',
      )
      if (prevSlotLabs.length > 0) return true
    }

    return false
  }

  const eventsBySlot = React.useMemo(() => {
    const map: Record<string, TimeSlot[]> = {}
    TIME_SLOTS.forEach((time) => {
      DAYS.forEach((day) => {
        map[`${day}-${time}`] = []
      })
    })
    events.forEach((event) => {
      const key = `${event.day}-${event.time}`
      if (map[key]) {
        map[key].push(event)
      }
    })
    return map
  }, [events])

  const conflictsBySlot = React.useMemo(() => {
    const map: Record<string, number> = {}
    TIME_SLOTS.forEach((time) => {
      DAYS.forEach((day) => {
        const key = `${day}-${time}`
        const otherDivisionEvents = allEvents.filter(
          (e) =>
            e.day === day && e.time === time && e.division !== activeDivision,
        )
        map[key] = otherDivisionEvents.length
      })
    })
    return map
  }, [allEvents, activeDivision])

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.stopPropagation()
    setDraggedEvent(eventId)
    e.dataTransfer!.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, day: string, time: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedEvent) {
      const event = events.find((ev) => ev.id === draggedEvent)
      if (event?.type === 'lab') {
        const nextSlot = getNextTimeSlot(time)
        if (!nextSlot) {
          alert(
            'Lab events require 2 consecutive time slots. Cannot place at the last slot.',
          )
          setDraggedEvent(null)
          return
        }
        // Check if next slot is available
        const nextSlotEvents = eventsBySlot[`${day}-${nextSlot}`] || []
        if (nextSlotEvents.length > 0) {
          alert(
            'Lab events require 2 consecutive time slots. Next slot is occupied.',
          )
          setDraggedEvent(null)
          return
        }
      }

      onEventMove(draggedEvent, day, time)
      setDraggedEvent(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedEvent(null)
  }

  const getConflictEvents = (day: string, time: string) => {
    return allEvents.filter((e) => e.day === day && e.time === time)
  }

  const selectedSlotEvents = selectedSlot
    ? eventsBySlot[`${selectedSlot.day}-${selectedSlot.time}`] || []
    : []
  const conflictEvents = conflictSlot
    ? getConflictEvents(conflictSlot.day, conflictSlot.time)
    : []

  return (
    <div className="flex bg-background">
      {conflictSlot && (
        <div className="flex w-80 flex-col border-r border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border bg-orange-50 p-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Layers className="h-4 w-4 text-orange-600" />
                <h3 className="font-semibold text-foreground">All Divisions</h3>
              </div>
              <p className="text-sm font-medium text-foreground">
                {conflictSlot.day}
              </p>
              <p className="text-xs text-muted-foreground">
                {conflictSlot.time}
              </p>
            </div>
            <button
              onClick={() => setConflictSlot(null)}
              className="rounded p-1 transition-colors hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {conflictEvents.length > 0 ? (
              conflictEvents.map((event) => (
                <div
                  key={event.id}
                  className={`rounded-lg border-l-4 p-3 transition-all hover:shadow-md`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {event.division}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        event.type === 'lab'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {event.type === 'lab' ? 'Lab' : 'Theory'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No events in this slot
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <div className="h-screen">
            <div
              className="grid gap-0 border-b border-border bg-muted"
              style={{
                gridTemplateColumns: `140px repeat(${TIME_SLOTS.length}, 1fr)`,
              }}
            >
              <div className="sticky left-0 z-10 bg-muted p-4 text-sm font-semibold text-foreground">
                Day
              </div>
              {TIME_SLOTS.map((time) => (
                <div
                  key={time}
                  className="border-l border-border p-4 text-center text-sm font-semibold text-foreground"
                >
                  {time}
                </div>
              ))}
            </div>

            {DAYS.map((day) => (
              <div
                key={day}
                className="grid gap-0 border-b border-border"
                style={{
                  gridTemplateColumns: `140px repeat(${TIME_SLOTS.length}, 1fr)`,
                }}
              >
                <div className="sticky left-0 z-10 flex items-center border-r border-border bg-muted/50 p-4 font-semibold text-foreground">
                  {day}
                </div>

                {TIME_SLOTS.map((time) => {
                  const slotEvents = eventsBySlot[`${day}-${time}`] || []
                  const eventCount = slotEvents.length
                  const isSelected =
                    selectedSlot?.day === day && selectedSlot?.time === time
                  const conflictCount = conflictsBySlot[`${day}-${time}`] || 0
                  const occupiedByLab = isSlotOccupiedByLab(day, time)
                  const labEvent = slotEvents.find((e) => e.type === 'lab')

                  return (
                    <div
                      key={`${day}-${time}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, time)}
                      onClick={() => !occupiedByLab && onSlotClick(day, time)}
                      className={`group relative min-h-36 overflow-visible ${labEvent ? 'border-r-0' : 'border-r'} border-r border-border transition-colors ${
                        occupiedByLab && !labEvent
                          ? 'cursor-not-allowed bg-muted/30'
                          : 'cursor-pointer hover:bg-accent/50'
                      } ${isSelected ? 'bg-accent/20 ring-2 ring-primary' : ''} ${
                        conflictCount > 0 ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      {conflictCount > 0 &&
                        eventCount === 0 &&
                        !occupiedByLab && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setConflictSlot({ day, time })
                            }}
                            className="absolute right-2 top-2 z-10 transition-transform hover:scale-110"
                          >
                            <div className="flex items-center gap-1 rounded border border-orange-300 bg-orange-100 px-2 py-1">
                              <Layers className="h-3 w-3 text-orange-600" />
                              <span className="text-xs font-semibold text-orange-700">
                                {conflictCount}
                              </span>
                            </div>
                          </button>
                        )}

                      {labEvent && (
                        <div className="absolute inset-0 bottom-2 left-2 right-2 top-2 z-10">
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, labEvent.id)}
                            onDragEnd={handleDragEnd}
                            className={`w-full cursor-grab border-red-200 bg-white text-center transition-all hover:border-2 hover:shadow-lg active:cursor-grabbing`}
                            style={{
                              width: 'calc(200% + 0.6rem)',
                              height: 'calc(100%)',
                            }}
                          >
                            <div className="flex flex-col items-center justify-center text-black">
                              {labEvent.subjects.map((subject: any) => {
                                return (
                                  <div className="flex w-full justify-center space-x-1">
                                    <span>{subject.short_name + ' - '}</span>
                                    <span>{subject.teacher_name + ' - '}</span>
                                    <span>{subject.classroom}</span>
                                  </div>
                                )
                              })}
                            </div>
                            {/* <div className="flex items-center justify-between mb-1">
                              <p className="w-full text-xs font-semibold text-foreground">
                                {labEvent.title}
                              </p>
                              <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                                Lab
                              </span>
                            </div> */}
                          </div>
                        </div>
                      )}

                      {eventCount > 0 && !labEvent ? (
                        <div
                          className="relative h-full w-full"
                          style={{
                            minHeight: `${Math.min(eventCount, 2) * 28 + 20}px`,
                          }}
                        >
                          {conflictCount > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setConflictSlot({ day, time })
                              }}
                              className="absolute right-0 top-0 z-20 transition-transform hover:scale-110"
                            >
                              <div className="flex items-center gap-1 rounded border border-orange-300 bg-orange-100 px-2 py-1">
                                <Layers className="h-3 w-3 text-orange-600" />
                                <span className="text-xs font-semibold text-orange-700">
                                  {conflictCount}
                                </span>
                              </div>
                            </button>
                          )}

                          {slotEvents.slice(0, 1).map((event, index) => (
                            <div
                              key={event.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, event.id)}
                              onDragEnd={handleDragEnd}
                              className={`absolute left-2 right-2 flex h-full cursor-grab flex-col items-center justify-center transition-all hover:z-50 hover:shadow-lg active:cursor-grabbing ${
                                draggedEvent === event.id
                                  ? 'opacity-50 shadow-xl'
                                  : 'opacity-100'
                              }${event.color}`}
                              style={{
                                transform: `translateY(${index * 40}px)`,
                                zIndex:
                                  draggedEvent === event.id ? 1000 : index,
                                boxShadow: `0 ${index * 2}px ${index * 4}px rgba(0, 0, 0, 0.15)`,
                                top: 0,
                              }}
                            >
                              {/* subjects: [
        {
          short_name: 'AI',
          teacher_name: 'aman',
          classroom: 210,
        },
      ], */}
                              <div className="flex w-full flex-col items-center justify-center text-black">
                                {event.subjects.map((subject: any) => {
                                  return (
                                    <div className="flex w-full justify-center space-x-1">
                                      <span>{subject.short_name + ' - '}</span>
                                      <span>
                                        {subject.teacher_name + ' - '}
                                      </span>
                                      <span>{subject.classroom}</span>
                                    </div>
                                  )
                                })}
                              </div>
                              {/* <div className="flex items-start justify-between">
                                <p className="flex-1 text-xs font-semibold truncate text-foreground">
                                  {event.title}
                                </p>
                                <span className="ml-1 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                                  T
                                </span>
                              </div> */}
                              {/* <p className="text-xs truncate text-muted-foreground">
                                {event.description}
                              </p> */}
                            </div>
                          ))}

                          {eventCount > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSlot({ day, time })
                              }}
                              className="absolute bottom-2 left-2 right-2 rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                            >
                              Show all ({eventCount})
                            </button>
                          )}
                        </div>
                      ) : (
                        !occupiedByLab &&
                        !labEvent && (
                          <div className="h-full w-full rounded border-2 border-dashed border-border opacity-0 transition-opacity group-hover:opacity-100" />
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="flex w-80 flex-col border-l border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <h3 className="font-semibold text-foreground">
                {selectedSlot.day}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedSlot.time}
              </p>
            </div>
            <button
              onClick={() => setSelectedSlot(null)}
              className="rounded p-1 transition-colors hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {selectedSlotEvents.length > 0 ? (
              selectedSlotEvents.map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event.id)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-grab rounded-lg border-l-4 p-3 transition-all hover:shadow-md active:cursor-grabbing ${event.color} group`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        event.type === 'lab'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {event.type === 'lab' ? 'Lab (2 slots)' : 'Theory'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No events in this slot
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimetableLayout
