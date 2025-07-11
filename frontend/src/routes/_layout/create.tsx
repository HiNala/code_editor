import React from "react"
import {
  Container,
  Heading,
  Text,
  Box,
  Flex,
  Icon,
  Input,
} from "@chakra-ui/react"
import { FiUpload, FiCpu, FiFilm, FiPlayCircle } from "react-icons/fi"
import { Field } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/create")({
  component: CreatePage,
})

function CreatePage() {
  const [videoFiles, setVideoFiles] = React.useState<File[]>([])
  const [audioFiles, setAudioFiles] = React.useState<File[]>([])
  const [creation, setCreation] = React.useState<any>(null)
  const [isLoading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  // legacy creation list removed in favor of Videos page

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("access_token") || undefined
      // 1️⃣ Create a new creation record
      const createResp = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/create`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      )
      if (!createResp.ok) throw new Error(await createResp.text())
      const created = await createResp.json()
      setCreation(created)

      // 2️⃣ Upload media files to S3 via our new endpoint
      const form = new FormData()
      videoFiles.forEach((f) => form.append("video_files", f))
      audioFiles.forEach((f) => form.append("audio_files", f))
      const uploadResp = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/create/${created.id}/media`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form,
        },
      )
      if (!uploadResp.ok) throw new Error(await uploadResp.text())
      setCreation(await uploadResp.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Container maxW="full" py={8}>
      <Heading size="lg">Creation Studio</Heading>
      <Box mb={6} color="gray.600">
        <Flex align="center" mb={2}>
          <Icon as={FiUpload} color="blue.500" mr={2} />
          <Text>Upload your videos and optional audio tracks</Text>
        </Flex>
        <Flex align="center" mb={2}>
          <Icon as={FiCpu} color="purple.500" mr={2} />
          <Text>Let Gemini AI analyze each clip and generate smart timestamps</Text>
        </Flex>
        <Flex align="center" mb={2}>
          <Icon as={FiFilm} color="orange.500" mr={2} />
          <Text>Stitch everything together via FFmpeg into your final edited video</Text>
        </Flex>
        <Flex align="center">
          <Icon as={FiPlayCircle} color="green.500" mr={2} />
          <Text>
            Hit “Start Processing,” then check the <strong>Videos</strong> page to monitor progress and preview the results
          </Text>
        </Flex>
      </Box>

      <Box as="form" mt={6} onSubmit={handleSubmit}>
        <Field label="Video files" required>
          <Input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => setVideoFiles(Array.from(e.target.files || []))}
          />
        </Field>
        <Field label="Music / Audio" mt={4}>
          <Input
            type="file"
            accept="audio/*"
            multiple
            onChange={(e) => setAudioFiles(Array.from(e.target.files || []))}
          />
        </Field>
        <Button mt={4} type="submit" loading={isLoading}>
          Start Processing
        </Button>
      </Box>

      {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}

      {creation && (
        <Box mt={6}>
          <Heading size="md">Status: {creation.status}</Heading>
          {creation.output_url && (
            <Box mt={4}>
              <Heading size="sm">Result Video</Heading>
              <video
                src={creation.output_url}
                controls
                style={{ maxWidth: "100%", marginTop: 8 }}
              />
            </Box>
          )}
        </Box>
      )}
      {/* Previous Creations table removed: replaced by Videos page */}
    </Container>
  )
}

export default CreatePage
