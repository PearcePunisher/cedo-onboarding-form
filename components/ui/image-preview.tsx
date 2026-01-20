"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, X } from "lucide-react"
import Image from "next/image"

interface ImagePreviewProps {
  url: string
  name: string
}

export function ImagePreview({ url, name }: ImagePreviewProps) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" asChild>
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => {
          e.preventDefault()
          setShowPreview(true)
        }}>
          {name}
          <ExternalLink className="ml-2 h-3 w-3" />
        </a>
      </Button>

      {showPreview && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
              onClick={() => setShowPreview(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={url}
                alt={name}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                unoptimized
              />
            </div>
            <div className="mt-4 text-center">
              <Button variant="secondary" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Open in New Tab
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
