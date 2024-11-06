import React, { forwardRef, useId } from 'react'

import { cn } from '@utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string
  label?: string
  reverse?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, name, value, disabled, className, reverse = true, ...props },
    ref,
  ) => {
    const id = useId()

    return (
      <div
        className={cn('flex w-full items-center justify-start gap-2', {
          'opacity-50': disabled,
          'flex-row-reverse justify-between': reverse,
        })}
      >
        <input
          id={id}
          name={id}
          type="checkbox"
          ref={ref}
          className={`h-4 w-4 shrink-0 rounded-lg accent-black ${className}`}
          {...props}
        />

        {label && (
          <label
            htmlFor={id}
            className="truncate text-xs font-semibold text-gray-600"
          >
            {label}
          </label>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
