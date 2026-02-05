"use client";

import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormData } from "@/lib/schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/onboarding/file-upload";
import { RepeatableField } from "@/components/onboarding/repeatable-field";

interface StepProps {
  form: UseFormReturn<OnboardingFormData>;
}

const seriesOptions = ["INDYCAR", "NHRA", "F1", "IMSA", "NASCAR"] as const;

const eventTypeOptions = [
  "Credential office hours",
  "Practice",
  "Qualifying",
  "Green flag start",
  "General autograph sessions",
  "Hospitality suite hours",
  "Team meet & greet",
  "Garage tours",
];

const schedulePreferenceConfig: Record<
  (typeof seriesOptions)[number],
  { name: keyof OnboardingFormData; label: string }[]
> = {
  INDYCAR: [
    { name: "indycarOnly", label: "Confirm INDYCAR-only events" },
    { name: "includeIndycarNxt", label: "Include INDYCAR NXT if applicable" },
    { name: "acknowledgeScheduleSource", label: "Acknowledge official INDYCAR schedule source" },
  ],
  F1: [
    { name: "f1IncludeSupportSeries", label: "Include F2/F3 support series" },
    { name: "f1IncludeSprint", label: "Include sprint weekends" },
    { name: "f1AcknowledgeScheduleSource", label: "Acknowledge FIA schedule source" },
  ],
  IMSA: [
    { name: "imsaIncludeMichelinPilot", label: "Include Michelin Pilot Challenge" },
    { name: "imsaWeatherTechOnly", label: "Limit to WeatherTech Championship only" },
    { name: "imsaAcknowledgeScheduleSource", label: "Acknowledge IMSA official schedule source" },
  ],
  NASCAR: [
    { name: "nascarIncludeXfinity", label: "Include Xfinity Series" },
    { name: "nascarIncludeTruckSeries", label: "Include Craftsman Truck Series" },
    { name: "nascarAcknowledgeScheduleSource", label: "Acknowledge NASCAR official schedule source" },
  ],
  NHRA: [
    { name: "nhraIncludeSportsman", label: "Include Sportsman categories" },
    { name: "nhraProOnly", label: "Limit to Professional categories only" },
    { name: "nhraAcknowledgeScheduleSource", label: "Acknowledge NHRA official schedule source" },
  ],
};

export function Step6Events({ form }: StepProps) {
  const experientialEvents = form.watch("experientialEvents") || [];
  const selectedSeries = form.watch("selectedSeries") || [];
  const validSelectedSeries = selectedSeries.filter(
    (series): series is (typeof seriesOptions)[number] =>
      (seriesOptions as readonly string[]).includes(series),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Event Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Configure event and schedule settings
        </p>
      </div>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="selectedSeries"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Series</FormLabel>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {seriesOptions.map((series) => {
                  const checked = field.value?.includes(series);
                  return (
                    <div
                      key={series}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          const current = field.value || [];
                          if (isChecked) {
                            field.onChange([...current, series]);
                          } else {
                            field.onChange(current.filter((item: string) => item !== series));
                          }
                        }}
                      />
                      <span className="text-sm">{series}</span>
                    </div>
                  );
                })}
              </div>
            </FormItem>
          )}
        />

        <FormLabel>Schedule Preferences</FormLabel>

        {validSelectedSeries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Select at least one series to configure schedule preferences.
          </p>
        ) : (
          <div className="space-y-4">
            {validSelectedSeries.map((series) => {
              const preferences = schedulePreferenceConfig[series];

              if (!preferences) {
                return null;
              }

              return (
                <div
                  key={series}
                  className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{series} schedule</span>
                    <span className="text-xs text-muted-foreground">
                      Preferences apply only when {series} is selected
                    </span>
                  </div>

                  {preferences.map(({ name, label }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-3 space-y-0 p-3 rounded-md bg-muted/30">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel className="cursor-pointer">
                              {label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}

      </div>

      <FormField
        control={form.control}
        name="eventTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Types to Display</FormLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {eventTypeOptions.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Checkbox
                    checked={field.value?.includes(type)}
                    onCheckedChange={(checked) => {
                      const current = field.value || [];
                      if (checked) {
                        field.onChange([...current, type]);
                      } else {
                        field.onChange(current.filter((t) => t !== type));
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
        <FormLabel className="mb-3 block">Experiential Events</FormLabel>
        <RepeatableField
          items={experientialEvents}
          onAdd={() =>
            form.setValue("experientialEvents", [
              ...experientialEvents,
              {
                id: crypto.randomUUID(),
                eventName: "",
                description: "",
                images: [],
              },
            ])
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
                      <Input
                        placeholder="Event name"
                        className="bg-input"
                        maxLength={5000}
                        showCharCount
                        {...field}
                      />
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
                      <Textarea
                        placeholder="Event description"
                        className="bg-input"
                        maxLength={5000}
                        showCharCount
                        {...field}
                      />
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
                        inputId={`.${index}.`}
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
  );
}
