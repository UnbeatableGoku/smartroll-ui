import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectionProps } from './utils/selectionInterface'
import { Skeleton } from '@components/ui/skeleton'
const SemesterSelection = ({
    title,
    selectedValue,
    selectedValue2,
    onValueChange,
    placeholder,
    data
  }: SelectionProps) => {
  return (
    <Card className="h-auto w-full dark:bg-black">
        <CardHeader className="space-y-0 pb-2 pt-2">
          <div className="flex items-center justify-center">
            <CardTitle className="text-center text-base sm:text-lg">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {selectedValue2 ? (
            <Select
              value={selectedValue}
              onValueChange={(value) => {
                onValueChange(value)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {data?.map((semester) => (
                  <SelectItem
                    key={semester.slug}
                    value={semester.slug}
                    className="cursor-pointer"
                  >
                   Semester - {semester.no}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <Skeleton className="h-10 w-full sm:h-9" />
            </div>
          )}
        </CardContent>
      </Card>
  )
}

export default SemesterSelection