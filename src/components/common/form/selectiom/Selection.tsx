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
    <div className="h-auto w-full rounded-sm border-none bg-[#F7F7F7] shadow-soft">
      <div className="flex items-center px-3 py-2">
        <div className="text-sm text-black">
          {/* pass through props  */}
          {title + ' : '}
        </div>
      </div>

      <div className="px-2 pb-2">
        {selectedValue2 ? (
          <Select
            value={selectedValue}
            onValueChange={(value) => {
              onValueChange(value)
            }}
          >
            <SelectTrigger className="w-full border-[#0261BE] bg-white text-black">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {data?.map((item) => (
                <SelectItem
                  key={item.slug}
                  value={item.slug}
                  className="cursor-pointer hover:bg-[#0261BE]/10"
                >
                  {optionTitle ? `${optionTitle} - ` : null} {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            <Skeleton className="h-10 w-full bg-[#F7F7F7] sm:h-9" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Selection
