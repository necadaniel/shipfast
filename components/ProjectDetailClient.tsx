"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Plus,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit2,
  Search,
  FileText,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddVariableModal from "./AddVariableModal";
import UploadEnvModal from "./UploadEnvModal";
import DeleteVariableModal from "./DeleteVariableModal";
import apiClient from "@/libs/api";
import { useEncryption } from "@/hooks/useEncryption";
import { decryptVariables } from "@/libs/encryption";

interface Variable {
  key: string;
  value: string;
  encrypted?: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  variables: Variable[];
  variableCount: number;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailClient({ project }: { project: Project }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    encryptionKey,
    isLoading: isLoadingKey,
    error: keyError,
  } = useEncryption();
  const [variables, setVariables] = useState<Variable[]>([]);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleValues, setVisibleValues] = useState<Set<string>>(new Set());

  // Check URL params to auto-open upload modal
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "import" && !isDecrypting && variables.length >= 0) {
      setShowUploadModal(true);
      // Remove the query param after opening modal
      router.replace(`/dashboard/project/${project.id}`, { scroll: false });
    }
  }, [searchParams, isDecrypting, variables.length, project.id, router]);

  // Decrypt variables when encryption key is loaded
  useEffect(() => {
    const decryptData = async () => {
      console.log("=== DECRYPT VARIABLES EFFECT ===");
      console.log("Encryption key available:", !!encryptionKey);
      console.log("Project variables count:", project.variables?.length);

      if (!encryptionKey) {
        console.log("No encryption key yet, skipping decrypt");
        return;
      }

      try {
        setIsDecrypting(true);
        setDecryptError(null);

        console.log("Starting decryption...");
        // Decrypt all variables
        const decrypted = await decryptVariables(
          project.variables,
          encryptionKey
        );
        console.log(
          "Decryption successful, decrypted count:",
          decrypted.length
        );
        setVariables(decrypted);
      } catch (error) {
        console.error("Failed to decrypt variables:", error);
        setDecryptError(
          "Failed to decrypt variables. Please refresh the page."
        );
      } finally {
        console.log("Setting isDecrypting to false");
        setIsDecrypting(false);
      }
    };

    decryptData();
  }, [encryptionKey, project.variables]);

  // Filter variables based on search
  const filteredVariables = variables.filter(
    (variable) =>
      variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variable.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle value visibility
  const toggleValueVisibility = (key: string) => {
    const newVisible = new Set(visibleValues);
    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
    }
    setVisibleValues(newVisible);
  };

  // Copy value to clipboard
  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  // Delete variable
  const handleDeleteClick = (key: string) => {
    setVariableToDelete(key);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!variableToDelete) return;

    try {
      await apiClient.delete(
        `/projects/${project.id}/variables/${variableToDelete}`
      );
      setVariables(variables.filter((v) => v.key !== variableToDelete));
      router.refresh();
    } catch (error) {
      console.error("Error deleting variable:", error);
      alert("Failed to delete variable");
    }
  };

  // Download .env file
  const handleDownload = () => {
    const envContent = variables.map((v) => `${v.key}=${v.value}`).join("\n");
    const blob = new Blob([envContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}.env`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  // Show loading state while encryption key is loading or variables are being decrypted
  if (isLoadingKey || isDecrypting) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <Lock className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">
                Decrypting Variables
              </h3>
              <p className="text-sm text-muted-foreground">
                Unlocking your secure environment variables...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if encryption key failed to load
  if (keyError || decryptError) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">Decryption Failed</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {keyError || decryptError}
              </p>
              <Button onClick={() => router.refresh()}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              {/* Color Indicator */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]"
                style={{ backgroundColor: project.color }}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                {project.description && (
                  <p className="text-muted-foreground">{project.description}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={variables.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Variables:</span>
              <span className="ml-2 font-semibold">{variables.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Last synced:</span>
              <span className="ml-2 font-semibold">
                {formatDate(project.lastSyncedAt)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2 font-semibold">
                {formatDate(project.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Variables Section */}
        <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Variable
            </Button>
          </div>

          {/* Variables Table */}
          {filteredVariables.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? "No variables found"
                  : "No environment variables yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Add your first environment variable to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variable
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredVariables.map((variable) => (
                <div
                  key={variable.key}
                  className="bg-background/50 rounded-lg p-4 flex items-center gap-4 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_4px_16px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5"
                >
                  {/* Key */}
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-semibold mb-1">
                      {variable.key}
                    </div>
                    <div className="font-mono text-sm text-muted-foreground truncate">
                      {visibleValues.has(variable.key)
                        ? variable.value
                        : "•".repeat(Math.min(variable.value.length, 20))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleValueVisibility(variable.key)}
                      className="h-8 w-8 p-0"
                    >
                      {visibleValues.has(variable.key) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(variable.value)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(variable.key)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Variable Modal */}
      <AddVariableModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        projectId={project.id}
        existingKeys={variables.map((v) => v.key)}
        onSuccess={(newVariable: Variable) => {
          setVariables([...variables, newVariable]);
          router.refresh();
        }}
      />

      {/* Upload .env Modal */}
      <UploadEnvModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        projectId={project.id}
        existingKeys={variables.map((v) => v.key)}
        onSuccess={(newVariables: Variable[]) => {
          setVariables([...variables, ...newVariables]);
          router.refresh();
        }}
      />

      {/* Delete Variable Modal */}
      <DeleteVariableModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        variableKey={variableToDelete || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
