import { Button } from '@components/ui/button'
import { useState } from 'react'

const FilterOption = ({availableSubjects}:any) => {
    const [selectedFilters, setSelectedFilters] = useState<string | null>(null)

    const toggleFilter = (stream_name: string) => {
        setSelectedFilters(stream_name)
      }

      
  return (
    

        <div className="flex flex-wrap gap-2 mx-auto px-4">
          {availableSubjects.map((stream:any) => (
             <Button
              key={stream.stream}
              variant={selectedFilters == stream.stream ? "default" : "outline"}
              onClick={() => toggleFilter(stream.stream)}
              className="transition-all duration-200 ease-in-out"
            >
              <a href={`#${stream.stream}`}>{stream.stream}</a>
            </Button> 
            
            
          ))}
        </div>
  )
}

// 

export default FilterOption