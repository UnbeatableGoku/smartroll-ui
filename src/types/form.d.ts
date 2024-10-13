import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form'

/**
 * -------------------- HOOK FORM --------------------
 */
interface CommonForm<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  error?: string
}

/**
 * -------------------- LABEL --------------------
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  name?: string
  required?: boolean
}

/**
 * -------------------- BUTTON --------------------
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  labelClass?: string
  size?: 'small' | 'medium' | 'large'
  theme?: 'primary' | 'success'
  variant?: 'filled' | 'outline' | 'custom'
  loading?: boolean
  iconPosition?: 'start' | 'end'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  startIconClass?: string
  endIconClass?: string
}

export interface ButtonIconProps {
  icon: React.ReactNode
  className?: string
}

/**
 * -------------------- INPUT : Text --------------------
 */
export interface TextFieldProps<T extends FieldValues>
  extends CommonForm<T>,
    React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  containerClass?: string
  icon?: JSX.Element
  iconPosition?: 'start' | 'end'
  hintText?: string
}

/**
 * -------------------- CheckboxGroup --------------------
 */
export interface InputOption {
  label: string
  value: string
  disabled?: boolean
}

type WithSelectAll = {
  selectAllLabel?: string
  includeSelectAll?: boolean
}

export interface CheckboxGroupProps<T extends FieldValues>
  extends CommonForm<T>,
    WithSelectAll {
  label?: string
  labelClassName?: string
  parentClassName?: string
  required?: boolean
  columns?: 1 | 2 | 3
  options: InputOption[]
}

export interface DropdownInput<T extends FieldValues> extends CommonForm<T> {
  label?: string
  hintText?: string
  options: InputOption[]
  defaultValue?: string | boolean | undefined
  required?: boolean
  parentClassName?: string
  className?: string
}

export interface MultiselectDropdownInput<T extends FieldValues>
  extends CheckboxGroupProps<T> {
  hintText?: string
  className?: string
}
