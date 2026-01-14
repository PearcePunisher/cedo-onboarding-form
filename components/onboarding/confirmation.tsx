"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmationProps {
  referenceId: string
  onReset: () => void
}

export function Confirmation({ referenceId, onReset }: ConfirmationProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>

      <h2 className="text-2xl font-semibold mb-2">Submission Received</h2>
      <p className="text-muted-foreground mb-6">Thank you for completing the onboarding form.</p>

      <div className="inline-block p-4 rounded-lg bg-muted/30 mb-8">
        <p className="text-sm text-muted-foreground mb-1">Reference ID</p>
        <p className="font-mono text-lg font-semibold text-primary">{referenceId}</p>
      </div>

      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Our team will review your submission and reach out if any additional information is needed.
      </p>

      {/* Placeholder for webhook / Strapi integration */}
      {/* TODO: Integrate with backend API */}
      {/* POST /api/onboarding with form payload */}

      <Button variant="outline" onClick={onReset}>
        Submit Another Entry
      </Button>
    </div>
  )
}
