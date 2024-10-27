import { useMemo, useRef, useState } from 'react'

import DropdownButton from '../dropdownButton'
import InputHint from '../inputHint'
import Label from '../label'
import { FieldValues, Path, PathValue, useController } from 'react-hook-form'

import { useClickOutsideAndEscape } from '@hooks'

import { DropdownInputProps, InputOption } from 'types/form'

const Dropdown = <T extends FieldValues>({
  parentClassName = '',
  className,
  name,
  label,
  control,
  hintText,
  options,
  error,
  required = false,
  defaultValue,
}: DropdownInputProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue: defaultValue as PathValue<T, Path<T>>,
  })

  // To toggle the dropdown visibility
  const [isVisible, setIsVisible] = useState<boolean>(false)

  // To close the dropdown in outside click
  const ref = useRef<HTMLDivElement | null>(null)
  useClickOutsideAndEscape({ ref, callback: () => setIsVisible(false) })

  // Will handle the select field change and add the updated value to register
  const handleValueSelect = (option: InputOption) => {
    onChange(option.value)
    setIsVisible(false)
  }

  //To handle rendering of Button or Checkbox in the dropdown
  const renderInput = useMemo(() => {
    return options?.map((option: InputOption) => (
      <button
        type="button"
        key={option.value as string}
        value={option.value as string}
        className="block w-full cursor-pointer rounded-md px-4 py-2.5 text-left outline-none hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-30"
        onClick={() => handleValueSelect(option)}
        disabled={option?.disabled}
      >
        {option.label}
      </button>
    ))
  }, [options])

  return (
    <div className={`relative w-full outline-none ${parentClassName}`}>
      {/* Label */}
      {label && (
        <Label name={name} required={required}>
          {label}
        </Label>
      )}

      {/* Select Button */}
      <div ref={ref}>
        <DropdownButton
          className={className}
          setIsVisible={setIsVisible}
          isVisible={isVisible}
        >
          {options?.find((item: InputOption) => item.value === value)?.label ||
            'Select'}
        </DropdownButton>

        {/* Options */}
        <div
          className={`absolute z-10 h-max max-h-64 w-full min-w-max origin-top overflow-auto rounded-md bg-white p-2 text-sm shadow-lg transition-all duration-200 ${
            isVisible ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
          }`}
        >
          {renderInput}
        </div>
      </div>

      {/* Error & Hint Text */}
      <InputHint error={error} hintText={hintText} />
    </div>
  )
}

export default Dropdown
