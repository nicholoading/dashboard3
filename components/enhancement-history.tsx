import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type EnhancementSubmission = {
  id: number
  type: "advanced" | "basic"
  submittedBy: string
  submissionDate: string
  status: "success" | "failed"
}

const enhancementSubmissions: EnhancementSubmission[] = [
  { id: 1, type: "advanced", submittedBy: "Alice Johnson", submissionDate: "2023-06-15T14:30:00Z", status: "success" },
  { id: 2, type: "basic", submittedBy: "Bob Smith", submissionDate: "2023-06-16T09:45:00Z", status: "failed" },
  { id: 3, type: "advanced", submittedBy: "Charlie Brown", submissionDate: "2023-06-17T11:20:00Z", status: "success" },
]

const colorSchemes = {
  status: {
    success: "bg-green-500 hover:bg-green-600 text-white",
    failed: "bg-red-500 hover:bg-red-600 text-white",
  },
}

export function EnhancementHistory() {
  return (
    <Table>
      <TableCaption>A list of recent enhancement submissions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Submission Date & Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enhancementSubmissions.map((submission) => {
          const submissionDate = new Date(submission.submissionDate)
          return (
            <TableRow key={submission.id} className="cursor-pointer hover:bg-gray-100">
              <TableCell>
                <Link href={`/dashboard/enhancement/${submission.id}`} className="block w-full">
                  <span className="capitalize">{submission.type}</span>
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/enhancement/${submission.id}`} className="block w-full">
                  {submission.submittedBy}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/enhancement/${submission.id}`} className="block w-full">
                  {submissionDate.toLocaleDateString()} {submissionDate.toLocaleTimeString()}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/enhancement/${submission.id}`} className="block w-full">
                  <Badge className={colorSchemes.status[submission.status]}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
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

