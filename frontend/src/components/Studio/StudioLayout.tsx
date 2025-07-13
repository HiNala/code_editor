import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageCircle, Code, Eye, Settings } from 'lucide-react'
import { Button } from '../ui/button'
import { TubelightNavBar } from '../ui/tubelight-navbar'
import { ChatPanel } from './ChatPanel'
import { CodeEditor } from './CodeEditor'
import { PreviewPanel } from './PreviewPanel'
import { VersionSidebar } from './VersionSidebar'
import { cn } from '../../lib/utils'

export interface FileMap {
  [filename: string]: string
}

interface StudioState {
  activeView: 'chat' | 'code' | 'preview'
  showVersionSidebar: boolean
  isMobileMenuOpen: boolean
  files: FileMap
  activeFile: string
}

export const StudioLayout: React.FC = () => {
  const [state, setState] = useState<StudioState>({
    activeView: 'chat',
    showVersionSidebar: false,
    isMobileMenuOpen: false,
    files: {
      'App.tsx': `import React from 'react'

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Hello World!</h1>
      <p className="text-gray-600">This is a sample React component.</p>
    </div>
  )
}`
    },
    activeFile: 'App.tsx'
  })

  const updateState = (updates: Partial<StudioState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const handleFileChange = (filename: string, content: string) => {
    updateState({
      files: { ...state.files, [filename]: content }
    })
  }

  const handleActiveFileChange = (filename: string) => {
    updateState({ activeFile: filename })
  }

  // Desktop Layout (1024px+)
  const DesktopLayout = () => (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">AI Studio</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateState({ showVersionSidebar: !state.showVersionSidebar })}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-80 border-r border-border">
          <ChatPanel 
            onGenerate={() => {}}
            onImprove={() => {}}
            isGenerating={false}
          />
        </div>

        {/* Code/Preview Area */}
        <div className="flex-1 flex">
          <div className="flex-1">
            {state.activeView === 'code' ? (
              <CodeEditor
                files={state.files}
                activeFile={state.activeFile}
                onFileChange={handleFileChange}
                onActiveFileChange={handleActiveFileChange}
              />
            ) : (
              <PreviewPanel
                files={state.files}
                activeFile={state.activeFile}
              />
            )}
          </div>
        </div>

        {/* Version Sidebar */}
        <VersionSidebar
          isOpen={state.showVersionSidebar}
          onClose={() => updateState({ showVersionSidebar: false })}
        />
      </div>
    </div>
  )

  // Mobile Layout (<768px)
  const MobileLayout = () => (
    <div className="h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="h-14 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4">
        <h1 className="font-semibold">AI Studio</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateState({ isMobileMenuOpen: !state.isMobileMenuOpen })}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 overflow-hidden">
        {state.activeView === 'chat' && <ChatPanel />}
        {state.activeView === 'code' && (
          <CodeEditor
            files={state.files}
            activeFile={state.activeFile}
            onFileChange={handleFileChange}
            onActiveFileChange={handleActiveFileChange}
          />
        )}
        {state.activeView === 'preview' && (
          <PreviewPanel
            files={state.files}
            activeFile={state.activeFile}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="h-16 border-t border-border bg-background/95 backdrop-blur">
        <TubelightNavBar
          items={[
            {
              id: 'chat',
              label: 'Chat',
              icon: MessageCircle,
              isActive: state.activeView === 'chat'
            },
            {
              id: 'code',
              label: 'Code',
              icon: Code,
              isActive: state.activeView === 'code'
            },
            {
              id: 'preview',
              label: 'Preview',
              icon: Eye,
              isActive: state.activeView === 'preview'
            }
          ]}
          onItemClick={(id) => updateState({ activeView: id as any })}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {state.isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => updateState({ isMobileMenuOpen: false })}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-xl z-50"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateState({ isMobileMenuOpen: false })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => updateState({ showVersionSidebar: true, isMobileMenuOpen: false })}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Version History
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Version Sidebar */}
      <VersionSidebar
        isOpen={state.showVersionSidebar}
        onClose={() => updateState({ showVersionSidebar: false })}
      />
    </div>
  )

  return (
    <>
      <div className="desktop-only">
        <DesktopLayout />
      </div>
      <div className="mobile-only">
        <MobileLayout />
      </div>
    </>
  )
} 