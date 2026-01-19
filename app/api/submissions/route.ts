import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const referenceId = searchParams.get("referenceId")

    const sql = neon(process.env.DATABASE_URL!)

    if (referenceId) {
      // Fetch specific submission with all related data
      const [submission] = await sql`
        SELECT * FROM onboarding_submissions 
        WHERE reference_id = ${referenceId}
      `

      if (!submission) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 })
      }

      const drivers = await sql`
        SELECT * FROM drivers WHERE reference_id = ${referenceId}
      `

      const tracks = await sql`
        SELECT * FROM tracks WHERE reference_id = ${referenceId}
      `

      const events = await sql`
        SELECT * FROM experiential_events WHERE reference_id = ${referenceId}
      `

      const ownership = await sql`
        SELECT * FROM ownership WHERE reference_id = ${referenceId}
      `

      const staff = await sql`
        SELECT * FROM staff WHERE reference_id = ${referenceId}
      `

      const faqs = await sql`
        SELECT * FROM custom_faqs WHERE reference_id = ${referenceId}
      `

      return NextResponse.json({
        submission,
        drivers,
        tracks,
        events,
        ownership,
        staff,
        faqs,
      })
    }

    // List all submissions (limited to 50)
    const submissions = await sql`
      SELECT 
        reference_id, 
        created_at,
        assets_approved,
        chassis,
        engine
      FROM onboarding_submissions 
      ORDER BY created_at DESC 
      LIMIT 50
    `

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
