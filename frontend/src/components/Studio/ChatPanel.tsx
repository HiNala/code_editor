import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  IconButton,
  Flex,
  Badge,
  Textarea,
  ScrollArea,
} from '@chakra-ui/react'
import { FiSend, FiMessageCircle, FiEdit3 } from 'react-icons/fi'
import { useColorModeValue } from '../ui/color-mode'

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatPanelProps {
  onGenerate: (prompt: string) => void
  onImprove: (improvement: string) => void
  isGenerating: boolean
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onGenerate,
  onImprove,
  isGenerating,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to the Code Generation Studio! Describe what you want to build and I\'ll generate the code for you.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isImproveMode, setIsImproveMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const messageBg = useColorModeValue('gray.50', 'gray.700')
  const userMessageBg = useColorModeValue('blue.50', 'blue.900')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    if (isImproveMode) {
      onImprove(input)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Improving code based on: "${input}"`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } else {
      onGenerate(input)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Generating code for: "${input}"`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    }

    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
            <FiMessageCircle />
            <Text fontWeight="semibold">Chat</Text>
          </HStack>
          
          <HStack>
            <Button
              size="sm"
              variant={!isImproveMode ? 'solid' : 'outline'}
              colorScheme="blue"
              onClick={() => setIsImproveMode(false)}
            >
              Generate
            </Button>
            <Button
              size="sm"
              variant={isImproveMode ? 'solid' : 'outline'}
              colorScheme="green"
              onClick={() => setIsImproveMode(true)}
            >
              Improve
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Messages */}
      <Box flex="1" overflow="hidden" position="relative">
        <Box
          h="100%"
          overflowY="auto"
          p={4}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
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
          <VStack spacing={3} align="stretch">
            {messages.map((message) => (
              <Box
                key={message.id}
                p={3}
                bg={
                  message.type === 'user'
                    ? userMessageBg
                    : message.type === 'system'
                    ? messageBg
                    : messageBg
                }
                borderRadius="lg"
                borderLeft={
                  message.type === 'user'
                    ? '4px solid'
                    : message.type === 'system'
                    ? '4px solid'
                    : '4px solid'
                }
                borderLeftColor={
                  message.type === 'user'
                    ? 'blue.500'
                    : message.type === 'system'
                    ? 'gray.500'
                    : 'green.500'
                }
              >
                <HStack justify="space-between" align="start">
                  <Box flex="1">
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {message.content}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme={
                      message.type === 'user'
                        ? 'blue'
                        : message.type === 'system'
                        ? 'gray'
                        : 'green'
                    }
                    size="sm"
                  >
                    {message.type}
                  </Badge>
                </HStack>
              </Box>
            ))}
            
            {isGenerating && (
              <Box
                p={3}
                bg={messageBg}
                borderRadius="lg"
                borderLeft="4px solid"
                borderLeftColor="yellow.500"
              >
                <HStack>
                  <Text fontSize="sm" color="yellow.600">
                    Generating...
                  </Text>
                  <Box
                    w="3"
                    h="3"
                    bg="yellow.500"
                    borderRadius="full"
                    animation="pulse 1s infinite"
                  />
                </HStack>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
      </Box>

      {/* Input */}
      <Box
        p={4}
        borderTop="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <VStack spacing={2}>
          <HStack w="100%" align="center">
            <IconButton
              aria-label="Switch mode"
              icon={isImproveMode ? <FiEdit3 /> : <FiMessageCircle />}
              size="sm"
              variant="ghost"
              colorScheme={isImproveMode ? 'green' : 'blue'}
              onClick={() => setIsImproveMode(!isImproveMode)}
            />
            <Badge
              colorScheme={isImproveMode ? 'green' : 'blue'}
              size="sm"
            >
              {isImproveMode ? 'Improve Mode' : 'Generate Mode'}
            </Badge>
          </HStack>
          
          <HStack w="100%">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isImproveMode
                  ? 'Describe how to improve the code...'
                  : 'Describe what you want to build...'
              }
              resize="none"
              minH="40px"
              maxH="120px"
              rows={2}
            />
            <IconButton
              aria-label="Send"
              icon={<FiSend />}
              colorScheme="blue"
              onClick={handleSend}
              isDisabled={!input.trim() || isGenerating}
            />
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
} 