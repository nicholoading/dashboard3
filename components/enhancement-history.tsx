"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface Enhancement {
  id: string;
  teamName: string;
  author: string;
  enhancement_type: string;
  description: string;
  timestamp: string;
  screenshot_url: string;
}

export function EnhancementHistory() {
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnhancement, setSelectedEnhancement] = useState<Enhancement | null>(null);
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
        fetchEnhancements(teamData.teamName); // Fetch enhancements only for this team
      }
    };

    fetchUserTeam();
  }, []);

  const fetchEnhancements = async (userTeam: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("enhancements")
      .select("id, teamName, author, enhancement_type, description, timestamp, screenshot_url")
      .eq("teamName", userTeam) // ✅ Only fetch enhancements from the user's team
      .order("timestamp", { ascending: false });

    if (error) console.error("Error fetching enhancements:", error);
    else setEnhancements(data || []);

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-500">Loading enhancement submissions...</p>
      ) : enhancements.length === 0 ? (
        <p className="text-gray-500">No enhancement submissions for your team yet.</p>
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
              {enhancements.map((enhancement) => (
                <TableRow key={enhancement.id}>
                  <TableCell className={enhancement.enhancement_type === "basic" ? "text-blue-500" : "text-red-500"}>
                    {enhancement.enhancement_type.charAt(0).toUpperCase() + enhancement.enhancement_type.slice(1)}
                  </TableCell>
                  <TableCell>{enhancement.teamName}</TableCell>
                  <TableCell>{enhancement.author}</TableCell>
                  <TableCell>{format(new Date(enhancement.timestamp), "PPpp")}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setSelectedEnhancement(enhancement)}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ✅ Dialog for Enhancement Details */}
      <Dialog open={!!selectedEnhancement} onOpenChange={() => setSelectedEnhancement(null)}>
        {selectedEnhancement && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEnhancement.enhancement_type.charAt(0).toUpperCase() + selectedEnhancement.enhancement_type.slice(1)} Enhancement</DialogTitle>
            </DialogHeader>
            <p><strong>Team:</strong> {selectedEnhancement.teamName}</p>
            <p><strong>Author:</strong> {selectedEnhancement.author}</p>
            <p><strong>Date:</strong> {format(new Date(selectedEnhancement.timestamp), "PPpp")}</p>
            <p className="mt-2">{selectedEnhancement.description}</p>
            {selectedEnhancement.screenshot_url && (
              <a href={selectedEnhancement.screenshot_url} target="_blank" rel="noopener noreferrer">
                <img src={selectedEnhancement.screenshot_url} alt="Screenshot" className="mt-2 rounded-lg w-full h-48 object-cover" />
              </a>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
