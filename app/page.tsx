import { Header } from "@/components/onboarding/header"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <OnboardingForm />
      </main>
    </div>
  )
}
