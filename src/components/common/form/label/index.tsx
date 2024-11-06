import { cn } from '@utils'

import { LabelProps } from 'types/form'

const Label = ({
  name,
  children,
  className,
  required = true,
  ...props
}: LabelProps) => {
  return (
    <label
      className={cn('text-sidebar-primary text-xs font-semibold', className)}
      htmlFor={name}
      {...props}
    >
      {children}
      {required && <span className="text-error">*</span>}
    </label>
  )
}

export default Label
