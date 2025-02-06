"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function ProjectSubmission() {
  const [submissionType, setSubmissionType] = useState<"brainstorm map" | "presentation video">("brainstorm map");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [teamName, setTeamName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch the logged-in user's team name
  useEffect(() => {
    const fetchUserTeam = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        toast({ title: "Error", description: "Could not fetch user data." });
        return;
      }

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("teamName")
        .or(`"teacherEmail".eq.${user.email}, "teamMember1ParentEmail".eq.${user.email}, "teamMember2ParentEmail".eq.${user.email}, "teamMember3ParentEmail".eq.${user.email}`)
        .single();

      if (teamError) {
        toast({ title: "Error", description: "Could not find your team." });
      } else {
        setTeamName(teamData.teamName);
      }
    };

    fetchUserTeam();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((submissionType === "brainstorm map" && !file) || (submissionType === "presentation video" && !youtubeLink) || !teamName) {
      toast({ title: "Error", description: "All fields are required." });
      return;
    }

    setLoading(true);
    let fileUrl = "";

    try {
      if (submissionType === "brainstorm map" && file) {
        // ✅ Upload file to Supabase Storage for Brainstorm Map
        const filePath = `project-submissions/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("project-submissions")
          .upload(filePath, file);

        if (uploadError) throw new Error("Failed to upload file.");

        // ✅ Get the public URL of the uploaded file
        const { data: publicURLData } = supabase.storage
          .from("project-submissions")
          .getPublicUrl(filePath);

        fileUrl = publicURLData.publicUrl;
      } else if (submissionType === "presentation video") {
        // ✅ Directly save the YouTube link
        fileUrl = youtubeLink;
      }

      // ✅ Insert into the submissions table
      const { error: insertError } = await supabase.from("submissions").insert([
        {
          "teamName": teamName,
          "author": (await supabase.auth.getUser()).data.user?.email,
          "submission_type": submissionType,
          "timestamp": new Date().toISOString(),
          "file_url": fileUrl,
        }
      ]);

      if (insertError) throw new Error("Failed to submit project.");

      toast({
        title: "Submission Successful",
        description: "Your project has been submitted.",
      });

      setFile(null);
      setYoutubeLink("");

      // ✅ Reset File Input
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Submit Your Project</CardTitle>
          <CardDescription>Upload your brainstorm map or submit a YouTube link for your presentation video</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ✅ Submission Type Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="submissionType">Submission Type</Label>
              <select
                id="submissionType"
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value as "brainstorm map" | "presentation video")}
                className="w-full p-2 border rounded"
                required
              >
                <option value="brainstorm map">Brainstorm Map</option>
                <option value="presentation video">Presentation Video</option>
              </select>
            </div>

            {/* ✅ Show File Upload for Brainstorm Map */}
            {submissionType === "brainstorm map" && (
              <div className="space-y-2">
                <Label htmlFor="file">Upload Brainstorm Map (PDF/Image)</Label>
                <Input 
                  id="file" 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
            )}

            {/* ✅ Show YouTube Link Input for Presentation Video */}
            {submissionType === "presentation video" && (
              <div className="space-y-2">
                <Label htmlFor="youtubeLink">YouTube Video Link</Label>
                <Input 
                  id="youtubeLink" 
                  type="url" 
                  placeholder="https://www.youtube.com/watch?v=example"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  required
                />
              </div>
            )}

            {/* ✅ Submit Button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Project"}
            </Button>
          </form>
        </CardContent>
      </Card>

  );
}
