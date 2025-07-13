import { createFileRoute, Link } from '@tanstack/react-router'
import * as React from "react"
import { motion } from "framer-motion"
import { 
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Code
} from "lucide-react"
import { Button } from "../components/ui/button"
import Navbar from "../components/Common/Navbar"

export const Route = createFileRoute('/')({
  component: Home,
})

// Animation variants
const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

// AnimatedGroup component
type PresetType = 'fade' | 'slide' | 'scale' | 'blur' | 'blur-slide'

type AnimatedGroupProps = {
  children: React.ReactNode
  className?: string
  variants?: {
    container?: any
    item?: any
  }
  preset?: PresetType
}

const defaultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const defaultItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const presetVariants: Record<PresetType, { container: any; item: any }> = {
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(4px)' },
      visible: { 
        opacity: 1, 
        filter: 'blur(0px)',
        transition: {
          filter: {
            type: "tween",
            ease: "easeOut",
            duration: 0.3
          }
        }
      },
    },
  },
  'blur-slide': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(4px)', y: 20 },
      visible: { 
        opacity: 1, 
        filter: 'blur(0px)', 
        y: 0,
        transition: {
          filter: {
            type: "tween",
            ease: "easeOut",
            duration: 0.3
          }
        }
      },
    },
  },
}

function AnimatedGroup({
  children,
  className,
  variants,
  preset,
}: AnimatedGroupProps) {
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants }
  const containerVariants = variants?.container || selectedVariants.container
  const itemVariants = variants?.item || selectedVariants.item

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      className="p-6 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-400/20 to-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}

// Shiny Button Component
function ShinyButton({ 
  label = "Get Started", 
  className,
  onClick
}: { 
  label?: string
  className?: string
  onClick?: () => void
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`group relative h-12 px-6 rounded-lg overflow-hidden transition-all duration-500 ${className}`}
    >
      <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-b from-orange-400/60 via-orange-400/20 to-red-500/80">
        <div className="absolute inset-0 bg-background rounded-lg opacity-90" />
      </div>

      <div className="absolute inset-[2px] bg-background rounded-lg opacity-95" />
      <div className="absolute inset-[2px] bg-gradient-to-r from-background via-background/80 to-background rounded-lg opacity-90" />
      <div className="absolute inset-[2px] bg-gradient-to-b from-orange-400/20 via-background to-red-500/10 rounded-lg opacity-80" />

      <div className="relative flex items-center justify-center gap-2">
        <span className="text-base font-medium bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
          {label}
        </span>
        <ArrowRight className="h-4 w-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="absolute inset-[2px] opacity-0 transition-opacity duration-300 bg-gradient-to-r from-background/20 via-orange-400/10 to-background/20 group-hover:opacity-100 rounded-lg" />
    </Button>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20">
          <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,transparent_0%,var(--background)_75%)]"></div>
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.25,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-sm mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Introducing AI Studio v2.0</span>
                </motion.div>

                <h1 className="max-w-4xl mx-auto text-balance text-5xl font-bold md:text-6xl lg:text-7xl mb-6">
                  Build Beautiful Apps with{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    AI Assistance
                  </span>
                </h1>
                
                <p className="max-w-2xl mx-auto text-pretty text-lg text-muted-foreground mb-10">
                  Create stunning interfaces with our AI-powered development environment. 
                  Modern design, seamless workflows, and exceptional performance.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/studio">
                    <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                      <ShinyButton label="Open Studio" />
                    </div>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-[42px] rounded-xl px-5 text-base"
                  >
                    <span className="text-nowrap">Watch Demo</span>
                  </Button>
                </div>
              </AnimatedGroup>
            </div>
          </div>
          
          {/* Hero Image */}
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.5,
                  },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="relative mt-16 overflow-hidden px-2 sm:mt-20">
              <div
                aria-hidden
                className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-2xl shadow-orange-500/10 ring-1 ring-border">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">AI Studio Interface</h3>
                    <p className="text-muted-foreground">Beautiful, intuitive, and powerful</p>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-orange-500/5 via-transparent to-red-500/5 opacity-30"></div>
              </div>
            </div>
          </AnimatedGroup>
        </section>

        {/* Features Section */}
        <section className="bg-background/50 py-20 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <AnimatedGroup preset="blur-slide">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to build modern, responsive web applications with beautiful UI/UX
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                  icon={<Zap className="h-6 w-6 text-orange-500" />}
                  title="Lightning Fast"
                  description="Optimized for speed and performance, ensuring your applications load quickly and run smoothly."
                />
                <FeatureCard 
                  icon={<Shield className="h-6 w-6 text-orange-500" />}
                  title="Secure by Default"
                  description="Built with security best practices to protect your data and your users."
                />
                <FeatureCard 
                  icon={<BarChart3 className="h-6 w-6 text-orange-500" />}
                  title="Analytics Ready"
                  description="Integrated analytics capabilities to help you understand user behavior and optimize your app."
                />
                <FeatureCard 
                  icon={<Code className="h-6 w-6 text-orange-500" />}
                  title="Developer Friendly"
                  description="Clean, well-documented code that makes development a breeze for your team."
                />
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Technology Section */}
        <section className="bg-background py-20 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <AnimatedGroup preset="slide">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Cutting-Edge Technology</h2>
                  <p className="text-muted-foreground mb-8">
                    Our platform leverages the latest advancements in web technology to deliver exceptional experiences. 
                    From responsive designs to AI-powered features, we've got you covered.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/studio">
                      <Button className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                        Explore Technology
                      </Button>
                    </Link>
                    <Button variant="outline" className="rounded-xl">
                      Read Documentation
                    </Button>
                  </div>
                </div>
              </AnimatedGroup>
              
              <motion.div 
                className="relative p-8 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-[20rem] rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
                  
                  {/* Floating Icons */}
                  <div className="relative z-10 flex items-center justify-center gap-8">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-8 h-8 text-orange-500" />
                    </motion.div>
                    <motion.div
                      className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg"
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <Code className="w-6 h-6 text-red-500" />
                    </motion.div>
                    <motion.div
                      className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <Zap className="w-4 h-4 text-orange-400" />
                    </motion.div>
                  </div>
                  
                  {/* Sparkle Effects */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-orange-400 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-foreground py-2">
                  AI-Powered Development
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Leverage the power of AI to accelerate your development workflow and create better products.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-background py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_0%,rgba(251,146,60,0.1)_0%,transparent_50%)]"></div>
          <div className="mx-auto max-w-5xl px-6 text-center">
            <AnimatedGroup preset="blur">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
                Join thousands of developers and companies building amazing products with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/studio">
                  <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                    <ShinyButton label="Start Building Now" className="w-full sm:w-auto" />
                  </div>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-[42px] rounded-xl px-5 text-base"
                >
                  <span className="text-nowrap">Contact Sales</span>
                </Button>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  AI Studio
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building the future of web experiences, one component at a time.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Guides</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} AI Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 