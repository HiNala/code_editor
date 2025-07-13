import { createFileRoute } from "@tanstack/react-router"
import { StudioLayout } from "../components/Studio/StudioLayout"

function StudioPage() {
  return <StudioLayout />
}

export const Route = createFileRoute("/studio")({
  component: StudioPage,
}) 