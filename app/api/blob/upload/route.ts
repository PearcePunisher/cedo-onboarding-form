import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("onboarding/")) {
          throw new Error("Invalid upload path")
        }

        return {
          allowedContentTypes: [
            "image/*",
            "application/pdf",
            "application/postscript",
            "application/illustrator",
            "application/octet-stream",
          ],
          maximumSizeInBytes: 50 * 1024 * 1024,
        }
      },
      onUploadCompleted: async () => {
        // No-op for now. Final DB write occurs when form data is submitted.
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Blob upload token error:", error)
    return NextResponse.json({ error: "Failed to process upload" }, { status: 400 })
  }
}
