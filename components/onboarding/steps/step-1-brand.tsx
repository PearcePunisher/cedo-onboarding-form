"use client"

import { useEffect, useMemo, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/onboarding/file-upload"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

export function Step1Brand({ form }: StepProps) {
  const logos = (form.watch("logos") as File[] | undefined) ?? []
  const [previewItems, setPreviewItems] = useState<{ name: string; url: string }[]>([])
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  const imageFiles = useMemo(() => logos.filter((file) => file.type.startsWith("image/")), [logos])

  useEffect(() => {
    const nextPreviews = imageFiles.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))
    setPreviewItems(nextPreviews)

    return () => {
      nextPreviews.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [imageFiles])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Brand Assets</h2>
        <p className="text-sm text-muted-foreground">
          Upload logos (SVG, PNG, or EPS) and brand guidelines including color palette and fonts
        </p>
      </div>
      <FormField
        control={form.control}
        name="logos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Logos <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <FileUpload
                accept=".svg, .png, .eps, .webp, .avif"
                multiple
                onChange={field.onChange}
                value={field.value || []}
                label="Upload logos (SVG, PNG, EPS, WEBP, AVIF)"
              />
            </FormControl>
            <FormDescription>
              Please provide logos with transparent background (preferred) or white/dark background for app integration purposes.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {previewItems.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium">Preview</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previewItems.map((item, index) => (
              <button
                type="button"
                key={`${item.name}-${index}`}
                onClick={() => setLightboxUrl(item.url)}
                className="group relative rounded-lg overflow-hidden border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-24 w-full object-contain bg-background transition-transform duration-150 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[11px] text-white px-2 py-1 truncate">
                  {item.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm text-white"
              onClick={() => setLightboxUrl(null)}
            >
              Close
            </button>
            <img src={lightboxUrl} alt="Logo preview" className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl" />
          </div>
        </div>
      )}

      {/* <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="lightBackgroundVersion"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 p-4 rounded-lg bg-muted/30">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="flex-1">
                <FormLabel className="cursor-pointer">
                  Light background version included <span className="text-destructive">*</span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="darkBackgroundVersion"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 p-4 rounded-lg bg-muted/30">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="cursor-pointer">Dark background version included</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div> */}
      {/* TODO: Provide the user an example of a correctly formatted brand guideline file or give them a customizer tool to create one. */}
      <FormField
        control={form.control}
        name="brandGuidelines"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Brand Guidelines <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <FileUpload
                accept=".pdf, .pptx, .docx"
                onChange={(files) => field.onChange(files[0])}
                value={field.value ? [field.value] : []}
                label="Upload brand guidelines (PDF, PowerPoint, Word Document)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="brandNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes on Brand Usage</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any specific requirements or restrictions for brand usage..."
                className="min-h-[100px] bg-input"
                maxLength={5000}
                showCharCount
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
