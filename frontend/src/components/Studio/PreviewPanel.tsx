import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  RefreshCw, 
  Monitor, 
  Smartphone, 
  Tablet,
  Terminal,
  Code,
  Maximize2,
  Minimize2,
  XCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

export interface FileMap {
  [filename: string]: string
}

interface PreviewPanelProps {
  files: FileMap
  activeFile: string
  className?: string
}

type DeviceType = 'mobile' | 'tablet' | 'desktop'
type ConsoleLogType = 'log' | 'error' | 'warning' | 'info'

interface ConsoleLog {
  type: ConsoleLogType
  message: string
  timestamp: Date
}

// Device mockup component
const DeviceMockup: React.FC<{
  type: DeviceType
  children: React.ReactNode
  className?: string
}> = ({ type, children, className }) => {
  const mockupStyles = {
    mobile: 'w-[375px] h-[667px] rounded-[32px] border-[12px] border-gray-800 bg-gray-800',
    tablet: 'w-[768px] h-[1024px] rounded-[24px] border-[16px] border-gray-700 bg-gray-700',
    desktop: 'w-full h-full rounded-lg border border-border bg-background'
  }

  return (
    <div className={cn('relative overflow-hidden shadow-2xl', mockupStyles[type], className)}>
      <div className="w-full h-full bg-white dark:bg-gray-900 overflow-hidden rounded-[20px]">
        {children}
      </div>
    </div>
  )
}

// Console output component
const ConsoleOutput: React.FC<{ logs: ConsoleLog[] }> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLogIcon = (type: ConsoleLogType) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      default:
        return <Terminal className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogClass = (type: ConsoleLogType) => {
    switch (type) {
      case 'error':
        return 'text-red-500 border-l-red-500'
      case 'warning':
        return 'text-yellow-500 border-l-yellow-500'
      case 'info':
        return 'text-blue-500 border-l-blue-500'
      default:
        return 'text-foreground border-l-gray-500'
    }
  }

  return (
    <ScrollArea className="h-[300px] w-full" ref={scrollRef}>
      <div className="p-4 font-mono text-sm space-y-2">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No console output</p>
            </div>
          </div>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={cn('py-2 pl-3 border-l-2 rounded-r', getLogClass(log.type))}
            >
              <div className="flex items-center gap-2 mb-1">
                {getLogIcon(log.type)}
                <span className="text-xs text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {log.type}
                </Badge>
              </div>
              <div className="ml-6 break-all">{log.message}</div>
            </motion.div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}

// Loading component
const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-spin rounded-full border-2 border-primary border-t-transparent', className)} />
)

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  files,
  activeFile,
  className
}) => {
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview')
  const [refreshKey, setRefreshKey] = useState(0)
  
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Add console log function
  const addConsoleLog = (type: ConsoleLogType, message: string) => {
    setConsoleLogs(prev => [
      ...prev,
      { type, message, timestamp: new Date() }
    ])
  }

  // Reload preview function
  const reloadPreview = () => {
    setIsLoading(true)
    setHasError(false)
    setRefreshKey(prev => prev + 1)
    
    // Simulate loading
    setTimeout(() => {
      try {
        // Simulate potential error (5% chance)
        if (Math.random() > 0.95) {
          throw new Error('Preview rendering failed')
        }
        
        setIsLoading(false)
        addConsoleLog('info', 'Preview reloaded successfully')
      } catch (error) {
        setHasError(true)
        const message = error instanceof Error ? error.message : 'Unknown error'
        setErrorMessage(message)
        addConsoleLog('error', message)
        setIsLoading(false)
      }
    }, 1000)
  }

  // Generate preview content
  const generatePreviewContent = () => {
    const activeFileContent = files[activeFile] || ''
    
    // Basic HTML template with the file content
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            background: ${device === 'mobile' ? '#f8f9fa' : 'white'};
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
          }
          h1 { color: #333; margin-bottom: 1rem; }
          p { color: #666; line-height: 1.6; }
          .code-block {
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin: 1rem 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Live Preview</h1>
          <p>File: <strong>${activeFile}</strong></p>
          <p>Device: <strong>${device}</strong></p>
          ${activeFile.endsWith('.html') ? activeFileContent : `
            <div class="code-block">
              <pre>${activeFileContent}</pre>
            </div>
          `}
        </div>
        <script>
          // Capture console logs and send to parent
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          
          console.log = (...args) => {
            originalLog.apply(console, args);
            window.parent.postMessage({
              type: 'console',
              level: 'log',
              message: args.join(' ')
            }, '*');
          };
          
          console.error = (...args) => {
            originalError.apply(console, args);
            window.parent.postMessage({
              type: 'console',
              level: 'error',
              message: args.join(' ')
            }, '*');
          };
          
          console.warn = (...args) => {
            originalWarn.apply(console, args);
            window.parent.postMessage({
              type: 'console',
              level: 'warning',
              message: args.join(' ')
            }, '*');
          };
          
          // Log initial load
          console.log('Preview loaded successfully');
        </script>
      </body>
      </html>
    `
  }

  // Listen for iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        addConsoleLog(
          event.data.level as ConsoleLogType,
          event.data.message
        )
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Initial load and file change handling
  useEffect(() => {
    reloadPreview()
  }, [activeFile, device])



  return (
    <motion.div
      className={cn(
        'flex flex-col bg-background border border-border rounded-lg overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Preview</h2>
          <Badge variant="outline" className="text-xs">
            {activeFile}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={reloadPreview}
            disabled={isLoading}
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Device Selector */}
      <div className="flex items-center justify-center p-3 border-b border-border bg-background">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          {(['mobile', 'tablet', 'desktop'] as DeviceType[]).map((deviceType) => {
            const Icon = deviceType === 'mobile' ? Smartphone : deviceType === 'tablet' ? Tablet : Monitor
            return (
              <Button
                key={deviceType}
                variant={device === deviceType ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDevice(deviceType)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="capitalize">{deviceType}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'console')}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <TabsList>
            <TabsTrigger value="preview" className="gap-2">
              <Code className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="console" className="gap-2">
              <Terminal className="h-4 w-4" />
              Console
              {consoleLogs.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {consoleLogs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-4"
                >
                  <LoadingSpinner className="w-8 h-8" />
                  <p className="text-sm text-muted-foreground">Loading preview...</p>
                </motion.div>
              ) : hasError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-4 text-center max-w-md"
                >
                  <XCircle className="h-12 w-12 text-destructive" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Preview Error</h3>
                    <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
                    <Button onClick={reloadPreview} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`preview-${refreshKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <DeviceMockup type={device} className="shadow-2xl">
                    <iframe
                      ref={iframeRef}
                      title="Preview"
                      className="w-full h-full border-0"
                      srcDoc={generatePreviewContent()}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </DeviceMockup>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="console" className="p-4">
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Console Output</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConsoleLogs([])}
                >
                  Clear
                </Button>
              </div>
              <ConsoleOutput logs={consoleLogs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
} 