"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Image from 'next/image'

export function BugSubmission({ bugNumber }: { bugNumber: number }) {
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [method, setMethod] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the submission, perhaps sending to an API
    toast({
      title: "Submission Received",
      description: "Your bug fix has been submitted for review.",
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Bug #{bugNumber} Description</CardTitle>
          <CardDescription>Review the bug details before submitting your fix</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>This bug causes the navigation menu to disappear on mobile devices.</p>
            <div className="space-y-2">
              <p className="font-medium">Bug Screenshot:</p>
              <Image 
                src="/placeholder.svg?height=300&width=400" 
                alt={`Bug ${bugNumber} screenshot`}
                width={400}
                height={300}
                className="rounded-md"
              />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Expected Behavior:</p>
              <Image 
                src="/placeholder.svg?height=300&width=400" 
                alt="Expected behavior screenshot"
                width={400}
                height={300}
                className="rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Submit Your Fix</CardTitle>
          <CardDescription>Upload your code and describe your method</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="screenshot">Code Screenshot</Label>
              <Input 
                id="screenshot" 
                type="file" 
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Fix Method Description</Label>
              <Textarea 
                id="method"
                placeholder="Describe how you fixed the bug..."
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Submit Fix</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

