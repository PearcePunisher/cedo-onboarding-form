import { z } from "zod"

export const onboardingSchema = z.object({
  // Step 1: Brand Assets
  logos: z.array(z.any()).optional(),
  lightBackgroundVersion: z.boolean().default(false),
  darkBackgroundVersion: z.boolean().default(false),
  brandGuidelines: z.any().optional(),
  brandNotes: z.string().optional(),

  // Step 2: Car Information
  chassis: z.string().optional(),
  engine: z.string().optional(),
  otherSpecifications: z.string().optional(),
  carImages: z.array(z.any()).optional(),
  plainWhiteBackground: z.boolean().default(false),
  multipleAngles: z.boolean().default(false),

  // Step 3: Photography
  eventPhotography: z.array(z.any()).optional(),
  photographyTypes: z.array(z.string()).default([]),
  tracks: z
    .array(
      z.object({
        trackName: z.string(),
        trackImages: z.array(z.any()).optional(),
      }),
    )
    .default([]),
  experientialEvents: z
    .array(
      z.object({
        eventName: z.string(),
        description: z.string().optional(),
        images: z.array(z.any()).optional(),
      }),
    )
    .default([]),

  // Step 4: Driver
  driverName: z.string().min(1, "Driver name is required"),
  hometown: z.string().optional(),
  currentResidence: z.string().optional(),
  birthdate: z.string().optional(),
  instagram: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  tiktok: z.string().url().optional().or(z.literal("")),
  merchandiseStore: z.string().url().optional().or(z.literal("")),
  driverBio: z.string().optional(),
  headshot: z.any().optional(),
  heroImage: z.any().optional(),

  // Step 5: Team & Staff
  ownership: z
    .array(
      z.object({
        name: z.string(),
        title: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .default([]),
  teamBackground: z.string().optional(),
  staff: z
    .array(
      z.object({
        name: z.string(),
        title: z.string().optional(),
        email: z.string().email("Valid email required").optional().or(z.literal("")),
        mobile: z.string().optional(),
        roleOnSite: z.string().optional(),
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
        question: z.string(),
        answer: z.string(),
      }),
    )
    .default([]),
  specialNotes: z.string().optional(),

  // Step 8: Review & Submit
  assetsApproved: z.boolean().refine((val) => val === true, {
    message: "You must confirm all assets are approved",
  }),
  additionalNotes: z.string().optional(),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
