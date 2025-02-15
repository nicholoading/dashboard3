"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function BugSubmission({ bugNumber }: { bugNumber: number }) {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [method, setMethod] = useState("");
  const [teamName, setTeamName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch the logged-in user's team name
  useEffect(() => {
    const fetchUserTeam = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast({ title: "Error", description: "Could not fetch user data." });
        return;
      }

      // Query the teams table to get the teamName for either the teacher or students
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("teamName")
        .or(
          `"teacherEmail".eq.${user.email}, "teamMember1ParentEmail".eq.${user.email}, "teamMember2ParentEmail".eq.${user.email}, "teamMember3ParentEmail".eq.${user.email}`
        )
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
    if (!screenshot || !method || !teamName) {
      toast({ title: "Error", description: "All fields are required." });
      return;
    }
  
    setLoading(true);
  
    try {
      // ✅ Fetch the logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not found.");
  
      console.log("Logged-in User Email:", user.email); // ✅ Debugging
  
      // ✅ Fetch the user's real name from the teams table
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("teacherName, teacherEmail, teamMember1Name, teamMember1ParentEmail, teamMember2Name, teamMember2ParentEmail, teamMember3Name, teamMember3ParentEmail")
        .eq("teamName", teamName)
        .single();
  
      if (teamError || !teamData) throw new Error("Failed to fetch team data.");
  
      console.log("Fetched Team Data:", teamData); // ✅ Debugging
  
      let authorName = "Unknown";
      if (teamData.teacherEmail === user.email) {
        authorName = teamData.teacherName;
      } else if (teamData.teamMember1ParentEmail === user.email) {
        authorName = teamData.teamMember1Name;
      } else if (teamData.teamMember2ParentEmail === user.email) {
        authorName = teamData.teamMember2Name;
      } else if (teamData.teamMember3ParentEmail === user.email) {
        authorName = teamData.teamMember3Name;
      }
  
      console.log("Determined Author Name:", authorName); // ✅ Debugging
  
      // ✅ Upload the screenshot to Supabase Storage
      const filePath = `bug-screenshots/${Date.now()}-${screenshot.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("bug-screenshots")
        .upload(filePath, screenshot);
  
      if (uploadError) throw new Error("Failed to upload screenshot.");
  
      // ✅ Get the public URL of the uploaded image
      const { data: publicURLData } = supabase.storage
        .from("bug-screenshots")
        .getPublicUrl(filePath);
  
      const screenshotUrl = publicURLData.publicUrl;
  
      // ✅ Insert into the bugs table with real author name
      const { error: insertError } = await supabase.from("bugs").insert([
        {
          "teamName": teamName,
          "author": authorName, // ✅ Store real name instead of email
          "bug_number": bugNumber,
          "description": method,
          "timestamp": new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }),
          "screenshot_url": screenshotUrl,
        }
      ]);
  
      if (insertError) throw new Error("Failed to submit bug fix.");
  
      toast({
        title: "Submission Successful",
        description: "Your bug fix has been submitted for review.",
      });
  
      setScreenshot(null);
      setMethod("");
  
      const fileInput = document.getElementById("screenshot") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
  
    } catch (error: any) {
      console.error("Submission Error:", error); // ✅ Debugging
      toast({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Bug #{bugNumber} Description
          </CardTitle>
          <CardDescription>
            Review the bug details before submitting your fix
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              This bug causes the navigation menu to disappear on mobile
              devices.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Bug Screenshot:</p>
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt={`Bug ${bugNumber} screenshot`}
                width={400}
                height={300}
                className="rounded-md"
              />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Expected Behavior:</p>
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Expected behavior screenshot"
                width={400}
                height={300}
                className="rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Submit Your Fix
          </CardTitle>
          <CardDescription>
            Upload your code and describe your method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="screenshot">Code Screenshot</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Fix Method Description</Label>
              <Textarea
                id="method"
                placeholder="Describe how you fixed the bug..."
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Fix"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
