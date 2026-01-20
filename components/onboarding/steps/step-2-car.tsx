"use client"

import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/onboarding/file-upload"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

export function Step2Car({ form }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Car Information</h2>
        <p className="text-sm text-muted-foreground">
          Provide chassis, engine, and other specs along with car images (SVG, EPS, or PNG)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="chassis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chassis</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dallara DW12" className="bg-input" maxLength={5000} showCharCount {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="engine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engine</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Honda HI24TT" className="bg-input" maxLength={5000} showCharCount {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="otherSpecifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other Specifications</FormLabel>
            <FormControl>
              <Textarea placeholder="Additional car specifications..." className="min-h-[100px] bg-input" maxLength={5000} showCharCount {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="carImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Car Images</FormLabel>
            <FormControl>
              <FileUpload
                accept="image/*"
                multiple
                onChange={field.onChange}
                value={field.value || []}
                label="Upload car images"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="plainWhiteBackground"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 p-4 rounded-lg bg-muted/30">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="cursor-pointer">Plain white background confirmed</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="multipleAngles"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 p-4 rounded-lg bg-muted/30">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="cursor-pointer">Multiple angles included</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
