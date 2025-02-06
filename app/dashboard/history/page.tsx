import { BugSubmissionHistory } from "@/components/bug-submission-history";
import { EnhancementHistory } from "@/components/enhancement-history";
import { SubmissionHistory } from "@/components/submission-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Submission History</h1>

      <Tabs defaultValue="bugs" className="w-full">
        <TabsList>
          <TabsTrigger value="bugs">Bugs</TabsTrigger>
          <TabsTrigger value="enhancements">Enhancements</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        {/* ✅ Bug Submission History */}
        <TabsContent value="bugs">
          <BugSubmissionHistory />
        </TabsContent>

        {/* ✅ Enhancements Submission History */}
        <TabsContent value="enhancements">
          <EnhancementHistory />
        </TabsContent>

        {/* ✅ Project Submission History */}
        <TabsContent value="submissions">
          <SubmissionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
