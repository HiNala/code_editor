import { useEffect, useCallback } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  action: () => void
  description: string
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export const useKeyboardShortcuts = ({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Don't trigger shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase()
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey
      const altMatches = !!shortcut.altKey === event.altKey
      const metaMatches = !!shortcut.metaKey === event.metaKey
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey

      return keyMatches && ctrlMatches && altMatches && metaMatches && shiftMatches
    })

    if (matchingShortcut) {
      event.preventDefault()
      event.stopPropagation()
      matchingShortcut.action()
    }
  }, [shortcuts, enabled])

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])

  return {
    shortcuts: shortcuts.map(s => ({
      key: s.key,
      ctrlKey: s.ctrlKey,
      altKey: s.altKey,
      metaKey: s.metaKey,
      shiftKey: s.shiftKey,
      description: s.description,
    }))
  }
}

// Common shortcuts
export const getCommonShortcuts = (handlers: {
  onGenerate?: () => void
  onSave?: () => void
  onToggleVersionSidebar?: () => void
  onShowHelp?: () => void
}) => [
  ...(handlers.onGenerate ? [{
    key: 'Enter',
    metaKey: true,
    action: handlers.onGenerate,
    description: '⌘ + Enter: Generate code'
  }] : []),
  ...(handlers.onSave ? [{
    key: 's',
    metaKey: true,
    action: handlers.onSave,
    description: '⌘ + S: Save snapshot'
  }] : []),
  ...(handlers.onToggleVersionSidebar ? [{
    key: 'v',
    metaKey: true,
    altKey: true,
    action: handlers.onToggleVersionSidebar,
    description: '⌘ + ⌥ + V: Toggle version sidebar'
  }] : []),
  ...(handlers.onShowHelp ? [{
    key: '/',
    metaKey: true,
    action: handlers.onShowHelp,
    description: '⌘ + /: Show keyboard shortcuts'
  }] : []),
] 