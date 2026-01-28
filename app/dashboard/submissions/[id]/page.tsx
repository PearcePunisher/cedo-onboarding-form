import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyableText } from "@/components/ui/copyable-text"
import { ImagePreview } from "@/components/ui/image-preview"
import { ArrowLeft, CheckCircle2, XCircle, Instagram, Facebook, Twitter } from "lucide-react"
import { neon } from "@neondatabase/serverless"

async function getSubmissionDetails(referenceId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured')
    }
    
    const sql = neon(process.env.DATABASE_URL)
    
    const [submission] = await sql`
      SELECT * FROM onboarding_submissions 
      WHERE reference_id = ${referenceId}
    `

    if (!submission) {
      return null
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

    return {
      submission,
      drivers,
      tracks,
      events,
      ownership,
      staff,
      faqs,
    }
  } catch (error) {
    console.error('Failed to fetch submission details:', error)
    return null
  }
}

function parseJsonField(field: string | null) {
  if (!field) return []
  try {
    return JSON.parse(field)
  } catch {
    return []
  }
}

function parseFileUrls(field: string | null): Array<{ url: string; name: string }> {
  if (!field) return []
  try {
    const data = JSON.parse(field)
    if (!Array.isArray(data)) return []
    
    return data.map((item, index) => {
      // If it's already a string URL
      if (typeof item === 'string') {
        return { url: item, name: `File ${index + 1}` }
      }
      // If it's an object with a url property
      if (item && typeof item === 'object' && item.url) {
        return { url: item.url, name: item.name || `File ${index + 1}` }
      }
      // If it's an object without URL (pre-blob storage)
      if (item && typeof item === 'object' && item.name) {
        return { url: '', name: item.name }
      }
      return { url: '', name: `File ${index + 1}` }
    })
  } catch {
    return []
  }
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const data = await getSubmissionDetails(resolvedParams.id)
  
  if (!data) {
    notFound()
  }

  const { submission, drivers = [], tracks = [], events = [], ownership = [], staff = [], faqs = [] } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Submission Details</h1>
        <p className="text-gray-500 mt-1">Reference ID: {submission.reference_id}</p>
      </div>

      {/* Brand Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Assets</CardTitle>
          <CardDescription>Logos and brand guidelines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Light Background Version</p>
              <p className="mt-1">
                {submission.light_background_version ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dark Background Version</p>
              <p className="mt-1">
                {submission.dark_background_version ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
              </p>
            </div>
          </div>
          
          {parseFileUrls(submission.logos).length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Logo Files</p>
              <div className="flex flex-wrap gap-2">
                {parseFileUrls(submission.logos).map((file, idx) => (
                  file.url ? (
                    <ImagePreview key={idx} url={file.url} name={file.name} />
                  ) : (
                    <Button key={idx} variant="outline" size="sm" disabled>
                      {file.name} (not available)
                    </Button>
                  )
                ))}
              </div>
            </div>
          )}
          
          {submission.brand_notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Brand Notes</p>
              <CopyableText text={submission.brand_notes} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Car Information */}
      <Card>
        <CardHeader>
          <CardTitle>Car Information</CardTitle>
          <CardDescription>Vehicle specifications and images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Chassis</p>
              <p className="mt-1">{submission.chassis || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Engine</p>
              <p className="mt-1">{submission.engine || '—'}</p>
            </div>
          </div>
          
          {submission.other_specifications && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Other Specifications</p>
              <CopyableText text={submission.other_specifications} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plain White Background</p>
              <p className="mt-1">
                {submission.plain_white_background ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Multiple Angles</p>
              <p className="mt-1">
                {submission.multiple_angles ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
              </p>
            </div>
          </div>

          {parseFileUrls(submission.car_images).length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Car Images</p>
              <div className="flex flex-wrap gap-2">
                {parseFileUrls(submission.car_images).map((file, idx) => (
                  file.url ? (
                    <ImagePreview key={idx} url={file.url} name={file.name} />
                  ) : (
                    <Button key={idx} variant="outline" size="sm" disabled>
                      {file.name} (not available)
                    </Button>
                  )
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drivers */}
      {drivers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Drivers</CardTitle>
            <CardDescription>{drivers.length} driver{drivers.length !== 1 ? 's' : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {drivers.map((driver: any, idx: number) => (
                <div key={driver.id} className="border-b last:border-0 pb-6 last:pb-0">
                  <h3 className="font-semibold text-lg mb-3">{driver.driver_name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {driver.hometown && (
                      <div>
                        <p className="text-muted-foreground">Hometown</p>
                        <p className="mt-1">{driver.hometown}</p>
                      </div>
                    )}
                    {driver.current_residence && (
                      <div>
                        <p className="text-muted-foreground">Current Residence</p>
                        <p className="mt-1">{driver.current_residence}</p>
                      </div>
                    )}
                    {driver.birthdate && (
                      <div>
                        <p className="text-muted-foreground">Birthdate</p>
                        <p className="mt-1">{driver.birthdate}</p>
                      </div>
                    )}
                  </div>
                  
                  {driver.driver_bio && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-2">Bio</p>
                      <CopyableText text={driver.driver_bio} />
                    </div>
                  )}

                  {(driver.instagram || driver.facebook || driver.twitter || driver.tiktok) && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-2">Social Media</p>
                      <div className="flex flex-wrap gap-2">
                        {driver.instagram && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={driver.instagram} target="_blank" rel="noopener noreferrer">
                              <Instagram className="mr-2 h-4 w-4" />
                              Instagram
                            </a>
                          </Button>
                        )}
                        {driver.facebook && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={driver.facebook} target="_blank" rel="noopener noreferrer">
                              <Facebook className="mr-2 h-4 w-4" />
                              Facebook
                            </a>
                          </Button>
                        )}
                        {driver.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={driver.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="mr-2 h-4 w-4" />
                              Twitter
                            </a>
                          </Button>
                        )}
                        {driver.tiktok && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={driver.tiktok} target="_blank" rel="noopener noreferrer">
                              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                              </svg>
                              TikTok
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracks */}
      {tracks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracks</CardTitle>
            <CardDescription>{tracks.length} track{tracks.length !== 1 ? 's' : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tracks.map((track: any) => (
                <div key={track.id} className="flex justify-between items-center">
                  <p>{track.track_name}</p>
                  {parseFileUrls(track.track_images).length > 0 && (
                    <div className="flex gap-2">
                      {parseFileUrls(track.track_images).map((file, idx) => (
                        file.url ? (
                          <ImagePreview key={idx} url={file.url} name={file.name} />
                        ) : (
                          <Button key={idx} variant="outline" size="sm" disabled>
                            {file.name}
                          </Button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experiential Events */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Experiential Events</CardTitle>
            <CardDescription>{events.length} event{events.length !== 1 ? 's' : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event: any) => (
                <div key={event.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <h4 className="font-medium">{event.event_name}</h4>
                  {event.description && (
                    <div className="mt-2">
                      <CopyableText text={event.description} />
                    </div>
                  )}
                  {parseFileUrls(event.images).length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {parseFileUrls(event.images).map((file, idx) => (
                        file.url ? (
                          <ImagePreview key={idx} url={file.url} name={file.name} />
                        ) : (
                          <Button key={idx} variant="outline" size="sm" disabled>
                            {file.name}
                          </Button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team & Ownership */}
      {(ownership.length > 0 || staff.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Team & Staff</CardTitle>
            <CardDescription>Team members and staff information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {submission.team_background && (
              <div>
                <p className="text-sm font-medium text-white-500 mb-2">Team Background</p>
                <CopyableText text={submission.team_background} />
              </div>
            )}

            {ownership.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Ownership</h4>
                <div className="space-y-3">
                  {ownership.map((owner: any) => (
                    <div key={owner.id} className="text-sm space-y-2">
                      <p className="font-medium">{owner.name}</p>
                      {owner.title && <p className="text-white-600">{owner.title}</p>}
                      {owner.bio && (
                        <div>
                          <CopyableText text={owner.bio} className="text-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {staff.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Staff</h4>
                <div className="space-y-3">
                  {staff.map((member: any) => (
                    <div key={member.id} className="text-sm">
                      <p className="font-medium">{member.name}</p>
                      {member.title && <p className="text-gray-600">{member.title}</p>}
                      {member.email && <p className="text-gray-600">{member.email}</p>}
                      {member.mobile && <p className="text-gray-600">{member.mobile}</p>}
                      {member.role_on_site && <p className="text-gray-600">Role: {member.role_on_site}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Event Preferences</CardTitle>
          <CardDescription>Event type preferences and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-white-500">IndyCar Only</p>
              <p className="mt-1">
                {submission.indycar_only ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-white-500">Include IndyCar NXT</p>
              <p className="mt-1">
                {submission.include_indycar_nxt ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
              </p>
            </div>
          </div>

          {parseJsonField(submission.event_types).length > 0 && (
            <div>
              <p className="text-sm font-medium text-white-500 mb-2">Event Types</p>
              <div className="flex flex-wrap gap-2">
                {parseJsonField(submission.event_types).map((type: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQs */}
      {faqs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom FAQs</CardTitle>
            <CardDescription>{faqs.length} custom FAQ{faqs.length !== 1 ? 's' : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq: any) => (
                <div key={faq.id}>
                  <p className="font-medium text-sm mb-2">{faq.question}</p>
                  <CopyableText text={faq.answer} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review & Approval */}
      <Card>
        <CardHeader>
          <CardTitle>Review & Approval</CardTitle>
          <CardDescription>Final review and submission details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-white-500">Assets Approved</p>
            <p className="mt-1">
              {submission.assets_approved ? (
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="h-5 w-5" />
                  Yes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-gray-400">
                  <XCircle className="h-5 w-5" />
                  No
                </span>
              )}
            </p>
          </div>

          {submission.additional_notes && (
            <div>
              <p className="text-sm font-medium text-white-500 mb-2">Additional Notes</p>
              <CopyableText text={submission.additional_notes} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-white-500">Submitted</p>
              <p className="mt-1 text-sm">
                {new Date(submission.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-white-500">Last Updated</p>
              <p className="mt-1 text-sm">
                {new Date(submission.updated_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
