"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Users,
  Plus,
  Crown,
  Loader2,
  Calendar,
  MoreVertical,
  Settings,
  Trash2,
  ExternalLink,
  FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteTeamModal from "@/components/DeleteTeamModal";
import apiClient from "@/libs/api";

interface UserProps {
  id: string;
  email: string;
  name: string;
  plan: string;
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  memberCount: number;
  projectCount: number;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamsListClient({
  user,
  teams: initialTeams,
}: {
  user: UserProps;
  teams: Team[];
}) {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    teamId: string;
    teamName: string;
  }>({
    open: false,
    teamId: "",
    teamName: "",
  });

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    try {
      setIsCreating(true);
      const response = await apiClient.post("/team", { name: teamName });
      const newTeam = (response as any).team;

      // Add the new team to the list
      setTeams([
        {
          id: newTeam._id,
          name: newTeam.name,
          ownerId: newTeam.ownerId,
          memberCount: 1,
          projectCount: 0,
          userRole: "owner",
          createdAt: newTeam.createdAt,
          updatedAt: newTeam.updatedAt,
        },
        ...teams,
      ]);

      setShowCreateModal(false);
      setTeamName("");
      toast.success("Team created successfully!");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating team:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    setDeleteModal({
      open: true,
      teamId,
      teamName,
    });
  };

  const handleDeleteSuccess = () => {
    // Remove the deleted team from the list
    setTeams(teams.filter((t) => t.id !== deleteModal.teamId));
    setDeleteModal({
      open: false,
      teamId: "",
      teamName: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      teamId: "",
      teamName: "",
    });
  };

  // Empty state - No teams yet
  if (teams.length === 0) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">
                Create Your First Team
              </h2>
              <p className="text-muted-foreground mb-6">
                Start collaborating! Create a team to invite members and share
                projects securely.
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
              <DialogTitle>Create a Team</DialogTitle>
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

  // Teams list
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teams</h1>
            <p className="text-muted-foreground">
              Manage your teams and collaborate with members
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/dashboard/team/${team.id}`}
              className="block group"
            >
              <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl p-6 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-200 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 relative">
                {/* Dropdown Menu */}
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.preventDefault()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/team/${team.id}`}
                          className="cursor-pointer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Team
                        </Link>
                      </DropdownMenuItem>
                      {team.userRole === "owner" && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              toast("Settings coming soon!");
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteTeam(team.id, team.name);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Team
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Team Icon */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]">
                  <Users className="w-6 h-6 text-primary" />
                </div>

                {/* Team Info */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {team.name}
                </h3>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {team.memberCount}{" "}
                      {team.memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderKanban className="w-4 h-4" />
                    <span>
                      {team.projectCount}{" "}
                      {team.projectCount === 1 ? "project" : "projects"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(team.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                    {team.userRole === "owner" && <Crown className="w-3 h-3" />}
                    <span className="capitalize">{team.userRole}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Create Team Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a Team</DialogTitle>
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

        {/* Delete Team Modal */}
        <DeleteTeamModal
          open={deleteModal.open}
          onOpenChange={closeDeleteModal}
          teamId={deleteModal.teamId}
          teamName={deleteModal.teamName}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </div>
  );
}
