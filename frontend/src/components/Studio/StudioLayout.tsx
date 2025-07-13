import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, MessageSquare, Code, Eye, Settings } from "lucide-react"
import { StudioTopBar } from "../studio/StudioTopBar"
import { WorkspaceTabs } from "../studio/WorkspaceTabs"
import { ChatPanel } from "../Studio/ChatPanel"
import { CodeEditor } from "../Studio/CodeEditor"
import { PreviewPanel } from "../Studio/PreviewPanel"
import { VersionSidebar } from "../Studio/VersionSidebar"
import { useStudioStore } from "../../stores/studioStore"
import { TubelightNavBar } from "../ui/tubelight-navbar"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

interface StudioLayoutProps {
  children?: React.ReactNode
  className?: string
}

// Mobile navigation items
const MOBILE_NAV_ITEMS = [
  { name: 'Chat', icon: MessageSquare, url: 'chat' },
  { name: 'Code', icon: Code, url: 'code' },
  { name: 'Preview', icon: Eye, url: 'preview' },
  { name: 'Settings', icon: Settings, url: 'settings' },
]

// Mock data for components
const mockFiles = {
  'App.tsx': 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;',
  'index.css': 'body {\n  margin: 0;\n  font-family: Inter, sans-serif;\n}',
}

export function StudioLayout({ children, className }: StudioLayoutProps) {
  const { 
    activeWorkspace, 
    activeView,
    showVersionSidebar,
    setActiveWorkspace,
    setActiveView
  } = useStudioStore()
  
  // Mobile state management
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeMobilePanel, setActiveMobilePanel] = useState<'chat' | 'code' | 'preview' | 'settings'>('chat')
  const [showMobileModal, setShowMobileModal] = useState(false)

  // Handle mobile navigation
  const handleMobileNavClick = (item: any) => {
    const panel = item.url as 'chat' | 'code' | 'preview' | 'settings'
    setActiveMobilePanel(panel)
    
    // Update main store based on mobile selection
    if (panel === 'chat') {
      setActiveWorkspace('chat')
    } else if (panel === 'code') {
      setActiveView('code')
    } else if (panel === 'preview') {
      setActiveView('preview')
    }
  }

  // Handle mobile panel modal
  const openMobileModal = (panel: 'chat' | 'code' | 'preview' | 'settings') => {
    setActiveMobilePanel(panel)
    setShowMobileModal(true)
  }

  const closeMobileModal = () => {
    setShowMobileModal(false)
  }

  // Mock handlers for components
  const handleGenerate = (prompt: string) => {
    console.log('Generate:', prompt)
  }

  const handleImprove = (prompt: string) => {
    console.log('Improve:', prompt)
  }

  const handleFileChange = (filename: string, content: string) => {
    console.log('File changed:', filename, content)
  }

  const handleActiveFileChange = (filename: string) => {
    console.log('Active file changed:', filename)
  }

  const handleVersionRestore = (versionId: string) => {
    console.log('Restore version:', versionId)
  }

  // Render mobile panel content
  const renderMobilePanelContent = () => {
    switch (activeMobilePanel) {
      case 'chat':
        return (
          <ChatPanel 
            onGenerate={handleGenerate}
            onImprove={handleImprove}
            isGenerating={false}
          />
        )
      case 'code':
        return (
          <CodeEditor 
            files={mockFiles}
            activeFile="App.tsx"
            onFileChange={handleFileChange}
            onActiveFileChange={handleActiveFileChange}
          />
        )
      case 'preview':
        return (
          <PreviewPanel 
            files={mockFiles}
            activeFile="App.tsx"
          />
        )
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center p-8">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg font-medium mb-2">Settings</div>
              <div className="text-sm">Project settings and preferences</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("studio-workspace", className)}>
      {/* Top Bar - Always visible, responsive */}
      <StudioTopBar />
      
      {/* Desktop: Workspace Tabs */}
      <div className="desktop-only">
        <WorkspaceTabs />
      </div>
      
      {/* Mobile: Simplified header with menu toggle */}
      <div className="mobile-only border-b border-border bg-muted/30 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="touch-target"
          >
            {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <span className="font-medium text-sm capitalize">{activeMobilePanel}</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openMobileModal(activeMobilePanel)}
          className="text-xs"
        >
          Expand
        </Button>
      </div>

      {/* Mobile: Collapsible menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="mobile-only border-b border-border bg-background overflow-hidden"
          >
            <div className="p-3">
              <TubelightNavBar
                items={MOBILE_NAV_ITEMS}
                activeItem={activeMobilePanel}
                onItemClick={handleMobileNavClick}
                variant="mobile"
                className="w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: Three-panel layout */}
        <div className="desktop-only flex w-full">
          {/* Left Panel - Chat or Design workspace */}
          <div className="studio-panel-left">
            {activeWorkspace === 'chat' ? (
              <ChatPanel 
                onGenerate={handleGenerate}
                onImprove={handleImprove}
                isGenerating={false}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center p-8">
                  <div className="text-lg font-medium mb-2">Design Workspace</div>
                  <div className="text-sm">Visual design tools coming soon...</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Center Panel - Preview or Code */}
          <div className="studio-panel-center">
            {activeView === 'preview' ? (
              <PreviewPanel 
                files={mockFiles}
                activeFile="App.tsx"
              />
            ) : (
              <CodeEditor 
                files={mockFiles}
                activeFile="App.tsx"
                onFileChange={handleFileChange}
                onActiveFileChange={handleActiveFileChange}
              />
            )}
          </div>
          
          {/* Right Panel - Version Sidebar (conditional) */}
          {showVersionSidebar && (
            <div className="w-80 border-l border-border">
              <VersionSidebar 
                isOpen={showVersionSidebar}
                onClose={() => {}}
                projectId="mock-project"
                onVersionRestore={handleVersionRestore}
              />
            </div>
          )}
        </div>

        {/* Tablet: Two-panel layout */}
        <div className="tablet-only flex w-full">
          {/* Left Panel */}
          <div className="studio-panel-left">
            {activeWorkspace === 'chat' ? (
              <ChatPanel 
                onGenerate={handleGenerate}
                onImprove={handleImprove}
                isGenerating={false}
              />
            ) : (
              <CodeEditor 
                files={mockFiles}
                activeFile="App.tsx"
                onFileChange={handleFileChange}
                onActiveFileChange={handleActiveFileChange}
              />
            )}
          </div>
          
          {/* Right Panel */}
          <div className="studio-panel-right">
            {activeView === 'preview' ? (
              <PreviewPanel 
                files={mockFiles}
                activeFile="App.tsx"
              />
            ) : (
              <CodeEditor 
                files={mockFiles}
                activeFile="App.tsx"
                onFileChange={handleFileChange}
                onActiveFileChange={handleActiveFileChange}
              />
            )}
          </div>
        </div>

        {/* Mobile: Single panel with bottom navigation */}
        <div className="mobile-only w-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            {renderMobilePanelContent()}
          </div>
        </div>
      </div>

      {/* Mobile: Bottom Navigation */}
      <div className="mobile-nav">
        <TubelightNavBar
          items={MOBILE_NAV_ITEMS}
          activeItem={activeMobilePanel}
          onItemClick={handleMobileNavClick}
          variant="mobile"
          className="h-full flex items-center justify-center"
        />
      </div>

      {/* Mobile: Full-screen modal for expanded panels */}
      <AnimatePresence>
        {showMobileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-panel-modal"
          >
            {/* Modal Header */}
            <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur">
              <h2 className="font-semibold capitalize">{activeMobilePanel}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileModal}
                className="touch-target"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              {renderMobilePanelContent()}
            </div>
            
            {/* Modal Footer - Quick actions */}
            <div className="h-16 border-t border-border bg-background/95 backdrop-blur flex items-center justify-center gap-4 px-4">
              <TubelightNavBar
                items={MOBILE_NAV_ITEMS}
                activeItem={activeMobilePanel}
                onItemClick={(item) => {
                  handleMobileNavClick(item)
                  // Keep modal open for quick switching
                }}
                variant="desktop"
                className="flex-1"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Any additional children */}
      {children}
    </div>
  )
} 