"use client"

import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
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
  const experientialEvents = form.watch("experientialEvents") || []

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
                accept="image/*,.eps,.svg"
                multiple
                onChange={field.onChange}
                value={field.value || []}
                label="Upload approved event photography (PNG, EPS, or SVG)"
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
                      if (checked) {
                        field.onChange([...current, type])
                      } else {
                        field.onChange(current.filter((t) => t !== type))
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

      <div>
        <FormLabel className="mb-3 block">Tracks</FormLabel>
        <RepeatableField
          items={tracks}
          onAdd={() => form.setValue("tracks", [...tracks, { trackName: "", trackImages: [] }])}
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
                      <Input placeholder="e.g., Indianapolis Motor Speedway" className="bg-input" {...field} />
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
                        accept="image/*"
                        multiple
                        onChange={field.onChange}
                        value={field.value || []}
                        label="Upload track images"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        />
      </div>

      <div>
        <FormLabel className="mb-3 block">Experiential Events</FormLabel>
        <RepeatableField
          items={experientialEvents}
          onAdd={() =>
            form.setValue("experientialEvents", [...experientialEvents, { eventName: "", description: "", images: [] }])
          }
          onRemove={(index) =>
            form.setValue(
              "experientialEvents",
              experientialEvents.filter((_, i) => i !== index),
            )
          }
          addLabel="Add Event"
          renderItem={(_, index) => (
            <div className="space-y-4 pr-8">
              <FormField
                control={form.control}
                name={`experientialEvents.${index}.eventName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Event name" className="bg-input" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experientialEvents.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Event description" className="bg-input" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experientialEvents.${index}.images`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Images</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept="image/*"
                        multiple
                        onChange={field.onChange}
                        value={field.value || []}
                        label="Upload event images"
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
