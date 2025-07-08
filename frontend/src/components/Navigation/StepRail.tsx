import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { tokens, gradients } from "../../theme/tokens"
import { useColorModeValue } from "../ui/color-mode"

interface Step {
  id: string
  label: string
  path: string
  description: string
  gradient: string
  isActive: boolean
  isComplete: boolean
}

export function StepRail() {
  const navigate = useNavigate()
  const router = useRouter()
  const currentPath = router.state.location.pathname
  
  // Theme colors
  const textColor = useColorModeValue("gray.900", "white")
  const mutedTextColor = useColorModeValue("gray.600", "gray.400")
  
  // Define the workflow steps
  const steps: Step[] = [
    {
      id: "plan",
      label: "PLAN",
      path: "/plan",
      description: "Organize your ideas",
      gradient: gradients.plan,
      isActive: currentPath === "/plan",
      isComplete: true, // Always available
    },
    {
      id: "create",
      label: "CREATE",
      path: "/create",
      description: "Bring ideas to life",
      gradient: gradients.sunset,
      isActive: currentPath === "/create",
      isComplete: true,
    },
    {
      id: "publish",
      label: "PUBLISH",
      path: "/publish",
      description: "Share with the world",
      gradient: gradients.publish,
      isActive: currentPath === "/publish",
      isComplete: true, // Enable when ready
    },
  ]

  const handleStepClick = (step: Step) => {
    if (step.isComplete) {
      navigate({ to: step.path })
    }
  }

  return (
    <Box w="full" py={8}>
      {/* Main Project Label */}
      <Box textAlign="center" mb={12}>
        <Text
          fontSize="xl"
          fontWeight={tokens.typography.fontWeights.medium}
          color={mutedTextColor}
          mb={2}
        >
          PROJECT
        </Text>
        
        {/* Step Navigation */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          gap={4}
          maxW="800px"
          mx="auto"
        >
          {steps.map((step, index) => (
            <Flex key={step.id} align="center" gap={4}>
              {/* Step Button */}
              <Button
                onClick={() => handleStepClick(step)}
                cursor={step.isComplete ? "pointer" : "not-allowed"}
                background={step.isActive ? step.gradient : "transparent"}
                color={step.isActive ? "white" : textColor}
                border={step.isActive ? "none" : `2px solid ${tokens.colors.charcoal300}`}
                borderRadius={tokens.radius.pill}
                px={8}
                py={6}
                minH="60px"
                fontSize={tokens.typography.fontSizes.bodyLg}
                fontWeight={tokens.typography.fontWeights.bold}
                letterSpacing="0.1em"
                transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
                boxShadow={step.isActive ? tokens.shadows.gradient : "none"}
                _hover={step.isComplete ? {
                  transform: "translateY(-2px)",
                  boxShadow: step.isActive ? tokens.shadows.xl : tokens.shadows.md,
                  ...(step.isActive ? {} : {
                    background: `linear-gradient(135deg, ${step.gradient}20, ${step.gradient}10)`,
                    borderColor: step.gradient.split(",")[0].split("(")[1],
                  })
                } : {}}
                _active={step.isComplete ? {
                  transform: "translateY(0)",
                } : {}}
                _disabled={{
                  opacity: 0.5,
                  cursor: "not-allowed",
                }}
                disabled={!step.isComplete}
              >
                {step.label}
              </Button>
              
              {/* Arrow connector (except for last item) */}
              {index < steps.length - 1 && (
                <Box
                  display={{ base: "none", md: "block" }}
                  w="40px"
                  h="2px"
                  bg={tokens.colors.charcoal300}
                  position="relative"
                  _after={{
                    content: "''",
                    position: "absolute",
                    right: "-6px",
                    top: "-4px",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid",
                    borderLeftColor: tokens.colors.charcoal300,
                    borderTop: "4px solid transparent",
                    borderBottom: "4px solid transparent",
                  }}
                />
              )}
            </Flex>
          ))}
        </Flex>
        
        {/* Active Step Description */}
        {steps.find(step => step.isActive) && (
          <Text
            mt={6}
            fontSize={tokens.typography.fontSizes.bodyLg}
            color={mutedTextColor}
            fontWeight={tokens.typography.fontWeights.medium}
          >
            {steps.find(step => step.isActive)?.description}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default StepRail 