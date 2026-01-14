"use client"

import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

const eventTypeOptions = [
  "Credential office hours",
  "Practice",
  "Qualifying",
  "Green flag start",
  "General autograph sessions",
  "Hospitality suite hours",
  "Team meet & greet",
  "Garage tours",
]

export function Step6Events({ form }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Event Preferences</h2>
        <p className="text-sm text-muted-foreground">Configure event and schedule settings</p>
      </div>

      <div className="space-y-4">
        <FormLabel>Schedule Preferences</FormLabel>

        <FormField
          control={form.control}
          name="indycarOnly"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 p-4 rounded-lg bg-muted/30">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="cursor-pointer">Confirm INDYCAR-only events</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="includeIndycarNxt"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 p-4 rounded-lg bg-muted/30">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="cursor-pointer">Include INDYCAR NXT if applicable</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acknowledgeScheduleSource"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 p-4 rounded-lg bg-muted/30">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="cursor-pointer">Acknowledge official INDYCAR schedule source</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="eventTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Types to Display</FormLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {eventTypeOptions.map((type) => (
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
    </div>
  )
}
