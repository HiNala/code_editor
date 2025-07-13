import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  Code, 
  Zap,
  User,
  Bot
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatPanelProps {
  onGenerate: (prompt: string) => void
  onImprove: (prompt: string) => void
  isGenerating: boolean
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onGenerate,
  onImprove,
  isGenerating,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to the Code Generation Studio! Describe what you want to build and I\'ll generate the code for you.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isImproveMode, setIsImproveMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    if (isImproveMode) {
      onImprove(input)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Improving code based on: "${input}"`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } else {
      onGenerate(input)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Generating code for: "${input}"`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    }

    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getMessageIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'assistant':
        return <Bot className="h-4 w-4" />
      case 'system':
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getMessageBorderColor = (type: ChatMessage['type']) => {
    switch (type) {
      case 'user':
        return 'border-l-blue-500'
      case 'assistant':
        return 'border-l-green-500'
      case 'system':
        return 'border-l-gray-500'
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h2 className="font-semibold">Chat</h2>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={!isImproveMode ? 'default' : 'outline'}
              onClick={() => setIsImproveMode(false)}
              className="text-xs"
            >
              <Code className="h-3 w-3 mr-1" />
              Generate
            </Button>
            <Button
              size="sm"
              variant={isImproveMode ? 'default' : 'outline'}
              onClick={() => setIsImproveMode(true)}
              className="text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Improve
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "p-4 rounded-lg border-l-4 bg-muted/30",
                getMessageBorderColor(message.type)
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  message.type === 'user' 
                    ? "bg-blue-500/10 text-blue-500"
                    : message.type === 'assistant'
                    ? "bg-green-500/10 text-green-500"
                    : "bg-gray-500/10 text-gray-500"
                )}>
                  {getMessageIcon(message.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium capitalize">
                      {message.type === 'assistant' ? 'AI Assistant' : message.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/95 backdrop-blur">
        <div className="space-y-3">
          {/* Mode Indicator */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              isImproveMode 
                ? "bg-green-500/10 text-green-500"
                : "bg-blue-500/10 text-blue-500"
            )}>
              {isImproveMode ? <Zap className="h-3 w-3" /> : <Code className="h-3 w-3" />}
              {isImproveMode ? 'Improve Mode' : 'Generate Mode'}
            </div>
          </div>
          
          {/* Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isImproveMode
                    ? 'Describe how to improve the code...'
                    : 'Describe what you want to build...'
                }
                className={cn(
                  "w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm",
                  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "min-h-[44px] max-h-32 custom-scrollbar"
                )}
                rows={1}
              />
            </div>
            
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="touch-target self-end"
              size="sm"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          
          {/* Quick Actions - Mobile */}
          <div className="mobile-only flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Create a React component')}
              className="text-xs flex-1"
            >
              React Component
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Add responsive styles')}
              className="text-xs flex-1"
            >
              Add Styles
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 