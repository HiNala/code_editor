import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  RefreshCw, 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Tablet,
  AlertCircle,
  Square
} from 'lucide-react'
import { 
  SandpackProvider, 
  SandpackPreview, 
  SandpackConsole,
  SandpackLayout,
  SandpackCodeViewer
} from '@codesandbox/sandpack-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export interface FileMap {
  [filename: string]: string
}

export interface PreviewPanelProps {
  files: FileMap
  activeFile: string
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop'
type PreviewMode = 'preview' | 'console' | 'code'

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  files,
  activeFile,
}) => {
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('preview')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showConsole, setShowConsole] = useState(false)

  const getViewportDimensions = () => {
    switch (viewportSize) {
      case 'mobile':
        return { width: '375px', height: '667px' }
      case 'tablet':
        return { width: '768px', height: '1024px' }
      case 'desktop':
        return { width: '100%', height: '100%' }
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsRefreshing(false)
  }

  const handleOpenExternal = () => {
    // Open preview in new tab
    window.open('about:blank', '_blank')
  }

  const getViewportIcon = (size: ViewportSize) => {
    switch (size) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      case 'desktop':
        return <Monitor className="h-4 w-4" />
    }
  }

  const dimensions = getViewportDimensions()

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <h2 className="font-semibold">Preview</h2>
          </div>
          
          {/* Desktop Controls */}
          <div className="desktop-only flex items-center gap-2">
            {/* Viewport Size Selector */}
            <div className="flex items-center border border-border rounded-md p-1">
              {(['mobile', 'tablet', 'desktop'] as ViewportSize[]).map((size) => (
                <Button
                  key={size}
                  variant={viewportSize === size ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewportSize(size)}
                  className="h-8 px-2"
                >
                  {getViewportIcon(size)}
                  <span className="ml-1 capitalize text-xs">{size}</span>
                </Button>
              ))}
            </div>
            
            {/* Mode Selector */}
            <div className="flex items-center border border-border rounded-md p-1">
              <Button
                variant={previewMode === 'preview' ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode('preview')}
                className="h-8 px-2 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button
                variant={previewMode === 'console' ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode('console')}
                className="h-8 px-2 text-xs"
              >
                <Square className="h-3 w-3 mr-1" />
                Console
              </Button>
              <Button
                variant={previewMode === 'code' ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode('code')}
                className="h-8 px-2 text-xs"
              >
                <Monitor className="h-3 w-3 mr-1" />
                Code
              </Button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="touch-target"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              <span className="hidden sm:inline ml-1">Refresh</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenExternal}
              className="touch-target"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Open</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Controls */}
        <div className="mobile-only mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 flex-1">
            {(['mobile', 'tablet', 'desktop'] as ViewportSize[]).map((size) => (
              <Button
                key={size}
                variant={viewportSize === size ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize(size)}
                className="flex-1 text-xs"
              >
                {getViewportIcon(size)}
              </Button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConsole(!showConsole)}
            className="text-xs"
          >
            Console
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden">
        {Object.keys(files).length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-4">
              <Eye className="h-12 w-12 mx-auto opacity-50" />
              <div>
                <div className="text-lg font-medium mb-2">No files to preview</div>
                <div className="text-sm">Create some files to see the preview</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full p-4">
            <SandpackProvider
              files={files}
              template="react-ts"
              theme="dark"
            >
              <div className={cn(
                "h-full mx-auto transition-all duration-300",
                viewportSize === 'desktop' ? "w-full" : "border border-border rounded-lg overflow-hidden shadow-lg"
              )} style={viewportSize !== 'desktop' ? dimensions : undefined}>
                
                {previewMode === 'preview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full"
                  >
                    <SandpackLayout>
                      <SandpackPreview 
                        showOpenInCodeSandbox={false}
                        showRefreshButton={false}
                      />
                    </SandpackLayout>
                  </motion.div>
                )}
                
                {previewMode === 'console' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full"
                  >
                    <SandpackLayout>
                      <SandpackConsole />
                    </SandpackLayout>
                  </motion.div>
                )}
                
                {previewMode === 'code' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full"
                  >
                    <SandpackLayout>
                      <SandpackCodeViewer />
                    </SandpackLayout>
                  </motion.div>
                )}
              </div>
            </SandpackProvider>
          </div>
        )}
      </div>

      {/* Mobile Console */}
      {showConsole && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '200px' }}
          exit={{ height: 0 }}
          className="mobile-only border-t border-border bg-background"
        >
          <div className="h-full p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Console</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConsole(false)}
                className="h-6 w-6 p-0"
              >
                <Square className="h-3 w-3" />
              </Button>
            </div>
            
            {Object.keys(files).length > 0 ? (
              <SandpackProvider files={files} template="react-ts" theme="dark">
                <div className="h-[140px]">
                  <SandpackConsole />
                </div>
              </SandpackProvider>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">No files to run</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Status Bar */}
      <div className="border-t border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Viewport: {viewportSize}</span>
            <span>Files: {Object.keys(files).length}</span>
            {viewportSize !== 'desktop' && (
              <span>{dimensions.width} × {dimensions.height}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
} 