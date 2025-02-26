import { ShoppingBag } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-center">
            <ShoppingBag className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Loading your shopping experience...</h1>
          <p className="text-muted-foreground">
            We're preparing the best deals and products just for you. This won't take long!
          </p>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded"></div>
          <div className="h-2 bg-muted rounded"></div>
          <div className="h-2 bg-muted rounded"></div>
        </div>
        <div className="flex justify-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-primary animate-bounce"></div>
          <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></div>
          <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
      <footer className="absolute bottom-0 w-full py-4 text-center text-sm text-muted-foreground">
        <p>© 2023 Your E-commerce Store. All rights reserved.</p>
      </footer>
    </div>
  )
}