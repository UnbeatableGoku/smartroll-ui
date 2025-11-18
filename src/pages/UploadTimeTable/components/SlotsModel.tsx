import React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TimeSlot {
  id: string
  day: string
  time: string
  title: string
  description: string
  color: string
  division: string
  type: 'theory' | 'lab'
}

interface SlotModalProps {
  isOpen: boolean
  event: TimeSlot
  onClose: () => void
  onSave: (event: TimeSlot) => void
  onDelete: (id: string) => void
}

const COLOR_OPTIONS = [
  { name: 'Blue', value: 'bg-blue-100 border-blue-400' },
  { name: 'Purple', value: 'bg-purple-100 border-purple-400' },
  { name: 'Green', value: 'bg-green-100 border-green-400' },
  { name: 'Red', value: 'bg-red-100 border-red-400' },
  { name: 'Yellow', value: 'bg-yellow-100 border-yellow-400' },
  { name: 'Pink', value: 'bg-pink-100 border-pink-400' },
]

const SlotsModel = (props: SlotModalProps) => {
  const { isOpen, event, onClose, onSave, onDelete } = props
  const [formData, setFormData] = React.useState(event)

  React.useEffect(() => {
    setFormData(event)
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id)
    }
  }

  if (!isOpen) return null

  return (
    <React.Fragment>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform">
        <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {event.title ? 'Edit Event' : 'New Event'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Division
                </label>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formData.division}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Day
                </label>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formData.day}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Time
              </label>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formData.time}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Event Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'theory' })}
                  className={`rounded-lg border-2 p-3 transition-all ${
                    formData.type === 'theory'
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-border bg-background hover:border-blue-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">
                    Theory Lecture
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    1 time slot
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'lab' })}
                  className={`rounded-lg border-2 p-3 transition-all ${
                    formData.type === 'lab'
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-border bg-background hover:border-purple-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">
                    Practical Lab
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    2 time slots
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Event Title *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Team Meeting"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Add details about this event..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, color: color.value })
                    }
                    className={`h-8 rounded border-2 transition-all ${color.value} ${
                      formData.color === color.value
                        ? 'border-foreground ring-2 ring-primary ring-offset-2'
                        : 'border-transparent'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 border-t border-border pt-4">
              {event.title && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SlotsModel
