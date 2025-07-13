import { useEffect, useRef, useCallback } from 'react'
import { useStudioStore } from '../stores/studioStore'
import type { AgentStage, FileNode, TestResult, ReasoningStep } from '../stores/studioStore'

export interface StreamingMessage {
  type: 'token' | 'file_closed' | 'build_progress' | 'build_ok' | 'build_error' | 'stage_complete' | 'test_result' | 'reasoning_step' | 'hot_reload' | 'plugin_result' | 'error'
  content?: string
  filename?: string
  stage?: AgentStage
  progress_pct?: number
  test_results?: any
  reasoning_data?: any
  component_id?: string
  prop_name?: string
  new_value?: any
  plugin_name?: string
  files?: Record<string, string>
}

export interface UseEnhancedWebSocketOptions {
  projectId: string
  onMessage?: (message: StreamingMessage) => void
  onError?: (error: Event) => void
  onClose?: () => void
}

export function useEnhancedWebSocket({ projectId, onMessage, onError, onClose }: UseEnhancedWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  
  const {
    setConnectionStatus,
    setState,
    setCurrentStage,
    setBuildProgress,
    addFile,
    updateFile,
    addTestResult,
    clearTestResults,
    addReasoningStep,
    stopGeneration
  } = useStudioStore()

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionStatus('connecting')
    
    const token = localStorage.getItem('access_token')
    const wsUrl = `ws://localhost:8000/api/v1/studio/projects/${projectId}/generate/stream?token=${token}`
    
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnectionStatus('connected')
      reconnectAttempts.current = 0
    }

    ws.onmessage = (event) => {
      try {
        const message: StreamingMessage = JSON.parse(event.data)
        handleMessage(message)
        onMessage?.(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      onError?.(error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setConnectionStatus('disconnected')
      onClose?.()
      
      // Attempt to reconnect
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Reconnecting... (attempt ${reconnectAttempts.current})`)
          connect()
        }, delay)
      }
    }
  }, [projectId, setConnectionStatus, onMessage, onError, onClose])

  const handleMessage = useCallback((message: StreamingMessage) => {
    switch (message.type) {
      case 'token':
        // Handle streaming code tokens
        if (message.filename && message.content) {
          // Update or create file with new content
          const fileId = message.filename.replace(/[^a-zA-Z0-9]/g, '_')
          const existingFile = useStudioStore.getState().files[fileId]
          
          if (existingFile) {
            updateFile(fileId, {
              content: existingFile.content + message.content
            })
          } else {
            const newFile: FileNode = {
              id: fileId,
              name: message.filename.split('/').pop() || 'untitled',
              path: message.filename,
              content: message.content,
              language: getLanguageFromPath(message.filename),
              isModified: false,
              isNew: true
            }
            addFile(newFile)
          }
        }
        break

      case 'file_closed':
        // File generation completed
        if (message.filename) {
          const fileId = message.filename.replace(/[^a-zA-Z0-9]/g, '_')
          updateFile(fileId, { isNew: false })
          
          // Trigger file completion animation
          setTimeout(() => {
            const element = document.querySelector(`[data-file-id="${fileId}"]`)
            if (element) {
              element.classList.add('animate-highlight-flash')
              setTimeout(() => {
                element.classList.remove('animate-highlight-flash')
              }, 600)
            }
          }, 100)
        }
        break

      case 'build_progress':
        // Update build progress
        if (typeof message.progress_pct === 'number') {
          setBuildProgress(message.progress_pct)
          setState('BUILDING')
        }
        break

      case 'build_ok':
        // Build completed successfully
        setState('PREVIEW_READY')
        setBuildProgress(100)
        setTimeout(() => setBuildProgress(0), 2000)
        break

      case 'build_error':
        // Build failed
        setState('ERROR')
        setBuildProgress(0)
        break

      case 'stage_complete':
        // Test-driven agent stage completed
        if (message.stage) {
          setCurrentStage(message.stage)
          
          // Add reasoning step
          const step: ReasoningStep = {
            stage: message.stage,
            timestamp: new Date().toISOString(),
            description: message.content || `${message.stage} completed`
          }
          addReasoningStep(step)
        }
        break

      case 'test_result':
        // Test results received
        if (message.test_results) {
          clearTestResults()
          
          if (message.test_results.test_details) {
            message.test_results.test_details.forEach((test: any) => {
              const result: TestResult = {
                file: test.file,
                status: test.status,
                duration: test.duration,
                error: test.error
              }
              addTestResult(result)
            })
          }
        }
        break

      case 'reasoning_step':
        // Reasoning step from agent
        if (message.reasoning_data) {
          const step: ReasoningStep = {
            stage: message.reasoning_data.stage,
            timestamp: message.reasoning_data.timestamp,
            description: message.reasoning_data.description || 'Processing...',
            data: message.reasoning_data
          }
          addReasoningStep(step)
        }
        break

      case 'hot_reload':
        // Prop inspector hot reload
        if (message.component_id && message.prop_name !== undefined) {
          // Trigger hot reload in preview
          const previewFrame = document.querySelector('iframe[data-preview]') as HTMLIFrameElement
          if (previewFrame && previewFrame.contentWindow) {
            previewFrame.contentWindow.postMessage({
              type: 'prop_update',
              componentId: message.component_id,
              propName: message.prop_name,
              newValue: message.new_value
            }, '*')
          }
        }
        break

      case 'plugin_result':
        // Plugin execution result
        if (message.plugin_name && message.files) {
          // Update files with plugin results
          Object.entries(message.files).forEach(([path, content]) => {
            const fileId = path.replace(/[^a-zA-Z0-9]/g, '_')
            const existingFile = useStudioStore.getState().files[fileId]
            
            if (existingFile) {
              updateFile(fileId, { content })
            } else {
              const newFile: FileNode = {
                id: fileId,
                name: path.split('/').pop() || 'untitled',
                path,
                content,
                language: getLanguageFromPath(path),
                isModified: true,
                isNew: false
              }
              addFile(newFile)
            }
          })
        }
        break

      case 'error':
        // Error message
        setState('ERROR')
        stopGeneration()
        console.error('WebSocket error:', message.content)
        break

      default:
        console.log('Unknown message type:', message.type)
    }
  }, [setState, setCurrentStage, setBuildProgress, addFile, updateFile, addTestResult, clearTestResults, addReasoningStep, stopGeneration])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      return true
    }
    return false
  }, [])

  const generateCode = useCallback((prompt: string, options: { skipTests?: boolean, usePlugins?: string[] } = {}) => {
    return sendMessage({
      type: 'generate',
      prompt,
      skip_tests: options.skipTests || false,
      use_plugins: options.usePlugins || []
    })
  }, [sendMessage])

  const improveCode = useCallback((code: string, improvement: string) => {
    return sendMessage({
      type: 'improve',
      code,
      improvement
    })
  }, [sendMessage])

  const updateProp = useCallback((componentId: string, propName: string, newValue: any) => {
    return sendMessage({
      type: 'patch_prop',
      component_id: componentId,
      prop_name: propName,
      new_value: newValue
    })
  }, [sendMessage])

  const usePlugin = useCallback((pluginName: string, files: Record<string, string>) => {
    return sendMessage({
      type: 'use_plugin',
      plugin_name: pluginName,
      files
    })
  }, [sendMessage])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setConnectionStatus('disconnected')
  }, [setConnectionStatus])

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    connect,
    disconnect,
    sendMessage,
    generateCode,
    improveCode,
    updateProp,
    usePlugin,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN
  }
}

// Helper function to determine language from file path
function getLanguageFromPath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'css':
      return 'css'
    case 'html':
      return 'html'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    default:
      return 'text'
  }
} 