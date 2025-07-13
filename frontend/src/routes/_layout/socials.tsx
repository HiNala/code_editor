import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_layout/socials'
)(
  {
    component: SocialsPage,
  }
)

function SocialsPage() {
  const { creationId } = Route.useParams() as { creationId: string }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        Schedule Social Post
      </h1>
      <p className="text-muted-foreground">Creation ID: {creationId}</p>
      {/* TODO: implement social media scheduling UI */}
    </div>
  )
}

export default SocialsPage