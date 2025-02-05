"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/ui/icons"

type SubmissionType = "brainstormMap" | "presentationVideo"

export function ProjectSubmission() {
  const [submissionType, setSubmissionType] = useState<SubmissionType>("brainstormMap")
  const [file, setFile] = useState<File | null>(null)
  const [youtubeLink, setYoutubeLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Project Submitted",
      description: `Your ${submissionType === "brainstormMap" ? "Brainstorm Map" : "Presentation Video"} has been submitted successfully.`,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value)
  }

  const handleSubmissionTypeChange = (value: SubmissionType) => {
    setSubmissionType(value)
    setFile(null)
    setYoutubeLink("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Submit Your Project</CardTitle>
        <CardDescription>
          Upload your brainstorm map or provide a YouTube link for your presentation video
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup value={submissionType} onValueChange={handleSubmissionTypeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="brainstormMap" id="brainstormMap" />
              <Label htmlFor="brainstormMap">Brainstorm Map</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="presentationVideo" id="presentationVideo" />
              <Label htmlFor="presentationVideo">Presentation Video</Label>
            </div>
          </RadioGroup>
          {submissionType === "brainstormMap" ? (
            <div className="space-y-2">
              <Label htmlFor="brainstormMap">Upload Brainstorm Map</Label>
              <Input
                id="brainstormMap"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="youtubeLink">Presentation Video (YouTube Link)</Label>
              <Input
                id="youtubeLink"
                type="url"
                value={youtubeLink}
                onChange={handleYoutubeLinkChange}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
          )}
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
              <span className="inline-block transition-transform group-active:scale-95">Submit</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

