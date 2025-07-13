import React, { useState, useRef, useCallback, useMemo } from 'react'
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
  Upload,
  Download,
  Trash2,
  Edit,
  Copy,
  Move,
  Settings,
  Star,
  Clock,
  Filter,
  Grid,
  List,
  SortAsc,
  X
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Tooltip } from '../ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../../lib/utils'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: Date
  children?: FileItem[]
  isExpanded?: boolean
  isStarred?: boolean
  extension?: string
  path: string
}

interface FileExplorerProps {
  initialFiles?: FileItem[]
  onFileSelect?: (file: FileItem) => void
  onFileCreate?: (name: string, type: 'file' | 'folder', parentPath: string) => void
  onFileDelete?: (file: FileItem) => void
  onFileRename?: (file: FileItem, newName: string) => void
  className?: string
}

const defaultFiles: FileItem[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    modified: new Date('2024-01-15'),
    isExpanded: true,
    path: '/src',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        modified: new Date('2024-01-14'),
        isExpanded: true,
        path: '/src/components',
        children: [
          {
            id: '3',
            name: 'Button.tsx',
            type: 'file',
            size: 2048,
            modified: new Date('2024-01-14'),
            extension: 'tsx',
            path: '/src/components/Button.tsx',
            isStarred: true
          },
          {
            id: '4',
            name: 'Modal.tsx',
            type: 'file',
            size: 3072,
            modified: new Date('2024-01-13'),
            extension: 'tsx',
            path: '/src/components/Modal.tsx'
          }
        ]
      },
      {
        id: '5',
        name: 'utils',
        type: 'folder',
        modified: new Date('2024-01-12'),
        path: '/src/utils',
        children: [
          {
            id: '6',
            name: 'helpers.ts',
            type: 'file',
            size: 1024,
            modified: new Date('2024-01-12'),
            extension: 'ts',
            path: '/src/utils/helpers.ts'
          }
        ]
      }
    ]
  },
  {
    id: '7',
    name: 'public',
    type: 'folder',
    modified: new Date('2024-01-10'),
    path: '/public',
    children: [
      {
        id: '8',
        name: 'logo.png',
        type: 'file',
        size: 5120,
        modified: new Date('2024-01-10'),
        extension: 'png',
        path: '/public/logo.png'
      }
    ]
  },
  {
    id: '9',
    name: 'README.md',
    type: 'file',
    size: 1536,
    modified: new Date('2024-01-15'),
    extension: 'md',
    path: '/README.md',
    isStarred: true
  },
  {
    id: '10',
    name: 'package.json',
    type: 'file',
    size: 2560,
    modified: new Date('2024-01-14'),
    extension: 'json',
    path: '/package.json'
  }
]

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') {
    return file.isExpanded ? FolderOpen : Folder
  }
  
  switch (file.extension) {
    case 'tsx':
    case 'ts':
    case 'js':
    case 'jsx':
      return Code
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return Image
    case 'md':
    case 'txt':
      return FileText
    default:
      return File
  }
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  initialFiles = defaultFiles,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  className = ''
}) => {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createType, setCreateType] = useState<'file' | 'folder'>('file')
  const [createParentPath, setCreateParentPath] = useState('')
  const [newFileName, setNewFileName] = useState('')
  const [draggedItem, setDraggedItem] = useState<FileItem | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/src', '/src/components']))

  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }, [])

  const updateFileInTree = useCallback((files: FileItem[], targetId: string, updater: (file: FileItem) => FileItem): FileItem[] => {
    return files.map(file => {
      if (file.id === targetId) {
        return updater(file)
      }
      if (file.children) {
        return {
          ...file,
          children: updateFileInTree(file.children, targetId, updater)
        }
      }
      return file
    })
  }, [])

  const searchFiles = useCallback((files: FileItem[], query: string): FileItem[] => {
    if (!query) return files
    
    const filtered: FileItem[] = []
    
    for (const file of files) {
      if (file.name.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(file)
      } else if (file.children) {
        const childMatches = searchFiles(file.children, query)
        if (childMatches.length > 0) {
          filtered.push({
            ...file,
            children: childMatches,
            isExpanded: true
          })
        }
      }
    }
    
    return filtered
  }, [])

  const sortFiles = useCallback((files: FileItem[]): FileItem[] => {
    return [...files].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1
      }
      
      switch (sortBy) {
        case 'modified':
          return b.modified.getTime() - a.modified.getTime()
        case 'size':
          return (b.size || 0) - (a.size || 0)
        default:
          return a.name.localeCompare(b.name)
      }
    }).map(file => ({
      ...file,
      children: file.children ? sortFiles(file.children) : undefined
    }))
  }, [sortBy])

  const filteredAndSortedFiles = useMemo(() => {
    const searched = searchFiles(files, searchQuery)
    return sortFiles(searched)
  }, [files, searchQuery, sortFiles, searchFiles])

  const handleFileSelect = useCallback((file: FileItem) => {
    setSelectedFile(file)
    onFileSelect?.(file)
  }, [onFileSelect])

  const handleCreateFile = useCallback(() => {
    if (!newFileName.trim()) return

    const newFile: FileItem = {
      id: Date.now().toString(),
      name: newFileName,
      type: createType,
      modified: new Date(),
      path: `${createParentPath}/${newFileName}`,
      size: createType === 'file' ? 0 : undefined,
      extension: createType === 'file' ? newFileName.split('.').pop() : undefined,
      children: createType === 'folder' ? [] : undefined
    }

    if (createParentPath === '') {
      setFiles(prev => [...prev, newFile])
    } else {
      setFiles(prev => updateFileInTree(prev, createParentPath, parent => ({
        ...parent,
        children: [...(parent.children || []), newFile]
      })))
    }

    onFileCreate?.(newFileName, createType, createParentPath)
    setShowCreateDialog(false)
    setNewFileName('')
  }, [newFileName, createType, createParentPath, onFileCreate, updateFileInTree])

  const handleDragStart = useCallback((e: React.DragEvent, file: FileItem) => {
    setDraggedItem(file)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, targetFile: FileItem) => {
    e.preventDefault()
    if (targetFile.type === 'folder' && draggedItem?.id !== targetFile.id) {
      setDropTarget(targetFile.id)
    }
  }, [draggedItem])

  const handleDrop = useCallback((e: React.DragEvent, targetFile: FileItem) => {
    e.preventDefault()
    setDropTarget(null)
    
    if (draggedItem && targetFile.type === 'folder' && draggedItem.id !== targetFile.id) {
      // Move file logic would go here
      console.log(`Moving ${draggedItem.name} to ${targetFile.name}`)
    }
    
    setDraggedItem(null)
  }, [draggedItem])

  const renderFileItem = useCallback((file: FileItem, depth: number = 0) => {
    const Icon = getFileIcon(file)
    const isExpanded = expandedFolders.has(file.path)
    const isSelected = selectedFile?.id === file.id
    const isDropTarget = dropTarget === file.id

    return (
      <motion.div
        key={file.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={cn(
            "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
            isSelected && "bg-accent text-accent-foreground",
            isDropTarget && "bg-primary/10 border border-primary/20"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.path)
            } else {
              handleFileSelect(file)
            }
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, file)}
          onDragOver={(e) => handleDragOver(e, file)}
          onDrop={(e) => handleDrop(e, file)}
        >
          {file.type === 'folder' && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          )}
          
          <Icon className={cn(
            "h-4 w-4",
            file.type === 'folder' ? 'text-blue-500' : 'text-muted-foreground'
          )} />
          
          <span className="flex-1 text-sm truncate">{file.name}</span>
          
          {file.isStarred && (
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
          )}
          
          {file.size && (
            <span className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </span>
          )}
          
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {formatDate(file.modified)}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <AnimatePresence>
          {file.type === 'folder' && isExpanded && file.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {file.children.map(child => renderFileItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }, [expandedFolders, selectedFile, dropTarget, toggleFolder, handleFileSelect, handleDragStart, handleDragOver, handleDrop])

  return (
    <>
      <Card className={cn("h-full flex flex-col", className)}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">File Explorer</h2>
            <div className="flex items-center gap-2">
              <Tooltip content={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                >
                  {viewMode === 'list' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
              </Tooltip>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <SortAsc className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setCreateType('file')
                    setCreateParentPath('')
                    setShowCreateDialog(true)
                  }}>
                    <File className="h-4 w-4 mr-2" />
                    New File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setCreateType('folder')
                    setCreateParentPath('')
                    setShowCreateDialog(true)
                  }}>
                    <Folder className="h-4 w-4 mr-2" />
                    New Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* File Tree */}
        <ScrollArea className="flex-1 p-2">
          <AnimatePresence>
            {filteredAndSortedFiles.map(file => renderFileItem(file))}
          </AnimatePresence>
          
          {filteredAndSortedFiles.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mb-2" />
              <p>No files found matching "{searchQuery}"</p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{filteredAndSortedFiles.length} items</span>
            {selectedFile && (
              <span>Selected: {selectedFile.name}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Create File/Folder Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create New {createType === 'file' ? 'File' : 'Folder'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder={`Enter ${createType} name...`}
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFile()
                }
              }}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile} disabled={!newFileName.trim()}>
              Create {createType === 'file' ? 'File' : 'Folder'}
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
          // Handle file upload
          console.log('Files uploaded:', e.target.files)
        }}
      />
    </>
  )
} 