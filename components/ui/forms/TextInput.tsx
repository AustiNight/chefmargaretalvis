"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * Props for the TextInput component
 * @interface TextInputProps
 * @property {string} id - Unique identifier for the input
 * @property {string} label - Label text for the input
 * @property {string} [value] - Current value of the input
 * @property {(value: string) => void} onChange - Function to call when input value changes
 * @property {string} [placeholder] - Placeholder text for the input
 * @property {boolean} [required] - Whether the input is required
 * @property {string} [type] - Input type (default: "text")
 * @property {string} [error] - Error message to display
 * @property {string} [className] - Additional CSS classes
 */
export interface TextInputProps {
  id: string
  label: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: string
  error?: string
  className?: string
}

/**
 * TextInput component provides a standardized text input with label
 *
 * @param {TextInputProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export function TextInput({
  id,
  label,
  value = "",
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  error,
  className = "",
}: TextInputProps): JSX.Element {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
