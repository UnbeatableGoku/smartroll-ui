import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form'

/**
 * -------------------- HOOK FORM --------------------
 */
interface CommonFormProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  error?: string
}

/**
 * -------------------- Common UI Props --------------------
 */
interface BaseUIProps {
  label?: string
  hintText?: string
  className?: string
  required?: boolean
}

/**
 * -------------------- ICON Props --------------------
 */
interface IconProps {
  icon?: React.ReactNode
  iconPosition?: 'start' | 'end'
  iconClass?: string
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
  extends Omit<CommonFormProps<T>, 'control'>,
    BaseUIProps,
    IconProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  containerClass?: string
  register: UseFormRegister<T>
}

/**
 * -------------------- CheckboxGroup --------------------
 */
export interface InputOption {
  label: string
  value: string | boolean
  disabled?: boolean
}

type WithSelectAll = {
  selectAllLabel?: string
  includeSelectAll?: boolean
}
export interface CheckboxGroupProps<T extends FieldValues>
  extends CommonFormProps<T>,
    BaseUIProps,
    WithSelectAll {
  labelClassName?: string
  parentClassName?: string
  columns?: 1 | 2 | 3
  options: InputOption[]
  defaultSelected?: string[]
}

/**
 * -------------------- Dropdown --------------------
 */
export interface DropdownInputProps<T extends FieldValues>
  extends CommonFormProps<T>,
    BaseUIProps {
  options: InputOption[]
  defaultValue?: string | boolean
  parentClassName?: string
}

export interface MultiselectDropdownInput<T extends FieldValues>
  extends CheckboxGroupProps<T> {
  hintText?: string
  className?: string
}
