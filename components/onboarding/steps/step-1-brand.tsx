"use client"

import { useEffect, useMemo, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/onboarding/file-upload"
import { Button } from "@/components/ui/button"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

export function Step1Brand({ form }: StepProps) {
  const logos = (form.watch("logos") as File[] | undefined) ?? []
  const [previewItems, setPreviewItems] = useState<{ name: string; url: string }[]>([])
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [copiedExample, setCopiedExample] = useState(false)

  const imageFiles = useMemo(() => logos.filter((file) => file.type.startsWith("image/")), [logos])

  const exampleGuidelines = useMemo(
    () =>
      `Brand: Nimbus Health\nMission: Make healthcare feel simple.\nTone: Confident, optimistic, plain language.\n\n1) Logo usage\n   - Primary logo on light backgrounds; white mark on dark.\n   - Minimum clear space: logo height x0.5; minimum size: 24px height.\n\n2) Colors\n   - Nimbus Blue #1E4B99 (Primary)\n   - Sky Mist #DCE8FF (Secondary)\n   - Coral Accent #FF6B5A (Accent)\n   - Text on light: #0F172A; on dark: #F8FAFC\n\n3) Typography\n   - Heading: Sora Bold (700)\n   - Body: Inter Regular (400)\n   - Buttons: Sora Semibold (600) all-caps letter-spacing 2%\n\n4) Imagery\n   - Use warm, candid care settings; avoid stock with heavy filters.\n\n5) Voice & copy\n   - Lead with outcomes, then how; prefer verbs over adjectives.\n\n6) Do / Don't\n   - Do keep 16px corner radius on cards.\n   - Don't place logo on photographic backgrounds without 60% overlay.\n\n7) File delivery\n   - Provide SVG + PNG @2x; include dark/light variants.\n\nOwner: brand@NimbusHealth.com\nLast updated: 2024-11-12`,
    []
  )

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
              Logos {/* TODO: add required indicator when RELAX_REQUIRED_FOR_TESTING is false */}
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
                  Light background version included
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
      <div className="rounded-lg border bg-muted/20 p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium">Need a starting point?</div>
          <p className="text-xs text-muted-foreground">Download a sample brand guide you can edit.</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            const blob = new Blob([exampleGuidelines], { type: "text/markdown" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "brand-guidelines-example.md"
            link.click()
            URL.revokeObjectURL(url)
          }}
        >
          Download sample brand guide
        </Button>
      </div>
      <FormField
        control={form.control}
        name="brandGuidelines"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Brand Guidelines {/* TODO: add required indicator when RELAX_REQUIRED_FOR_TESTING is false */}
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
