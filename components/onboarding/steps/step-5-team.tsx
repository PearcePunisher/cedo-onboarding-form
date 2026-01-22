"use client"

import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/onboarding/file-upload"
import { RepeatableField } from "@/components/onboarding/repeatable-field"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

export function Step5Team({ form }: StepProps) {
  const ownership = form.watch("ownership") || []
  const staff = form.watch("staff") || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Team & Staff</h2>
        <p className="text-sm text-muted-foreground">Add ownership and staff information</p>
      </div>

      <div>
        <FormLabel className="mb-3 block">Ownership</FormLabel>
        <RepeatableField
          items={ownership}
          onAdd={() => form.setValue("ownership", [...ownership, { name: "", title: "", bio: "", headshot: undefined }])}
          onRemove={(index) =>
            form.setValue(
              "ownership",
              ownership.filter((_, i) => i !== index),
            )
          }
          addLabel="Add Owner"
          renderItem={(_, index) => (
            <div className="space-y-4 pr-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`ownership.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" className="bg-input" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ownership.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Team Owner" className="bg-input" maxLength={5000} showCharCount {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`ownership.${index}.bio`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief bio..." className="bg-input" maxLength={5000} showCharCount {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`ownership.${index}.headshot`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headshot</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept="image/*"
                        onChange={(files) => field.onChange(files[0])}
                        value={field.value ? [field.value] : []}
                        label="Upload headshot on plain background"
                        inputId={`ownership-${index}-headshot`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="teamBackground"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Background</FormLabel>
            <FormControl>
              <Textarea
                placeholder="When the team was formed, where you are based, team history..."
                className="min-h-[120px] bg-input"
                maxLength={5000}
                showCharCount
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div>
        <FormLabel className="mb-3 block">Staff</FormLabel>
        <RepeatableField
          items={staff}
          onAdd={() =>
            form.setValue("staff", [...staff, { name: "", title: "", email: "", mobile: "", roleOnSite: "" }])
          }
          onRemove={(index) =>
            form.setValue(
              "staff",
              staff.filter((_, i) => i !== index),
            )
          }
          addLabel="Add Staff Member"
          renderItem={(_, index) => (
            <div className="space-y-4 pr-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`staff.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" className="bg-input" maxLength={5000} showCharCount {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`staff.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Job title" className="bg-input" maxLength={5000} showCharCount {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`staff.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" className="bg-input" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`staff.${index}.mobile`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" className="bg-input" maxLength={5000} showCharCount {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`staff.${index}.roleOnSite`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role on Site</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Team Manager" className="bg-input" maxLength={5000} showCharCount {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`staff.${index}.headshot`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headshot</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept="image/*"
                        onChange={(files) => field.onChange(files[0])}
                        value={field.value ? [field.value] : []}
                        label="Upload headshot"
                        inputId={`staff-${index}-headshot`}
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
