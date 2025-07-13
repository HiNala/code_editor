import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Kbd,
} from '@chakra-ui/react'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../ui/dialog'
import { useColorModeValue } from '../ui/color-mode'

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
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogContent maxW="2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        
        <DialogBody>
          <VStack spacing={6} align="stretch">
            <Text color="gray.600" fontSize="sm">
              Boost your productivity with these keyboard shortcuts
            </Text>
            
            {shortcuts.map((section, sectionIndex) => (
              <Box key={section.category}>
                <Text
                  fontWeight="semibold"
                  fontSize="sm"
                  color="gray.700"
                  mb={3}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {section.category}
                </Text>
                <VStack spacing={2} align="stretch">
                  {section.items.map((shortcut, index) => (
                    <HStack
                      key={index}
                      justify="space-between"
                      align="center"
                      p={3}
                      borderRadius="md"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      _hover={{
                        bg: useColorModeValue('gray.100', 'gray.600')
                      }}
                      transition="background-color 0.15s ease"
                    >
                      <Text fontSize="sm">{shortcut.description}</Text>
                      <HStack spacing={1}>
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            {keyIndex > 0 && (
                              <Text fontSize="xs" color="gray.400">+</Text>
                            )}
                            <Kbd
                              fontSize="xs"
                              bg={useColorModeValue('white', 'gray.600')}
                              border="1px"
                              borderColor={borderColor}
                              px={2}
                              py={1}
                            >
                              {key}
                            </Kbd>
                          </React.Fragment>
                        ))}
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
{sectionIndex < shortcuts.length - 1 && (
                  <Box h="1px" bg={borderColor} mt={4} />
                )}
              </Box>
            ))}
            
            <Box
              p={4}
              bg={useColorModeValue('blue.50', 'blue.900')}
              borderRadius="md"
              border="1px"
              borderColor={useColorModeValue('blue.200', 'blue.700')}
            >
              <HStack spacing={2} mb={2}>
                <Badge colorScheme="blue" variant="subtle">Tip</Badge>
              </HStack>
              <Text fontSize="sm" color={useColorModeValue('blue.700', 'blue.200')}>
                Most shortcuts use ⌘ (Cmd) on macOS and Ctrl on Windows/Linux. 
                The interface automatically adapts to your operating system.
              </Text>
            </Box>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
} 