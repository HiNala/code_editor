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

} from '@chakra-ui/react'
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from '../ui/menu'
import {
  FiX,
  FiClock,
  FiRotateCcw,
  FiMoreVertical,
  FiDownload,
  FiTrash2,
  FiGitBranch,
  FiCalendar,
} from 'react-icons/fi'
import { useColorModeValue } from '../ui/color-mode'
import { toaster } from '../ui/toaster'

interface Version {
  id: string
  name: string
  description?: string
  createdAt: Date
  filesCount: number
  size: string
  isActive?: boolean
}

interface VersionSidebarProps {
  isOpen: boolean
  onClose: () => void
  projectId: string | null
  onVersionRestore: (versionId: string) => void
}

// Mock data - in real app this would come from API
const mockVersions: Version[] = [
  {
    id: 'v1',
    name: 'Initial Component Setup',
    description: 'Created basic React component structure',
    createdAt: new Date('2024-01-15T10:30:00'),
    filesCount: 3,
    size: '2.1 KB',
    isActive: true,
  },
  {
    id: 'v2',
    name: 'Added Styling',
    description: 'Implemented responsive design with CSS Grid',
    createdAt: new Date('2024-01-15T11:45:00'),
    filesCount: 5,
    size: '4.7 KB',
  },
  {
    id: 'v3',
    name: 'Interactive Features',
    description: 'Added click handlers and state management',
    createdAt: new Date('2024-01-15T14:20:00'),
    filesCount: 7,
    size: '8.3 KB',
  },
  {
    id: 'v4',
    name: 'Performance Optimization',
    description: 'Optimized renders and added memoization',
    createdAt: new Date('2024-01-15T16:10:00'),
    filesCount: 8,
    size: '9.1 KB',
  },
]

const formatDate = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else {
    return date.toLocaleDateString()
  }
}

export const VersionSidebar: React.FC<VersionSidebarProps> = ({
  isOpen,
  onClose,
  projectId,
  onVersionRestore,
}) => {
  const [versions, setVersions] = useState<Version[]>(mockVersions)
  const [loading, setLoading] = useState(false)
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const handleRestore = (versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (!version) return

    // Update active version
    setVersions(prev => prev.map(v => ({
      ...v,
      isActive: v.id === versionId
    })))

    onVersionRestore(versionId)
    
    toaster.create({
      title: 'Version restored',
      description: `Restored to "${version.name}"`,
      status: 'success',
      duration: 3000,
    })
  }

  const handleDelete = (versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (!version) return

    setVersions(prev => prev.filter(v => v.id !== versionId))
    
    toaster.create({
      title: 'Version deleted',
      description: `"${version.name}" has been deleted`,
      status: 'info',
      duration: 3000,
    })
  }

  const handleDownload = (versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (!version) return

    // TODO: Implement actual download
    toaster.create({
      title: 'Download started',
      description: `Downloading "${version.name}"...`,
      status: 'info',
      duration: 3000,
    })
  }

  return (
    <Box
      position="fixed"
      right={0}
      top={0}
      bottom={0}
      w="400px"
      bg={bgColor}
      borderLeft="1px"
      borderColor={borderColor}
      transform={isOpen ? 'translateX(0)' : 'translateX(100%)'}
      transition="transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)"
      zIndex={50}
      boxShadow="xl"
    >
      {/* Header */}
      <Flex
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
        justify="space-between"
        align="center"
      >
        <HStack spacing={2}>
          <FiClock />
          <Text fontWeight="semibold">Version History</Text>
        </HStack>
        <IconButton
          aria-label="Close sidebar"
          icon={<FiX />}
          size="sm"
          variant="ghost"
          onClick={onClose}
        />
      </Flex>

      {/* Content */}
      <Box flex={1} overflow="auto">
        {!projectId ? (
          <Box p={8} textAlign="center">
            <FiGitBranch size={32} color="gray.400" />
            <Text color="gray.500" mt={4}>
              Select a project to view version history
            </Text>
          </Box>
        ) : (
          <VStack spacing={0} align="stretch">
            {versions.map((version, index) => (
              <Box key={version.id}>
                <Box
                  p={4}
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => setExpandedVersion(
                    expandedVersion === version.id ? null : version.id
                  )}
                  transition="background-color 0.15s ease"
                >
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack spacing={2}>
                        <Text fontWeight="medium" fontSize="sm">
                          {version.name}
                        </Text>
                        {version.isActive && (
                          <Badge colorScheme="green" size="sm">
                            Active
                          </Badge>
                        )}
                      </HStack>
                      
                      {version.description && (
                        <Text fontSize="xs" color="gray.600" noOfLines={2}>
                          {version.description}
                        </Text>
                      )}
                      
                      <HStack spacing={3} fontSize="xs" color="gray.500">
                        <HStack spacing={1}>
                          <FiCalendar size={12} />
                          <Text>{formatDate(version.createdAt)}</Text>
                        </HStack>
                        <Text>•</Text>
                        <Text>{version.filesCount} files</Text>
                        <Text>•</Text>
                        <Text>{version.size}</Text>
                      </HStack>
                    </VStack>

                    <MenuRoot>
                      <MenuTrigger asChild>
                        <IconButton
                          aria-label="Version options"
                          icon={<FiMoreVertical />}
                          size="sm"
                          variant="ghost"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </MenuTrigger>
                      <MenuContent>
                        <MenuItem
                          value="restore"
                          onClick={() => handleRestore(version.id)}
                          disabled={version.isActive}
                        >
                          <FiRotateCcw />
                          Restore Version
                        </MenuItem>
                        <MenuItem
                          value="download"
                          onClick={() => handleDownload(version.id)}
                        >
                          <FiDownload />
                          Download
                        </MenuItem>
                        <MenuSeparator />
                        <MenuItem
                          value="delete"
                          onClick={() => handleDelete(version.id)}
                          color="red.500"
                          disabled={version.isActive}
                        >
                          <FiTrash2 />
                          Delete
                        </MenuItem>
                      </MenuContent>
                    </MenuRoot>
                  </HStack>
                </Box>

{expandedVersion === version.id && (
                  <Box px={4} pb={4}>
                    <Box
                      p={3}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      fontSize="sm"
                    >
                      <Text fontWeight="medium" mb={2}>Details</Text>
                      <VStack spacing={1} align="start">
                        <Text>Created: {version.createdAt.toLocaleString()}</Text>
                        <Text>Size: {version.size}</Text>
                        <Text>Files: {version.filesCount}</Text>
                      </VStack>
                    </Box>
                  </Box>
                )}

{index < versions.length - 1 && (
                  <Box h="1px" bg={borderColor} />
                )}
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Footer */}
      <Box
        p={4}
        borderTop="1px"
        borderColor={borderColor}
        bg={useColorModeValue('gray.50', 'gray.700')}
      >
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Versions are automatically saved when you generate code
        </Text>
      </Box>
    </Box>
  )
} 