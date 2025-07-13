import { useState, useEffect, useRef, useCallback } from 'react'

export interface WebSocketMessage {
  type: string
  [key: string]: any
}

export interface UseWebSocketReturn {
  sendMessage: (message: WebSocketMessage) => void
  lastMessage: MessageEvent | null
  connectionStatus: 'Connecting' | 'Connected' | 'Disconnected'
  connect: () => void
  disconnect: () => void
}

export const useWebSocket = (url: string | null): UseWebSocketReturn => {
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Connected' | 'Disconnected'>('Disconnected')
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const ws = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    if (!url) return
    
    if (ws.current?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionStatus('Connecting')
    
    // Add token to WebSocket URL for authentication
    const token = localStorage.getItem('access_token')
    const wsUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url
    
    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => {
      setConnectionStatus('Connected')
    }

    ws.current.onmessage = (event: MessageEvent) => {
      setLastMessage(event)
    }

    ws.current.onclose = () => {
      setConnectionStatus('Disconnected')
    }

    ws.current.onerror = (error: Event) => {
      console.error('WebSocket error:', error)
      setConnectionStatus('Disconnected')
    }
  }, [url])

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close()
      ws.current = null
    }
    setConnectionStatus('Disconnected')
  }, [])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }, [])

  useEffect(() => {
    if (url) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [url, connect, disconnect])

  return {
    sendMessage,
    lastMessage,
    connectionStatus,
    connect,
    disconnect,
  }
} 