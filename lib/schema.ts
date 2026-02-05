import { z } from "zod"

export const onboardingSchema = z.object({
  // Step 1: Brand Assets
  logos: z.array(z.any()).min(1, "At least one logo is required"),
  lightBackgroundVersion: z.boolean().refine((val) => val === true, {
    message: "Light background version is required",
  }),
  darkBackgroundVersion: z.boolean().default(false),
  brandGuidelines: z.any().refine((val) => val !== undefined && val !== null, {
    message: "Brand guidelines are required",
  }),
  brandNotes: z.string().max(5000, "Maximum 5000 characters").optional(),

  // Step 2: Car Information
  chassis: z.string().max(5000, "Maximum 5000 characters").optional(),
  engine: z.string().max(5000, "Maximum 5000 characters").optional(),
  otherSpecifications: z.string().max(5000, "Maximum 5000 characters").optional(),
  carImages: z.array(z.any()).optional(),
  plainWhiteBackground: z.boolean().default(false),
  multipleAngles: z.boolean().default(false),

  // Step 3: Photography
  eventPhotography: z.array(z.any()).optional(),
  photographyTypes: z.array(z.string()).default([]),
  photographyTypeAssets: z
    .array(
      z.object({
        type: z.string(),
        files: z.array(z.any()).optional(),
      }),
    )
    .default([]),
  tracks: z
    .array(
      z.object({
        id: z.string().optional(),
        trackName: z.string().max(5000, "Maximum 5000 characters"),
        trackImages: z.array(z.any()).optional(),
      }),
    )
    .default([]),
  experientialEvents: z
    .array(
      z.object({
        id: z.string().optional(),
        eventName: z.string().max(5000, "Maximum 5000 characters"),
        description: z.string().max(5000, "Maximum 5000 characters").optional(),
        images: z.array(z.any()).optional(),
      }),
    )
    .default([]),

  // Step 4: Driver
  drivers: z
    .array(
      z.object({
        id: z.string().optional(),
        driverName: z.string().min(1, "Driver name is required").max(5000, "Maximum 5000 characters"),
        hometown: z.string().max(5000, "Maximum 5000 characters").optional(),
        currentResidence: z.string().max(5000, "Maximum 5000 characters").optional(),
        birthdate: z.string().optional(),
        instagram: z.string().url().optional().or(z.literal("")),
        facebook: z.string().url().optional().or(z.literal("")),
        twitter: z.string().url().optional().or(z.literal("")),
        tiktok: z.string().url().optional().or(z.literal("")),
        merchandiseStore: z.string().url().optional().or(z.literal("")),
        driverBio: z.string().max(5000, "Maximum 5000 characters").optional(),
        headshot: z.any().optional(),
        heroImage: z.any().optional(),
      }),
    )
    .min(1, "At least one driver is required"),


  // Step 5: Team & Staff
  ownership: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().max(5000, "Maximum 5000 characters"),
        title: z.string().max(5000, "Maximum 5000 characters").optional(),
        bio: z.string().max(5000, "Maximum 5000 characters").optional(),
        headshot: z.any().optional(),
      }),
    )
    .default([]),
  teamBackground: z.string().max(5000, "Maximum 5000 characters").optional(),
  staff: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().max(5000, "Maximum 5000 characters"),
        title: z.string().max(5000, "Maximum 5000 characters").optional(),
        email: z.string().email("Valid email required").optional().or(z.literal("")),
        mobile: z.string().max(5000, "Maximum 5000 characters").optional(),
        roleOnSite: z.string().max(5000, "Maximum 5000 characters").optional(),
        headshot: z.any().optional(),
      }),
    )
    .default([]),

  // Step 6: Event Preferences
  selectedSeries: z.array(z.string()).default([]),
  indycarOnly: z.boolean().default(false),
  includeIndycarNxt: z.boolean().default(false),
  acknowledgeScheduleSource: z.boolean().default(false),
  f1IncludeSupportSeries: z.boolean().default(false),
  f1IncludeSprint: z.boolean().default(false),
  f1AcknowledgeScheduleSource: z.boolean().default(false),
  imsaIncludeMichelinPilot: z.boolean().default(false),
  imsaWeatherTechOnly: z.boolean().default(false),
  imsaAcknowledgeScheduleSource: z.boolean().default(false),
  nascarIncludeXfinity: z.boolean().default(false),
  nascarIncludeTruckSeries: z.boolean().default(false),
  nascarAcknowledgeScheduleSource: z.boolean().default(false),
  nhraIncludeSportsman: z.boolean().default(false),
  nhraProOnly: z.boolean().default(false),
  nhraAcknowledgeScheduleSource: z.boolean().default(false),
  eventTypes: z.array(z.string()).default([]),

  // Step 7: FAQs
  useDefaultFaqs: z.boolean().default(true),
  customFaqs: z
    .array(
      z.object({
        id: z.string().optional(),
        question: z.string().max(5000, "Maximum 5000 characters"),
        answer: z.string().max(5000, "Maximum 5000 characters"),
      }),
    )
    .default([]),
  specialNotes: z.string().max(5000, "Maximum 5000 characters").optional(),

  // Step 8: Review & Submit
  assetsApproved: z.boolean().refine((val) => val === true, {
    message: "You must confirm all assets are approved",
  }),
  additionalNotes: z.string().max(5000, "Maximum 5000 characters").optional(),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
