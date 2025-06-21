"use client"

import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
  minHeight = "200px",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full h-auto my-4",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Handle link insertion
  const setLink = () => {
    if (!linkUrl) return

    if (linkUrl) {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    } else {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
    }
    setShowLinkInput(false)
    setLinkUrl("")
  }

  // Handle image insertion
  const addImage = () => {
    if (!imageUrl) return

    editor?.chain().focus().setImage({ src: imageUrl }).run()
    setShowImageInput(false)
    setImageUrl("")
  }

  // Ensure we only render the editor on the client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/20">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={cn("h-8 w-8 p-0", editor?.isActive("bold") && "bg-muted")}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8 p-0", editor?.isActive("italic") && "bg-muted")}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("h-8 w-8 p-0", editor?.isActive("heading", { level: 1 }) && "bg-muted")}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("h-8 w-8 p-0", editor?.isActive("heading", { level: 2 }) && "bg-muted")}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn("h-8 w-8 p-0", editor?.isActive("heading", { level: 3 }) && "bg-muted")}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={cn("h-8 w-8 p-0", editor?.isActive("bulletList") && "bg-muted")}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={cn("h-8 w-8 p-0", editor?.isActive("orderedList") && "bg-muted")}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={cn("h-8 w-8 p-0", editor?.isActive("link") && "bg-muted")}
          aria-label="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowImageInput(!showImageInput)}
          className="h-8 w-8 p-0"
          aria-label="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={cn("h-8 w-8 p-0", editor?.isActive({ textAlign: "left" }) && "bg-muted")}
          aria-label="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={cn("h-8 w-8 p-0", editor?.isActive({ textAlign: "center" }) && "bg-muted")}
          aria-label="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={cn("h-8 w-8 p-0", editor?.isActive({ textAlign: "right" }) && "bg-muted")}
          aria-label="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          className="h-8 w-8 p-0 ml-auto"
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          className="h-8 w-8 p-0"
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {showLinkInput && (
        <div className="p-2 border-b flex gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 p-1 text-sm border rounded"
          />
          <Button type="button" size="sm" onClick={setLink}>
            Set Link
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowLinkInput(false)}>
            Cancel
          </Button>
        </div>
      )}

      {showImageInput && (
        <div className="p-2 border-b flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 p-1 text-sm border rounded"
          />
          <Button type="button" size="sm" onClick={addImage}>
            Add Image
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowImageInput(false)}>
            Cancel
          </Button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 focus:outline-none"
        style={{ minHeight }}
      />
    </div>
  )
}
