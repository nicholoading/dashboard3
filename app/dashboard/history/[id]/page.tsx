import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// This would typically come from a database or API
const submissionDetails = [
  { 
    id: 1, 
    bugNumber: 1, 
    submittedBy: "Alice Johnson", 
    submissionDate: "2023-06-15T14:30:00Z",
    status: 'latest',
    codeScreenshot: "/placeholder.svg?height=300&width=400",
    fixDescription: "Fixed the navigation menu disappearing on mobile devices by adjusting the z-index and adding a media query for smaller screens."
  },
  // ... other submissions
]

const colorSchemes = {
  blueGray: {
    latest: 'bg-blue-500 hover:bg-blue-600 text-white',
    overwritten: 'bg-gray-300 hover:bg-gray-400 text-gray-800'
  },
}

const activeColorScheme = colorSchemes.blueGray

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const submission = submissionDetails.find(s => s.id === parseInt(params.id))

  if (!submission) {
    notFound()
  }

  const submissionDate = new Date(submission.submissionDate)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Submission Detail</h1>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bug #{submission.bugNumber}</CardTitle>
            <Badge 
              className={
                submission.status === 'latest' 
                  ? activeColorScheme.latest
                  : activeColorScheme.overwritten
              }
            >
              {submission.status === 'latest' ? 'Latest' : 'Overwritten'}
            </Badge>
          </div>
          <CardDescription>
            Submitted by {submission.submittedBy} on {submissionDate.toLocaleDateString()} at {submissionDate.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Code Screenshot</h3>
            <Image
              src={submission.codeScreenshot}
              alt={`Code screenshot for Bug #${submission.bugNumber}`}
              width={400}
              height={300}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Fix Method Description</h3>
            <p>{submission.fixDescription}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

