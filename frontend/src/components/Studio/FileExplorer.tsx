import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Image, 
  Code, 
  Search, 
  Plus, 
  MoreHorizontal, 
  ChevronRight, 
  ChevronDown,
  Trash2,
  Edit,
  Settings,
  Star,
  Grid,
  List,
  SortAsc,
  X
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Tooltip } from '../ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../../lib/utils'
import { fileSystemService, FileItem } from '../../services/fileSystemService'

interface FileExplorerProps {
  onFileSelect?: (file: FileItem) => void
  className?: string
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') {
    return file.isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
  }

  const iconMap: Record<string, React.ReactNode> = {
    'tsx': <Code className="w-4 h-4 text-blue-500" />,
    'ts': <Code className="w-4 h-4 text-blue-500" />,
    'jsx': <Code className="w-4 h-4 text-cyan-500" />,
    'js': <Code className="w-4 h-4 text-yellow-500" />,
    'html': <FileText className="w-4 h-4 text-orange-500" />,
    'css': <FileText className="w-4 h-4 text-purple-500" />,
    'scss': <FileText className="w-4 h-4 text-pink-500" />,
    'json': <FileText className="w-4 h-4 text-green-500" />,
    'md': <FileText className="w-4 h-4 text-gray-500" />,
    'png': <Image className="w-4 h-4 text-green-600" />,
    'jpg': <Image className="w-4 h-4 text-green-600" />,
    'jpeg': <Image className="w-4 h-4 text-green-600" />,
    'gif': <Image className="w-4 h-4 text-green-600" />,
    'svg': <Image className="w-4 h-4 text-purple-600" />,
  }

  return iconMap[file.extension || ''] || <File className="w-4 h-4 text-gray-500" />
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  onFileSelect,
  className = ''
}) => {
  const [fileSystemState, setFileSystemState] = useState(fileSystemService.getState())
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree')
  const [_sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name')
  const [showHidden] = useState(false)
  const [selectedFiles] = useState<Set<string>>(new Set())
  const [, setContextMenu] = useState<{ x: number; y: number; file: FileItem } | null>(null)
  const [draggedFile, setDraggedFile] = useState<FileItem | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [createType, setCreateType] = useState<'file' | 'folder'>('file')
  const [createParent, setCreateParent] = useState<FileItem | null>(null)
  const [renameFile, setRenameFile] = useState<FileItem | null>(null)
  const [newName, setNewName] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Subscribe to file system changes
  useEffect(() => {
    const unsubscribe = fileSystemService.subscribe(() => {
      setFileSystemState(fileSystemService.getState())
    })
    return () => {
      unsubscribe()
    }
  }, [])

  // Handle file selection
  const handleFileSelect = useCallback((file: FileItem) => {
    if (file.type === 'file') {
      fileSystemService.openFile(file.id)
      onFileSelect?.(file)
    } else {
      fileSystemService.toggleFolder(file.id)
    }
  }, [onFileSelect])

  // Handle file creation
  const handleCreateFile = useCallback((name: string, type: 'file' | 'folder', parent: FileItem) => {
    try {
      if (type === 'file') {
        const newFile = fileSystemService.createFile(name, parent.path)
        handleFileSelect(newFile)
      } else {
        fileSystemService.createFolder(name, parent.path)
      }
      setShowCreateDialog(false)
      setNewName('')
    } catch (error) {
      console.error('Failed to create file:', error)
    }
  }, [handleFileSelect])

  // Handle file deletion
  const handleDeleteFile = useCallback((file: FileItem) => {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      fileSystemService.deleteFile(file.id)
    }
  }, [])

  // Handle file rename
  const handleRenameFile = useCallback((file: FileItem, name: string) => {
    fileSystemService.renameFile(file.id, name)
    setShowRenameDialog(false)
    setRenameFile(null)
    setNewName('')
  }, [])

  // Handle star toggle
  const handleToggleStar = useCallback((file: FileItem) => {
    fileSystemService.toggleStar(file.id)
  }, [])

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    let files = fileSystemState.files

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = fileSystemService.searchFiles(searchQuery)
      files = searchResults
    }

    // Apply hidden files filter
    if (!showHidden) {
      const filterHidden = (items: FileItem[]): FileItem[] => {
        return items.filter(item => !item.name.startsWith('.'))
          .map(item => ({
            ...item,
            children: item.children ? filterHidden(item.children) : undefined
          }))
      }
      files = filterHidden(files)
    }

    return files
  }, [fileSystemState.files, searchQuery, showHidden])

  // Context menu handlers
  const handleContextMenu = useCallback((e: React.MouseEvent, file: FileItem) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, file })
  }, [])

  // Drag and drop handlers
  const handleDragStart = useCallback((file: FileItem) => {
    setDraggedFile(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, file: FileItem) => {
    if (file.type === 'folder' && draggedFile && draggedFile.id !== file.id) {
      e.preventDefault()
      setDropTarget(file.id)
    }
  }, [draggedFile])

  const handleDrop = useCallback((e: React.DragEvent, targetFile: FileItem) => {
    e.preventDefault()
    if (draggedFile && targetFile.type === 'folder' && draggedFile.id !== targetFile.id) {
      // TODO: Implement move file functionality
      console.log('Move', draggedFile.name, 'to', targetFile.name)
    }
    setDraggedFile(null)
    setDropTarget(null)
  }, [draggedFile])

  // File upload handler
  const handleFileUpload = useCallback((files: FileList, parent: FileItem) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        fileSystemService.createFile(file.name, parent.path, content)
      }
      reader.readAsText(file)
    })
  }, [])

  // Render file tree item
  const renderFileItem = useCallback((file: FileItem, depth: number = 0) => {
    const isSelected = selectedFiles.has(file.id)
    const isDropTarget = dropTarget === file.id
    const isActive = fileSystemState.activeFile === file.id

    return (
      <motion.div
        key={file.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className={cn(
          "group relative",
          isSelected && "bg-accent",
          isDropTarget && "bg-accent/50 border-2 border-primary border-dashed",
          isActive && "bg-primary/10"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 hover:bg-accent/50 cursor-pointer transition-colors",
            "select-none"
          )}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => handleFileSelect(file)}
          onContextMenu={(e) => handleContextMenu(e, file)}
          draggable
          onDragStart={() => handleDragStart(file)}
          onDragOver={(e) => handleDragOver(e, file)}
          onDrop={(e) => handleDrop(e, file)}
        >
          {/* Expand/Collapse Icon */}
          {file.type === 'folder' && (
            <Button
              variant="ghost"
              size="sm"
              className="w-4 h-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                fileSystemService.toggleFolder(file.id)
              }}
            >
              {file.isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          )}

          {/* File Icon */}
          <div className="flex-shrink-0">
            {getFileIcon(file)}
          </div>

          {/* File Name */}
          <span className={cn(
            "flex-1 truncate text-sm",
            isActive && "font-medium"
          )}>
            {file.name}
          </span>

          {/* Star Icon */}
          {file.isStarred && (
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
          )}

          {/* File Size (for files only) */}
          {file.type === 'file' && file.size && (
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {formatFileSize(file.size)}
            </span>
          )}

          {/* Actions Menu */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleToggleStar(file)}>
                  <Star className="w-4 h-4 mr-2" />
                  {file.isStarred ? 'Remove Star' : 'Add Star'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setRenameFile(file)
                    setNewName(file.name)
                    setShowRenameDialog(true)
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteFile(file)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                {file.type === 'folder' && (
                  <>
                    <Separator />
                    <DropdownMenuItem 
                      onClick={() => {
                        setCreateType('file')
                        setCreateParent(file)
                        setShowCreateDialog(true)
                      }}
                    >
                      <File className="w-4 h-4 mr-2" />
                      New File
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setCreateType('folder')
                        setCreateParent(file)
                        setShowCreateDialog(true)
                      }}
                    >
                      <Folder className="w-4 h-4 mr-2" />
                      New Folder
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Render children */}
        {file.type === 'folder' && file.isExpanded && file.children && (
          <AnimatePresence>
            {file.children.map(child => renderFileItem(child, depth + 1))}
          </AnimatePresence>
        )}
      </motion.div>
    )
  }, [
    selectedFiles, dropTarget, fileSystemState.activeFile, handleFileSelect,
    handleContextMenu, handleDragStart, handleDragOver, handleDrop,
    handleToggleStar, handleDeleteFile
  ])

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Explorer</h3>
          <div className="flex items-center gap-1">
            <Tooltip content="New File">
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0"
                onClick={() => {
                  setCreateType('file')
                  setCreateParent(filteredFiles[0] || null)
                  setShowCreateDialog(true)
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Settings">
              <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                <Settings className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* View Options */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              className="w-7 h-7 p-0"
              onClick={() => setViewMode('tree')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="w-7 h-7 p-0"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                <SortAsc className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Sort by Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('modified')}>
                Sort by Modified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('size')}>
                Sort by Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence>
            {filteredFiles.map(file => renderFileItem(file))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Create File/Folder Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create New {createType === 'file' ? 'File' : 'Folder'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={`Enter ${createType} name`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newName.trim() && createParent) {
                  handleCreateFile(newName.trim(), createType, createParent)
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newName.trim() && createParent) {
                  handleCreateFile(newName.trim(), createType, createParent)
                }
              }}
              disabled={!newName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {renameFile?.type}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newName.trim() && renameFile) {
                  handleRenameFile(renameFile, newName.trim())
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newName.trim() && renameFile) {
                  handleRenameFile(renameFile, newName.trim())
                }
              }}
              disabled={!newName.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && createParent) {
            handleFileUpload(e.target.files, createParent)
          }
        }}
      />
    </Card>
  )
} 