import { createFileRoute } from '@tanstack/react-router'
import { StudioLayout } from '../components/Studio/StudioLayout'

export const Route = createFileRoute('/studio')({
  component: StudioPage,
})

function StudioPage() {
  return <StudioLayout />
} 