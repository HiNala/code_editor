/**
 * Dynamic File System Service for AI Studio
 * Manages virtual file system for the coding environment
 */

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: Date
  created: Date
  children?: FileItem[]
  isExpanded?: boolean
  isStarred?: boolean
  extension?: string
  path: string
  content?: string
  parentId?: string
}

export interface FileSystemState {
  files: FileItem[]
  activeFile: string | null
  openFiles: string[]
  searchQuery: string
  viewMode: 'tree' | 'grid' | 'list'
}

class FileSystemService {
  private state: FileSystemState = {
    files: [],
    activeFile: null,
    openFiles: [],
    searchQuery: '',
    viewMode: 'tree'
  }

  private listeners: Set<() => void> = new Set()

  constructor() {
    this.initializeDefaultProject()
  }

  // Initialize with a basic project structure
  private initializeDefaultProject() {
    this.state.files = [
      {
        id: 'root',
        name: 'My Project',
        type: 'folder',
        path: '/',
        created: new Date(),
        modified: new Date(),
        isExpanded: true,
        children: [
          {
            id: 'src',
            name: 'src',
            type: 'folder',
            path: '/src',
            parentId: 'root',
            created: new Date(),
            modified: new Date(),
            isExpanded: true,
            children: [
              {
                id: 'app-tsx',
                name: 'App.tsx',
                type: 'file',
                path: '/src/App.tsx',
                parentId: 'src',
                extension: 'tsx',
                size: 1024,
                created: new Date(),
                modified: new Date(),
                content: `import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to AI Studio
        </h1>
        <p className="text-gray-600">
          Start building amazing applications with AI assistance!
        </p>
      </div>
    </div>
  )
}

export default App`
              },
              {
                id: 'index-css',
                name: 'index.css',
                type: 'file',
                path: '/src/index.css',
                parentId: 'src',
                extension: 'css',
                size: 512,
                created: new Date(),
                modified: new Date(),
                content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
              }
            ]
          },
          {
            id: 'public',
            name: 'public',
            type: 'folder',
            path: '/public',
            parentId: 'root',
            created: new Date(),
            modified: new Date(),
            children: [
              {
                id: 'index-html',
                name: 'index.html',
                type: 'file',
                path: '/public/index.html',
                parentId: 'public',
                extension: 'html',
                size: 2048,
                created: new Date(),
                modified: new Date(),
                content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="AI Studio - Build with AI assistance" />
    <title>AI Studio</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
              }
            ]
          },
          {
            id: 'package-json',
            name: 'package.json',
            type: 'file',
            path: '/package.json',
            parentId: 'root',
            extension: 'json',
            size: 1536,
            created: new Date(),
            modified: new Date(),
            content: `{
  "name": "ai-studio-project",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@types/node": "^16.7.13",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.4.2",
    "web-vitals": "^2.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`
          }
        ]
      }
    ]
  }

  // Subscribe to state changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }

  // Get current state
  getState(): FileSystemState {
    return { ...this.state }
  }

  // File operations
  createFile(name: string, parentPath: string, content: string = ''): FileItem {
    const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const extension = name.split('.').pop() || ''
    const parent = this.findFileByPath(parentPath)
    
    if (!parent || parent.type !== 'folder') {
      throw new Error('Parent must be a folder')
    }

    const newFile: FileItem = {
      id,
      name,
      type: 'file',
      path: `${parentPath}/${name}`.replace('//', '/'),
      parentId: parent.id,
      extension,
      size: content.length,
      created: new Date(),
      modified: new Date(),
      content
    }

    if (!parent.children) {
      parent.children = []
    }
    parent.children.push(newFile)
    parent.modified = new Date()

    this.notify()
    return newFile
  }

  createFolder(name: string, parentPath: string): FileItem {
    const id = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const parent = this.findFileByPath(parentPath)
    
    if (!parent || parent.type !== 'folder') {
      throw new Error('Parent must be a folder')
    }

    const newFolder: FileItem = {
      id,
      name,
      type: 'folder',
      path: `${parentPath}/${name}`.replace('//', '/'),
      parentId: parent.id,
      created: new Date(),
      modified: new Date(),
      children: []
    }

    if (!parent.children) {
      parent.children = []
    }
    parent.children.push(newFolder)
    parent.modified = new Date()

    this.notify()
    return newFolder
  }

  deleteFile(fileId: string): boolean {
    const file = this.findFileById(fileId)
    if (!file) return false

    // Remove from open files if it's open
    this.state.openFiles = this.state.openFiles.filter(id => id !== fileId)
    
    // If it's the active file, switch to another open file or null
    if (this.state.activeFile === fileId) {
      this.state.activeFile = this.state.openFiles[0] || null
    }

    // Remove from parent's children
    if (file.parentId) {
      const parent = this.findFileById(file.parentId)
      if (parent && parent.children) {
        parent.children = parent.children.filter(child => child.id !== fileId)
        parent.modified = new Date()
      }
    }

    this.notify()
    return true
  }

