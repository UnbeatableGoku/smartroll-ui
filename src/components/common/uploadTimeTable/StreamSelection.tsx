import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import useStream from './useStream'
import { SelectionProps } from './utils/selectionInterface'

const StreamSelection = ({
  title,
  selectedValue,
  onValueChange,
  placeholder,
}: SelectionProps) => {
  const { stream } = useStream()

  return (
    <div className="relative w-full md:w-[240px] lg:w-[320px]">
      <Card className="h-auto w-full dark:bg-black">
        <CardHeader className="space-y-0 pb-2 pt-2">
          <CardTitle className="text-center text-base sm:text-lg">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <Select
            value={selectedValue}
            onValueChange={(value) => onValueChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {stream?.map((stream) => (
                <SelectItem
                  key={stream.slug}
                  value={stream.slug}
                  className="cursor-pointer"
                >
                  {stream.title} - {stream.branch.branch_code}{' '}
                  {stream.branch.branch_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {/* Connecting Lines */}
      <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
      <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
    </div>
  )
}

export default StreamSelection
