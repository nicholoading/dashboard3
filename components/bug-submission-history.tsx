import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type BugSubmission = {
  id: number
  bugNumber: number
  submittedBy: string
  submissionDate: string
  status: "latest" | "overwritten"
}

const bugSubmissions: BugSubmission[] = [
  { id: 1, bugNumber: 1, submittedBy: "Alice Johnson", submissionDate: "2023-06-15T14:30:00Z", status: "latest" },
  { id: 2, bugNumber: 2, submittedBy: "Bob Smith", submissionDate: "2023-06-16T09:45:00Z", status: "overwritten" },
  { id: 3, bugNumber: 1, submittedBy: "Charlie Brown", submissionDate: "2023-06-17T11:20:00Z", status: "overwritten" },
  { id: 4, bugNumber: 3, submittedBy: "Diana Prince", submissionDate: "2023-06-18T16:55:00Z", status: "latest" },
  { id: 5, bugNumber: 2, submittedBy: "Ethan Hunt", submissionDate: "2023-06-19T08:10:00Z", status: "latest" },
]

const colorSchemes = {
  blueGray: {
    latest: "bg-blue-500 hover:bg-blue-600 text-white",
    overwritten: "bg-gray-300 hover:bg-gray-400 text-gray-800",
  },
}

const activeColorScheme = colorSchemes.blueGray

export function BugSubmissionHistory() {
  return (
    <Table>
      <TableCaption>A list of recent bug fix submissions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Bug #</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Submission Date & Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bugSubmissions.map((submission) => {
          const submissionDate = new Date(submission.submissionDate)
          return (
            <TableRow key={submission.id} className="cursor-pointer hover:bg-gray-100">
              <TableCell>
                <Link href={`/dashboard/bugs/${submission.bugNumber}`} className="block w-full">
                  Bug #{submission.bugNumber}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/bugs/${submission.bugNumber}`} className="block w-full">
                  {submission.submittedBy}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/bugs/${submission.bugNumber}`} className="block w-full">
                  {submissionDate.toLocaleDateString()} {submissionDate.toLocaleTimeString()}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/bugs/${submission.bugNumber}`} className="block w-full">
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