  renameFile(fileId: string, newName: string): boolean {
    const file = this.findFileById(fileId)
    if (!file) return false

    const oldPath = file.path
    const newPath = file.path.replace(file.name, newName)
    
    file.name = newName
    file.path = newPath
    file.modified = new Date()
    
    if (file.type === 'file') {
      file.extension = newName.split('.').pop() || ''
    }

    // Update all children paths if it's a folder
    if (file.type === 'folder' && file.children) {
      this.updateChildrenPaths(file, oldPath, newPath)
    }

    this.notify()
    return true
  }

  updateFileContent(fileId: string, content: string): boolean {
    const file = this.findFileById(fileId)
    if (!file || file.type !== 'file') return false

    file.content = content
    file.size = content.length
    file.modified = new Date()

    this.notify()
    return true
  }

  openFile(fileId: string): boolean {
    const file = this.findFileById(fileId)
    if (!file || file.type !== 'file') return false

    if (!this.state.openFiles.includes(fileId)) {
      this.state.openFiles.push(fileId)
    }
    this.state.activeFile = fileId

    this.notify()
    return true
  }

  closeFile(fileId: string): boolean {
    this.state.openFiles = this.state.openFiles.filter(id => id !== fileId)
    
    if (this.state.activeFile === fileId) {
      this.state.activeFile = this.state.openFiles[0] || null
    }

    this.notify()
    return true
  }

  setActiveFile(fileId: string | null): void {
    if (fileId && !this.state.openFiles.includes(fileId)) {
      this.openFile(fileId)
    } else {
      this.state.activeFile = fileId
      this.notify()
    }
  }

  toggleFolder(folderId: string): boolean {
    const folder = this.findFileById(folderId)
    if (!folder || folder.type !== 'folder') return false

    folder.isExpanded = !folder.isExpanded
    this.notify()
    return true
  }

  toggleStar(fileId: string): boolean {
    const file = this.findFileById(fileId)
    if (!file) return false

    file.isStarred = !file.isStarred
    this.notify()
    return true
  }

  setSearchQuery(query: string): void {
    this.state.searchQuery = query
    this.notify()
  }

  setViewMode(mode: 'tree' | 'grid' | 'list'): void {
    this.state.viewMode = mode
    this.notify()
  }

  // Utility methods
  private findFileById(id: string): FileItem | null {
    const search = (items: FileItem[]): FileItem | null => {
      for (const item of items) {
        if (item.id === id) return item
        if (item.children) {
          const found = search(item.children)
          if (found) return found
        }
      }
      return null
    }
    return search(this.state.files)
  }

  private findFileByPath(path: string): FileItem | null {
    const search = (items: FileItem[]): FileItem | null => {
      for (const item of items) {
        if (item.path === path) return item
        if (item.children) {
          const found = search(item.children)
          if (found) return found
        }
      }
      return null
    }
    return search(this.state.files)
  }

  private updateChildrenPaths(folder: FileItem, oldPath: string, newPath: string): void {
    if (!folder.children) return

    for (const child of folder.children) {
      child.path = child.path.replace(oldPath, newPath)
      if (child.type === 'folder' && child.children) {
        this.updateChildrenPaths(child, oldPath, newPath)
      }
    }
  }

  // Search functionality
  searchFiles(query: string): FileItem[] {
    if (!query.trim()) return []

    const results: FileItem[] = []
    const search = (items: FileItem[]) => {
      for (const item of items) {
        if (item.name.toLowerCase().includes(query.toLowerCase()) ||
            (item.content && item.content.toLowerCase().includes(query.toLowerCase()))) {
          results.push(item)
        }
        if (item.children) {
          search(item.children)
        }
      }
    }

    search(this.state.files)
    return results
  }

  // Export/Import functionality
  exportProject(): string {
    return JSON.stringify(this.state.files, null, 2)
  }

  importProject(projectData: string): boolean {
    try {
      const files = JSON.parse(projectData)
      this.state.files = files
      this.state.activeFile = null
      this.state.openFiles = []
      this.notify()
      return true
    } catch (error) {
      console.error('Failed to import project:', error)
      return false
    }
  }

  // Get file content for preview/execution
  getFileContent(fileId: string): string | null {
    const file = this.findFileById(fileId)
    return file?.content || null
  }

  // Get all files as a flat array (useful for search, etc.)
  getAllFiles(): FileItem[] {
    const files: FileItem[] = []
    const collect = (items: FileItem[]) => {
      for (const item of items) {
        files.push(item)
        if (item.children) {
          collect(item.children)
        }
      }
    }
    collect(this.state.files)
    return files
  }
}

// Create singleton instance
export const fileSystemService = new FileSystemService()
export default fileSystemService 