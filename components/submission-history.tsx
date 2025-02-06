"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";

interface Submission {
  id: string;
  teamName: string;
  author: string;
  submission_type: string;
  timestamp: string;
  file_url: string;
}

export function SubmissionHistory() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [deleteSubmissionId, setDeleteSubmissionId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [teamName, setTeamName] = useState<string | null>(null);

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
        fetchSubmissions(teamData.teamName);
      }
    };

    fetchUserTeam();
  }, []);

  const fetchSubmissions = async (userTeam: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("id, teamName, author, submission_type, timestamp, file_url")
      .eq("teamName", userTeam)
      .order("timestamp", { ascending: false });

    if (error) console.error("Error fetching submissions:", error);
    else setSubmissions(data || []);

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteSubmissionId) return;

    setDeleteLoading(true);
    const { error } = await supabase.from("submissions").delete().eq("id", deleteSubmissionId);
    if (error) {
      console.error("Error deleting submission:", error);
    } else {
      setSubmissions(submissions.filter((submission) => submission.id !== deleteSubmissionId));
      setDeleteSubmissionId(null);
    }
    setDeleteLoading(false);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-500">Loading project submissions...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500">No project submissions for your team yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className={submission.submission_type === "brainstorm map" ? "text-blue-500" : "text-green-500"}>
                    {submission.submission_type.charAt(0).toUpperCase() + submission.submission_type.slice(1)}
                  </TableCell>
                  <TableCell>{submission.teamName}</TableCell>
                  <TableCell>{submission.author}</TableCell>
                  <TableCell>{format(new Date(submission.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }), "PPpp")
                }</TableCell>
                  <TableCell className="flex gap-2">
                    {/* ✅ View Details Icon */}
                    <Button size="icon" variant="ghost" onClick={() => setSelectedSubmission(submission)}>
                      <Eye className="h-5 w-5 text-blue-500" />
                    </Button>

                    {/* ✅ Delete Icon */}
                    <Button size="icon" variant="ghost" onClick={() => setDeleteSubmissionId(submission.id)}>
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
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        {selectedSubmission && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedSubmission.submission_type.charAt(0).toUpperCase() + selectedSubmission.submission_type.slice(1)} Submission</DialogTitle>
            </DialogHeader>
            <p><strong>Team:</strong> {selectedSubmission.teamName}</p>
            <p><strong>Author:</strong> {selectedSubmission.author}</p>
            <p><strong>Date:</strong> {format(new Date(selectedSubmission.timestamp), "PPpp")}</p>

            {/* ✅ Handle Brainstorm Map (Downloadable File) */}
            {selectedSubmission.submission_type === "brainstorm map" && selectedSubmission.file_url && (
              <a href={selectedSubmission.file_url} target="_blank" rel="noopener noreferrer">
                <p className="text-blue-500 underline mt-2">Download Brainstorm Map</p>
              </a>
            )}

            {/* ✅ Handle Presentation Video (YouTube Embed) */}
            {selectedSubmission.submission_type === "presentation video" && selectedSubmission.file_url && (
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${selectedSubmission.file_url.split("v=")[1]}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* ✅ Confirmation Dialog for Deletion */}
      <Dialog open={!!deleteSubmissionId} onOpenChange={() => setDeleteSubmissionId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this project submission? This action cannot be undone.</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteSubmissionId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
