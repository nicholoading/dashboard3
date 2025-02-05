"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/ui/icons"

type EnhancementType = "advanced" | "basic"

export function EnhancementSubmission() {
  const [enhancementType, setEnhancementType] = useState<EnhancementType>("basic")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Enhancement Submitted",
      description: `Your ${enhancementType} enhancement "${description}" has been submitted successfully.`,
    })
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setScreenshot(selectedFile)
  }

  const handleEnhancementTypeChange = (value: EnhancementType) => {
    setEnhancementType(value)
    setScreenshot(null)
    setDescription("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Submit Enhancement</CardTitle>
        <CardDescription>Choose the enhancement type and upload a screenshot of your code</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup value={enhancementType} onValueChange={handleEnhancementTypeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="basic" />
              <Label htmlFor="basic">Basic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced">Advanced</Label>
            </div>
          </RadioGroup>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe your enhancement..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="screenshot">Code Screenshot</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
              ref={fileInputRef}
              required
            />
          </div>
          <Button
            type="submit"
            className="group"
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
              <span className="inline-block transition-transform group-active:scale-95">Submit Enhancement</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

