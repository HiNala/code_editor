import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { WorkspaceType, ViewType } from '../lib/navigation'

// Types
export type StudioState = 'IDLE' | 'GENERATING' | 'BUILDING' | 'PREVIEW_READY' | 'ERROR'

export type AgentStage = 'interpret' | 'scaffold' | 'unit_test' | 'execute' | 'repair' | 'report'

export interface FileNode {
  id: string
  name: string
  path: string
  content: string
  language: string
  isModified: boolean
  isNew: boolean
}

export interface TestResult {
  file: string
  status: 'pass' | 'fail' | 'pending'
  duration?: number
  error?: string
}

export interface ReasoningStep {
  stage: AgentStage
  timestamp: string
  description: string
  data?: any
}

export interface PluginTool {
  name: string
  description: string
  inputs: string[]
  outputs: string[]
  cost_estimate: number
  enabled: boolean
}

export interface StudioStore {
  // Core state
  state: StudioState
  currentProject: string | null
  
  // Files and editor
  files: Record<string, FileNode>
  currentFileId: string | null
  fileTree: string[]
  
  // Generation state
  isGenerating: boolean
  currentStage: AgentStage | null
  buildProgress: number
  
  // Test-driven features
  skipTests: boolean
  testResults: TestResult[]
  reasoningSteps: ReasoningStep[]
  
  // Plugin system
  availablePlugins: PluginTool[]
  selectedPlugins: string[]
  
  // WebSocket connection
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
  
  // UI state
  showReasoningDrawer: boolean
  showVersionSidebar: boolean
  showPropInspector: boolean
  activeTab: 'preview' | 'code'
  
  // Workspace state (v0.dev style)
  activeWorkspace: WorkspaceType
  activeView: ViewType
  
  // Actions
  setState: (state: StudioState) => void
  setCurrentProject: (projectId: string | null) => void
  
  // File management
  addFile: (file: FileNode) => void
  updateFile: (fileId: string, updates: Partial<FileNode>) => void
  deleteFile: (fileId: string) => void
  setCurrentFile: (fileId: string | null) => void
  
  // Generation
  startGeneration: () => void
  stopGeneration: () => void
  setCurrentStage: (stage: AgentStage | null) => void
  setBuildProgress: (progress: number) => void
  
  // Test-driven features
  setSkipTests: (skip: boolean) => void
  addTestResult: (result: TestResult) => void
  clearTestResults: () => void
  addReasoningStep: (step: ReasoningStep) => void
  clearReasoningSteps: () => void
  
  // Plugin management
  setAvailablePlugins: (plugins: PluginTool[]) => void
  togglePlugin: (pluginName: string) => void
  
  // WebSocket
  setConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected') => void
  
  // UI state
  toggleReasoningDrawer: () => void
  toggleVersionSidebar: () => void
  togglePropInspector: () => void
  setActiveTab: (tab: 'preview' | 'code') => void
  
  // Workspace actions
  setActiveWorkspace: (workspace: WorkspaceType) => void
  setActiveView: (view: ViewType) => void
}

export const useStudioStore = create<StudioStore>()(
  subscribeWithSelector((set) => ({
    // Initial state
    state: 'IDLE',
    currentProject: null,
    
    files: {},
    currentFileId: null,
    fileTree: [],
    
    isGenerating: false,
    currentStage: null,
    buildProgress: 0,
    
    skipTests: false,
    testResults: [],
    reasoningSteps: [],
    
    availablePlugins: [],
    selectedPlugins: [],
    
    connectionStatus: 'disconnected',
    
    showReasoningDrawer: false,
    showVersionSidebar: false,
    showPropInspector: false,
    activeTab: 'preview',
    
    // Workspace state
    activeWorkspace: 'chat',
    activeView: 'preview',
    
    // Actions
    setState: (state) => set({ state }),
    setCurrentProject: (projectId) => set({ currentProject: projectId }),
    
    // File management
    addFile: (file) => 
      set((state) => ({
        files: { ...state.files, [file.id]: file },
        fileTree: [...state.fileTree, file.id],
        currentFileId: file.id
      })),
    
    updateFile: (fileId, updates) =>
      set((state) => ({
        files: {
          ...state.files,
          [fileId]: { ...state.files[fileId], ...updates, isModified: true }
        }
      })),
    
    deleteFile: (fileId) =>
      set((state) => {
        const newFiles = { ...state.files }
        delete newFiles[fileId]
        const newFileTree = state.fileTree.filter(id => id !== fileId)
        const newCurrentFileId = state.currentFileId === fileId 
          ? (newFileTree.length > 0 ? newFileTree[0] : null)
          : state.currentFileId
        
        return {
          files: newFiles,
          fileTree: newFileTree,
          currentFileId: newCurrentFileId
        }
      }),
    
    setCurrentFile: (fileId) => set({ currentFileId: fileId }),
    
    // Generation
    startGeneration: () => set({ 
      isGenerating: true, 
      state: 'GENERATING',
      buildProgress: 0,
      testResults: [],
      reasoningSteps: []
    }),
    
    stopGeneration: () => set({ 
      isGenerating: false, 
      currentStage: null,
      buildProgress: 0
    }),
    
    setCurrentStage: (stage) => set({ currentStage: stage }),
    setBuildProgress: (progress) => set({ buildProgress: progress }),
    
    // Test-driven features
    setSkipTests: (skip) => set({ skipTests: skip }),
    
    addTestResult: (result) =>
      set((state) => ({
        testResults: [...state.testResults, result]
      })),
    
    clearTestResults: () => set({ testResults: [] }),
    
    addReasoningStep: (step) =>
      set((state) => ({
        reasoningSteps: [...state.reasoningSteps, step]
      })),
    
    clearReasoningSteps: () => set({ reasoningSteps: [] }),
    
    // Plugin management
    setAvailablePlugins: (plugins) => set({ availablePlugins: plugins }),
    
    togglePlugin: (pluginName) =>
      set((state) => ({
        selectedPlugins: state.selectedPlugins.includes(pluginName)
          ? state.selectedPlugins.filter(name => name !== pluginName)
          : [...state.selectedPlugins, pluginName]
      })),
    
    // WebSocket
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    
    // UI state
    toggleReasoningDrawer: () => 
      set((state) => ({ showReasoningDrawer: !state.showReasoningDrawer })),
    
    toggleVersionSidebar: () => 
      set((state) => ({ showVersionSidebar: !state.showVersionSidebar })),
    
    togglePropInspector: () => 
      set((state) => ({ showPropInspector: !state.showPropInspector })),
    
    setActiveTab: (tab) => set({ activeTab: tab }),
    
    // Workspace actions
    setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
    setActiveView: (view) => set({ activeView: view }),
  }))
)

// Selectors for performance
export const useStudioState = () => useStudioStore((state) => state.state)
export const useCurrentFile = () => useStudioStore((state) => 
  state.currentFileId ? state.files[state.currentFileId] : null
)
export const useGenerationState = () => useStudioStore((state) => ({
  isGenerating: state.isGenerating,
  currentStage: state.currentStage,
  buildProgress: state.buildProgress
}))
export const useTestResults = () => useStudioStore((state) => state.testResults)
export const useReasoningSteps = () => useStudioStore((state) => state.reasoningSteps)
export const useConnectionStatus = () => useStudioStore((state) => state.connectionStatus) 