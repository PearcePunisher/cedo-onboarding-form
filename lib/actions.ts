"use server"

import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"
import { OnboardingFormData } from "./schema"

async function uploadFiles(files: File[] | null | undefined, prefix: string): Promise<string | null> {
  if (!files || files.length === 0) return null
  
  const uploadedUrls: string[] = []
  
  for (const file of files) {
    if (file instanceof File) {
      const blob = await put(`${prefix}/${Date.now()}-${file.name}`, file, {
        access: "public",
      })
      uploadedUrls.push(blob.url)
    }
  }
  
  return uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : null
}

async function uploadSingleFile(file: File | null | undefined, prefix: string): Promise<string | null> {
  if (!file || !(file instanceof File)) return null
  
  const blob = await put(`${prefix}/${Date.now()}-${file.name}`, file, {
    access: "public",
  })
  
  return blob.url
}

export async function submitOnboardingForm(data: OnboardingFormData) {
  console.log("Server Action called - starting submission...")
  
  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not defined!")
      return { success: false, error: "Database configuration error" }
    }

    const sql = neon(process.env.DATABASE_URL)
    console.log("Database connection initialized")

    // Generate reference ID
    const referenceId = `CEDO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    console.log("Generated reference ID:", referenceId)

    // Upload files to Vercel Blob Storage
    console.log("Uploading files to Vercel Blob Storage...")
    const logosUrls = await uploadFiles(data.logos, `onboarding/${referenceId}/logos`)
    const brandGuidelinesUrl = await uploadSingleFile(data.brandGuidelines, `onboarding/${referenceId}/brand-guidelines`)
    const carImagesUrls = await uploadFiles(data.carImages, `onboarding/${referenceId}/car-images`)
    const eventPhotographyUrls = await uploadFiles(data.eventPhotography, `onboarding/${referenceId}/event-photography`)
    console.log("Files uploaded successfully")

    // Insert main onboarding record
    await sql`
      INSERT INTO onboarding_submissions (
        reference_id,
        logos,
        light_background_version,
        dark_background_version,
        brand_guidelines,
        brand_notes,
        chassis,
        engine,
        other_specifications,
        car_images,
        plain_white_background,
        multiple_angles,
        event_photography,
        photography_types,
        team_background,
        indycar_only,
        include_indycar_nxt,
        acknowledge_schedule_source,
        event_types,
        use_default_faqs,
        special_notes,
        assets_approved,
        additional_notes,
        created_at
      ) VALUES (
        ${referenceId},
        ${logosUrls},
        ${data.lightBackgroundVersion},
        ${data.darkBackgroundVersion},
        ${brandGuidelinesUrl},
        ${data.brandNotes},
        ${data.chassis},
        ${data.engine},
        ${data.otherSpecifications},
        ${carImagesUrls},
        ${data.plainWhiteBackground},
        ${data.multipleAngles},
        ${eventPhotographyUrls},
        ${JSON.stringify(data.photographyTypes)},
        ${data.teamBackground},
        ${data.indycarOnly},
        ${data.includeIndycarNxt},
        ${data.acknowledgeScheduleSource},
        ${JSON.stringify(data.eventTypes)},
        ${data.useDefaultFaqs},
        ${data.specialNotes},
        ${data.assetsApproved},
        ${data.additionalNotes},
        NOW()
      )
    `

    console.log("Main onboarding record inserted successfully")

    // Insert drivers
    console.log(`Inserting ${data.drivers.length} driver(s)...`)
    for (const driver of data.drivers) {
      const headshotUrl = await uploadSingleFile(driver.headshot, `onboarding/${referenceId}/drivers/headshots`)
      const heroImageUrl = await uploadSingleFile(driver.heroImage, `onboarding/${referenceId}/drivers/hero-images`)
      
      await sql`
        INSERT INTO drivers (
          reference_id,
          driver_name,
          hometown,
          current_residence,
          birthdate,
          instagram,
          facebook,
          twitter,
          tiktok,
          merchandise_store,
          driver_bio,
          headshot,
          hero_image
        ) VALUES (
          ${referenceId},
          ${driver.driverName},
          ${driver.hometown},
          ${driver.currentResidence},
          ${driver.birthdate},
          ${driver.instagram},
          ${driver.facebook},
          ${driver.twitter},
          ${driver.tiktok},
          ${driver.merchandiseStore},
          ${driver.driverBio},
          ${headshotUrl},
          ${heroImageUrl}
        )
      `
    }

    // Insert tracks
    for (const track of data.tracks) {
      const trackImagesUrls = await uploadFiles(track.trackImages, `onboarding/${referenceId}/tracks`)
      
      await sql`
        INSERT INTO tracks (
          reference_id,
          track_name,
          track_images
        ) VALUES (
          ${referenceId},
          ${track.trackName},
          ${trackImagesUrls}
        )
      `
    }

    // Insert experiential events
    for (const event of data.experientialEvents) {
      const eventImagesUrls = await uploadFiles(event.images, `onboarding/${referenceId}/experiential-events`)
      
      await sql`
        INSERT INTO experiential_events (
          reference_id,
          event_name,
          description,
          images
        ) VALUES (
          ${referenceId},
          ${event.eventName},
          ${event.description},
          ${eventImagesUrls}
        )
      `
    }

    // Insert ownership
    for (const owner of data.ownership) {
      const headshotUrl = await uploadSingleFile(owner.headshot, `onboarding/${referenceId}/ownership`)
      
      await sql`
        INSERT INTO ownership (
          reference_id,
          name,
          title,
          bio,
          headshot
        ) VALUES (
          ${referenceId},
          ${owner.name},
          ${owner.title},
          ${owner.bio},
          ${headshotUrl}
        )
      `
    }

    // Insert staff
    for (const staffMember of data.staff) {
      const headshotUrl = await uploadSingleFile(staffMember.headshot, `onboarding/${referenceId}/staff`)
      
      await sql`
        INSERT INTO staff (
          reference_id,
          name,
          title,
          email,
          mobile,
          role_on_site,
          headshot
        ) VALUES (
          ${referenceId},
          ${staffMember.name},
          ${staffMember.title},
          ${staffMember.email},
          ${staffMember.mobile},
          ${staffMember.roleOnSite},
          ${headshotUrl}
        )
      `
    }

    // Insert custom FAQs
    for (const faq of data.customFaqs) {
      await sql`
        INSERT INTO custom_faqs (
          reference_id,
          question,
          answer
        ) VALUES (
          ${referenceId},
          ${faq.question},
          ${faq.answer}
        )
      `
    }

    console.log("All data inserted successfully!")
    return { success: true, referenceId }
  } catch (error) {
    console.error("Database error:", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to save onboarding data" 
    }
  }
}
