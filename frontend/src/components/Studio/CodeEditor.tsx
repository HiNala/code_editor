import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, 
  FileText, 
  X, 
  Plus, 
  Download,
  Settings,
  Maximize2,
  Play,
  Copy,
  Check,
  Terminal,
  FileCode
} from 'lucide-react'
import { Editor } from '@monaco-editor/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Tooltip } from '../ui/tooltip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../../lib/utils'

export interface FileMap {
  [filename: string]: string
}



export interface CodeEditorProps {
  files: FileMap
  activeFile: string
  onFileChange: (filename: string, content: string) => void
  onActiveFileChange: (filename: string) => void
  className?: string
}

// Default files with better content
const defaultContent = {
  'app.tsx': `import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface AppProps {
  title?: string
}

export default function App({ title = "Hello World" }: AppProps) {
  const [count, setCount] = useState(0)
  
  return (
    <motion.div 
      className="p-8 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          You clicked {count} times
        </p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Click me!
        </button>
      </div>
    </motion.div>
  )
}`,
  'styles.css': `/* Modern CSS with custom properties */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-radius: 0.5rem;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.card {
  background: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: color-mix(in srgb, var(--primary-color), black 10%);
  transform: translateY(-1px);
}`,
  'utils.ts': `// Utility functions for common operations
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}`
}

const getFileLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
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
    case 'py':
      return 'python'
    default:
      return 'plaintext'
  }
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'ts':
    case 'tsx':
      return <div className="text-blue-500"><Code className="h-4 w-4" /></div>
    case 'js':
    case 'jsx':
      return <div className="text-yellow-500"><Code className="h-4 w-4" /></div>
    case 'css':
      return <div className="text-pink-500"><FileText className="h-4 w-4" /></div>
    case 'html':
      return <div className="text-orange-500"><FileText className="h-4 w-4" /></div>
    case 'json':
      return <div className="text-green-500"><FileText className="h-4 w-4" /></div>
    case 'md':
      return <div className="text-purple-500"><FileText className="h-4 w-4" /></div>
    case 'py':
      return <div className="text-blue-600"><Code className="h-4 w-4" /></div>
    default:
      return <FileCode className="h-4 w-4 text-muted-foreground" />
  }
}

