import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, Plus, X } from 'lucide-react'

export interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: Option[]
  onValueChange: (value: string[]) => void
  defaultValue?: string[]
  placeholder?: string
  animation?: number
  maxCount?: number
  modalPopover?: boolean
  asChild?: boolean
  className?: string
}

export function MultiSelect({
  options,
  onValueChange,
  defaultValue = [],
  placeholder = 'Select items',
  animation = 0,
  maxCount = 3,
  modalPopover = false,
  asChild = false,
  className,
  ...props
}: MultiSelectProps) {
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultValue)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [isAnimating] = React.useState(false)

  React.useEffect(() => {
    setSelectedValues(defaultValue)
  }, [defaultValue])

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const target = event.currentTarget as HTMLInputElement // cast
    if (event.key === 'Enter') {
      setIsPopoverOpen(true)
    } else if (event.key === 'Backspace' && !target.value) {
      const newSelectedValues = [...selectedValues]
      newSelectedValues.pop()
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }
  }

  const toggleOption = (option: string) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option]
    setSelectedValues(newSelectedValues)
    onValueChange(newSelectedValues)
  }

  const handleClear = () => {
    setSelectedValues([])
    onValueChange([])
  }

  const handleTogglePopover = () => {
    setIsPopoverOpen((prev) => !prev)
  }

  const clearExtraOptions = () => {
    const newSelectedValues = selectedValues.slice(0, maxCount)
    setSelectedValues(newSelectedValues)
    onValueChange(newSelectedValues)
  }

  const toggleAll = () => {
    if (selectedValues.length === options.length) {
      handleClear()
    } else {
      const allValues = options.map((option) => option.value)
      setSelectedValues(allValues)
      onValueChange(allValues)
    }
  }

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      modal={modalPopover}
    >
      <PopoverTrigger asChild>
        <Button
          ref={null}
          {...props}
          onClick={handleTogglePopover}
          className={cn(
            'flex h-auto min-h-10 w-full items-center justify-between rounded-none border bg-inherit p-1 focus-within:border-primary hover:bg-inherit focus-visible:outline-none focus-visible:ring-0 [&[data-state=open]>svg]:rotate-180',
            className,
          )}
        >
          {selectedValues.length > 0 ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-wrap items-center">
                {selectedValues.slice(0, maxCount).map((value) => {
                  const option = options.find((o) => o.value === value)
                  const IconComponent = React.forwardRef<
                    HTMLDivElement,
                    React.HTMLProps<HTMLDivElement>
                  >(({ ...props }, ref) => (
                    <div ref={ref} {...props}>
                      <Badge
                        className={cn(
                          isAnimating ? 'animate-pulse' : '',
                          'data-[disabled]:bg-transparent data-[disabled]:text-muted data-[disabled]:hover:bg-transparent',
                          'data-[fixed]:bg-transparent data-[fixed]:text-muted data-[fixed]:hover:bg-transparent',
                          'border-submit bg-transparent text-black hover:bg-transparent',
                        )}
                        data-fixed={option?.disabled}
                        data-disabled={option?.disabled}
                      >
                        {option?.label}
                        <button
                          className={cn(
                            'ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                            option?.disabled && 'hidden',
                          )}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleInputKeyDown(e)
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleOption(value)
                          }}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    </div>
                  ))
                  return <IconComponent key={value} className="m-1" />
                })}
                {selectedValues.length > maxCount && (
                  <Badge
                    className={cn(
                      'border-foreground/1 bg-transparent text-foreground hover:bg-transparent',
                      isAnimating ? 'animate-pulse' : '',
                    )}
                  >
                    {`+ ${selectedValues.length - maxCount} more`}
                    <button
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleInputKeyDown(e)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        clearExtraOptions()
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                )}
                <button
                  className="ml-2 flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-muted-foreground/50 transition-colors hover:border-muted-foreground hover:bg-muted/50"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsPopoverOpen(true)
                  }}
                  title="Add more items"
                >
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className={cn(
                    'ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  )}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInputKeyDown(e)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleClear()
                  }}
                  title="Clear all"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-200" />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full items-center justify-between">
              <span className="mx-3 text-sm text-muted-foreground">
                {placeholder}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-200" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search..."
            onKeyDown={handleInputKeyDown}
            className="h-9"
            tabIndex={-1}
          />
          <div
            className="max-h-[200px] overflow-y-auto"
            onWheel={(e) => {
              e.stopPropagation()
            }}
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
            onTouchMove={(e) => {
              e.stopPropagation()
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
            }}
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
            }}
          >
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-none border border-submit',
                      selectedValues.length === options.length
                        ? 'bg-submit text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible',
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span>(Select All)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                      disabled={option.disabled}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-none border border-submit',
                          isSelected
                            ? 'bg-submit text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
