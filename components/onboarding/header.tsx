import Image from "next/image"

export function Header() {
  return (
    <header className="border-b border-border bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <Image
          src="/cedo-apps-logo.png"
          alt="Cédo Apps"
          width={150}
          height={40}
          className="h-10 w-auto"
          priority
        />
        <div className="h-6 w-px bg-border" />
        <span className="text-muted-foreground">Client Onboarding Form</span>
      </div>
    </header>
  )
}
