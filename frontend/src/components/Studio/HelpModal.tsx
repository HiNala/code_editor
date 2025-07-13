import React from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  {
    category: 'Generation',
    items: [
      { keys: ['⌘', 'Enter'], description: 'Generate code from prompt' },
      { keys: ['⌘', 'Shift', 'Enter'], description: 'Improve selected code' },
    ]
  },
  {
    category: 'File Management',
    items: [
      { keys: ['⌘', 'S'], description: 'Save snapshot' },
      { keys: ['⌘', 'N'], description: 'New file' },
      { keys: ['⌘', 'W'], description: 'Close file' },
    ]
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['⌘', '⌥', 'V'], description: 'Toggle version sidebar' },
      { keys: ['⌘', 'B'], description: 'Toggle file tree' },
      { keys: ['⌘', 'P'], description: 'Open project selector' },
    ]
  },
  {
    category: 'Editor',
    items: [
      { keys: ['⌘', 'F'], description: 'Find in file' },
      { keys: ['⌘', 'G'], description: 'Go to line' },
      { keys: ['⌘', 'D'], description: 'Duplicate line' },
      { keys: ['⌘', '/'], description: 'Toggle comment' },
    ]
  },
  {
    category: 'Preview',
    items: [
      { keys: ['⌘', 'R'], description: 'Refresh preview' },
      { keys: ['⌘', 'Shift', 'R'], description: 'Hard refresh preview' },
      { keys: ['⌘', '1'], description: 'Switch to preview tab' },
      { keys: ['⌘', '2'], description: 'Switch to console tab' },
    ]
  },
  {
    category: 'General',
    items: [
      { keys: ['⌘', '/'], description: 'Show this help' },
      { keys: ['⌘', ','], description: 'Open preferences' },
      { keys: ['Esc'], description: 'Close modal/sidebar' },
    ]
  },
]

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl max-h-[80vh] bg-background border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-sm text-muted-foreground mb-6">
                Boost your productivity with these keyboard shortcuts
              </p>
              
              <div className="space-y-6">
                {shortcuts.map((section, sectionIndex) => (
                  <div key={section.category}>
                    <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <span className="text-sm">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <React.Fragment key={keyIndex}>
                                {keyIndex > 0 && (
                                  <span className="text-xs text-muted-foreground">+</span>
                                )}
                                <kbd className="px-2 py-1 text-xs bg-background border border-border rounded">
                                  {key}
                                </kbd>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {sectionIndex < shortcuts.length - 1 && (
                      <div className="h-px bg-border mt-4" />
                    )}
                  </div>
                ))}
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                      Tip
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Most shortcuts use ⌘ (Cmd) on macOS and Ctrl on Windows/Linux. 
                    The interface automatically adapts to your operating system.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 