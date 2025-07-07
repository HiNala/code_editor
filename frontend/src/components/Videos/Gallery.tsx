import { Box, Image, Input, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"

interface Video {
  id: string // youtube id
  url: string
  title: string
}

interface VideoFormData {
  url: string
}

function parseYouTubeId(url: string): string | null {
  const regex =
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:v\/|watch\?.*v=|embed\/))([\w-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function fetchTitle(url: string): Promise<string> {
  try {
    const resp = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    )
    if (resp.ok) {
      const json = (await resp.json()) as { title: string }
      return json.title
    }
  } catch {
    /* ignore */
  }
  return "Untitled Video"
}

export default function Gallery() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormData>({ defaultValues: { url: "" } })

  const [videos, setVideos] = useState<Video[]>([])

  // load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("cre8able-videos")
    if (raw) {
      try {
        setVideos(JSON.parse(raw))
      } catch {
        /* ignore */
      }
    }
  }, [])

  const saveVideos = (newList: Video[]) => {
    setVideos(newList)
    localStorage.setItem("cre8able-videos", JSON.stringify(newList))
  }

  const onSubmit = async ({ url }: VideoFormData) => {
    const id = parseYouTubeId(url)
    if (!id) return
    const title = await fetchTitle(url)
    const newList = [...videos, { id, url, title }]
    saveVideos(newList)
    reset()
  }

  const removeVideo = (id: string) => {
    const newList = videos.filter((v) => v.id !== id)
    saveVideos(newList)
  }

  return (
    <VStack align="stretch" gap={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          invalid={!!errors.url}
          errorText={errors.url?.message}
          label="Add YouTube Video"
        >
          <InputGroup
            w="100%"
            endElement={
              <Button type="submit" loading={isSubmitting}>
                Add
              </Button>
            }
          >
            <Input
              placeholder="Paste YouTube link"
              {...register("url", {
                required: "URL is required",
                validate: (v) =>
                  parseYouTubeId(v) !== null || "Invalid YouTube URL",
              })}
            />
          </InputGroup>
        </Field>
      </form>

      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={4}
      >
        {videos.map((video) => (
          <Box
            key={video.id}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            position="relative"
            _hover={{ shadow: "md" }}
          >
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                w="100%"
                cursor="pointer"
              />
            </a>
            <Box p={2}>
              <Text
                fontWeight="bold"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {video.title}
              </Text>
              <Button
                size="xs"
                variant="ghost"
                colorPalette="red"
                onClick={() => removeVideo(video.id)}
              >
                Remove
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </VStack>
  )
}
