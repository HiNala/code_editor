import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  Text,
  Button,
  Badge,
  Flex,
} from '@chakra-ui/react'
import { FiFile, FiX, FiPlus, FiCode } from 'react-icons/fi'
import Editor from '@monaco-editor/react'

import { FileMap } from './StudioLayout'
import { useColorModeValue } from '../ui/color-mode'

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
  const [isEditorReady, setIsEditorReady] = useState(false)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const tabBg = useColorModeValue('gray.50', 'gray.700')
  const theme = useColorModeValue('light', 'dark')

  const fileList = Object.keys(files)
  const activeFileContent = files[activeFile] || ''

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      onFileChange(activeFile, value)
    }
  }

  const handleEditorDidMount = () => {
    setIsEditorReady(true)
  }

  const getFileLanguage = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'tsx':
      case 'ts':
        return 'typescript'
      case 'jsx':
      case 'js':
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
        return 'typescript'
    }
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'tsx':
      case 'jsx':
        return '⚛️'
      case 'ts':
      case 'js':
        return '📄'
      case 'css':
        return '🎨'
      case 'html':
        return '🌐'
      case 'json':
        return '📋'
      case 'md':
        return '📝'
      default:
        return '📄'
    }
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
            <FiCode />
            <Text fontWeight="semibold">Code Editor</Text>
          </HStack>
          
          <HStack>
            <Badge colorScheme="blue" size="sm">
              {fileList.length} files
            </Badge>
            <Button
              size="sm"
              leftIcon={<FiPlus />}
              variant="outline"
              onClick={() => {
                const newFileName = `src/NewFile${Date.now()}.tsx`
                onFileChange(newFileName, '// New file\n')
                onActiveFileChange(newFileName)
              }}
            >
              New File
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* File Tabs */}
      {fileList.length > 0 && (
        <Box
          bg={tabBg}
          borderBottom="1px"
          borderColor={borderColor}
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              height: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#CBD5E0',
              borderRadius: '2px',
            },
          }}
        >
          <Flex minW="max-content">
            {fileList.map((filename) => (
              <Button
                key={filename}
                size="sm"
                variant={activeFile === filename ? 'solid' : 'ghost'}
                colorScheme={activeFile === filename ? 'blue' : 'gray'}
                onClick={() => onActiveFileChange(filename)}
                leftIcon={<span>{getFileIcon(filename)}</span>}
                rightIcon={
                  fileList.length > 1 ? (
                    <IconButton
                      aria-label="Close file"
                      icon={<FiX />}
                      size="xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Remove file (simplified - you might want to add confirmation)
                        const newFiles = { ...files }
                        delete newFiles[filename]
                        // Switch to another file if this was active
                        if (activeFile === filename) {
                          const remainingFiles = Object.keys(newFiles)
                          if (remainingFiles.length > 0) {
                            onActiveFileChange(remainingFiles[0])
                          }
                        }
                      }}
                    />
                  ) : undefined
                }
                mr={1}
                mb={1}
                mt={1}
                borderRadius="md"
                maxW="200px"
                justifyContent="flex-start"
              >
                <Text fontSize="xs" isTruncated>
                  {filename.split('/').pop()}
                </Text>
              </Button>
            ))}
          </Flex>
        </Box>
      )}

      {/* Editor */}
      <Box flex="1" position="relative">
        {fileList.length === 0 ? (
          <Flex
            h="100%"
            align="center"
            justify="center"
            direction="column"
            gap={4}
            color="gray.500"
          >
            <FiFile size={48} />
            <Text>No files yet</Text>
            <Text fontSize="sm">
              Generate some code to get started
            </Text>
          </Flex>
        ) : (
          <Editor
            height="100%"
            language={getFileLanguage(activeFile)}
            value={activeFileContent}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={theme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
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
            }}
          />
        )}
        
        {!isEditorReady && fileList.length > 0 && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            align="center"
            justify="center"
            bg={bgColor}
            zIndex={10}
          >
            <Text color="gray.500">Loading editor...</Text>
          </Flex>
        )}
      </Box>
    </Box>
  )
} 