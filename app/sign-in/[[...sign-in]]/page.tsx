import { SignIn } from "@clerk/nextjs"
import { Header } from "@/components/onboarding/header"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Sign In</h1>
          <p className="text-muted-foreground mt-2">Sign in to access the dashboard</p>
        </div>
        <SignIn 
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
