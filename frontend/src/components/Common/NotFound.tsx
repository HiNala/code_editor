import React from 'react'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '../ui/button'

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">404</h1>
            <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => window.history.back()}
            className="w-full"
          >
            Go Back
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
