import { memo } from 'react'

import { cn } from '@utils/helpers'

import { ButtonProps, IconProps } from 'types/form'

const sizeClasses = {
  small: 'px-1.5 py-1 text-xs',
  medium: 'px-2.5 py-1.5 text-sm',
  large: 'px-4 py-1.5 text-lg',
}

const disableClasses = {
  filled: 'disabled:bg-gray-400 disabled:text-white disabled:border-gray-400',
  outline: 'disabled:border-gray-400 disabled:text-gray-400 disabled:bg-white',
}

const ButtonIcon = ({ icon: Icon, iconClass = '' }: IconProps) => {
  return (
    <span
      className={cn(
        'inline-flex h-4 w-4 shrink-0 items-center justify-center',
        iconClass,
      )}
    >
      {Icon}
    </span>
  )
}

const Button = ({
  label = '',
  labelClass = '',
  className = '',
  size = 'medium',
  theme = 'primary',
  variant = 'filled',
  loading = false,
  disabled = false,
  startIcon = null,
  endIcon = null,
  iconPosition = 'start',
  startIconClass = '',
  endIconClass = '',
  ...props
}: ButtonProps) => {
  const colors = {
    primary: {
      filled: cn(
        'bg-button-primary border-transparent text-white',
        !loading &&
          'hover:text-button-primary hover:border-button-primary hover:bg-button-secondary',
        disableClasses.filled,
      ),
      outline: cn(
        'text-button-primary border-button-primary bg-button-secondary',
        !loading && 'hover:bg-button-primary hover:text-button-secondary',
        disableClasses.outline,
      ),
    },
    success: {
      filled: cn(
        'bg-green-light border-transparent text-green-darker',
        !loading && 'hover:bg-green-dark',
        disableClasses.filled,
      ),
      outline: cn(
        'text-green-darker border-green-darker bg-white',
        !loading &&
          'hover:bg-green-light hover:border-transparent hover:text-green-darker',
        disableClasses.outline,
      ),
    },
  }

  const buttonClasses = cn(
    'inline-flex justify-center gap-2 items-center transition-all duration-300 outline-none focus:outline-none antialiased',
    { 'flex-row-reverse': iconPosition === 'end' },
    variant !== 'custom' && 'border rounded-md font-semibold capitalize',
    className,
    variant !== 'custom' && colors[theme][variant],
    sizeClasses[size],
  )

  return (
    <button className={buttonClasses} disabled={loading || disabled} {...props}>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {startIcon && (
            <ButtonIcon iconClass={startIconClass} icon={startIcon} />
          )}

          {label && (
            <span className={cn('truncate whitespace-nowrap', labelClass)}>
              {label}
            </span>
          )}

          {endIcon && <ButtonIcon iconClass={endIconClass} icon={endIcon} />}
        </>
      )}
    </button>
  )
}

export default memo(Button)
