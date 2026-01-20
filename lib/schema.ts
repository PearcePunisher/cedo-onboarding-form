import { z } from "zod"

export const onboardingSchema = z.object({
  // Step 1: Brand Assets
  logos: z.array(z.any()).optional(),
  lightBackgroundVersion: z.boolean().default(false),
  darkBackgroundVersion: z.boolean().default(false),
  brandGuidelines: z.any().optional(),
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
  tracks: z
    .array(
      z.object({
        trackName: z.string().max(5000, "Maximum 5000 characters"),
        trackImages: z.array(z.any()).optional(),
      }),
    )
    .default([]),
  experientialEvents: z
    .array(
      z.object({
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
  indycarOnly: z.boolean().default(false),
  includeIndycarNxt: z.boolean().default(false),
  acknowledgeScheduleSource: z.boolean().default(false),
  eventTypes: z.array(z.string()).default([]),

  // Step 7: FAQs
  useDefaultFaqs: z.boolean().default(true),
  customFaqs: z
    .array(
      z.object({
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
