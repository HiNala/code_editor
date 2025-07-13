import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "@tanstack/react-router"
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User,
  ChevronDown,
  Sparkles
} from "lucide-react"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"

interface NavItem {
  title: string
  href: string
  description?: string
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    description: "Return to dashboard"
  },
  {
    title: "Studio",
    href: "/studio",
    description: "AI-powered development environment"
  },
  {
    title: "Projects",
    href: "/projects",
    description: "Manage your projects"
  },
  {
    title: "Videos",
    href: "/videos",
    description: "Video content and tutorials"
  }
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm" 
        : "bg-background"
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-200" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                AI Studio
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className="group relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent/50"
                >
                  {item.title}
                  <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-orange-400 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side - Theme Toggle & User Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex hover:bg-accent/50 transition-colors duration-200"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "light" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </motion.div>
              <span className="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hidden md:flex hover:bg-accent/50 transition-colors duration-200">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/api/placeholder/32/32" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2 h-4 w-4">⚙️</span>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <span className="mr-2 h-4 w-4">🚪</span>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="default"
              size="sm"
              className="hidden md:inline-flex bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-accent/50 transition-colors duration-200"
              onClick={toggleMenu}
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-background md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <Link to="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    AI Studio
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200 group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div>
                          <div className="font-medium text-foreground">{item.title}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200 rotate-[-90deg]" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-border/40 space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-start"
                >
                  {theme === "light" ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </Button>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/api/placeholder/40/40" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs text-muted-foreground mt-1">john@example.com</p>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
