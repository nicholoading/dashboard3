"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";

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
  const [selectedEnhancement, setSelectedEnhancement] =
    useState<Enhancement | null>(null);
  const [deleteEnhancementId, setDeleteEnhancementId] = useState<string | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [teamName, setTeamName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTeam = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Could not fetch user data:", error);
        return;
      }

      // ✅ Fetch the logged-in user's team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("teamName")
        .or(
          `"teacherEmail".eq.${user.email}, "teamMember1ParentEmail".eq.${user.email}, "teamMember2ParentEmail".eq.${user.email}, "teamMember3ParentEmail".eq.${user.email}`
        )
        .single();

      if (teamError) {
        console.error("Could not find the user's team:", teamError);
      } else {
        setTeamName(teamData.teamName);
        fetchEnhancements(teamData.teamName);
      }
    };

    fetchUserTeam();
  }, []);

  const fetchEnhancements = async (userTeam: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("enhancements")
      .select(
        "id, teamName, author, enhancement_type, description, timestamp, screenshot_url"
      )
      .eq("teamName", userTeam)
      .order("timestamp", { ascending: false });

    if (error) console.error("Error fetching enhancements:", error);
    else setEnhancements(data || []);

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteEnhancementId) return;

    setDeleteLoading(true);
    const { error } = await supabase
      .from("enhancements")
      .delete()
      .eq("id", deleteEnhancementId);
    if (error) {
      console.error("Error deleting enhancement:", error);
    } else {
      setEnhancements(
        enhancements.filter(
          (enhancement) => enhancement.id !== deleteEnhancementId
        )
      );
      setDeleteEnhancementId(null);
    }
    setDeleteLoading(false);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-500">Loading enhancement submissions...</p>
      ) : enhancements.length === 0 ? (
        <p className="text-gray-500">
          No enhancement submissions for your team yet.
        </p>
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
                  <TableCell
                    className={
                      enhancement.enhancement_type === "basic"
                        ? "text-blue-500"
                        : "text-red-500"
                    }
                  >
                    {enhancement.enhancement_type.charAt(0).toUpperCase() +
                      enhancement.enhancement_type.slice(1)}
                  </TableCell>
                  <TableCell>{enhancement.teamName}</TableCell>
                  <TableCell>{enhancement.author}</TableCell>
                  <TableCell>{format(new Date(enhancement.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }), "PPpp")
                }</TableCell>
                  <TableCell className="flex gap-2">
                    {/* ✅ View Details Icon */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setSelectedEnhancement(enhancement)}
                    >
                      <Eye className="h-5 w-5 text-blue-500" />
                    </Button>

                    {/* ✅ Delete Icon */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteEnhancementId(enhancement.id)}
                    >
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
      <Dialog
        open={!!selectedEnhancement}
        onOpenChange={() => setSelectedEnhancement(null)}
      >
        {selectedEnhancement && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedEnhancement.enhancement_type.charAt(0).toUpperCase() +
                  selectedEnhancement.enhancement_type.slice(1)}{" "}
                Enhancement
              </DialogTitle>
            </DialogHeader>
            <p>
              <strong>Team:</strong> {selectedEnhancement.teamName}
            </p>
            <p>
              <strong>Author:</strong> {selectedEnhancement.author}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {format(new Date(selectedEnhancement.timestamp), "PPpp")}
            </p>
            <p className="mt-2">{selectedEnhancement.description}</p>
            {selectedEnhancement.screenshot_url && (
              <a
                href={selectedEnhancement.screenshot_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={selectedEnhancement.screenshot_url}
                  alt="Screenshot"
                  className="mt-2 rounded-lg w-full h-48 object-cover"
                />
              </a>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* ✅ Confirmation Dialog for Deletion */}
      <Dialog
        open={!!deleteEnhancementId}
        onOpenChange={() => setDeleteEnhancementId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this enhancement? This action cannot
            be undone.
          </p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteEnhancementId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
