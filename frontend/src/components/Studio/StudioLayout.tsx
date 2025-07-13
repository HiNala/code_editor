import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Flex,
  Button,
  IconButton,
  HStack,
  Spacer,
} from '@chakra-ui/react'
import { FiSidebar, FiSave, FiPlay, FiSettings } from 'react-icons/fi'
import { Link } from '@tanstack/react-router'

import { ChatPanel } from './ChatPanel'
import { CodeEditor } from './CodeEditor'
import { PreviewPanel } from './PreviewPanel'
import { ProjectSelector } from './ProjectSelector'
import { VersionSidebar } from './VersionSidebar'
import { HelpModal } from './HelpModal'
import UserMenu from '../Common/UserMenu'
import { ColorModeToggle } from '../ui/ColorModeToggle'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useColorModeValue } from '../ui/color-mode'
import { toaster } from '../ui/toaster'
import { useKeyboardShortcuts, getCommonShortcuts } from '../../hooks/useKeyboardShortcuts'

export interface FileMap {
  [filename: string]: string
}

export interface StudioLayoutProps {}

export const StudioLayout: React.FC<StudioLayoutProps> = () => {
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [files, setFiles] = useState<FileMap>({})
  const [activeFile, setActiveFile] = useState<string>('src/App.tsx')
  const [isGenerating, setIsGenerating] = useState(false)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [versionSidebarOpen, setVersionSidebarOpen] = useState(false)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  const { sendMessage, lastMessage, connectionStatus } = useWebSocket(
    currentProject ? `ws://localhost:8000/api/v1/studio/projects/${currentProject}/generate/stream` : null
  )

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const message = JSON.parse(lastMessage.data)
        
        switch (message.type) {
          case 'file':
            if (message.filename && message.content) {
              setFiles(prev => ({
                ...prev,
                [message.filename]: message.content
              }))
              
              // Set the first file as active if none is selected
              if (!activeFile || !files[activeFile]) {
                setActiveFile(message.filename)
              }
            }
            break
            
          case 'status':
            if (message.content === 'Generation completed') {
              setIsGenerating(false)
              toaster.create({
                title: 'Generation completed',
                status: 'success',
                duration: 3000,
              })
            }
            break
            
          case 'error':
            setIsGenerating(false)
            toaster.create({
              title: 'Error',
              description: message.content,
              status: 'error',
              duration: 5000,
            })
            break
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }, [lastMessage, activeFile, files])

  const handleGenerate = (prompt: string) => {
    if (!currentProject) {
      toaster.create({
        title: 'No project selected',
        description: 'Please select or create a project first',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setIsGenerating(true)
    sendMessage({
      type: 'generate',
      prompt: prompt,
      context: Object.keys(files).length > 0 ? JSON.stringify(files) : ''
    })
  }

  const handleImproveCode = (improvement: string) => {
    if (!currentProject) {
      toaster.create({
        title: 'No project selected',
        description: 'Please select or create a project first',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setIsGenerating(true)
    sendMessage({
      type: 'improve',
      code: files[activeFile] || '',
      improvement_request: improvement
    })
  }

  const handleFileChange = (filename: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [filename]: content
    }))
  }

  const handleSaveSnapshot = () => {
    // TODO: Implement save snapshot functionality
    toaster.create({
      title: 'Snapshot saved',
      description: 'Your current work has been saved',
      status: 'success',
      duration: 3000,
    })
  }

  const handleVersionRestore = (versionId: string) => {
    // TODO: Implement version restore functionality
    console.log('Restoring version:', versionId)
  }

  // Setup keyboard shortcuts
  const shortcuts = getCommonShortcuts({
    onSave: handleSaveSnapshot,
    onToggleVersionSidebar: () => setVersionSidebarOpen(prev => !prev),
    onShowHelp: () => setHelpModalOpen(true),
  })

  useKeyboardShortcuts({ shortcuts })

  const gridTemplateColumns = leftPanelCollapsed 
    ? '0px 1fr 1fr' 
    : '350px 1fr 1fr'

  return (
    <Box h="100vh" bg={bgColor}>
      {/* Top Bar */}
      <Flex
        h="60px"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        px={4}
        align="center"
        justify="space-between"
      >
        <Flex align="center" gap={2}>
          <IconButton
            aria-label="Toggle sidebar"
            icon={<FiSidebar />}
            variant="ghost"
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          />
          <ProjectSelector
            currentProject={currentProject}
            onProjectChange={setCurrentProject}
          />
        </Flex>
        
        <HStack spacing={2}>
          <Button
            leftIcon={<FiSave />}
            variant="outline"
            onClick={handleSaveSnapshot}
            isDisabled={!currentProject}
          >
            Save Version
          </Button>
          <Button
            leftIcon={<FiPlay />}
            colorScheme="blue"
            isLoading={isGenerating}
            isDisabled={!currentProject}
          >
            {connectionStatus === 'Connected' ? 'Connected' : 'Disconnected'}
          </Button>
          
          <Spacer />
          
          <Link to="/settings">
            <IconButton
              aria-label="Settings"
              icon={<FiSettings />}
              variant="ghost"
            />
          </Link>
          
          <ColorModeToggle />
          
          <UserMenu />
        </HStack>
      </Flex>

      {/* Main Content */}
      <Grid
        templateColumns={gridTemplateColumns}
        h="calc(100vh - 60px)"
        gap={0}
      >
        {/* Left Panel - Chat */}
        <GridItem
          bg={bgColor}
          borderRight="1px"
          borderColor={borderColor}
          overflow="hidden"
          display={leftPanelCollapsed ? 'none' : 'block'}
        >
          <ChatPanel
            onGenerate={handleGenerate}
            onImprove={handleImproveCode}
            isGenerating={isGenerating}
          />
        </GridItem>

        {/* Middle Panel - Code Editor */}
        <GridItem
          bg={bgColor}
          borderRight="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <CodeEditor
            files={files}
            activeFile={activeFile}
            onFileChange={handleFileChange}
            onActiveFileChange={setActiveFile}
          />
        </GridItem>

        {/* Right Panel - Preview */}
        <GridItem bg={bgColor} overflow="hidden">
          <PreviewPanel
            files={files}
            activeFile={activeFile}
          />
        </GridItem>
      </Grid>

      {/* Version Sidebar */}
      <VersionSidebar
        isOpen={versionSidebarOpen}
        onClose={() => setVersionSidebarOpen(false)}
        projectId={currentProject}
        onVersionRestore={handleVersionRestore}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </Box>
  )
} 