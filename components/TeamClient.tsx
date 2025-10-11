"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Users, Plus, Crown, Mail, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiClient from "@/libs/api";

interface UserProps {
  id: string;
  email: string;
  name: string;
  plan: string;
  teamId: string | null;
  teamRole: string | null;
}

interface TeamMember {
  userId: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function TeamClient({ user }: { user: UserProps }) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch team data on mount
  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/team");
      // apiClient interceptor returns response.data directly, so response is { team: ... }
      setTeam((response as any).team || null);
    } catch (error) {
      console.error("Error fetching team:", error);
      // Don't show error toast if user just doesn't have a team yet
      if (user.plan === "team") {
        // Only show error for team plan users who should have team data
        console.log("No team found for team plan user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    try {
      setIsCreating(true);
      const response = await apiClient.post("/team", { name: teamName });
      // apiClient interceptor returns response.data directly
      setTeam((response as any).team || null);
      setShowCreateModal(false);
      setTeamName("");
      toast.success("Team created successfully!");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating team:", error);
      // Error toast is already shown by apiClient interceptor
    } finally {
      setIsCreating(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading team data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - User has team plan but no team yet
  if (!team && user.plan === "team") {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">Create Your Team</h2>
              <p className="text-muted-foreground mb-6">
                You have a Team plan! Create your team to start collaborating
                and sharing projects with your colleagues.
              </p>
              <Button onClick={() => setShowCreateModal(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Team
              </Button>
            </div>
          </div>
        </div>

        {/* Create Team Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Your Team</DialogTitle>
              <DialogDescription>
                Choose a name for your team. You can change this later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="teamName"
                  className="block text-sm font-medium mb-2"
                >
                  Team Name
                </label>
                <Input
                  id="teamName"
                  placeholder="Acme Inc."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={isCreating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isCreating) {
                      handleCreateTeam();
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} disabled={isCreating}>
                  {isCreating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Team exists - show team details
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Team Header */}
        <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{team?.name}</h1>
                <p className="text-muted-foreground">
                  Manage your team members and collaborate on projects
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {user.teamRole === "owner" || user.teamRole === "admin" ? (
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            ) : null}
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Members:</span>
              <span className="ml-2 font-semibold">
                {team?.memberCount || 1}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Plan:</span>
              <span className="ml-2 font-semibold capitalize">{user.plan}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Your Role:</span>
              <span className="ml-2 font-semibold capitalize flex items-center gap-1">
                {user.teamRole === "owner" && (
                  <Crown className="w-3 h-3 text-yellow-500" />
                )}
                {user.teamRole}
              </span>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>

          {/* Coming soon placeholder */}
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">
              Member management coming soon
            </h3>
            <p className="text-muted-foreground">
              We're working on invitations, role management, and more team
              features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
