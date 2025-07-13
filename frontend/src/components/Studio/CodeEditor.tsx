import React, { useState, useRef, useEffect } from 'react'
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
  FileCode,
  Save,
  Undo,
  Redo
} from 'lucide-react'
import { Editor } from '@monaco-editor/react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tooltip } from '../ui/tooltip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../../lib/utils'
import { fileSystemService, FileItem } from '../../services/fileSystemService'

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

// Editor themes
const EDITOR_THEMES = [
  { value: 'vs-dark', label: 'VS Dark' },
  { value: 'vs', label: 'VS Light' },
  { value: 'hc-black', label: 'High Contrast Dark' },
  { value: 'hc-light', label: 'High Contrast Light' },
]

// Language mappings
const getFileLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'sql': 'sql',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
  }
  return languageMap[ext || ''] || 'plaintext'
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  if (['tsx', 'jsx'].includes(ext || '')) {
    return <Code className="w-4 h-4 text-blue-500" />
  }
  if (['ts', 'js'].includes(ext || '')) {
    return <FileCode className="w-4 h-4 text-yellow-500" />
  }
  if (['html', 'css', 'scss'].includes(ext || '')) {
    return <FileText className="w-4 h-4 text-orange-500" />
  }
  
  return <FileText className="w-4 h-4 text-gray-500" />
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFile,
  onFileChange,
  onActiveFileChange,
  className
}) => {
  const [fileSystemState, setFileSystemState] = useState(fileSystemService.getState())
  const [theme, setTheme] = useState('vs-dark')
  const [fontSize, setFontSize] = useState([14])
  const [wordWrap, setWordWrap] = useState(true)
  const [minimap, setMinimap] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [executeOutput, setExecuteOutput] = useState<string>('')
  const [showOutput, setShowOutput] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const editorRef = useRef<any>(null)

  // Subscribe to file system changes
  useEffect(() => {
    const unsubscribe = fileSystemService.subscribe(() => {
      setFileSystemState(fileSystemService.getState())
    })
    return unsubscribe
  }, [])

  // Get current file content from file system
  const getCurrentContent = () => {
    if (fileSystemState.activeFile) {
      return fileSystemService.getFileContent(fileSystemState.activeFile) || ''
    }
    return files[activeFile] || ''
  }

  // Get current file name
  const getCurrentFileName = () => {
    if (fileSystemState.activeFile) {
      const allFiles = fileSystemService.getAllFiles()
      const activeFileObj = allFiles.find(f => f.id === fileSystemState.activeFile)
      return activeFileObj?.name || activeFile
    }
    return activeFile
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    
    // Configure editor
    editor.updateOptions({
      fontSize: fontSize[0],
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: minimap },
      lineNumbers: lineNumbers ? 'on' : 'off',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      }
    })

    // Add keyboard shortcuts
    editor.addCommand(editor.KeyMod.CtrlCmd | editor.KeyCode.KeyS, () => {
      handleSave()
    })

    editor.addCommand(editor.KeyMod.CtrlCmd | editor.KeyCode.KeyR, () => {
      runCode()
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      const fileName = getCurrentFileName()
      onFileChange(fileName, value)
      
      // Update file system if we have an active file
      if (fileSystemState.activeFile) {
        fileSystemService.updateFileContent(fileSystemState.activeFile, value)
      }
      
      setHasUnsavedChanges(true)
    }
  }

  const handleSave = () => {
    setHasUnsavedChanges(false)
    // File is automatically saved to the file system via handleEditorChange
  }

  const createNewFile = () => {
    const fileName = prompt('Enter file name (with extension):')
    if (fileName) {
      try {
        const newFile = fileSystemService.createFile(fileName, '/src', '')
        onActiveFileChange(fileName)
        fileSystemService.setActiveFile(newFile.id)
      } catch (error) {
        alert('Error creating file: ' + error)
      }
    }
  }

  const closeFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (hasUnsavedChanges) {
      const shouldSave = confirm(`Save changes to ${fileName}?`)
      if (shouldSave) {
        handleSave()
      }
    }

    // Find and close file in file system
    const allFiles = fileSystemService.getAllFiles()
    const fileToClose = allFiles.find(f => f.name === fileName)
    if (fileToClose) {
      fileSystemService.closeFile(fileToClose.id)
    }

    // Switch to another open file or create a new one
    const remainingFiles = Object.keys(files).filter(f => f !== fileName)
    if (remainingFiles.length > 0) {
      onActiveFileChange(remainingFiles[0])
    }
  }

  const runCode = async () => {
    const content = getCurrentContent()
    const fileName = getCurrentFileName()
    const language = getFileLanguage(fileName)
    
    setShowOutput(true)
    setExecuteOutput('Running code...\n')

    try {
      if (language === 'javascript' || language === 'typescript') {
        // Simple JavaScript execution (be careful with eval in production)
        const result = eval(content)
        setExecuteOutput(`✅ Execution completed\nResult: ${result}\n`)
      } else {
        setExecuteOutput(`ℹ️ Code execution not supported for ${language} files yet.\nPreview available in the Preview panel.`)
      }
    } catch (error) {
      setExecuteOutput(`❌ Error executing code:\n${error}\n`)
    }
  }

  const copyCode = async () => {
    const content = getCurrentContent()
    try {
      await navigator.clipboard.writeText(content)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const downloadCode = () => {
    const content = getCurrentContent()
    const fileName = getCurrentFileName()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run()
    }
  }

  const openFiles = fileSystemState.openFiles
  const allFiles = fileSystemService.getAllFiles()
  const openFileObjects = openFiles.map(id => allFiles.find(f => f.id === id)).filter(Boolean) as FileItem[]

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      {/* Tabs */}
      <div className="flex items-center justify-between border-b bg-background/50 backdrop-blur-sm">
        <ScrollArea className="flex-1">
          <div className="flex items-center">
            {openFileObjects.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 border-r cursor-pointer hover:bg-accent transition-colors",
                  fileSystemState.activeFile === file.id && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  fileSystemService.setActiveFile(file.id)
                  onActiveFileChange(file.name)
                }}
              >
                {getFileIcon(file.name)}
                <span className="text-sm">{file.name}</span>
                {hasUnsavedChanges && fileSystemState.activeFile === file.id && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-4 h-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => closeFile(file.name, e)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 ml-2"
              onClick={createNewFile}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </ScrollArea>

        {/* Editor Actions */}
        <div className="flex items-center gap-1 p-2">
          <Tooltip content="Save (Ctrl+S)">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              <Save className="w-4 h-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Format Code">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={formatCode}
            >
              <Code className="w-4 h-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Run Code (Ctrl+R)">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={runCode}
            >
              <Play className="w-4 h-4" />
            </Button>
          </Tooltip>

          <Tooltip content={copySuccess ? "Copied!" : "Copy Code"}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={copyCode}
            >
              {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </Tooltip>

          <Tooltip content="Download">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={downloadCode}
            >
              <Download className="w-4 h-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Settings">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Fullscreen">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="w-4 h-4" />
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
            className="border-b bg-accent/50 p-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EDITOR_THEMES.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size: {fontSize[0]}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={10}
                  max={24}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={wordWrap}
                    onCheckedChange={setWordWrap}
                  />
                  <Label>Word Wrap</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={minimap}
                    onCheckedChange={setMinimap}
                  />
                  <Label>Minimap</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={lineNumbers}
                    onCheckedChange={setLineNumbers}
                  />
                  <Label>Line Numbers</Label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="flex-1 relative">
        {getCurrentFileName() ? (
          <Editor
            height="100%"
            language={getFileLanguage(getCurrentFileName())}
            theme={theme}
            value={getCurrentContent()}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: fontSize[0],
              wordWrap: wordWrap ? 'on' : 'off',
              minimap: { enabled: minimap },
              lineNumbers: lineNumbers ? 'on' : 'off',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderWhitespace: 'selection',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true,
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm mb-4">Open a file from the explorer or create a new one</p>
              <Button onClick={createNewFile}>
                <Plus className="w-4 h-4 mr-2" />
                Create New File
              </Button>
            </div>
          </div>
        )}

        {/* Status Bar */}
        {getCurrentFileName() && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-accent/80 backdrop-blur-sm border-t flex items-center justify-between px-4 text-xs">
            <div className="flex items-center gap-4">
              <span>{getFileLanguage(getCurrentFileName())}</span>
              <span>Line 1, Column 1</span>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="h-4 text-xs">
                  Unsaved
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>UTF-8</span>
              <span>LF</span>
            </div>
          </div>
        )}
      </div>

      {/* Output Panel */}
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            className="border-t bg-background"
          >
            <Tabs defaultValue="output" className="h-full">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <TabsList>
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="terminal">Terminal</TabsTrigger>
                </TabsList>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowOutput(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <TabsContent value="output" className="h-full p-0">
                <ScrollArea className="h-full">
                  <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                    {executeOutput}
                  </pre>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="terminal" className="h-full p-0">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Terminal className="w-8 h-8 mx-auto mb-2" />
                    <p>Terminal integration coming soon</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 