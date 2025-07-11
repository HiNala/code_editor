import { createFileRoute } from "@tanstack/react-router"

import CreationsTable from "@/components/Creations/CreationsTable"

export const Route = createFileRoute("/_layout/videos")({
  component: Videos,
})

function Videos() {
  return <CreationsTable />
}
