import { Hexagon } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Hexagon className="w-6 h-6 text-primary" />
          </div>
          <span className="font-semibold text-lg">Cédo Apps</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <span className="text-muted-foreground">Client Onboarding</span>
      </div>
    </header>
  )
}
