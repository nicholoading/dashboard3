"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    toast({
      title: "Login Successful",
      description: "Welcome back to the dashboard!",
      duration: 3000,
    })
    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              className="w-full group"
              type="submit"
              disabled={isLoading}
              onClick={(e) => {
                if (!isLoading) {
                  const button = e.currentTarget
                  button.classList.add("animate-button-pop")
                  button.addEventListener(
                    "animationend",
                    () => {
                      button.classList.remove("animate-button-pop")
                    },
                    { once: true },
                  )
                }
              }}
            >
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <span className="inline-block transition-transform group-active:scale-95">Sign In</span>
              )}
            </Button>
          </form>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-6">
            <div className="text-sm text-muted-foreground">
              <span className="mr-1 hidden sm:inline-block">Don&apos;t have an account?</span>
              <Button variant="link" className="p-0 text-primary">
                Register your team
              </Button>
            </div>
            <Button variant="link" className="p-0 text-primary">
              Forgot password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

