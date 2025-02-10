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

export function EnhancementSubmission() {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [method, setMethod] = useState("");
  const [justification, setJustification] = useState(""); // ✅ Justification for advanced
  const [enhancementType, setEnhancementType] = useState<"basic" | "advanced">("basic");
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
    if (!screenshot || !method || !teamName || (enhancementType === "advanced" && !justification)) {
      toast({ title: "Error", description: "All required fields must be filled." });
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not found.");

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("teacherName, teacherEmail, teamMember1Name, teamMember1ParentEmail, teamMember2Name, teamMember2ParentEmail, teamMember3Name, teamMember3ParentEmail")
        .eq("teamName", teamName)
        .single();

      if (teamError || !teamData) throw new Error("Failed to fetch team data.");

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

      // ✅ Upload the screenshot to Supabase Storage
      const filePath = `enhancement-screenshots/${Date.now()}-${screenshot.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("enhancement-screenshots")
        .upload(filePath, screenshot);

      if (uploadError) throw new Error("Failed to upload screenshot.");

      const { data: publicURLData } = supabase.storage
        .from("enhancement-screenshots")
        .getPublicUrl(filePath);

      const screenshotUrl = publicURLData.publicUrl;

      // ✅ Insert into the enhancements table
      const { error: insertError } = await supabase
        .from("enhancements")
        .insert([
          {
            teamName: teamName,
            author: authorName,
            enhancement_type: enhancementType,
            description: method,
            justification: enhancementType === "advanced" ? justification : null, // ✅ Only add justification for advanced
            timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }),
            screenshot_url: screenshotUrl,
          },
        ]);

      if (insertError) throw new Error("Failed to submit enhancement.");

      toast({
        title: "Submission Successful",
        description: "Your enhancement has been submitted for review.",
      });

      setScreenshot(null);
      setMethod("");
      setJustification(""); // ✅ Reset justification

      const fileInput = document.getElementById("screenshot") as HTMLInputElement;
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
        <CardTitle className="text-xl font-semibold">Submit Your Enhancement</CardTitle>
        <CardDescription>
          Upload your code and describe your method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enhancementType">Enhancement Type</Label>
            <select
              id="enhancementType"
              value={enhancementType}
              onChange={(e) => setEnhancementType(e.target.value as "basic" | "advanced")}
              className="w-full p-2 border rounded"
              required
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
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
            <Label htmlFor="method">Description</Label>
            <Textarea
              id="method"
              placeholder="Describe your enhancement..."
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              required
            />
          </div>
          {/* ✅ Show Justification Field Only for Advanced Enhancements */}
          {enhancementType === "advanced" && (
            <div className="space-y-2">
              <Label htmlFor="justification">Justification</Label>
              <Textarea
                id="justification"
                placeholder="Explain why this enhancement is needed..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                required={enhancementType === "advanced"}
              />
            </div>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Enhancement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
