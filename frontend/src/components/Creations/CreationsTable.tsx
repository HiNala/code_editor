import React from 'react'
import { Button, Container, Heading, Text, Table, Box, IconButton } from '@chakra-ui/react'
import { FiVideo, FiMusic, FiTrash } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog'

const API_URL = import.meta.env.VITE_API_URL

interface Creation {
  id: string
  created_at: string
  timestamp_data: Record<string, any>
  input_video_keys: string[]
  input_audio_keys: string[]
  input_video_urls: string[]
  input_audio_urls: string[]
  output_url?: string
  status: string
}

export default function CreationsTable() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState('')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['creations'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token')
      const res = await fetch(`${API_URL}/api/v1/create`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!res.ok) throw new Error('Failed to fetch creations')
      return res.json()
    },
  })
  const creations: Creation[] = data?.data || []

  const [previewType, setPreviewType] = React.useState<'video' | 'audio'>('video')
  const openPreview = (url: string, type: 'video' | 'audio' = 'video') => {
    setPreviewUrl(url)
    setPreviewType(type)
    setIsOpen(true)
  }

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  return (
    <Container maxW="full">
      <Heading size="md" mb={4}>
        Your Creations
      </Heading>
      <Table.Root size={{ base: 'sm', md: 'md' }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Videos</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Timestamps</Table.ColumnHeader>
            <Table.ColumnHeader>Edited</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {creations.map((c) => (
            <React.Fragment key={c.id}>
              <Table.Row>
                <Table.Cell>{new Date(c.created_at).toLocaleString()}</Table.Cell>
                <Table.Cell>
                  {c.input_video_urls.map((url) => (
                    <IconButton
                      key={url}
                      aria-label="Play video"
                      size="sm"
                      variant="ghost"
                      onClick={() => openPreview(url, 'video')}
                      mr={2}
                    >
                      <FiVideo />
                    </IconButton>
                  ))}
                  {c.input_audio_urls.map((url) => (
                    <IconButton
                      key={url}
                      aria-label="Play audio"
                      size="sm"
                      variant="ghost"
                      onClick={() => openPreview(url, 'audio')}
                    >
                      <FiMusic />
                    </IconButton>
                  ))}
                </Table.Cell>
                <Table.Cell textTransform="capitalize">{c.status}</Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    onClick={() =>
                      setExpandedId(expandedId === c.id ? null : c.id)
                    }
                  >
                    {expandedId === c.id ? 'Hide' : 'Show'}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                {c.output_url ? (
                  <Button size="sm" onClick={() => openPreview(c.output_url!, 'video')}>
                    View
                  </Button>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    N/A
                  </Text>
                )}
              </Table.Cell>
                <Table.Cell>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    aria-label="Delete creation"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          'Are you sure you want to delete this creation? This will remove all videos, audio, and output permanently.'
                        )
                      )
                        return
                      const token = localStorage.getItem('access_token')
                      const res = await fetch(
                        `${API_URL}/api/v1/create/${c.id}`,
                        {
                          method: 'DELETE',
                          headers: token ? { Authorization: `Bearer ${token}` } : {},
                        }
                      )
                      if (res.ok) {
                        refetch()
                      } else {
                        console.error('Failed to delete creation')
                      }
                    }}
                  >
                    <FiTrash />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
              {expandedId === c.id && (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Box p={4} bg="gray.50">
                      {(c.timestamp_data.videos as any[] | undefined)?.map((video: any) => {
                        const candidate = video.timestamps?.candidates?.[0]
                        const rawText = candidate?.content?.parts?.[0]?.text || ''
                        const jsonText = rawText
                          .replace(/^```json\s*/, '')
                          .replace(/```$/, '')
                        let entries: Array<{
                          start: string
                          end: string
                          description: string
                          importance: number
                        }> = []
                        try {
                          entries = JSON.parse(jsonText)
                        } catch {
                          entries = []
                        }
                        return (
                          <Box key={video.key} mb={6}>
                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                              {video.key.split('/').pop()}
                            </Text>
                            <Box as="table" width="100%" borderCollapse="collapse">
                              <Box as="thead" bg="gray.100">
                                <Box as="tr">
                                  <Box as="th" p={2}>Start</Box>
                                  <Box as="th" p={2}>End</Box>
                                  <Box as="th" p={2}>Description</Box>
                                  <Box as="th" p={2}>Importance</Box>
                                </Box>
                              </Box>
                              <Box as="tbody">
                                {entries.map((e, idx) => (
                                  <Box as="tr" key={idx} _even={{ bg: 'gray.50' }}>
                                    <Box as="td" p={2}>{e.start}</Box>
                                    <Box as="td" p={2}>{e.end}</Box>
                                    <Box as="td" p={2}>{e.description}</Box>
                                    <Box as="td" p={2}>{e.importance}</Box>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Table.Cell>
                </Table.Row>
              )}
            </React.Fragment>
          ))}
      </Table.Body>
      </Table.Root>

      <DialogRoot
        size={{ base: 'xs', md: 'lg' }}
        open={isOpen}
        onOpenChange={({ open }) => setIsOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
            {previewType === 'audio' ? 'Preview Audio' : 'Edited Video'}
            </DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            {previewType === 'audio' ? (
              <audio src={previewUrl} controls style={{ width: '100%' }} />
            ) : (
              <video src={previewUrl} controls style={{ width: '100%' }} />
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Container>
  )
}