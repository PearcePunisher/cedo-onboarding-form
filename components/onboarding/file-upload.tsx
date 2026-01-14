"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, X, File, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  onChange: (files: File[]) => void
  value?: File[]
  label?: string
}

export function FileUpload({ accept, multiple = false, onChange, value = [], label }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (multiple) {
        onChange([...value, ...files])
      } else {
        onChange(files.slice(0, 1))
      }
    },
    [multiple, onChange, value],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (multiple) {
        onChange([...value, ...files])
      } else {
        onChange(files.slice(0, 1))
      }
    },
    [multiple, onChange, value],
  )

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = value.filter((_, i) => i !== index)
      onChange(newFiles)
    },
    [onChange, value],
  )

  const isImage = (file: File) => file.type.startsWith("image/")

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${label}`}
        />
        <label htmlFor={`file-upload-${label}`} className="cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{label || "Drop files here or click to upload"}</p>
          {accept && <p className="text-xs text-muted-foreground mt-1">Accepted: {accept}</p>}
        </label>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              {isImage(file) ? (
                <ImageIcon className="w-5 h-5 text-primary" />
              ) : (
                <File className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="flex-1 text-sm truncate">{file.name}</span>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
