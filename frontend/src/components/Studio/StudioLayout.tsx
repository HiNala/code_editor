import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { ChatPanel } from './ChatPanel'
import { CodeEditor } from './CodeEditor'
import { PreviewPanel } from './PreviewPanel'
import { FileExplorer } from './FileExplorer'
import { StudioTopBar } from './StudioTopBar'
import { VersionSidebar } from './VersionSidebar'
import { ConnectionStatus } from './ConnectionStatus'
import { UserDropdown } from './UserDropdown'
import { fileSystemService, FileItem } from '../../services/fileSystemService'

interface StudioState {
  activeView: 'chat' | 'code' | 'preview'
  showVersionSidebar: boolean
  isMobileMenuOpen: boolean
  isGenerating: boolean
  isPanelCollapsed: {
    chat: boolean
    preview: boolean
  }
}

const AnimatedLogo = () => (
  <motion.div 
    className="flex items-center gap-2"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <div className="relative w-6 h-6">
      <motion.div 
        className="absolute inset-0 bg-primary rounded-sm"
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      />
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        A
      </motion.div>
    </div>
    <motion.span 
      className="font-semibold text-lg"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      AI Studio
    </motion.span>
  </motion.div>
)

export const StudioLayout: React.FC = () => {
  const [state, setState] = useState<StudioState>({
    activeView: 'chat',
    showVersionSidebar: false,
    isMobileMenuOpen: false,
    isGenerating: false,
    isPanelCollapsed: {
      chat: false,
      preview: false
    }
  })

  const [fileSystemState, setFileSystemState] = useState(fileSystemService.getState())
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Subscribe to file system changes
  useEffect(() => {
    const unsubscribe = fileSystemService.subscribe(() => {
      setFileSystemState(fileSystemService.getState())
    })
    return unsubscribe
  }, [])

  // Initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const updateState = (updates: Partial<StudioState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      // Switch to code view when a file is selected
      updateState({ activeView: 'code' })
    }
  }

  const handleGenerate = (_prompt: string) => {
    updateState({ isGenerating: true })
    // TODO: Implement AI generation
    setTimeout(() => {
      updateState({ isGenerating: false })
    }, 2000)
  }

  const handleImprove = (_prompt: string) => {
    updateState({ isGenerating: true })
    // TODO: Implement AI improvement
    setTimeout(() => {
      updateState({ isGenerating: false })
    }, 2000)
  }

  const _togglePanel = (panel: 'chat' | 'preview') => {
    updateState({
      isPanelCollapsed: {
        ...state.isPanelCollapsed,
        [panel]: !state.isPanelCollapsed[panel]
      }
    })
  }

  // Get current file content
  const _getCurrentFileContent = () => {
    if (fileSystemState.activeFile) {
      return fileSystemService.getFileContent(fileSystemState.activeFile) || ''
    }
    return ''
  }

  // Get current file name
  const getCurrentFileName = () => {
    if (fileSystemState.activeFile) {
      const allFiles = fileSystemService.getAllFiles()
      const activeFile = allFiles.find(f => f.id === fileSystemState.activeFile)
      return activeFile?.name || 'Untitled'
    }
    return 'No file selected'
  }

  // Handle code changes
  const handleCodeChange = (_filename: string, content: string) => {
    if (fileSystemState.activeFile) {
      fileSystemService.updateFileContent(fileSystemState.activeFile, content)
    }
  }

  // Handle active file change
  const handleActiveFileChange = (filename: string) => {
    // Find file by name and set as active
    const allFiles = fileSystemService.getAllFiles()
    const file = allFiles.find(f => f.name === filename)
    if (file) {
      fileSystemService.setActiveFile(file.id)
    }
  }

  // Convert file system state to legacy format for existing components
  const getLegacyFiles = () => {
    const files: { [filename: string]: string } = {}
    const allFiles = fileSystemService.getAllFiles()
    allFiles.forEach(file => {
      if (file.type === 'file' && file.content) {
        files[file.name] = file.content
      }
    })
    return files
  }

  // Desktop Layout (1024px+)
  const DesktopLayout = () => {
    const panelTransition = {
      type: "spring",
      stiffness: 300,
      damping: 30
    }

    return (
      <div className="hidden lg:flex h-screen bg-background">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="h-14 border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 flex items-center justify-between px-4">
            <AnimatedLogo />
            <StudioTopBar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex w-full pt-14">
          {/* Left Sidebar - File Explorer */}
          <motion.div
            initial={{ width: 300 }}
            animate={{ width: 300 }}
            transition={panelTransition}
            className="border-r border-border bg-background/50 backdrop-blur-sm"
          >
            <FileExplorer onFileSelect={handleFileSelect} className="h-full" />
          </motion.div>

          {/* Center Panel - Code Editor */}
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <div className="flex-1">
              <CodeEditor
                files={getLegacyFiles()}
                activeFile={getCurrentFileName()}
                onFileChange={handleCodeChange}
                onActiveFileChange={handleActiveFileChange}
              />
            </div>
          </div>

          {/* Right Sidebar - Chat */}
          <AnimatePresence>
            {!state.isPanelCollapsed.chat && (
              <motion.div
                key="chat-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={panelTransition}
                className="border-l border-border bg-background/50 backdrop-blur-sm"
              >
                <ChatPanel 
                  onGenerate={handleGenerate}
                  onImprove={handleImprove}
                  isGenerating={state.isGenerating}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Panel - Preview (when expanded) */}
          <AnimatePresence>
            {!state.isPanelCollapsed.preview && (
              <motion.div
                key="preview-panel"
                initial={{ height: 0 }}
                animate={{ height: 300 }}
                exit={{ height: 0 }}
                transition={panelTransition}
                className="absolute bottom-0 left-300 right-0 border-t border-border bg-background/95 backdrop-blur-sm"
              >
                <PreviewPanel 
                  files={getLegacyFiles()}
                  activeFile={getCurrentFileName()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Version Sidebar */}
        <AnimatePresence>
          {state.showVersionSidebar && (
            <motion.div
              key="version-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={panelTransition}
              className="w-80 border-l border-border bg-background/95 backdrop-blur-sm"
            >
              <VersionSidebar 
                isOpen={state.showVersionSidebar}
                onClose={() => updateState({ showVersionSidebar: false })} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Mobile Layout (< 1024px)
  const MobileLayout = () => (
    <div className="lg:hidden flex flex-col h-screen bg-background">
      {/* Mobile Header */}
      <div className="h-14 border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 flex items-center justify-between px-4">
        <AnimatedLogo />
        <div className="flex items-center gap-2">
          <ConnectionStatus status="connected" />
          <UserDropdown />
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="flex">
          {(['chat', 'code', 'preview'] as const).map((view) => (
            <button
              key={view}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium transition-colors",
                state.activeView === view
                  ? "text-primary border-b-2 border-primary bg-accent/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              )}
              onClick={() => updateState({ activeView: view })}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {state.activeView === 'chat' && (
            <motion.div
              key="mobile-chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ChatPanel 
                onGenerate={handleGenerate}
                onImprove={handleImprove}
                isGenerating={state.isGenerating}
              />
            </motion.div>
          )}

          {state.activeView === 'code' && (
            <motion.div
              key="mobile-code"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Mobile File Explorer (Collapsible) */}
              <div className="border-b border-border">
                <FileExplorer onFileSelect={handleFileSelect} className="max-h-40" />
              </div>
              
              {/* Mobile Code Editor */}
              <div className="flex-1">
                <CodeEditor
                  files={getLegacyFiles()}
                  activeFile={getCurrentFileName()}
                  onFileChange={handleCodeChange}
                  onActiveFileChange={handleActiveFileChange}
                />
              </div>
            </motion.div>
          )}

          {state.activeView === 'preview' && (
            <motion.div
              key="mobile-preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <PreviewPanel 
                files={getLegacyFiles()}
                activeFile={getCurrentFileName()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {state.isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => updateState({ isMobileMenuOpen: false })}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 h-full bg-background border-r border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <FileExplorer onFileSelect={handleFileSelect} className="h-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  // Loading Screen
  if (isInitialLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <AnimatedLogo />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-muted-foreground"
          >
            Initializing AI Studio...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  )
}