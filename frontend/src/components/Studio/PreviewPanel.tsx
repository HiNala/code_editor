import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Badge,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Code,
  Alert,
  Select,
} from '@chakra-ui/react'
import { FiEye, FiRefreshCw, FiExternalLink, FiCode, FiMonitor, FiSmartphone, FiTablet } from 'react-icons/fi'
import { 
  SandpackProvider, 
  SandpackPreview, 
  SandpackConsole,
  SandpackLayout,
  SandpackCodeViewer
} from '@codesandbox/sandpack-react'

import { FileMap } from './StudioLayout'
import { useColorModeValue } from '../ui/color-mode'

export interface PreviewPanelProps {
  files: FileMap
  activeFile: string
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  files,
  activeFile,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const previewBg = useColorModeValue('gray.50', 'gray.900')

  const fileList = Object.keys(files)
  const hasFiles = fileList.length > 0

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setPreviewError(null)
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsRefreshing(false)
  }

  const handleOpenInNewTab = () => {
    // TODO: Implement opening preview in new tab
    console.log('Opening preview in new tab')
  }

  const renderPreview = () => {
    if (!hasFiles) {
      return (
        <Flex
          h="100%"
          align="center"
          justify="center"
          direction="column"
          gap={4}
          color="gray.500"
        >
          <FiEye size={48} />
          <Text>No preview available</Text>
          <Text fontSize="sm" textAlign="center">
            Generate some code to see a preview
          </Text>
        </Flex>
      )
    }

    // Simple preview showing file structure
    return (
      <Box h="100%" overflow="auto" p={4}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2}>
              Generated Files
            </Text>
            <VStack spacing={2} align="stretch">
              {fileList.map((filename) => (
                <Box
                  key={filename}
                  p={3}
                  bg={previewBg}
                  borderRadius="md"
                  border="1px"
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" align="center" mb={2}>
                    <HStack>
                      <FiCode size={16} />
                      <Text fontWeight="medium" fontSize="sm">
                        {filename}
                      </Text>
                    </HStack>
                    <Badge size="sm" colorScheme="blue">
                      {files[filename].split('\n').length} lines
                    </Badge>
                  </HStack>
                  
                  <Box
                    bg={bgColor}
                    borderRadius="md"
                    p={3}
                    border="1px"
                    borderColor={borderColor}
                    maxH="200px"
                    overflowY="auto"
                  >
                    <Code
                      fontSize="xs"
                      whiteSpace="pre-wrap"
                      display="block"
                      color="inherit"
                    >
                      {files[filename]}
                    </Code>
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          
          <Box>
            <Text fontSize="md" fontWeight="medium" mb={2}>
              Preview Notes
            </Text>
            <Alert status="info" size="sm">
              <Text fontSize="sm">
                ℹ️ This is a basic preview. In a full implementation, you would integrate
                Sandpack or a similar solution to provide live code execution and preview.
              </Text>
            </Alert>
          </Box>
        </VStack>
      </Box>
    )
  }

  return (
    <Box h="100%" display="flex" flexDirection="column">
      {/* Header */}
      <Box
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <HStack justify="space-between" align="center">
          <HStack>
            <FiEye />
            <Text fontWeight="semibold">Preview</Text>
          </HStack>
          
          <HStack>
            {hasFiles && (
              <>
                <Button
                  size="sm"
                  leftIcon={<FiRefreshCw />}
                  variant="outline"
                  onClick={handleRefresh}
                  isLoading={isRefreshing}
                  loadingText="Refreshing"
                >
                  Refresh
                </Button>
                <IconButton
                  aria-label="Open in new tab"
                  icon={<FiExternalLink />}
                  size="sm"
                  variant="ghost"
                  onClick={handleOpenInNewTab}
                />
              </>
            )}
          </HStack>
        </HStack>
      </Box>

      {/* Preview Content */}
      <Box flex="1" position="relative">
        {previewError ? (
          <Alert status="error" m={4}>
            <Text>❌ Preview Error: {previewError}</Text>
          </Alert>
        ) : (
          renderPreview()
        )}
      </Box>
    </Box>
  )
} 