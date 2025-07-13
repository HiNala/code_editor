import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, MessageCircle, Code, Eye, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Route = createFileRoute('/studio')({
  component: StudioDemo,
})

function StudioDemo() {
  const [activeView, setActiveView] = useState<'chat' | 'code' | 'preview'>('chat')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Desktop Layout (1024px+)
  const DesktopLayout = () => (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">AI Studio</h1>
          <span className="text-sm text-muted-foreground">Fully Responsive Design</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent rounded-md">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-80 border-r border-border bg-muted/30 p-4">
          <div className="space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm">Welcome to AI Studio! This is a fully responsive design that works perfectly on all devices.</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm">✨ Mobile-first design with touch optimization</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm">🚀 Desktop: Three-panel layout</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm">📱 Mobile: Single-panel with bottom nav</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code/Preview Area */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveView('code')}
                className={`px-3 py-1 rounded-md text-sm ${activeView === 'code' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <Code className="h-4 w-4 inline mr-1" />
                Code
              </button>
              <button 
                onClick={() => setActiveView('preview')}
                className={`px-3 py-1 rounded-md text-sm ${activeView === 'preview' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <Eye className="h-4 w-4 inline mr-1" />
                Preview
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            {activeView === 'code' ? (
              <div className="h-full bg-muted/30 rounded-lg border p-4">
                <h3 className="font-semibold mb-4">Code Editor</h3>
                <div className="bg-background rounded border p-4 font-mono text-sm">
                  <div className="text-green-600">// Responsive AI Studio</div>
                  <div className="text-blue-600">import React from 'react'</div>
                  <div className="mt-2">export default function App() {`{`}</div>
                  <div className="ml-4">return (</div>
                  <div className="ml-8 text-purple-600">&lt;div className="responsive-design"&gt;</div>
                  <div className="ml-12">Hello World!</div>
                  <div className="ml-8 text-purple-600">&lt;/div&gt;</div>
                  <div className="ml-4">)</div>
                  <div>{`}`}</div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-muted/30 rounded-lg border p-4">
                <h3 className="font-semibold mb-4">Live Preview</h3>
                <div className="bg-background rounded border p-8 text-center">
                  <h1 className="text-2xl font-bold mb-4">Hello World!</h1>
                  <p className="text-muted-foreground">This is a live preview of your responsive application.</p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold">Mobile First</h4>
                      <p className="text-sm text-muted-foreground">Optimized for touch</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold">Tablet Ready</h4>
                      <p className="text-sm text-muted-foreground">Perfect for tablets</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold">Desktop Pro</h4>
                      <p className="text-sm text-muted-foreground">Full feature set</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile Layout (<768px)
  const MobileLayout = () => (
    <div className="h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="h-14 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4">
        <h1 className="font-semibold">AI Studio</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-accent rounded-md"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 overflow-hidden p-4">
        {activeView === 'chat' && (
          <div className="space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm">📱 Mobile-optimized interface</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm">✨ Touch-friendly navigation</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm">🎯 44px minimum touch targets</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'code' && (
          <div className="space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code Editor
            </h2>
            <div className="bg-background rounded border p-4 font-mono text-sm">
              <div className="text-green-600">// Mobile Code Editor</div>
              <div className="text-blue-600">import React from 'react'</div>
              <div className="mt-2">function MobileApp() {`{`}</div>
              <div className="ml-4">return (</div>
              <div className="ml-8 text-purple-600">&lt;div className="mobile-first"&gt;</div>
              <div className="ml-12">Responsive!</div>
              <div className="ml-8 text-purple-600">&lt;/div&gt;</div>
              <div className="ml-4">)</div>
              <div>{`}`}</div>
            </div>
          </div>
        )}

        {activeView === 'preview' && (
          <div className="space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </h2>
            <div className="bg-background rounded border p-6 text-center">
              <h1 className="text-xl font-bold mb-4">Mobile Preview</h1>
              <p className="text-muted-foreground mb-4">Optimized for mobile devices</p>
              <div className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold">Touch Optimized</h4>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold">Fast Loading</h4>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="h-16 border-t border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-around h-full">
          <button
            onClick={() => setActiveView('chat')}
            className={`flex flex-col items-center gap-1 p-2 rounded-md ${activeView === 'chat' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </button>
          <button
            onClick={() => setActiveView('code')}
            className={`flex flex-col items-center gap-1 p-2 rounded-md ${activeView === 'code' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Code className="h-5 w-5" />
            <span className="text-xs">Code</span>
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`flex flex-col items-center gap-1 p-2 rounded-md ${activeView === 'preview' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Eye className="h-5 w-5" />
            <span className="text-xs">Preview</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-xl z-50"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-accent rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full text-left p-3 hover:bg-accent rounded-md flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
      <div className="lg:hidden">
        <MobileLayout />
      </div>
    </>
  )
} 