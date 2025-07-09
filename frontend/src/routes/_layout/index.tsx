import { createFileRoute } from "@tanstack/react-router"

import WorkflowWheel from "@/components/Common/WorkflowWheel"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const handleStateChange = (state: string) => {
    console.log("Workflow state changed to:", state)
    // Here you can add navigation logic or other actions based on the state
  }

  return <WorkflowWheel onStateChange={handleStateChange} />
}

export default Dashboard
