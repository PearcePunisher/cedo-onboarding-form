"use client"

import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/onboarding/file-upload"
import { RepeatableField } from "@/components/onboarding/repeatable-field"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

const photographyTypeOptions = [
  "Qualifying isolated car shots",
  "Race action",
  "Pit lane",
  "Hospitality empty",
  "Hospitality with guests",
  "Driver autograph sessions",
  "Garage tours",
  "Paddock action",
]

export function Step3Photography({ form }: StepProps) {
  const tracks = form.watch("tracks") || []
  const selectedTypes = form.watch("photographyTypes") || []
  const typeAssets = form.watch("photographyTypeAssets") || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Photography</h2>
        <p className="text-sm text-muted-foreground">
          Upload fully approved images (PNG, EPS, or SVG) spanning the entire event experience
        </p>
      </div>

      <FormField
        control={form.control}
        name="eventPhotography"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Approved Event Photography</FormLabel>
            <FormControl>
              <FileUpload
                accept=".svg, .png, .eps, .webp, .avif"
                multiple
                onChange={field.onChange}
                value={field.value || []}
                label="Upload approved event photography (SVG, PNG, EPS, WEBP, AVIF)"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="photographyTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photography Types Included</FormLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {photographyTypeOptions.map((type) => (
                <div key={type} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Checkbox
                    checked={field.value?.includes(type)}
                    onCheckedChange={(checked) => {
                      const current = field.value || []
                      const currentAssets = form.getValues("photographyTypeAssets") || []
                      if (checked) {
                        field.onChange([...current, type])
                        if (!currentAssets.some((asset: { type: string }) => asset.type === type)) {
                          form.setValue(
                            "photographyTypeAssets",
                            [...currentAssets, { type, files: [] }],
                            { shouldDirty: true },
                          )
                        }
                      } else {
                        field.onChange(current.filter((t) => t !== type))
                        form.setValue(
                          "photographyTypeAssets",
                          currentAssets.filter((asset: { type: string }) => asset.type !== type),
                          { shouldDirty: true },
                        )
                      }
                    }}
                  />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />

      {selectedTypes.length > 0 && (
        <div className="space-y-4">
          <FormLabel>Photography Type Assets</FormLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            {selectedTypes.map((type) => {
              const index = typeAssets.findIndex((asset: { type: string }) => asset.type === type)
              const files = index >= 0 ? typeAssets[index].files || [] : []

              return (
                <div key={type} className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                  <div className="text-sm font-medium">{type}</div>
                  <FileUpload
                    accept=".svg, .png, .eps, .webp, .avif"
                    multiple
                    value={files}
                    onChange={(newFiles) => {
                      const currentAssets = form.getValues("photographyTypeAssets") || []
                      if (index === -1) {
                        form.setValue(
                          "photographyTypeAssets",
                          [...currentAssets, { type, files: newFiles }],
                          { shouldDirty: true },
                        )
                        return
                      }
                      const updated = [...currentAssets]
                      updated[index] = { ...updated[index], files: newFiles }
                      form.setValue("photographyTypeAssets", updated, { shouldDirty: true })
                    }}
                    label={`Upload ${type.toLowerCase()} imagery`}
                    inputId={`photo-type-${type.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <FormLabel className="mb-3 block">Tracks</FormLabel>
        <RepeatableField
          items={tracks}
          onAdd={() => form.setValue("tracks", [...tracks, { id: crypto.randomUUID(),trackName: "", trackImages: [] }])} // when we're uploading we are probably upading to the new trackImages
          onRemove={(index) =>
            form.setValue(
              "tracks",
              tracks.filter((_, i) => i !== index),
            )
          }
          addLabel="Add Track"
          renderItem={(_, index) => (
            <div className="space-y-4 pr-8">
              <FormField
                control={form.control}
                name={`tracks.${index}.trackName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Track Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Indianapolis Motor Speedway" className="bg-input" maxLength={5000} showCharCount {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`tracks.${index}.trackImages`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Track Images</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept=".svg, .png, .eps, .webp, .avif"
                        multiple
                        onChange={field.onChange}
                        value={field.value || []}
                        label="Upload track images"
                        inputId={`${index}`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
