"use client";

import { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { Mail, UserPlus, Loader2 } from "lucide-react";
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

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  onInviteSent: () => void;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  teamId,
  teamName,
  onInviteSent,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin" | "viewer">("member");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      await apiClient.post(`/team/${teamId}/invite`, {
        email: email.trim().toLowerCase(),
        role,
      });

      toast.success(`Invitation sent to ${email}! 📧`);
      setEmail("");
      setRole("member");
      onInviteSent();
      onClose();
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to send invitation";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail("");
      setRole("member");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join {teamName}. The link will be valid for 24
            hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium mb-2"
            >
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              className={error ? "border-destructive" : ""}
              autoFocus
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("viewer")}
                disabled={isLoading}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === "viewer"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-center">
                  <p className="font-medium text-sm">Viewer</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    View only
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("member")}
                disabled={isLoading}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === "member"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-center">
                  <p className="font-medium text-sm">Member</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Edit access
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                disabled={isLoading}
                className={`p-3 rounded-lg border-2 transition-all ${
                  role === "admin"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-center">
                  <p className="font-medium text-sm">Admin</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Full access
                  </p>
                </div>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {role === "viewer" &&
                "Can view team projects and variables but cannot edit."}
              {role === "member" &&
                "Can view and edit team projects and variables."}
              {role === "admin" &&
                "Can manage team settings, invite members, and edit everything."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
