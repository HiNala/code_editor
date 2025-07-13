import React, { useState, useEffect } from 'react'
import { MessageCircle, Code, Eye, Menu, Settings, X, ChevronRight, Save, Download, Share } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatPanel } from './ChatPanel'
import { CodeEditor } from './CodeEditor'
import { PreviewPanel } from './PreviewPanel'
import { VersionSidebar } from './VersionSidebar'
import { Button } from '../ui/button'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Tooltip } from '../ui/tooltip'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'

export interface FileMap {
  [filename: string]: string
}

// Studio state interface
interface StudioState {
  activeView: 'chat' | 'code' | 'preview'
  showVersionSidebar: boolean
  isMobileMenuOpen: boolean
  files: FileMap
  activeFile: string
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
    files: {
      'app.tsx': `import React from 'react'

export function App() {
  return (
    <div className="p-4">
      <h1>Hello World!</h1>
      <p>This is a live preview of your responsive application.</p>
    </div>
  )
}`,
    },
    activeFile: 'app.tsx',
    isGenerating: false,
    isPanelCollapsed: {
      chat: false,
      preview: false
    }
  })

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // Simulate initial loading animation
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

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

  const togglePanel = (panel: 'chat' | 'preview') => {
    updateState({
      isPanelCollapsed: {
        ...state.isPanelCollapsed,
        [panel]: !state.isPanelCollapsed[panel]
      }
    })
  }

  // Desktop Layout (1024px+)
  const DesktopLayout = () => {
    const panelTransition = {
      type: "spring",
      stiffness: 300,
      damping: 30
    }

    return (
      <div className="h-screen flex flex-col">
        {/* Top Bar */}
        <motion.div 
          className="h-14 border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 flex items-center justify-between px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <AnimatedLogo />
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal">
                v0.1.0
              </Badge>
              <Badge variant="secondary" className="text-xs font-normal">
                Beta
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip content="Share">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Save">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Save className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Download">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Settings">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateState({ showVersionSidebar: !state.showVersionSidebar })}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Chat Panel */}
          <motion.div 
            className="border-r border-border bg-background/50 backdrop-blur-sm"
            initial={{ width: state.isPanelCollapsed.chat ? 0 : 320 }}
            animate={{ 
              width: state.isPanelCollapsed.chat ? 0 : 320,
              opacity: state.isPanelCollapsed.chat ? 0 : 1
            }}
            transition={panelTransition}
          >
            {!state.isPanelCollapsed.chat && (
              <div className="h-full w-full">
                <ChatPanel 
                  onGenerate={handleGenerate}
                  onImprove={handleImprove}
                  isGenerating={state.isGenerating}
                />
              </div>
            )}
          </motion.div>

          {/* Chat Panel Toggle */}
          <motion.div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-8 px-1.5 rounded-l-none shadow-md"
              onClick={() => togglePanel('chat')}
            >
              <motion.div
                animate={{ rotate: state.isPanelCollapsed.chat ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>

          {/* Code Editor */}
          <motion.div 
            className="flex-1 bg-background"
            layout
            transition={panelTransition}
          >
            <CodeEditor
              files={state.files}
              activeFile={state.activeFile}
              onFileChange={handleFileChange}
              onActiveFileChange={handleActiveFileChange}
            />
          </motion.div>

          {/* Preview Panel */}
          <motion.div 
            className="border-l border-border bg-background/50 backdrop-blur-sm"
            initial={{ width: state.isPanelCollapsed.preview ? 0 : 380 }}
            animate={{ 
              width: state.isPanelCollapsed.preview ? 0 : 380,
              opacity: state.isPanelCollapsed.preview ? 0 : 1
            }}
            transition={panelTransition}
          >
            {!state.isPanelCollapsed.preview && (
              <div className="h-full w-full">
                <PreviewPanel
                  files={state.files}
                  activeFile={state.activeFile}
                />
              </div>
            )}
          </motion.div>

          {/* Preview Panel Toggle */}
          <motion.div 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-8 px-1.5 rounded-r-none shadow-md"
              onClick={() => togglePanel('preview')}
            >
              <motion.div
                animate={{ rotate: state.isPanelCollapsed.preview ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>

          {/* Version Sidebar */}
          <AnimatePresence>
            {state.showVersionSidebar && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
      </div>
    )
  }

  // Mobile Layout (< 1024px)
  const MobileLayout = () => (
    <div className="h-screen flex flex-col">
      {/* Mobile Header */}
      <motion.div 
        className="h-14 border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 flex items-center justify-between px-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedLogo />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateState({ isMobileMenuOpen: !state.isMobileMenuOpen })}
          >
            {state.isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Mobile Tabs */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm">
        <Tabs 
          value={state.activeView} 
          onValueChange={(value) => updateState({ activeView: value as 'chat' | 'code' | 'preview' })}
          className="w-full"
        >
          <TabsList className="w-full h-12 grid grid-cols-3">
            <TabsTrigger value="chat" className="data-[state=active]:bg-background/80">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-background/80">
              <Code className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-background/80">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {state.activeView === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <CodeEditor
                files={state.files}
                activeFile={state.activeFile}
                onFileChange={handleFileChange}
                onActiveFileChange={handleActiveFileChange}
              />
            </motion.div>
          )}
          {state.activeView === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <PreviewPanel
                files={state.files}
                activeFile={state.activeFile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {state.isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => updateState({ isMobileMenuOpen: false })}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold">Settings</h2>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateState({ isMobileMenuOpen: false })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto">
                  <VersionSidebar 
                    isOpen={state.isMobileMenuOpen}
                    onClose={() => updateState({ isMobileMenuOpen: false })}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  // Initial loading animation
  if (isInitialLoad) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimatedLogo />
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
      
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout />
      </div>
    </>
  )
}