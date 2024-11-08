export interface SelectionProps {
  title: string
  selectedValue: string
  selectedValue2?: string
  onValueChange: (value: string) => void
  placeholder: string
}
