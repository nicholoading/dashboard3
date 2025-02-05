import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// This would typically come from a database or API
const submissionDetails = [
  { 
    id: 1, 
    type: 'brainstormMap',
    submittedBy: "Alice Johnson", 
    submissionDate: "2023-06-15T14:30:00Z", 
    status: 'overwritten',
    content: "/placeholder.svg?height=300&width=400",
  },
  { 
    id: 2, 
    type: 'presentationVideo',
    submittedBy: "Bob Smith", 
    submissionDate: "2023-06-16T09:45:00Z", 
    status: 'latest',
    content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
            <CardTitle>{submission.type === 'brainstormMap' ? 'Brainstorm Map' : 'Presentation Video'}</CardTitle>
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
          {submission.type === 'brainstormMap' ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Brainstorm Map</h3>
              <Image
                src={submission.content}
                alt="Brainstorm Map"
                width={400}
                height={300}
                className="rounded-md border"
              />
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">Presentation Video</h3>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${submission.content.split('v=')[1]}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

