import { useEffect, useRef, useState } from 'react'

import Checkbox from '../checkbox'
import InputHint from '../inputHint'
import { FieldValues, Path, PathValue, useController } from 'react-hook-form'

import { toggleArrayValues } from '@utils'

import { CheckboxGroupProps, InputOption } from 'types/form'

import { Label } from '@components/common/form'

// Helper function to check if the "Select All" checkbox should be indeterminate
const checkIsIndeterminate = (
  selectedValues: string[],
  options: InputOption[],
) => {
  return selectedValues.length > 0 && selectedValues.length < options.length
}

const GRID_COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

// MultiSelectDropdown component with optional "Select All" functionality
const CheckboxGroup = <T extends FieldValues>({
  control,
  name,
  options,
  label,
  labelClassName,
  parentClassName,
  required,
  columns = 1,
  includeSelectAll = false,
  selectAllLabel = 'Select All',
  error,
  hintText,
  defaultSelected = [],
}: CheckboxGroupProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue: defaultSelected as PathValue<T, Path<T>>,
  })

  const [selectAll, setSelectAll] = useState(false)

  // Ref for the "Select All" checkbox to manage indeterminate state
  const selectAllRef = useRef<HTMLInputElement | null>(null)

  // Handler for "Select All" checkbox change
  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll)
    selectAllRef.current!.indeterminate = false
    const allValues = options.map((option) => option.value)
    onChange(selectAll ? [] : allValues)
  }

  // Handler for individual checkbox change
  const handleCheckboxChange = (selectedValue: string) => {
    // toggles the value based on checkbox selection
    const updatedValues = toggleArrayValues(value, selectedValue)

    // set the updated array into hook form
    onChange(updatedValues)

    // only set when select all field includes
    if (includeSelectAll && selectAllRef.current) {
      selectAllRef.current.indeterminate = checkIsIndeterminate(
        updatedValues,
        options,
      )
    }
  }

  // Effect to update "Select All" checkbox state and indeterminate state
  useEffect(() => {
    if (includeSelectAll && selectAllRef.current) {
      const allSelected = value.length === options.length
      setSelectAll(allSelected)
      selectAllRef.current.indeterminate = checkIsIndeterminate(value, options)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options])

  return (
    <div className={`${parentClassName || ''} relative w-full min-w-[150px]`}>
      {/* Label */}
      {label && (
        <Label className={labelClassName || ''} required={required}>
          {label}
        </Label>
      )}

      {/* Select All Checkbox */}
      {includeSelectAll && (
        <div className="mb-4 border-b py-3">
          <Checkbox
            name={selectAllLabel}
            label={selectAllLabel}
            checked={selectAll}
            onChange={handleSelectAllChange}
            ref={selectAllRef}
            className="text-sm"
            reverse={columns === 1}
          />
        </div>
      )}

      {/* Options List */}
      <div className={`my-2 grid ${GRID_COLUMNS[columns]} gap-x-4 gap-y-2`}>
        {options.map((option) => (
          <Checkbox
            key={option.value as string}
            name={option.value as string}
            label={option.label}
            value={option.value as string}
            checked={value.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value as string)}
            reverse={columns === 1}
          />
        ))}
      </div>

      <InputHint error={error} hintText={hintText} />
    </div>
  )
}

export default CheckboxGroup
