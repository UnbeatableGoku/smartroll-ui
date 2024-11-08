import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


import { SelectionProps } from './utils/selectionInterface'
import useStream from './useStream'

const StreamSelection = ({
  title,
  selectedValue,
  onValueChange,
  placeholder,
  data

}: SelectionProps) => {
  

  return (
   
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
              {data?.map((stream) => (
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
    
    
  )
}

export default StreamSelection
