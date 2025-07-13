import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Provider } from '../components/ui/provider'

export const Route = createRootRoute({
  component: () => (
    <Provider>
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    </Provider>
  ),
})
