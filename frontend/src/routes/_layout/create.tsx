import React from "react"
import {
  Container,
  Heading,
  Text,
  Box,
  Input,
  Spinner,
  Table,
} from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/create")({
  component: CreatePage,
})

function CreatePage() {
  const [url, setUrl] = React.useState("")
  const [result, setResult] = React.useState<any>(null)
  const [isLoading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [creationsList, setCreationsList] = React.useState<any[]>([])
  const [loadingList, setLoadingList] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("access_token")
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ youtube_url: url }),
        },
      )
      if (!resp.ok) throw new Error(await resp.text())
      setResult(await resp.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    setLoadingList(true)
    const token = localStorage.getItem("access_token")
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/create`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((json) => setCreationsList(json.data || []))
      .catch(() => {})
      .finally(() => setLoadingList(false))
  }, [])

  const parsedEntries = React.useMemo(() => {
    if (!result) return []
    const text = result.timestamp_data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const match = text.match(/```json\n([\s\S]*?)```/)
    const jsonStr = match ? match[1] : text
    try {
      return JSON.parse(jsonStr)
    } catch {
      return []
    }
  }, [result])

  return (
    <Container maxW="full" py={8}>
      <Heading size="lg">Creation Studio</Heading>

      <Box as="form" mt={6} onSubmit={handleSubmit}>
        <Field label="YouTube URL" required>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
        <Button mt={4} type="submit" loading={isLoading}>
          Generate Timestamps
        </Button>
      </Box>

      {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}

      {result && (
        <Box mt={6}>
          <Heading size="md">Timestamps</Heading>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Start</Table.ColumnHeader>
                <Table.ColumnHeader>End</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
                <Table.ColumnHeader>Importance</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {parsedEntries.map((e: any, i: number) => (
                <Table.Row key={i}>
                  <Table.Cell>{e.start}</Table.Cell>
                  <Table.Cell>{e.end}</Table.Cell>
                  <Table.Cell>{e.description}</Table.Cell>
                  <Table.Cell>{e.importance}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
      <Box mt={8}>
        <Heading size="md">Previous Creations</Heading>
        {loadingList ? (
          <Spinner mt={4} />
        ) : (
          <Table.Root mt={4}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>YouTube URL</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {creationsList.map((c: any) => (
                <Table.Row key={c.id}>
                  <Table.Cell>
                    {new Date(c.created_at).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{c.youtube_url}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Container>
  )
}

export default CreatePage
