import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, 
  FileText, 
  X, 
  Plus, 
  Save, 
  Download,
  Upload,
  Settings,
  Maximize2
} from 'lucide-react'
import { Editor } from '@monaco-editor/react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export interface FileMap {
  [filename: string]: string
}

export interface CodeEditorProps {
  files: FileMap
  activeFile: string
  onFileChange: (filename: string, content: string) => void
  onActiveFileChange: (filename: string) => void
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFile,
  onFileChange,
  onActiveFileChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFileList, setShowFileList] = useState(true)
  const editorRef = useRef<any>(null)

  const fileList = Object.keys(files)
  const activeFileContent = files[activeFile] || ''

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onFileChange(activeFile, value)
    }
  }

  const getFileLanguage = (filename: string) => {
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
      default:
        return 'plaintext'
    }
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <Code className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const createNewFile = () => {
    const newFileName = `untitled-${Date.now()}.tsx`
    onFileChange(newFileName, '// New file\nexport default function Component() {\n  return <div>Hello World</div>\n}')
    onActiveFileChange(newFileName)
  }

  const deleteFile = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (fileList.length <= 1) return // Don't delete the last file
    
    // If deleting active file, switch to another file
    if (filename === activeFile) {
      const remainingFiles = fileList.filter(f => f !== filename)
      if (remainingFiles.length > 0) {
        onActiveFileChange(remainingFiles[0])
      }
    }
    
    // Remove file from files object
    const newFiles = { ...files }
    delete newFiles[filename]
    // Note: Parent component should handle this through onFileChange
  }

  return (
    <div className={cn(
      "h-full flex flex-col bg-background",
      isFullscreen && "fixed inset-0 z-max"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <h2 className="font-semibold">Code Editor</h2>
            <span className="text-xs text-muted-foreground">
              ({fileList.length} files)
            </span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileList(!showFileList)}
              className="desktop-only"
            >
              <FileText className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={createNewFile}
              className="touch-target"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">New</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="touch-target"
            >
              {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File List - Collapsible on mobile */}
        <AnimatePresence>
          {showFileList && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "border-r border-border bg-muted/30 overflow-hidden",
                "w-64 desktop-only", // Desktop: Fixed width sidebar
                "mobile-only w-full" // Mobile: Full width overlay
              )}
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
                
                <div className="space-y-1">
                  {fileList.map((filename) => (
                    <motion.div
                      key={filename}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors",
                        filename === activeFile 
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-accent hover:text-accent-foreground"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs - Mobile */}
          <div className="mobile-only border-b border-border bg-background">
            <div className="flex overflow-x-auto p-2 gap-1 custom-scrollbar">
              {fileList.map((filename) => (
                <Button
                  key={filename}
                  variant={filename === activeFile ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onActiveFileChange(filename)}
                  className="flex-shrink-0 text-xs"
                >
                  {getFileIcon(filename)}
                  <span className="ml-1 max-w-[100px] truncate">
                    {filename.split('/').pop()}
                  </span>
                  {fileList.length > 1 && (
                    <X 
                      className="h-3 w-3 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded" 
                      onClick={(e) => deleteFile(filename, e)}
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Active File Header - Desktop */}
          <div className="desktop-only border-b border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(activeFile)}
                <span className="font-medium text-sm">{activeFile}</span>
                <span className="text-xs text-muted-foreground">
                  {getFileLanguage(activeFile)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
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
                theme="vs-dark"
                options={{
                  minimap: { enabled: window.innerWidth > 1024 }, // Only on desktop
                  fontSize: window.innerWidth < 768 ? 12 : 14, // Smaller font on mobile
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  bracketPairColorization: { enabled: true },
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                  },
                  // Mobile optimizations
                  folding: window.innerWidth > 768,
                  glyphMargin: window.innerWidth > 768,
                  lineDecorationsWidth: window.innerWidth > 768 ? 10 : 5,
                  lineNumbersMinChars: window.innerWidth > 768 ? 3 : 2,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="mobile-only border-t border-border bg-background/95 backdrop-blur p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4" />
              <span className="ml-1">Save</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Upload className="h-4 w-4" />
              <span className="ml-1">Upload</span>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {activeFileContent.length} chars
          </div>
        </div>
      </div>
    </div>
  )
} 