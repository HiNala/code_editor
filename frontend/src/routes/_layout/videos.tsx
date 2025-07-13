import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/videos")({
  component: Videos,
})

function Videos() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      <p className="text-muted-foreground">Video management coming soon...</p>
    </div>
  )
}
