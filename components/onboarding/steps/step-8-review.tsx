"use client"

import type React from "react"

import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Check, X } from "lucide-react"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

function SummaryItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

function BooleanIndicator({ value }: { value: boolean }) {
  return value ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-muted-foreground" />
}

export function Step8Review({ form }: StepProps) {
  const values = form.getValues()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Review & Submit</h2>
        <p className="text-sm text-muted-foreground">Review your submission before finalizing</p>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Brand Assets</h3>
          <SummaryItem label="Logos uploaded" value={(values.logos?.length || 0) + " files"} />
          <SummaryItem label="Light version" value={<BooleanIndicator value={values.lightBackgroundVersion} />} />
          <SummaryItem label="Dark version" value={<BooleanIndicator value={values.darkBackgroundVersion} />} />
          <SummaryItem label="Brand guidelines" value={values.brandGuidelines ? "Uploaded" : "Not provided"} />
        </div>

        <div className="p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Car Information</h3>
          <SummaryItem label="Chassis" value={values.chassis || "Not provided"} />
          <SummaryItem label="Engine" value={values.engine || "Not provided"} />
          <SummaryItem label="Car images" value={(values.carImages?.length || 0) + " files"} />
        </div>

        <div className="p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Driver</h3>
          <SummaryItem label="Name" value={values.driverName || "Not provided"} />
          <SummaryItem label="Hometown" value={values.hometown || "Not provided"} />
          <SummaryItem label="Current residence" value={values.currentResidence || "Not provided"} />
          <SummaryItem
            label="Social profiles"
            value={
              [values.instagram, values.facebook, values.twitter, values.tiktok].filter(Boolean).length + " provided"
            }
          />
        </div>

        <div className="p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Team & Staff</h3>
          <SummaryItem label="Ownership entries" value={values.ownership?.length || 0} />
          <SummaryItem label="Staff members" value={values.staff?.length || 0} />
        </div>

        <div className="p-4 rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Events & FAQs</h3>
          <SummaryItem label="Event types selected" value={values.eventTypes?.length || 0} />
          <SummaryItem label="Using default FAQs" value={<BooleanIndicator value={values.useDefaultFaqs} />} />
          <SummaryItem label="Custom FAQs" value={values.customFaqs?.length || 0} />
        </div>
      </div>

      <FormField
        control={form.control}
        name="assetsApproved"
        render={({ field }) => (
          <FormItem className="flex items-start gap-3 space-y-0 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1">
              <FormLabel className="cursor-pointer">All submitted assets are approved for use *</FormLabel>
              <p className="text-sm text-muted-foreground">
                By checking this box, you confirm that all uploaded materials are approved for use in the Cédo
                hospitality app.
              </p>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional information or special requests..."
                className="min-h-[100px] bg-input"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
