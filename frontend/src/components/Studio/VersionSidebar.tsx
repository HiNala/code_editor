import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GitBranch, 
  History, 
  Plus, 
  MoreHorizontal,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface Version {
  id: string
  name: string
  description: string
  timestamp: string
  author: string
  status: 'saved' | 'published' | 'draft'
  changes: number
}

interface VersionSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const VersionSidebar: React.FC<VersionSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeVersion, setActiveVersion] = useState('current')
  const [isCreatingVersion, setIsCreatingVersion] = useState(false)

  // Mock version data
  const versions: Version[] = [
    {
      id: 'current',
      name: 'Current Draft',
      description: 'Working on responsive design improvements',
      timestamp: 'Just now',
      author: 'You',
      status: 'draft',
      changes: 12
    },
    {
      id: 'v1.2.0',
      name: 'Mobile Optimization',
      description: 'Added mobile-first responsive design',
      timestamp: '2 hours ago',
      author: 'John Doe',
      status: 'published',
      changes: 8
    },
    {
      id: 'v1.1.0',
      name: 'UI Components',
      description: 'Enhanced component library with new animations',
      timestamp: '1 day ago',
      author: 'Jane Smith',
      status: 'published',
      changes: 15
    },
    {
      id: 'v1.0.0',
      name: 'Initial Release',
      description: 'First stable version with core features',
      timestamp: '3 days ago',
      author: 'Team',
      status: 'published',
      changes: 45
    }
  ]

  const getStatusIcon = (status: Version['status']) => {
    switch (status) {
      case 'published':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      case 'saved':
        return <Clock className="h-3 w-3 text-blue-500" />
      case 'draft':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />
      default:
        return <XCircle className="h-3 w-3 text-red-500" />
    }
  }

  const getStatusColor = (status: Version['status']) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'saved':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'draft':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const handleCreateVersion = () => {
    setIsCreatingVersion(true)
    // Simulate version creation
    setTimeout(() => {
      setIsCreatingVersion(false)
    }, 1000)
  }

  const handleVersionSelect = (versionId: string) => {
    setActiveVersion(versionId)
  }

  const handleVersionAction = (action: string, versionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(`${action} version:`, versionId)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-only fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              "fixed right-0 top-0 h-full bg-background border-l border-border shadow-xl z-50",
              "w-80 desktop-only", // Desktop: Fixed width
              "w-full mobile-only" // Mobile: Full width
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-background/95 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  <h2 className="font-semibold">Version History</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateVersion}
                    disabled={isCreatingVersion}
                    className="touch-target"
                  >
                    {isCreatingVersion ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline ml-1">Save</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="touch-target"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Stats */}
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  <span>{versions.length} versions</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>3 contributors</span>
                </div>
              </div>
            </div>

            {/* Version List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-3">
                {versions.map((version, index) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                      activeVersion === version.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-accent hover:bg-accent/50"
                    )}
                    onClick={() => handleVersionSelect(version.id)}
                  >
                    {/* Version Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(version.status)}
                          <h3 className="font-medium text-sm truncate">
                            {version.name}
                          </h3>
                        </div>
                        
                        <div className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(version.status)
                        )}>
                          {version.status}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleVersionAction('menu', version.id, e)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Description */}
                    {version.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {version.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{version.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{version.author}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{version.changes} changes</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {activeVersion === version.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-border flex items-center gap-2"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleVersionAction('restore', version.id, e)}
                          className="flex-1 text-xs"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Restore
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleVersionAction('download', version.id, e)}
                          className="flex-1 text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        
                        {version.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleVersionAction('publish', version.id, e)}
                            className="flex-1 text-xs"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Publish
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Auto-save enabled</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Synced</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 