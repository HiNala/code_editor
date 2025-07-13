import React, { useState } from "react"
import { 
  User, 
  Settings, 
  CreditCard, 
  Key, 
  Folder, 
  HelpCircle, 
  FileText, 
  LogOut,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

interface UserDropdownProps {
  className?: string
}

// Mock user data - in real app this would come from auth context
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: null,
  plan: "Pro"
}

export function UserDropdown({ className }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    // TODO: Implement theme switching
    console.log("Theme changed to:", newTheme)
  }

  const handleMenuAction = (action: string) => {
    console.log("Menu action:", action)
    setIsOpen(false)
    // TODO: Implement modal opening logic
  }

  const handleSignOut = () => {
    console.log("Sign out")
    // TODO: Implement sign out
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="relative h-8 w-8 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
          {mockUser.avatar ? (
            <img 
              src={mockUser.avatar} 
              alt={mockUser.name}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            getInitials(mockUser.name)
          )}
        </div>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 p-0 overflow-hidden">
            {/* User Info Section */}
            <div className="flex items-center space-x-3 p-4 border-b border-border">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {mockUser.avatar ? (
                  <img 
                    src={mockUser.avatar} 
                    alt={mockUser.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  getInitials(mockUser.name)
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground">{mockUser.email}</p>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary w-fit">
                  {mockUser.plan} Plan
                </div>
              </div>
            </div>
            
            {/* Quick Settings */}
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                Preferences
              </div>
              
              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-2 py-2 hover:bg-accent rounded-md">
                <span className="text-sm">Theme</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant={theme === 'light' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleThemeChange('system')}
                  >
                    <Monitor className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border" />
            
            {/* Account Actions */}
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                Account
              </div>
              
              <button
                className="flex items-center w-full px-2 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => handleMenuAction('api-keys')}
              >
                <Key className="mr-3 h-4 w-4" />
                API Keys
              </button>
              
              <button
                className="flex items-center w-full px-2 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => handleMenuAction('billing')}
              >
                <CreditCard className="mr-3 h-4 w-4" />
                Billing & Usage
              </button>
              
              <button
                className="flex items-center w-full px-2 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => handleMenuAction('projects')}
              >
                <Folder className="mr-3 h-4 w-4" />
                All Projects
              </button>
            </div>
            
            <div className="border-t border-border" />
            
            {/* Support & Actions */}
            <div className="p-2">
              <button
                className="flex items-center w-full px-2 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => handleMenuAction('help')}
              >
                <HelpCircle className="mr-3 h-4 w-4" />
                Help & Support
              </button>
              
              <button
                className="flex items-center w-full px-2 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => handleMenuAction('docs')}
              >
                <FileText className="mr-3 h-4 w-4" />
                Documentation
              </button>
            </div>
            
            <div className="border-t border-border" />
            
            <div className="p-2">
              <button
                className="flex items-center w-full px-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 