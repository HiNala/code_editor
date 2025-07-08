import { Box, Button, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatPanelProps {
  threadId: string // unique per card
}

function ChatBubble({ msg }: { msg: Message }) {
  const align = msg.role === "user" ? "flex-end" : "flex-start"
  const bg = msg.role === "user" ? "purple.500" : "gray.200"
  const color = msg.role === "user" ? "white" : "black"
  return (
    <Box maxW="70%" alignSelf={align} bg={bg} color={color} px={3} py={2} borderRadius="md">
      <Text whiteSpace="pre-wrap">{msg.content}</Text>
    </Box>
  )
}

export default function ChatPanel({ threadId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(`chat-${threadId}`)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
          const filtered: Message[] = parsed.filter(
            (m): m is Message =>
              m &&
              typeof m === "object" &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string",
          )
          setMessages(filtered)
        }
      } catch {
        /* ignore */
      }
    }
  }, [threadId])

  // scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const save = (msgs: Message[]) => {
    setMessages(msgs)
    localStorage.setItem(`chat-${threadId}`, JSON.stringify(msgs))
  }

  const send = () => {
    if (!input.trim()) return
    const userMsg: Message = { role: "user", content: input.trim() }
    const newMsgs: Message[] = [...messages, userMsg]
    save(newMsgs)
    setInput("")
    // call backend
    const base = import.meta.env.VITE_API_URL ?? ""
    const url =
      base.endsWith("/api/v1") || base.includes("/api/v1")
        ? `${base}/items/${threadId}/chat`
        : `${base}/api/v1/items/${threadId}/chat`

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
      },
      body: JSON.stringify({ message: input.trim() }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const assistantMsg: Message = { role: "assistant", content: data.assistant }
        save([...newMsgs, assistantMsg])
      })
      .catch(() => {
        const assistantMsg: Message = {
          role: "assistant",
          content: "Sorry, something went wrong.",
        }
        save([...newMsgs, assistantMsg])
      })
  }

  return (
    <Stack h="100%" justify="space-between">
      <Stack overflowY="auto" flex="1" p={2} gap={3}>
        {messages.map((m, i) => (
          <ChatBubble key={i} msg={m} />
        ))}
        <div ref={bottomRef} />
      </Stack>
      <HStack p={2} borderTopWidth="1px">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
        />
        <Button onClick={send} disabled={!input.trim()}>
          Send
        </Button>
      </HStack>
    </Stack>
  )
}
