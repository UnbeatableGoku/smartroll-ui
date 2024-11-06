// Helper function to toggle values in an array
const toggleArrayValues = (value: string[], selectedValue: string) => {
  return value.includes(selectedValue)
    ? value.filter((val: string) => val !== selectedValue)
    : [...value, selectedValue]
}

export { toggleArrayValues }
