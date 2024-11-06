import { ReactNode } from 'react'

import { ChevronIcon } from '@icons'

interface DropdownButtonProps {
  className?: string
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  isVisible: boolean
  children: ReactNode
  error?: string
}

const DropdownButton = ({
  className,
  setIsVisible,
  children,
  isVisible,
  error,
}: DropdownButtonProps) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`text-primary mr-6 mt-1 flex h-11 w-full appearance-none items-center overflow-hidden rounded-lg border bg-white px-3 text-sm shadow-sm focus:border-2 focus:border-gray-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 ${
          error ? 'border-error' : 'border-gray-300'
        } ${className}`}
        type="button"
      >
        {/* Button Text */}
        {children}

        {/* Arrow Icon */}
        <span
          className={`absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 ${
            isVisible ? 'rotate-0' : '-rotate-90'
          } text-secondary flex transition-transform duration-300`}
        >
          <ChevronIcon />
        </span>
      </button>
    </div>
  )
}

export default DropdownButton
