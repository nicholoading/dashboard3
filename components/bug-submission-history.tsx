"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";

interface BugSubmission {
  id: string;
  teamName: string;
  author: string;
  bug_number: number;
  description: string;
  timestamp: string;
  screenshot_url: string;
}

export function BugSubmissionHistory() {
  const [submissions, setSubmissions] = useState<BugSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBug, setSelectedBug] = useState<BugSubmission | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [deleteBugId, setDeleteBugId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUserTeam = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Could not fetch user data:", error);
        return;
      }

      // ✅ Fetch the logged-in user's team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("teamName")
        .or(`"teacherEmail".eq.${user.email}, "teamMember1ParentEmail".eq.${user.email}, "teamMember2ParentEmail".eq.${user.email}, "teamMember3ParentEmail".eq.${user.email}`)
        .single();

      if (teamError) {
        console.error("Could not find the user's team:", teamError);
      } else {
        setTeamName(teamData.teamName);
        fetchSubmissions(teamData.teamName); // Fetch bugs only for this team
      }
    };

    fetchUserTeam();
  }, []);

  const fetchSubmissions = async (userTeam: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bugs")
      .select("id, teamName, author, bug_number, description, timestamp, screenshot_url")
      .eq("teamName", userTeam) // ✅ Only fetch bugs from the user's team
      .order("timestamp", { ascending: false });

    if (error) console.error("Error fetching submissions:", error);
    else setSubmissions(data || []);

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteBugId) return;

    setDeleteLoading(true);
    const { error } = await supabase.from("bugs").delete().eq("id", deleteBugId);
    if (error) {
      console.error("Error deleting submission:", error);
    } else {
      setSubmissions(submissions.filter((bug) => bug.id !== deleteBugId)); // ✅ Remove from UI
      setDeleteBugId(null);
    }
    setDeleteLoading(false);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-500">Loading bug submissions...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500">No bug submissions for your team yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bug #</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>#{submission.bug_number}</TableCell>
                  <TableCell>{submission.teamName}</TableCell>
                  <TableCell>{submission.author}</TableCell>
                  <TableCell>{format(new Date(submission.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }), "PPpp")
                }</TableCell>
                  <TableCell className="flex gap-2">
                    {/* ✅ View Details Icon */}
                    <Button size="icon" variant="ghost" onClick={() => setSelectedBug(submission)}>
                      <Eye className="h-5 w-5 text-blue-500" />
                    </Button>

                    {/* ✅ Delete Icon */}
                    <Button size="icon" variant="ghost" onClick={() => setDeleteBugId(submission.id)}>
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ✅ Dialog for Viewing Details */}
      <Dialog open={!!selectedBug} onOpenChange={() => setSelectedBug(null)}>
        {selectedBug && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bug #{selectedBug.bug_number} Details</DialogTitle>
            </DialogHeader>
            <p><strong>Team:</strong> {selectedBug.teamName}</p>
            <p><strong>Author:</strong> {selectedBug.author}</p>
            <p><strong>Date:</strong> {format(new Date(selectedBug.timestamp), "PPpp")}</p>
            <p className="mt-2">{selectedBug.description}</p>
            {selectedBug.screenshot_url && (
              <a href={selectedBug.screenshot_url} target="_blank" rel="noopener noreferrer">
                <img src={selectedBug.screenshot_url} alt="Screenshot" className="mt-2 rounded-lg w-full h-48 object-cover" />
              </a>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* ✅ Confirmation Dialog for Deletion */}
      <Dialog open={!!deleteBugId} onOpenChange={() => setDeleteBugId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this bug submission? This action cannot be undone.</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteBugId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
