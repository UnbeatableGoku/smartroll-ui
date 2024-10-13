import { useMemo, useRef, useState } from 'react'

import CheckboxGroup from '../checkboxGroup'
import DropdownButton from '../dropdownButton'
import InputHint from '../inputHint'
import Label from '../label'
import { FieldValues, useController } from 'react-hook-form'

import { useClickOutsideAndEscape } from '@hooks'

import { MultiselectDropdownInput } from 'types/form'

const MultiSelectDropdown = <T extends FieldValues>({
  parentClassName = '',
  className = '',
  label,
  name,
  error,
  hintText,
  options,
  includeSelectAll,
  required,
  control,
  columns = 1,
}: MultiselectDropdownInput<T>) => {
  // To toggle the dropdown visibility
  const [isVisible, setIsVisible] = useState(false)

  // To store total selected values
  const {
    field: { value },
  } = useController({
    name,
    control,
  })

  // To close the dropdown in outside click
  const ref = useRef<HTMLDivElement | null>(null)

  useClickOutsideAndEscape({ ref, callback: () => setIsVisible(false) })

  //To handle rendering of Button or Checkbox in the dropdown
  const renderInput = useMemo(() => {
    return (
      <CheckboxGroup
        control={control}
        columns={columns}
        options={options}
        name={name}
        includeSelectAll={includeSelectAll}
        parentClassName="px-2 w-full"
      />
    )
  }, [options, includeSelectAll])

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
          error={error}
          className={className}
          setIsVisible={setIsVisible}
          isVisible={isVisible}
        >
          {`${value.length || 0} Selected`}{' '}
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

export default MultiSelectDropdown
