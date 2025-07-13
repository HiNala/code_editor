import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Code, 
  Wand2, 
  FileText, 
  Trash2, 
  Copy, 
  Download,
  User,
  Bot,
  Loader2,
  Sparkles,
  Terminal,
  Zap
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { Tooltip } from '../ui/tooltip'
import { cn } from '../../lib/utils'
import { fileSystemService } from '../../services/fileSystemService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'code' | 'file_created' | 'file_updated' | 'error'
  metadata?: {
    fileName?: string
    language?: string
    fileId?: string
  }
}

interface ChatPanelProps {
  onGenerate?: (prompt: string) => void
  onImprove?: (prompt: string) => void
  isGenerating?: boolean
  className?: string
}

const QUICK_ACTIONS = [
  { id: 'component', label: 'Create Component', icon: Code, prompt: 'Create a new React component' },
  { id: 'fix', label: 'Fix Code', icon: Wand2, prompt: 'Fix any issues in the current file' },
  { id: 'explain', label: 'Explain Code', icon: FileText, prompt: 'Explain what this code does' },
  { id: 'optimize', label: 'Optimize', icon: Zap, prompt: 'Optimize this code for better performance' },
]

const COMMAND_SUGGESTIONS = [
  '/component - Create a new React component',
  '/fix - Fix issues in current file', 
  '/explain - Explain selected code',
  '/optimize - Optimize code performance',
  '/test - Generate unit tests',
  '/docs - Generate documentation'
]

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onGenerate,
  onImprove,
  isGenerating = false,
  className
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you create components, fix bugs, explain code, and much more. What would you like to build today?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'generate' | 'improve'>('generate')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle AI response simulation
  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true)
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    let response = ''
    let messageType: Message['type'] = 'text'
    let metadata: Message['metadata'] = {}

    // Parse commands and generate appropriate responses
    if (userMessage.toLowerCase().includes('/component') || userMessage.toLowerCase().includes('create component')) {
      const componentName = extractComponentName(userMessage) || 'NewComponent'
      response = `I'll create a new React component called "${componentName}" for you.`
      messageType = 'code'
      
      // Actually create the component file
      const componentCode = generateComponentCode(componentName, userMessage)
      const newFile = fileSystemService.createFile(
        `${componentName}.tsx`,
        '/src/components',
        componentCode
      )
      
      metadata = {
        fileName: `${componentName}.tsx`,
        language: 'typescript',
        fileId: newFile.id
      }
      
      response += `\n\n\`\`\`typescript\n${componentCode}\n\`\`\``
      
      // Add file creation notification
      addMessage({
        id: Date.now().toString() + '_file',
        role: 'assistant',
        content: `✅ Created new file: ${componentName}.tsx`,
        timestamp: new Date(),
        type: 'file_created',
        metadata
      })
      
    } else if (userMessage.toLowerCase().includes('/fix') || userMessage.toLowerCase().includes('fix')) {
      response = analyzeAndFixCode(userMessage)
      messageType = 'code'
      
    } else if (userMessage.toLowerCase().includes('/explain') || userMessage.toLowerCase().includes('explain')) {
      response = explainCode(userMessage)
      
    } else if (userMessage.toLowerCase().includes('/optimize') || userMessage.toLowerCase().includes('optimize')) {
      response = optimizeCode(userMessage)
      messageType = 'code'
      
    } else if (userMessage.toLowerCase().includes('/test') || userMessage.toLowerCase().includes('test')) {
      response = generateTests(userMessage)
      messageType = 'code'
      
    } else {
      // General AI response
      response = generateGeneralResponse(userMessage)
    }

    setIsTyping(false)
    
    addMessage({
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      type: messageType,
      metadata
    })
  }

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const handleSend = async () => {
    if (!input.trim() || isGenerating || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text'
    }

    addMessage(userMessage)
    
    const messageContent = input.trim()
    setInput('')
    setShowSuggestions(false)

    // Call external handlers if provided
    if (mode === 'generate') {
      onGenerate?.(messageContent)
    } else {
      onImprove?.(messageContent)
    }

    // Simulate AI response
    await simulateAIResponse(messageContent)
  }

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    setInput(action.prompt)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    
    if (e.key === '/' && input === '') {
      setShowSuggestions(true)
    }
    
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const downloadCode = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'
    const isCode = message.type === 'code'
    const isFileAction = message.type === 'file_created' || message.type === 'file_updated'

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex gap-3 p-4",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-accent text-accent-foreground"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={cn(
          "flex-1 max-w-[80%]",
          isUser ? "text-right" : "text-left"
        )}>
          <div className={cn(
            "rounded-lg p-3 text-sm",
            isUser 
              ? "bg-primary text-primary-foreground ml-auto" 
              : "bg-accent text-accent-foreground",
            isCode && "font-mono text-xs",
            isFileAction && "border border-green-500/20 bg-green-500/10"
          )}>
            {isFileAction && (
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-500" />
                <Badge variant="outline" className="text-green-500">
                  {message.type === 'file_created' ? 'File Created' : 'File Updated'}
                </Badge>
              </div>
            )}
            
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>

            {/* Message Actions */}
            {!isUser && (
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip content="Copy">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyMessage(message.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </Tooltip>
                
                {isCode && message.metadata?.fileName && (
                  <Tooltip content="Download">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => downloadCode(message.content, message.metadata!.fileName!)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          
          <Tabs value={mode} onValueChange={(value) => setMode(value as 'generate' | 'improve')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="text-xs">Generate</TabsTrigger>
              <TabsTrigger value="improve" className="text-xs">Improve</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-1 mt-2">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleQuickAction(action)}
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 relative">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {messages.map(renderMessage)}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-4"
              >
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-accent text-accent-foreground rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Command Suggestions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-4 right-4 bg-background border rounded-lg shadow-lg p-2 z-10"
            >
              <div className="text-xs text-muted-foreground mb-2">Commands:</div>
              {COMMAND_SUGGESTIONS.map((suggestion, index) => (
                <div
                  key={index}
                  className="text-xs p-2 hover:bg-accent rounded cursor-pointer"
                  onClick={() => {
                    setInput(suggestion.split(' - ')[0])
                    setShowSuggestions(false)
                    inputRef.current?.focus()
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${mode === 'generate' ? 'Describe what you want to build...' : 'How can I improve this code?'}`}
              className="w-full min-h-[40px] max-h-32 px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isGenerating || isTyping}
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating || isTyping}
            className="h-10 w-10 p-0"
          >
            {isGenerating || isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Type / for commands</span>
        </div>
      </div>
    </Card>
  )
}

// Helper functions for AI responses
function extractComponentName(message: string): string | null {
  const match = message.match(/component\s+(?:called\s+)?["']?(\w+)["']?/i)
  return match ? match[1] : null
}

function generateComponentCode(name: string, prompt: string): string {
  const hasProps = prompt.toLowerCase().includes('props') || prompt.toLowerCase().includes('properties')
  const hasState = prompt.toLowerCase().includes('state') || prompt.toLowerCase().includes('useState')
  
  const propsInterface = hasProps ? `interface ${name}Props {
  // Add your props here
  title?: string
  className?: string
}

` : ''

  const componentHeader = hasProps ? `export const ${name}: React.FC<${name}Props> = ({ title, className })` : `export const ${name}: React.FC = ()`
  
  const titleElement = hasProps ? '{title || `${name} Component`}' : `'${name} Component'`
  
  const stateSection = hasState ? `  const [count, setCount] = useState(0)

` : ''

  const contentSection = hasState ? `      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>` : `      <p>This is the ${name} component.</p>`

  return `import React${hasState ? ', { useState }' : ''} from 'react'

${propsInterface}${componentHeader} => {
${stateSection}  return (
    <div${hasProps ? ' className={className}' : ''}>
      <h2>${titleElement}</h2>
${contentSection}
    </div>
  )
}

export default ${name}`
}

function analyzeAndFixCode(message: string): string {
  const currentFile = fileSystemService.getState().activeFile
  if (!currentFile) {
    return "Please select a file first, then I can help fix any issues in it."
  }
  
  return `I've analyzed your code and here are some improvements:

\`\`\`typescript
// Fixed version with improvements:
// - Added proper TypeScript types
// - Fixed potential null reference errors  
// - Improved error handling
// - Added proper key props for lists
// - Optimized re-renders with useCallback

// Your improved code will be applied to the active file
\`\`\``
}

function explainCode(message: string): string {
  return `Let me explain this code for you:

**What it does:**
This code creates a React component that manages state and renders UI elements.

**Key concepts:**
- **useState**: Manages component state
- **useEffect**: Handles side effects and lifecycle
- **Props**: Data passed down from parent components
- **JSX**: JavaScript XML for describing UI

**Best practices used:**
- Proper TypeScript typing
- Clean component structure
- Efficient state management
- Accessible HTML elements`
}

function optimizeCode(message: string): string {
  return `Here's how to optimize your code:

\`\`\`typescript
// Optimized version:
import React, { memo, useCallback, useMemo } from 'react'

// Use memo to prevent unnecessary re-renders
export const OptimizedComponent = memo(({ items, onItemClick }) => {
  // Use useCallback for event handlers
  const handleClick = useCallback((id) => {
    onItemClick(id)
  }, [onItemClick])
  
  // Use useMemo for expensive calculations
  const processedItems = useMemo(() => {
    return items.filter(item => item.active)
  }, [items])
  
  return (
    <div>
      {processedItems.map(item => (
        <button key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </button>
      ))}
    </div>
  )
})
\`\`\`

**Optimizations applied:**
- Added React.memo for component memoization
- Used useCallback for stable function references
- Used useMemo for expensive computations
- Proper key props for list items`
}

function generateTests(message: string): string {
  return `Here are unit tests for your component:

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { YourComponent } from './YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const mockClick = jest.fn()
    render(<YourComponent onClick={mockClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockClick).toHaveBeenCalledTimes(1)
  })
  
  it('updates state correctly', () => {
    render(<YourComponent />)
    const button = screen.getByText('Increment')
    
    fireEvent.click(button)
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
})
\`\`\``
}

function generateGeneralResponse(message: string): string {
  const responses = [
    "I'd be happy to help you with that! Could you provide more details about what you're trying to build?",
    "That's a great idea! Let me help you implement that. What specific functionality do you need?",
    "I can definitely help with that. Would you like me to create a new component or modify an existing one?",
    "Excellent! Let's build that together. What's the first step you'd like to tackle?",
    "I understand what you're looking for. Let me create a solution for you."
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
} 