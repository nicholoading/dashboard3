import { EnhancementSubmission } from '@/components/enhancement-submission'

export default function EnhancementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Enhancement Suggestions</h1>
      <p className="text-lg text-gray-700">Help us improve the competition platform by suggesting enhancements or new features.</p>
      <EnhancementSubmission />
    </div>
  )
}

