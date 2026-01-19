"use server"

import { neon } from "@neondatabase/serverless"
import { OnboardingFormData } from "./schema"

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

    // Convert File objects and complex data to JSON strings for storage
    const prepareFileData = (files: any) => {
      if (!files) return null
      return JSON.stringify(files.map((file: any) => ({
        name: file?.name || "unknown",
        type: file?.type || "unknown",
        size: file?.size || 0,
      })))
    }

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
        ${prepareFileData(data.logos)},
        ${data.lightBackgroundVersion},
        ${data.darkBackgroundVersion},
        ${prepareFileData(data.brandGuidelines ? [data.brandGuidelines] : null)},
        ${data.brandNotes},
        ${data.chassis},
        ${data.engine},
        ${data.otherSpecifications},
        ${prepareFileData(data.carImages)},
        ${data.plainWhiteBackground},
        ${data.multipleAngles},
        ${prepareFileData(data.eventPhotography)},
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
          ${prepareFileData(driver.headshot ? [driver.headshot] : null)},
          ${prepareFileData(driver.heroImage ? [driver.heroImage] : null)}
        )
      `
    }

    // Insert tracks
    for (const track of data.tracks) {
      await sql`
        INSERT INTO tracks (
          reference_id,
          track_name,
          track_images
        ) VALUES (
          ${referenceId},
          ${track.trackName},
          ${prepareFileData(track.trackImages)}
        )
      `
    }

    // Insert experiential events
    for (const event of data.experientialEvents) {
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
          ${prepareFileData(event.images)}
        )
      `
    }

    // Insert ownership
    for (const owner of data.ownership) {
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
          ${prepareFileData(owner.headshot ? [owner.headshot] : null)}
        )
      `
    }

    // Insert staff
    for (const staffMember of data.staff) {
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
          ${prepareFileData(staffMember.headshot ? [staffMember.headshot] : null)}
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
