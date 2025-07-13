import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  Code, 
  Zap,
  User,
  Bot,
  Paperclip,
  Command,
  RefreshCw,
  Copy
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { Avatar, AvatarFallback } from '../ui/avatar'

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

const PLACEHOLDERS = [
  "Describe what you want to build...",
  "Create a React component for a dashboard...",
  "Generate a responsive navbar with dark mode...",
  "Build a form with validation...",
  "Design a card component with hover effects..."
]

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
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
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

  // Cycle placeholder text
  useEffect(() => {
    if (input) return

    const interval = setInterval(() => {
      setShowPlaceholder(false)
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
        setShowPlaceholder(true)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [input])

  // Close command palette when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target as Node)
      ) {
        setShowCommandPalette(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    } else {
      onGenerate(input)
    }

    // Add a temporary loading message that will be updated by the parent component
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: isImproveMode 
        ? `Improving code based on: "${input}"`
        : `Generating code for: "${input}"`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMessage])

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

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  }

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(8px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(8px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
  }

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  }

  return (
    <div className="h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">AI Code Assistant</h2>
              <p className="text-xs text-muted-foreground">Powered by AI</p>
            </div>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={!isImproveMode ? 'default' : 'outline'}
              onClick={() => setIsImproveMode(false)}
              className="text-xs h-8"
            >
              <Code className="h-3 w-3 mr-1" />
              Generate
            </Button>
            <Button
              size="sm"
              variant={isImproveMode ? 'default' : 'outline'}
              onClick={() => setIsImproveMode(true)}
              className="text-xs h-8"
            >
              <Zap className="h-3 w-3 mr-1" />
              Improve
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={messageVariants}
              layout
              className="group"
            >
              <div className={cn(
                "flex gap-3 group-hover:bg-muted/40 p-3 rounded-lg transition-colors",
                message.type === 'system' && "bg-muted/30"
              )}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={cn(
                    message.type === 'user' 
                      ? "bg-blue-500/10 text-blue-500"
                      : message.type === 'assistant'
                      ? "bg-green-500/10 text-green-500"
                      : "bg-gray-500/10 text-gray-500"
                  )}>
                    {getMessageIcon(message.type)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">
                      {message.type === 'assistant' ? 'AI Assistant' : message.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {message.type === 'assistant' && (
                    <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span className="sr-only">Regenerate</span>
                      </Button>
                    </div>
                  )}
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
            className="flex items-center gap-3 p-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-green-500/10 text-green-500">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
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
          <div 
            ref={inputContainerRef}
            className="relative flex items-center rounded-lg border border-input bg-background focus-within:ring-1 focus-within:ring-ring"
          >
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={cn(
                  "w-full resize-none rounded-md border-0 bg-transparent px-3 py-2 text-sm",
                  "placeholder:text-muted-foreground focus:outline-none",
                  "min-h-[44px] max-h-32 custom-scrollbar"
                )}
                rows={1}
              />
              
              {/* Animated placeholder */}
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !input && (
                    <motion.span
                      key={placeholderIndex}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none pointer-events-none ml-3"
                      variants={placeholderContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {PLACEHOLDERS[placeholderIndex]
                        .split("")
                        .map((char, i) => (
                          <motion.span
                            key={i}
                            variants={letterVariants}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex items-center gap-1 px-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCommandPalette(!showCommandPalette)}
              >
                <Command className="h-4 w-4" />
                <span className="sr-only">Commands</span>
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach</span>
              </Button>
              
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className="h-8 w-8"
                size="icon"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            
            {/* Command palette */}
            <AnimatePresence>
              {showCommandPalette && (
                <motion.div 
                  className="absolute left-0 right-0 bottom-full mb-2 bg-popover rounded-lg shadow-lg border border-border overflow-hidden z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-1">
                    {[
                      { icon: <Code className="h-4 w-4" />, label: "Generate Component", command: "/component" },
                      { icon: <Zap className="h-4 w-4" />, label: "Improve Code", command: "/improve" },
                      { icon: <Sparkles className="h-4 w-4" />, label: "Add Animation", command: "/animate" },
                    ].map((item, index) => (
                      <motion.button
                        key={item.command}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent"
                        onClick={() => {
                          setInput(item.command + " ")
                          setShowCommandPalette(false)
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex-shrink-0 text-muted-foreground">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {item.command}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Quick Actions - Mobile */}
          <div className="md:hidden flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('/component ')}
              className="text-xs flex-1"
            >
              <Code className="h-3.5 w-3.5 mr-1" />
              Component
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('/improve ')}
              className="text-xs flex-1"
            >
              <Zap className="h-3.5 w-3.5 mr-1" />
              Improve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('/animate ')}
              className="text-xs flex-1"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Animate
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 