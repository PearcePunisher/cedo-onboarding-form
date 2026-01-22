"use client"

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
                accept=".svg, .png, .eps, .webp"
                multiple
                onChange={field.onChange}
                value={field.value || []}
                label="Upload logos (SVG, PNG, EPS, WEBP)"
              />
            </FormControl>
            <FormDescription>
              Please provide logos with transparent background (preferred) or white/dark background for app integration purposes.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

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
