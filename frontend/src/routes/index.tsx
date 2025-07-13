import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">AI Studio</h1>
        <p className="text-xl text-muted-foreground">
          Build amazing applications with AI assistance
        </p>
        <div className="space-y-4">
          <Link 
            to="/studio"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Open Studio
          </Link>
        </div>
      </div>
    </div>
  )
} 