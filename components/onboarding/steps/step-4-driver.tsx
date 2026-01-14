"use client"

import type { UseFormReturn } from "react-hook-form"
import type { OnboardingFormData } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/onboarding/file-upload"

interface StepProps {
  form: UseFormReturn<OnboardingFormData>
}

export function Step4Driver({ form }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Driver Information</h2>
        <p className="text-sm text-muted-foreground">Provide driver details and social media links</p>
      </div>

      <FormField
        control={form.control}
        name="driverName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Driver Name *</FormLabel>
            <FormControl>
              <Input placeholder="Full name" className="bg-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="hometown"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hometown</FormLabel>
              <FormControl>
                <Input placeholder="City, Country" className="bg-input" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentResidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Residence</FormLabel>
              <FormControl>
                <Input placeholder="City, Country" className="bg-input" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birthdate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birthdate</FormLabel>
            <FormControl>
              <Input type="date" className="bg-input" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>Social Media</FormLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Instagram URL" className="bg-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Facebook URL" className="bg-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="X (Twitter) URL" className="bg-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="TikTok URL" className="bg-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="merchandiseStore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Merchandise Store</FormLabel>
            <FormControl>
              <Input placeholder="Store URL" className="bg-input" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="driverBio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Driver Bio</FormLabel>
            <FormControl>
              <Textarea placeholder="Brief biography..." className="min-h-[120px] bg-input" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="headshot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headshot</FormLabel>
              <FormControl>
                <FileUpload
                  accept="image/*"
                  onChange={(files) => field.onChange(files[0])}
                  value={field.value ? [field.value] : []}
                  label="Upload headshot"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heroImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Image</FormLabel>
              <FormControl>
                <FileUpload
                  accept="image/*"
                  onChange={(files) => field.onChange(files[0])}
                  value={field.value ? [field.value] : []}
                  label="Upload hero image"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
