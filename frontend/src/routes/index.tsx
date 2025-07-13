import React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Box } from '@chakra-ui/react'

import { StudioLayout } from '../components/Studio/StudioLayout'
import { useColorModeValue } from '../components/ui/color-mode'
import { isLoggedIn } from "@/hooks/useAuth"

export const Route = createFileRoute('/')({
  component: StudioPage,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

function StudioPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  
  return (
    <Box bg={bgColor} minH="100vh">
      <StudioLayout />
    </Box>
  )
} 