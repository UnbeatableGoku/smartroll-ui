import React from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type EventCardProps = {
  title: string
  time: string
  batches: Batches[]
  location: string
}

interface Batches {
  batch_name: string
}

const EventCard = React.memo(
  ({ title, time, batches, location }: EventCardProps) => {
    const batchNames =
      batches?.map((batch) => batch.batch_name).join(', ') ||
      'No Batches Available'

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="cursor-pointer rounded-md border bg-gray-200 p-3 transition-colors hover:bg-gray-300 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900 md:p-4">
            <h4 className="text-sm font-semibold md:text-base">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 md:text-sm">
              {time}
            </p>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{title}</h4>
              <p className="text-sm text-muted-foreground">{time}</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Location:</span>
                <span className="col-span-3 text-sm">{location}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Description: </span>
                <span className="col-span-3 text-sm">&nbsp;{batchNames}</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  },
)

export default EventCard
