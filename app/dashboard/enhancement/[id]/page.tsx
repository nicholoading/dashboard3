import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// This would typically come from a database or API
const enhancementDetails = [
  { 
    id: 1, 
    type: 'advanced',
    submittedBy: "Alice Johnson", 
    submissionDate: "2023-06-15T14:30:00Z", 
    status: 'success',
    screenshot: "/placeholder.svg?height=300&width=400",
  },
  { 
    id: 2, 
    type: 'basic',
    submittedBy: "Bob Smith", 
    submissionDate: "2023-06-16T09:45:00Z", 
    status: 'failed',
    screenshot: "/placeholder.svg?height=300&width=400",
  },
  // ... other submissions
]

const colorSchemes = {
  status: {
    success: 'bg-green-500 hover:bg-green-600 text-white',
    failed: 'bg-red-500 hover:bg-red-600 text-white'
  },
}

export default function EnhancementDetailPage({ params }: { params: { id: string } }) {
  const enhancement = enhancementDetails.find(e => e.id === parseInt(params.id))

  if (!enhancement) {
    notFound()
  }

  const submissionDate = new Date(enhancement.submissionDate)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Enhancement Submission Detail</h1>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="capitalize">{enhancement.type} Enhancement</CardTitle>
            <Badge 
              className={colorSchemes.status[enhancement.status]}
            >
              {enhancement.status.charAt(0).toUpperCase() + enhancement.status.slice(1)}
            </Badge>
          </div>
          <CardDescription>
            Submitted by {enhancement.submittedBy} on {submissionDate.toLocaleDateString()} at {submissionDate.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Code Screenshot</h3>
            <Image
              src={enhancement.screenshot}
              alt="Code Screenshot"
              width={400}
              height={300}
              className="rounded-md border"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

