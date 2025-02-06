"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

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
                  <TableCell>{format(new Date(submission.timestamp), "PPpp")}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setSelectedBug(submission)}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ✅ Dialog for Bug Details */}
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
    </div>
  );
}