const EditorThemes = [
  { name: "VS Dark", value: "vs-dark" },
  { name: "VS Light", value: "vs-light" },
  { name: "High Contrast Dark", value: "hc-black" },
  { name: "High Contrast Light", value: "hc-light" }
]

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFile,
  onFileChange,
  onActiveFileChange,
  className
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFileList, setShowFileList] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState(false)
  const [minimap, setMinimap] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const editorRef = useRef<any>(null)

  // Ensure we have some default files
  const fileList = Object.keys(files).length > 0 ? Object.keys(files) : Object.keys(defaultContent)
  const activeFileContent = files[activeFile] || defaultContent[activeFile as keyof typeof defaultContent] || ''
  
  // Filter files based on search
  const filteredFiles = fileList.filter(filename => 
    filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    
    // Configure editor
    editor.updateOptions({
      fontSize,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: minimap },
      lineNumbers: lineNumbers ? 'on' : 'off',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      bracketPairColorization: { enabled: true },
      suggest: {
        showKeywords: true,
        showSnippets: true,
      },
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onFileChange(activeFile, value)
    }
  }

  const createNewFile = () => {
    const newFileName = prompt('Enter file name (with extension):')
    if (!newFileName) return
    
    const extension = newFileName.split('.').pop()?.toLowerCase()
    let defaultContent = ''
    
    switch (extension) {
      case 'tsx':
      case 'ts':
        defaultContent = `// TypeScript file\nexport default function Component() {\n  return <div>Hello World</div>\n}`
        break
      case 'jsx':
      case 'js':
        defaultContent = `// JavaScript file\nexport default function Component() {\n  return <div>Hello World</div>\n}`
        break
      case 'css':
        defaultContent = `/* CSS file */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`
        break
      case 'html':
        defaultContent = `<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>`
        break
      case 'json':
        defaultContent = `{\n  "name": "new-file",\n  "version": "1.0.0"\n}`
        break
      default:
        defaultContent = `// New ${newFileName}\n`
    }
    
    onFileChange(newFileName, defaultContent)
    onActiveFileChange(newFileName)
  }

  const deleteFile = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (fileList.length <= 1) return
    
    if (confirm(`Delete ${filename}?`)) {
      // Switch to another file if deleting active file
      if (filename === activeFile) {
        const remainingFiles = fileList.filter(f => f !== filename)
        if (remainingFiles.length > 0) {
          onActiveFileChange(remainingFiles[0])
        }
      }
      
      // Remove from files object
      const newFiles = { ...files }
      delete newFiles[filename]
      // Note: This would need to be handled by parent component
    }
  }

  const runCode = async () => {
    if (!activeFile) return
    
    setIsRunning(true)
    setOutput("Running...")
    
    try {
      // Simulate execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const language = getFileLanguage(activeFile)
      if (language === 'javascript' || language === 'typescript') {
        // Simple evaluation for demo
        const logs: string[] = []
        const originalLog = console.log
        console.log = (...args) => {
          logs.push(args.join(' '))
        }
        
        try {
          // Basic evaluation (in real app, use a proper sandbox)
          eval(activeFileContent)
          console.log = originalLog
          setOutput(logs.join('\n') || 'Code executed successfully!')
        } catch (error) {
          console.log = originalLog
          setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      } else {
        setOutput(`Cannot execute ${language} code in browser`)
      }
    } finally {
      setIsRunning(false)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeFileContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([activeFileContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeFile
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn(
      "h-full flex flex-col bg-background border border-border rounded-lg overflow-hidden",
      isFullscreen && "fixed inset-0 z-50 rounded-none",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Code Editor</h2>
          <Badge variant="outline" className="text-xs">
            {fileList.length} files
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip content="Toggle file list">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileList(!showFileList)}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content="New file">
            <Button
              variant="ghost"
              size="sm"
              onClick={createNewFile}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Settings">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-muted/20 overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Theme</Label>
                  <Select value={editorTheme} onValueChange={setEditorTheme}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EditorThemes.map(theme => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => {
                      setFontSize(value[0])
                      editorRef.current?.updateOptions({ fontSize: value[0] })
                    }}
                    min={10}
                    max={24}
                    step={1}
                    className="w-[140px]"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Word Wrap</Label>
                  <Switch
                    checked={wordWrap}
                    onCheckedChange={(checked) => {
                      setWordWrap(checked)
                      editorRef.current?.updateOptions({ wordWrap: checked ? 'on' : 'off' })
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Minimap</Label>
                  <Switch
                    checked={minimap}
                    onCheckedChange={(checked) => {
                      setMinimap(checked)
                      editorRef.current?.updateOptions({ minimap: { enabled: checked } })
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Line Numbers</Label>
                  <Switch
                    checked={lineNumbers}
                    onCheckedChange={(checked) => {
                      setLineNumbers(checked)
                      editorRef.current?.updateOptions({ lineNumbers: checked ? 'on' : 'off' })
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {/* File List Sidebar */}
        <AnimatePresence>
          {showFileList && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-r border-border bg-muted/20 overflow-hidden"
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Files</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={createNewFile}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-3 h-8"
                />
                
                <ScrollArea className="h-[300px]">
                  <div className="space-y-1">
                    {filteredFiles.map((filename) => (
                      <motion.div
                        key={filename}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors group",
                          filename === activeFile 
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                        onClick={() => onActiveFileChange(filename)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getFileIcon(filename)}
                          <span className="text-sm truncate">{filename}</span>
                        </div>
                        
                        {fileList.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => deleteFile(filename, e)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Active File Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-background">
            <div className="flex items-center gap-2">
              {getFileIcon(activeFile)}
              <span className="font-medium text-sm">{activeFile}</span>
              <Badge variant="secondary" className="text-xs">
                {getFileLanguage(activeFile)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Tooltip content="Copy code">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCode}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </Tooltip>
              
              <Tooltip content="Download">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadCode}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </Tooltip>
              
              {(getFileLanguage(activeFile) === 'javascript' || getFileLanguage(activeFile) === 'typescript') && (
                <Tooltip content="Run code">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={runCode}
                    disabled={isRunning}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Editor and Output */}
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger value="editor" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Editor
              </TabsTrigger>
              <TabsTrigger value="output" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Output
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 m-0 p-0">
              {fileList.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-4">
                    <FileText className="h-12 w-12 mx-auto opacity-50" />
                    <div>
                      <div className="text-lg font-medium mb-2">No files yet</div>
                      <div className="text-sm mb-4">Create a new file to get started</div>
                      <Button onClick={createNewFile}>
                        <Plus className="h-4 w-4 mr-2" />
                        New File
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Editor
                  height="100%"
                  language={getFileLanguage(activeFile)}
                  value={activeFileContent}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme={editorTheme}
                  options={{
                    fontSize,
                    wordWrap: wordWrap ? 'on' : 'off',
                    minimap: { enabled: minimap },
                    lineNumbers: lineNumbers ? 'on' : 'off',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    bracketPairColorization: { enabled: true },
                    suggest: {
                      showKeywords: true,
                      showSnippets: true,
                    },
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="output" className="flex-1 m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 font-mono text-sm whitespace-pre-wrap">
                  {output || "Run your code to see output here..."}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 