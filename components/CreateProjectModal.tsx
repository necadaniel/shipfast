"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import apiClient from "@/libs/api";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId?: string; // Optional: if provided, creates team project
  isTeamProject?: boolean;
  onProjectCreated?: (project: any) => void; // Optional callback
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
}: CreateProjectModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: PROJECT_COLORS[0].value,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Determine which API endpoint to use
      const endpoint =
        isTeamProject && teamId ? `/team/${teamId}/projects` : "/projects";

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
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
