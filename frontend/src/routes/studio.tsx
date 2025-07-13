import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { StudioTopBar } from '../components/studio/StudioTopBar'
import { WorkspaceTabs } from '../components/studio/WorkspaceTabs'
import { useStudioStore } from '../stores/studioStore'

export const Route = createFileRoute('/studio')({
  component: StudioPage,
})

function StudioPage() {
  const { activeWorkspace, activeView } = useStudioStore()

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar - Project context and user controls */}
      <StudioTopBar />
      
      {/* Workspace Tabs - Chat/Design and Preview/Code switching */}
      <WorkspaceTabs />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat or Design workspace */}
        <div className="w-1/3 border-r border-border flex flex-col">
          {activeWorkspace === 'chat' ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Chat Workspace</div>
                <div className="text-sm">v0.dev-style chat interface</div>
                <div className="text-xs mt-4 p-4 bg-muted/50 rounded-lg max-w-sm">
                  This is where the chat panel would be integrated. The architecture supports:
                  <ul className="text-left mt-2 space-y-1">
                    <li>• Real-time WebSocket streaming</li>
                    <li>• Test-driven generation pipeline</li>
                    <li>• Plugin system integration</li>
                    <li>• Reasoning step visualization</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Design Workspace</div>
                <div className="text-sm">Visual design tools coming soon...</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Panel - Preview or Code */}
        <div className="flex-1 flex flex-col">
          {activeView === 'preview' ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Preview Panel</div>
                <div className="text-sm">Live component preview</div>
                <div className="text-xs mt-4 p-4 bg-muted/50 rounded-lg max-w-sm">
                  This is where the live preview would render. Features include:
                  <ul className="text-left mt-2 space-y-1">
                    <li>• Hot reload with prop inspector</li>
                    <li>• Real-time updates from generation</li>
                    <li>• Interactive component testing</li>
                    <li>• Responsive design preview</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Code Editor</div>
                <div className="text-sm">Monaco-based code editor</div>
                <div className="text-xs mt-4 p-4 bg-muted/50 rounded-lg max-w-sm">
                  This is where the code editor would be integrated. Features include:
                  <ul className="text-left mt-2 space-y-1">
                    <li>• File tree with modification tracking</li>
                    <li>• Syntax highlighting and IntelliSense</li>
                    <li>• Real-time streaming updates</li>
                    <li>• Test result annotations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-muted/30 border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div>v0.dev-inspired Studio Architecture</div>
        <div>Ready for development</div>
      </div>
    </div>
  )
} 