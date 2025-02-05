import { ProjectSubmission } from '@/components/project-submission'

export default function SubmissionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Project Submission</h1>
      <p className="text-lg text-gray-700">Submit your project by uploading a presentation video or a brainstorm map.</p>
      <ProjectSubmission />
    </div>
  )
}

