"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/libs/api";
import { useRouter } from "next/navigation";

interface DeleteProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

export default function DeleteProjectModal({
  open,
  onOpenChange,
  projectId,
  projectName,
}: DeleteProjectModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== projectName) {
      toast.error("Project name does not match");
      return;
    }

    setIsDeleting(true);

    try {
      await apiClient.delete(`/projects/${projectId}`);
      toast.success(`Project "${projectName}" deleted successfully!`);
      onOpenChange(false);
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to delete project. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setConfirmText("");
      }
    }
  };

  const isConfirmValid = confirmText === projectName;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Delete Project</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            This action cannot be undone. This will permanently delete the
            project and all its environment variables.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Box */}
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive font-medium mb-2">
              ⚠️ Warning
            </p>
            <p className="text-sm text-muted-foreground">
              You are about to delete <strong>"{projectName}"</strong>. All
              environment variables in this project will be permanently removed.
            </p>
          </div>

          {/* Confirmation Input */}
          <div>
            <label
              htmlFor="confirm-project-name"
              className="block text-sm font-medium mb-2"
            >
              Type <span className="font-mono font-bold">{projectName}</span> to
              confirm:
            </label>
            <Input
              id="confirm-project-name"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={projectName}
              disabled={isDeleting}
              className="font-mono"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting || !isConfirmValid}
            variant="destructive"
            className="gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
