import { SignUp } from "@clerk/nextjs"
import { Header } from "@/components/onboarding/header"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">Create an account to access the dashboard</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-md border",
              formButtonPrimary: "bg-primary hover:bg-primary/90"
            }
          }}
        />
      </main>
    </div>
  )
}
