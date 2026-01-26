"use client"

import type React from "react"

import { useCallback, useState,useId,useMemo } from "react"
import { Upload, X, File, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  onChange: (files: File[]) => void
  value?: File[]
  label?: string
  maxSize?: number // in bytes
  maxSizeMB?: number // for display purposes'
  inputId?: string
}

export function FileUpload({ accept, multiple = false, onChange, value = [], label, maxSize = 5 * 1024 * 1024, maxSizeMB = 5, inputId, }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reactId = useId()
  const resolvedInputId = useMemo(() => {
    if (inputId) return inputId

    const safeLabel = (label || "upload")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // useId() contains ":" characters in React 18; strip them for a cleaner HTML id
    const safeReactId = reactId.replace(/:/g, "")

    return `file-upload-${safeLabel}-${safeReactId}`
  }, [inputId, label, reactId])



  const validateAndAddFiles = useCallback(
    (newFiles: File[]) => {
      setError(null)
      const oversizedFiles = newFiles.filter(file => file.size > maxSize)
      
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map(f => f.name).join(', ')
        setError(`File(s) too large: ${fileNames}. Maximum size is ${maxSizeMB}MB per file.`)
        return
      }
      
      if (multiple) {
        onChange([...value, ...newFiles])
      } else {
        onChange(newFiles.slice(0, 1))
      }
    },
    [multiple, onChange, value, maxSize, maxSizeMB],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      validateAndAddFiles(files)
    },
    [validateAndAddFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("IN UPLOAD")
      console.log(e)
      console.log("END")
      const files = Array.from(e.target.files || [])
      validateAndAddFiles(files)
      // Reset input so same file can be selected again if needed
      e.target.value = ''
    },
    [validateAndAddFiles],
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
          <p className="text-xs text-muted-foreground mt-1">Maximum file size: {maxSizeMB}MB per file</p>
        </label>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

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
