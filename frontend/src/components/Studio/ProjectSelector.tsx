import React, { useState } from 'react'
import {
  Box,
  Button,
  Text,
  HStack,
  Badge,
  VStack,
  Input,
  Textarea,
} from '@chakra-ui/react'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Field } from '../ui/field'
import { FiFolder, FiPlus } from 'react-icons/fi'
import { useColorModeValue } from '../ui/color-mode'
import { toaster } from '../ui/toaster'

export interface ProjectSelectorProps {
  currentProject: string | null
  onProjectChange: (projectId: string) => void
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  currentProject,
  onProjectChange,
}) => {
  const [projects] = useState([
    {
      id: '1',
      name: 'My First Project',
      description: 'A React component generator',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Dashboard Components',
      description: 'Building dashboard UI components',
      createdAt: new Date('2024-01-02'),
    },
  ])

  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('blue.50', 'blue.900')

  const currentProjectData = projects.find(p => p.id === currentProject)

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toaster.create({
        title: 'Project name required',
        description: 'Please enter a name for your project',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    // Generate a new project ID
    const newProjectId = `project_${Date.now()}`
    
    // TODO: Actually create the project via API
    console.log('Creating project:', {
      name: newProjectName,
      description: newProjectDescription,
    })

    // Select the new project
    onProjectChange(newProjectId)
    
    // Reset form
    setNewProjectName('')
    setNewProjectDescription('')
    setIsOpen(false)

    toaster.create({
      title: 'Project created',
      description: `${newProjectName} has been created`,
      status: 'success',
      duration: 3000,
    })
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <DialogTrigger asChild>
        <Button
          leftIcon={<FiFolder />}
          variant="outline"
          size="sm"
        >
          {currentProjectData ? (
            <HStack spacing={2}>
              <Text>{currentProjectData.name}</Text>
              <Badge size="sm" colorScheme="blue">
                Active
              </Badge>
            </HStack>
          ) : (
            'Select Project'
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select or Create Project</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        
        <DialogBody>
          <VStack spacing={6} align="stretch">
            {/* Existing Projects */}
            <Box>
              <Text fontWeight="medium" mb={3}>
                Existing Projects
              </Text>
              <VStack spacing={2} align="stretch">
                {projects.map((project) => (
                  <Box
                    key={project.id}
                    p={3}
                    borderRadius="md"
                    border="1px"
                    borderColor={borderColor}
                    cursor="pointer"
                    bg={currentProject === project.id ? hoverBg : 'transparent'}
                    _hover={{ bg: hoverBg }}
                    onClick={() => {
                      onProjectChange(project.id)
                      setIsOpen(false)
                    }}
                  >
                    <HStack justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{project.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {project.description}
                        </Text>
                      </VStack>
                      {currentProject === project.id && (
                        <Badge colorScheme="blue" size="sm">
                          Active
                        </Badge>
                      )}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
            
            {/* Create New Project */}
            <Box borderTop="1px" borderColor={borderColor} pt={4}>
              <Text fontWeight="medium" mb={3}>
                Create New Project
              </Text>
              <VStack spacing={4} align="stretch">
                <Field label="Project Name" required>
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateProject()
                      }
                    }}
                  />
                </Field>
                
                <Field label="Description (Optional)">
                  <Textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe your project"
                    rows={3}
                  />
                </Field>
              </VStack>
            </Box>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Button
            colorScheme="blue"
            onClick={handleCreateProject}
            disabled={!newProjectName.trim()}
          >
            Create Project
          </Button>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
} 