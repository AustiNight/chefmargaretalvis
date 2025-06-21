"use client"
import { Label } from "@/components/ui/label"
import { DatePicker as DatePickerComponent } from "react-datepicker" // Import DatePicker from react-datepicker

/**
 * Props for the DatePicker component
 * @interface DatePickerProps
 * @property {string} id - Unique identifier for the input
 * @property {string} label - Label text for the input
 * @property {string} [value] - Current value of the input (YYYY-MM-DD)
 * @property {(value: string) => void} onChange - Function to call when date changes
 * @property {boolean} [required] - Whether the input is required
 * @property {string} [min] - Minimum date (YYYY-MM-DD)
 * @property {string} [max] - Maximum date (YYYY-MM-DD)
 * @property {string} [error] - Error message to display
 * @property {string} [className] - Additional CSS classes
 */
export interface DatePickerProps {
  id: string
  label: string
  value?: string
  onChange: (value: string) => void
  required?: boolean
  min?: string
  max?: string
  error?: string
  className?: string
}

/**
 * DatePicker component provides a standardized date input with label
 *
 * @param {DatePickerProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export function DatePicker({
  id,
  label,
  value = "",
  onChange,
  required = false,
  min,
  max,
  error,
  className = "",
}: DatePickerProps): JSX.Element {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <DatePickerComponent
        id={id}
        selected={value ? new Date(value) : null}
        onChange={(date: Date) => onChange(date.toISOString().split("T")[0])}
        required={required}
        minDate={min ? new Date(min) : null}
        maxDate={max ? new Date(max) : null}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
