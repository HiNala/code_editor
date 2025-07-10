import { createFileRoute } from "@tanstack/react-router"

import Gallery from "@/components/Videos/Gallery"

export const Route = createFileRoute("/_layout/videos")({
  component: Videos,
})

function Videos() {
  return <Gallery />
}
