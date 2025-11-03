"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Users, FolderOpen } from "lucide-react";
import apiClient from "@/libs/api";

interface Team {
  id: string;
  name: string;
}

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId?: string; // Optional: if provided, creates team project (for TeamDetailClient)
  isTeamProject?: boolean; // Force team project mode
  onProjectCreated?: (project: any) => void; // Optional callback
  userPlan?: string; // User's plan (to show team option)
  teams?: Team[]; // Available teams for selection
}

const PROJECT_COLORS = [
  { name: "Blue", value: "#2b7fff" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Green", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
];

export default function CreateProjectModal({
  open,
  onOpenChange,
  teamId,
  isTeamProject = false,
  onProjectCreated,
  userPlan,
  teams = [],
}: CreateProjectModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: PROJECT_COLORS[0].value,
  });
  const [projectType, setProjectType] = useState<"personal" | "team">(
    "personal"
  );
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const hasTeamPlan = userPlan === "team";
  const showTeamOption = hasTeamPlan && teams.length > 0 && !teamId; // Don't show if teamId is already provided

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        description: "",
        color: PROJECT_COLORS[0].value,
      });
      // Set default based on context
      if (teamId) {
        setProjectType("team");
        setSelectedTeamId(teamId);
      } else {
        setProjectType("personal");
        setSelectedTeamId(teams.length > 0 ? teams[0].id : "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, teamId]); // Only depend on open and teamId, not teams array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Determine which API endpoint to use
      let endpoint = "/projects";
      let shouldCreateAsTeamProject = isTeamProject;
      let targetTeamId = teamId;

      // If user selected team project and chose a team
      if (projectType === "team" && selectedTeamId) {
        endpoint = `/team/${selectedTeamId}/projects`;
        shouldCreateAsTeamProject = true;
        targetTeamId = selectedTeamId;
      }

      const response: any = await apiClient.post(endpoint, formData);
      // Note: apiClient interceptor returns response.data directly
      const newProject = response.project;

      // Reset form
      setFormData({
        name: "",
        description: "",
        color: PROJECT_COLORS[0].value,
      });

      // Close modal
      onOpenChange(false);

      // Call callback if provided
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }

      // Refresh the page to show new project (if no callback)
      if (!onProjectCreated) {
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      const errorMessage =
        error?.response?.data?.error ||
        "Failed to create project. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Project
          </DialogTitle>
          {showTeamOption && (
            <DialogDescription>
              Choose whether to create a personal project or share it with your
              team.
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Project Type Selection - Only show if user has team plan and teams available */}
          {showTeamOption && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Project Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProjectType("personal")}
                  disabled={isLoading}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    projectType === "personal"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                >
                  <FolderOpen className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Personal</div>
                    <div className="text-xs text-muted-foreground">
                      Only you
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setProjectType("team")}
                  disabled={isLoading}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    projectType === "team"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Team</div>
                    <div className="text-xs text-muted-foreground">
                      Shared access
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Team Selection - Only show if team project type is selected */}
          {showTeamOption && projectType === "team" && (
            <div className="space-y-2">
              <label
                htmlFor="team"
                className="text-sm font-medium text-foreground"
              >
                Select Team <span className="text-destructive">*</span>
              </label>
              <select
                id="team"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                disabled={isLoading}
                required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Project Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              placeholder="My Awesome Project"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={isLoading}
              className="shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              {" "}
              Description
            </label>
            <Textarea
              id="description"
              placeholder="A brief description of your project (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
              rows={3}
              className="resize-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Project Color
            </label>
            <div className="flex flex-wrap gap-3">
              {PROJECT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, color: color.value })
                  }
                  disabled={isLoading}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color.value
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-105"
                  } shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)]`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
