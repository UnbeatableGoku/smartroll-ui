import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { SelectionProps } from 'types/common'

import { Skeleton } from '@components/ui/skeleton'

const Selection = ({
  title,
  selectedValue, // for currently selected selection
  selectedValue2, // to render the selection items list based on the parent selection
  onValueChange, // to handle on select event to perform any task
  placeholder, // to display the data on the default selection
  data, // to render the data on the select item
  optionTitle, // to display the static text in all options
}: SelectionProps) => {
  return (
    <Card className="h-auto w-full dark:bg-black">
      <CardHeader className="space-y-0 pb-2 pt-2">
        <div className="flex items-center justify-center">
          <CardTitle className="text-center text-base sm:text-lg">
            {/* pass through props  */}
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
            <SelectTrigger className="w-full text-wrap">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {data?.map((item) => (
                <SelectItem
                  key={item.slug}
                  value={item.slug}
                  className="cursor-pointer"
                >
                  {optionTitle ? `${optionTitle} - ` : null} {item.name}
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

export default Selection
