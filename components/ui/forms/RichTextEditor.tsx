"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

/**
 * Props for the RichTextEditor component
 * @interface RichTextEditorProps
 * @property {string} id - Unique identifier for the editor
 * @property {string} label - Label text for the editor
 * @property {string} [value] - Current value of the editor
 * @property {(value: string) => void} onChange - Function to call when content changes
 * @property {boolean} [required] - Whether the editor is required
 * @property {number} [rows] - Number of rows for the textarea
 * @property {string} [placeholder] - Placeholder text for the editor
 * @property {string} [error] - Error message to display
 * @property {string} [className] - Additional CSS classes
 */
export interface RichTextEditorProps {
  id: string
  label: string
  value?: string
  onChange: (value: string) => void
  required?: boolean
  rows?: number
  placeholder?: string
  error?: string
  className?: string
}

/**
 * RichTextEditor component provides a simple rich text editor with basic formatting
 *
 * @param {RichTextEditorProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export function RichTextEditor({
  id,
  label,
  value = "",
  onChange,
  required = false,
  rows = 6,
  placeholder = "",
  error,
  className = "",
}: RichTextEditorProps): JSX.Element {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const insertFormatting = (prefix: string, suffix = "") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const beforeText = value.substring(0, start)
    const afterText = value.substring(end)

    const newValue = beforeText + prefix + selectedText + suffix + afterText
    onChange(newValue)

    // Set cursor position after formatting is applied
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length)
      }
    }, 0)
  }

  const handleBold = () => insertFormatting("**", "**")
  const handleItalic = () => insertFormatting("_", "_")
  const handleBulletList = () => insertFormatting("\n- ")
  const handleNumberedList = () => insertFormatting("\n1. ")

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="border rounded-md">
        <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
          <Button type="button" variant="ghost" size="sm" onClick={handleBold} className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
            <span className="sr-only">Bold</span>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleItalic} className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
            <span className="sr-only">Italic</span>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleBulletList} className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
            <span className="sr-only">Bullet List</span>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleNumberedList} className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
            <span className="sr-only">Numbered List</span>
          </Button>
        </div>

        <Textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className={`border-0 rounded-t-none ${error ? "border-red-500" : ""}`}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="text-xs text-gray-500">
        <p>
          Formatting: <strong>**bold**</strong>, <em>_italic_</em>, - bullet list, 1. numbered list
        </p>
      </div>
    </div>
  )
}
