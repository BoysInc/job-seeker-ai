"use client"

import { useRef, useState } from "react"
import { FileTextIcon, UploadCloudIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type FileDropzoneProps = Omit<
  React.ComponentProps<"button">,
  "onChange" | "type"
> & {
  /** Currently selected file, controlled by the caller. */
  file: File | null
  /** Secondary line under the selected file name, e.g. "1.2 MB". */
  fileMeta?: string | null
  onFileSelect: (file: File | null) => void
  /** input accept attribute, e.g. ".pdf,application/pdf". */
  accept?: string
  title?: string
  hint?: string
}

/**
 * Click-or-drag file picker for resume upload. Renders as a real button so
 * it is keyboard-operable and screen-reader friendly out of the box;
 * validation (type/size) stays in the caller, which sets `file` and any
 * error messaging.
 */
function FileDropzone({
  file,
  fileMeta,
  onFileSelect,
  accept = ".pdf,application/pdf",
  title = "Upload your resume",
  hint = "PDF up to 5 MB",
  className,
  disabled,
  ...props
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          onFileSelect(event.target.files?.[0] ?? null)
          event.target.value = ""
        }}
      />
      <button
        type="button"
        data-slot="file-dropzone"
        data-dragging={isDragging || undefined}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          if (disabled) return
          onFileSelect(event.dataTransfer.files?.[0] ?? null)
        }}
        className={cn(
          "flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-input bg-muted/40 px-4 py-8 text-center transition-colors outline-none",
          "hover:border-ring/70 hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "data-dragging:border-ring data-dragging:bg-accent/60",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span
          className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground"
          aria-hidden
        >
          {file ? (
            <FileTextIcon className="size-5" />
          ) : (
            <UploadCloudIcon className="size-5" />
          )}
        </span>
        {file ? (
          <span className="grid gap-0.5">
            <span className="text-sm font-medium break-all">{file.name}</span>
            {fileMeta ? (
              <span className="text-xs text-muted-foreground">{fileMeta}</span>
            ) : null}
            <span className="mt-1 text-xs text-accent-foreground">
              Choose a different file
            </span>
          </span>
        ) : (
          <span className="grid gap-0.5">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-muted-foreground">
              Drag and drop, or click to browse · {hint}
            </span>
          </span>
        )}
      </button>
    </>
  )
}

export { FileDropzone }
