"use client"

import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RepeatableField } from "@/components/onboarding/repeatable-field"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

export function Step7Faqs({ form }: StepProps) {
  const useDefaultFaqs = form.watch("useDefaultFaqs")
  const customFaqs = form.watch("customFaqs") || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">FAQs</h2>
        <p className="text-sm text-muted-foreground">Configure frequently asked questions</p>
      </div>

      <FormField
        control={form.control}
        name="useDefaultFaqs"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div>
              <FormLabel className="cursor-pointer">Use default FAQ set</FormLabel>
              <p className="text-sm text-muted-foreground mt-1">Use pre-configured FAQs for hospitality guests</p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {!useDefaultFaqs && (
        <div>
          <FormLabel className="mb-3 block">Custom FAQs</FormLabel>
          <RepeatableField
            items={customFaqs}
            onAdd={() => form.setValue("customFaqs", [...customFaqs, { question: "", answer: "" }])}
            onRemove={(index) =>
              form.setValue(
                "customFaqs",
                customFaqs.filter((_, i) => i !== index),
              )
            }
            addLabel="Add FAQ"
            renderItem={(_, index) => (
              <div className="space-y-4 pr-8">
                <FormField
                  control={form.control}
                  name={`customFaqs.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter question..." className="bg-input" maxLength={5000} showCharCount {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`customFaqs.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter answer..." className="bg-input" maxLength={5000} showCharCount {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          />
        </div>
      )}

      <FormField
        control={form.control}
        name="specialNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Notes or Restrictions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any special notes or restrictions for FAQs..."
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
