"use client";

import { useState } from "react";
import { Loader2, Upload, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import apiClient from "@/libs/api";
import { useEncryption } from "@/hooks/useEncryption";
import { useTeamEncryption } from "@/hooks/useTeamEncryption";
import { encryptValue } from "@/libs/encryption";

interface UploadEnvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  existingKeys: string[];
  onSuccess: (variables: { key: string; value: string }[]) => void;
  isTeamProject?: boolean;
  teamId?: string | null;
}

export default function UploadEnvModal({
  open,
  onOpenChange,
  projectId,
  existingKeys,
  onSuccess,
  isTeamProject = false,
  teamId = null,
}: UploadEnvModalProps) {
  // Personal encryption
  const { encryptionKey: personalKey } = useEncryption();

  // Team encryption (only if team project)
  const { teamKey } = useTeamEncryption(
    isTeamProject && teamId ? teamId : "",
    personalKey
  );

  // Use appropriate encryption key
  const encryptionKey = isTeamProject ? teamKey : personalKey;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ key: string; value: string }[]>([]);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [overwriteDuplicates, setOverwriteDuplicates] = useState(false);

  // Parse .env file content
  const parseEnvFile = (content: string): { key: string; value: string }[] => {
    const lines = content.split("\n");
    const variables: { key: string; value: string }[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) continue;

      // Find the first = sign
      const equalIndex = trimmed.indexOf("=");
      if (equalIndex === -1) continue;

      const key = trimmed.substring(0, equalIndex).trim();
      let value = trimmed.substring(equalIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key) {
        variables.push({ key, value });
      }
    }

    return variables;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate filename - must be a .env file
    const validEnvFiles = [
      ".env",
      ".env.local",
      ".env.development",
      ".env.production",
      ".env.test",
      ".env.staging",
    ];

    const isValidEnvFile = validEnvFiles.some(
      (pattern) => file.name === pattern || file.name.endsWith(pattern)
    );

    if (!isValidEnvFile) {
      const errorMsg = "Please select a valid .env file";
      setError(errorMsg);
      setPreview([]);
      toast.error(errorMsg);
      return;
    }

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseEnvFile(content);

        if (parsed.length === 0) {
          const errorMsg = "No valid variables found in file";
          setError(errorMsg);
          setPreview([]);
          toast.error(errorMsg);
          return;
        }

        setPreview(parsed);
        toast.success(
          `Found ${parsed.length} variable${
            parsed.length !== 1 ? "s" : ""
          } in ${file.name}`
        );
      } catch (err) {
        const errorMsg = "Failed to parse file";
        setError(errorMsg);
        setPreview([]);
        toast.error(errorMsg);
      }
    };
    reader.readAsText(file);
  };

  // Handle import
  const handleImport = async () => {
    if (preview.length === 0) return;

    if (!encryptionKey) {
      setError("Encryption key not loaded. Please refresh the page.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Determine which variables to import based on overwrite setting
      let variablesToImport: { key: string; value: string }[] = [];
      let duplicatesToUpdate: { key: string; value: string }[] = [];

      if (overwriteDuplicates) {
        // Import all variables (new + duplicates to overwrite)
        variablesToImport = preview;
        duplicatesToUpdate = preview.filter((v) =>
          existingKeys.includes(v.key)
        );
      } else {
        // Only import new variables (skip duplicates)
        variablesToImport = preview.filter(
          (v) => !existingKeys.includes(v.key)
        );
      }

      if (variablesToImport.length === 0) {
        const errorMsg = overwriteDuplicates
          ? "No variables to import"
          : "All variables already exist in this project";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // Set initial progress
      setProgress({ current: 0, total: variablesToImport.length });

      // Process variables sequentially to avoid race conditions
      const importedVariables: { key: string; value: string }[] = [];
      let updatedCount = 0;

      for (let i = 0; i < variablesToImport.length; i++) {
        const variable = variablesToImport[i];
        const isDuplicate = existingKeys.includes(variable.key);

        try {
          // Encrypt value
          const encryptedValue = await encryptValue(
            variable.value,
            encryptionKey
          );

          if (isDuplicate && overwriteDuplicates) {
            // Delete existing variable first, then add new one
            await apiClient.delete(
              `/projects/${projectId}/variables/${variable.key}`
            );
            updatedCount++;
          }

          // Save to database
          await apiClient.post(`/projects/${projectId}/variables`, {
            key: variable.key,
            value: encryptedValue,
            encrypted: true,
          });

          importedVariables.push(variable);

          // Update progress
          setProgress({ current: i + 1, total: variablesToImport.length });

          // Small delay to prevent overwhelming the server
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (err) {
          console.error(`Failed to import ${variable.key}:`, err);
          // Continue with next variable even if one fails
        }
      }

      if (importedVariables.length === 0) {
        setError("Failed to import any variables. Please try again.");
        toast.error("Failed to import any variables. Please try again.");
        setIsLoading(false);
        return;
      }

      // Return decrypted values to parent
      onSuccess(importedVariables);

      // Show success message with breakdown
      if (updatedCount > 0) {
        const addedCount = importedVariables.length - updatedCount;
        toast.success(
          `Successfully imported ${importedVariables.length} variable${
            importedVariables.length !== 1 ? "s" : ""
          }! (${updatedCount} updated, ${addedCount} added)`
        );
      } else {
        toast.success(
          `Successfully imported ${importedVariables.length} variable${
            importedVariables.length !== 1 ? "s" : ""
          }!`
        );
      }

      setPreview([]);
      setFileName("");
      setProgress({ current: 0, total: 0 });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error importing variables:", error);
      const errorMsg = "Failed to import variables. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setPreview([]);
        setFileName("");
        setError("");
        setProgress({ current: 0, total: 0 });
      }
    }
  };

  const duplicateCount = preview.filter((v) =>
    existingKeys.includes(v.key)
  ).length;
  const newCount = preview.length - duplicateCount;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Upload .env File</DialogTitle>
          <DialogDescription>
            Import environment variables from a .env file. Duplicate keys will
            be skipped.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1">
          {/* File Upload */}
          <div>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full h-32 rounded-lg cursor-pointer transition-all bg-muted/30 hover:bg-muted/40 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {fileName || "Choose .env file or drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  .env, .env.local, .env.development, etc.
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-3">
              {/* Overwrite Toggle */}
              {duplicateCount > 0 && (
                <div className="flex items-center gap-2 py-2 px-3 bg-muted/20 rounded-lg">
                  <input
                    type="checkbox"
                    id="overwrite-duplicates"
                    checked={overwriteDuplicates}
                    onChange={(e) => setOverwriteDuplicates(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <label
                    htmlFor="overwrite-duplicates"
                    className="text-sm cursor-pointer select-none"
                  >
                    Overwrite existing variables ({duplicateCount})
                  </label>
                </div>
              )}

              {/* Preview List */}
              <div className="bg-muted/30 rounded-lg p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold">Preview</h4>
                  <div className="text-xs text-muted-foreground">
                    {overwriteDuplicates ? (
                      <>
                        {newCount} new, {duplicateCount} to update
                      </>
                    ) : (
                      <>
                        {newCount} new, {duplicateCount} duplicate
                        {duplicateCount !== 1 ? "s" : ""}
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2">
                  {preview.map((variable, index) => {
                    const isDuplicate = existingKeys.includes(variable.key);
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 text-sm p-3 rounded-lg shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_1px_4px_rgba(0,0,0,0.03)] ${
                          isDuplicate && !overwriteDuplicates
                            ? "bg-muted/50 opacity-50"
                            : isDuplicate && overwriteDuplicates
                            ? "bg-orange-500/10 border border-orange-500/20"
                            : "bg-background/50"
                        }`}
                      >
                        <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="font-mono font-semibold">
                            {variable.key}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground truncate">
                            {variable.value}
                          </div>
                        </div>
                        {isDuplicate && (
                          <span
                            className={`text-xs ${
                              overwriteDuplicates
                                ? "text-orange-600 dark:text-orange-400 font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {overwriteDuplicates ? "Update" : "Exists"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          {isLoading && progress.total > 0 && (
            <div className="bg-muted/30 rounded-lg p-4 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm font-medium">
                    Importing variables...
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {progress.current} / {progress.total}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.1)_inset]">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>

              {/* Success checkmark when complete */}
              {progress.current === progress.total && (
                <div className="flex items-center gap-2 mt-3 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All variables imported successfully!</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={
                isLoading ||
                preview.length === 0 ||
                (newCount === 0 && !overwriteDuplicates)
              }
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {overwriteDuplicates && newCount === 0
                ? `Update (${duplicateCount})`
                : newCount > 0
                ? `Import (${newCount})`
                : "Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
