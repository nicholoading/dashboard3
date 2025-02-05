import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type ProjectSubmission = {
  id: number
  type: "brainstormMap" | "presentationVideo"
  submittedBy: string
  submissionDate: string
  status: "latest" | "overwritten"
}

const projectSubmissions: ProjectSubmission[] = [
  {
    id: 1,
    type: "brainstormMap",
    submittedBy: "Alice Johnson",
    submissionDate: "2023-06-15T14:30:00Z",
    status: "overwritten",
  },
  {
    id: 2,
    type: "presentationVideo",
    submittedBy: "Bob Smith",
    submissionDate: "2023-06-16T09:45:00Z",
    status: "latest",
  },
  {
    id: 3,
    type: "brainstormMap",
    submittedBy: "Charlie Brown",
    submissionDate: "2023-06-17T11:20:00Z",
    status: "latest",
  },
]

const colorSchemes = {
  blueGray: {
    latest: "bg-blue-500 hover:bg-blue-600 text-white",
    overwritten: "bg-gray-300 hover:bg-gray-400 text-gray-800",
  },
}

const activeColorScheme = colorSchemes.blueGray

export function SubmissionHistory() {
  return (
    <Table>
      <TableCaption>A list of your project submissions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Submission Date & Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectSubmissions.map((submission) => {
          const submissionDate = new Date(submission.submissionDate)
          return (
            <TableRow key={submission.id} className="cursor-pointer hover:bg-gray-100">
              <TableCell>
                <Link href={`/dashboard/submission/${submission.id}`} className="block w-full">
                  {submission.type === "brainstormMap" ? "Brainstorm Map" : "Presentation Video"}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/submission/${submission.id}`} className="block w-full">
                  {submission.submittedBy}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/submission/${submission.id}`} className="block w-full">
                  {submissionDate.toLocaleDateString()} {submissionDate.toLocaleTimeString()}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/submission/${submission.id}`} className="block w-full">
                  <Badge
                    className={
                      submission.status === "latest" ? activeColorScheme.latest : activeColorScheme.overwritten
                    }
                  >
                    {submission.status === "latest" ? "Latest" : "Overwritten"}
                  </Badge>
                </Link>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

