import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { neon } from "@neondatabase/serverless"

async function getSubmissions() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured')
    }
    
    const sql = neon(process.env.DATABASE_URL)
    
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
    
    return { submissions }
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    throw new Error('Failed to fetch submissions')
  }
}

export default async function DashboardPage() {
  const data = await getSubmissions()
  const submissions = data.submissions || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Onboarding Submissions</h1>
          <p className="text-gray-500 mt-1">
            View and manage client onboarding submissions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>
            {submissions.length} total submission{submissions.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No submissions yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Chassis</TableHead>
                  <TableHead>Engine</TableHead>
                  <TableHead>Assets Approved</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission: any) => (
                  <TableRow key={submission.reference_id}>
                    <TableCell className="font-medium">
                      {submission.reference_id}
                    </TableCell>
                    <TableCell>{submission.chassis || '—'}</TableCell>
                    <TableCell>{submission.engine || '—'}</TableCell>
                    <TableCell>
                      {submission.assets_approved ? (
                        <span className="text-green-600 font-medium">✓ Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(submission.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/submissions/${submission.reference_id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
