import InputHint from '../inputHint'
import Label from '../label'
import { Controller, FieldValues } from 'react-hook-form'

import { cn } from '@utils'

import { TextFieldProps } from 'types/form'

const TextField = <T extends FieldValues>({
  name,
  control,
  icon,
  label = '',
  placeholder = '',
  className = '',
  containerClass = '',
  error = '',
  hintText = '',
  disabled = false,
  iconPosition = 'start',
  required = true,
  defaultValue = '',
  ...props
}: TextFieldProps<T>) => {
  return (
    <div className="relative w-full">
      {/* Label */}
      {label && (
        <Label name={name} required={required}>
          {label}
        </Label>
      )}

      <div
        className={cn(
          'mt-1 flex h-11 w-full gap-2 rounded-lg border bg-white px-3',
          {
            'flex-row-reverse': iconPosition === 'end',
            'flex-row': iconPosition === 'start',
            'border-error': error,
            'border-gray-300': !error,
            'cursor-not-allowed bg-gray-200': disabled,
          },
          containerClass,
        )}
      >
        {/* Icon */}
        {icon && <div className="h-4 w-4 text-gray-400">{icon}</div>}

        {/* Input Field */}
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <input
              id={name}
              className={cn(
                'text-primary h-full w-full appearance-none text-sm focus:border-gray-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600',
                {
                  'border-secondary': error,
                },
                className,
              )}
              placeholder={placeholder || `Enter ${label}`}
              {...props}
              {...field}
              value={field.value || ''}
            />
          )}
        />
      </div>

      <InputHint error={error} hintText={hintText} />
    </div>
  )
}

export default TextField
