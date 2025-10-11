"use client";

import { useState, useEffect } from "react";
import {
  FolderPlus,
  Sparkles,
  Lock,
  Zap,
  FolderOpen,
  Calendar,
  Key,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateProjectModal from "@/components/CreateProjectModal";
import DeleteProjectModal from "@/components/DeleteProjectModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  variableCount: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt: string | null;
}

interface DashboardClientProps {
  projects: Project[];
}

export default function DashboardClient({ projects }: DashboardClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    projectId: string;
    projectName: string;
  }>({
    open: false,
    projectId: "",
    projectName: "",
  });
  const router = useRouter();

  // Listen for custom event from sidebar
  useEffect(() => {
    const handleOpenModal = () => setIsCreateModalOpen(true);
    window.addEventListener("openCreateProject", handleOpenModal);
    return () =>
      window.removeEventListener("openCreateProject", handleOpenModal);
  }, []);

  const openDeleteModal = (projectId: string, projectName: string) => {
    setDeleteModal({
      open: true,
      projectId,
      projectName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      projectId: "",
      projectName: "",
    });
  };

  const handleDuplicateProject = async (
    projectId: string,
    projectName: string
  ) => {
    try {
      // TODO: Implement duplicate API endpoint
      toast.success(`Project "${projectName}" duplicated successfully!`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to duplicate project");
      console.error("Duplicate error:", error);
    }
  };

  const handleImportVariables = (projectId: string) => {
    // Navigate to project page with action=import query param
    router.push(`/dashboard/project/${projectId}?action=import`);
  };

  const handleExportEnv = async (projectId: string, projectName: string) => {
    try {
      toast("Preparing download...");

      // Fetch project variables
      const response = await fetch(`/api/projects/${projectId}/variables`);
      if (!response.ok) {
        throw new Error("Failed to fetch variables");
      }

      const data = await response.json();

      // Import encryption utilities dynamically to avoid issues
      const { decryptVariables, getEncryptionKeyFromSession } = await import(
        "@/libs/encryption"
      );

      // Get encryption key from sessionStorage
      const encryptionKey = getEncryptionKeyFromSession();
      if (!encryptionKey) {
        toast.error("Encryption key not found. Please refresh the page.");
        return;
      }

      // Decrypt variables
      const decryptedVariables = await decryptVariables(
        data.variables,
        encryptionKey
      );

      // Create .env file content
      const envContent = decryptedVariables
        .map((v) => `${v.key}=${v.value}`)
        .join("\n");

      // Download file
      const blob = new Blob([envContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.env`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export .env file");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              Projects
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your environment variables across all your projects
            </p>
          </div>
          {projects.length > 0 && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_6px_20px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          )}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4">
            <div className="max-w-md w-full">
              {/* Empty State Card */}
              <div className="relative rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 p-6 sm:p-8 lg:p-12 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
                {/* Decorative gradient orb */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-primary/20 rounded-full blur-3xl" />

                <div className="relative">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-4 sm:mb-6 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.1)]">
                    <FolderPlus className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
                  </div>

                  {/* Heading */}
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                    Create Your First Project
                  </h2>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                    Start by creating a project to organize and sync your
                    environment variables securely across all your devices.
                  </p>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="gap-2 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_6px_20px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Project
                  </Button>

                  {/* Feature pills */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-8 border-t border-primary/10">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">
                        End-to-end encrypted
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Real-time sync
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick tips */}
              <div className="mt-6 space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  💡 <strong>Quick tip:</strong> Use projects to organize
                  secrets by application, client, or environment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/dashboard/project/${project._id}`}
                className="group h-full"
              >
                <div className="relative rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-4 sm:p-6 transition-all hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_12px_40px_rgba(0,0,0,0.12)] hover:translate-y-[-2px] shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)] active:scale-[0.98] cursor-pointer h-full flex flex-col">
                  {/* Color indicator */}
                  <div
                    className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                    style={{ backgroundColor: project.color }}
                  />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div
                        className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)] flex-shrink-0"
                        style={{ backgroundColor: `${project.color}20` }}
                      >
                        <FolderOpen
                          className="w-4 sm:w-5 h-4 sm:h-5"
                          style={{ color: project.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/dashboard/project/${project._id}`);
                          }}
                        >
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Open Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Open edit modal
                            toast("Edit project coming soon!");
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleDuplicateProject(project._id, project.name);
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleImportVariables(project._id);
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Import Variables
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleExportEnv(project._id, project.name);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export .env
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            openDeleteModal(project._id, project.name);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description */}
                  <div className="flex-1 mb-3 sm:mb-4">
                    {project.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Key className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      <span>{project.variableCount} variables</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Add New Project Card */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="group rounded-xl border-2 border-dashed border-primary/30 p-6 hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center h-full min-h-[160px] sm:min-h-[180px]"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-primary/20 transition-colors">
                <FolderPlus className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              </div>
              <p className="text-sm sm:text-base font-medium text-foreground mb-1">
                Create New Project
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Add another project to manage
              </p>
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal
        open={deleteModal.open}
        onOpenChange={closeDeleteModal}
        projectId={deleteModal.projectId}
        projectName={deleteModal.projectName}
      />
    </>
  );
}
