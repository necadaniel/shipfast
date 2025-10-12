"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/libs/api";
import { useEncryption } from "@/hooks/useEncryption";
import { useTeamEncryption } from "@/hooks/useTeamEncryption";
import { encryptValue } from "@/libs/encryption";

interface AddVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  existingKeys: string[];
  onSuccess: (variable: { key: string; value: string }) => void;
  isTeamProject?: boolean;
  teamId?: string | null;
}

export default function AddVariableModal({
  open,
  onOpenChange,
  projectId,
  existingKeys,
  onSuccess,
  isTeamProject = false,
  teamId = null,
}: AddVariableModalProps) {
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
  const [formData, setFormData] = useState({
    key: "",
    value: "",
  });
  const [error, setError] = useState("");
  const [overwriteExisting, setOverwriteExisting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.key.trim()) {
      setError("Variable name is required");
      return;
    }

    // Check for duplicate keys
    const isDuplicate = existingKeys.includes(formData.key);
    if (isDuplicate && !overwriteExisting) {
      setError(
        "A variable with this name already exists. Enable 'Overwrite existing' to update it."
      );
      return;
    }

    // Validate key format (alphanumeric and underscore only)
    if (!/^[A-Z_][A-Z0-9_]*$/i.test(formData.key)) {
      setError(
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"
      );
      return;
    }

    if (!formData.value.trim()) {
      setError("Variable value is required");
      return;
    }

    if (!encryptionKey) {
      setError("Encryption key not loaded. Please refresh the page.");
      return;
    }

    setIsLoading(true);

    try {
      // If overwriting, delete the existing variable first
      if (isDuplicate && overwriteExisting) {
        await apiClient.delete(
          `/projects/${projectId}/variables/${formData.key}`
        );
      }

      // Encrypt the value before sending to server
      const encryptedValue = await encryptValue(formData.value, encryptionKey);

      const response = await apiClient.post(
        `/projects/${projectId}/variables`,
        {
          key: formData.key,
          value: encryptedValue,
          encrypted: true,
        }
      );

      // Return decrypted value to parent component
      onSuccess({ key: formData.key, value: formData.value });
      toast.success(
        isDuplicate
          ? `Variable "${formData.key}" updated successfully!`
          : `Variable "${formData.key}" added successfully!`
      );
      setFormData({ key: "", value: "" });
      setOverwriteExisting(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding variable:", error);
      const errorMsg =
        error?.response?.data?.error ||
        "Failed to add variable. Please try again.";
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
        setFormData({ key: "", value: "" });
        setError("");
        setOverwriteExisting(false);
      }
    }
  };

  const isDuplicate = existingKeys.includes(formData.key);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Environment Variable</DialogTitle>
          <DialogDescription>
            Add a new key-value pair to your project. Variable names should be
            in UPPER_CASE format.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Variable Key */}
          <div>
            <label htmlFor="key" className="block text-sm font-medium mb-2">
              Variable Name
            </label>
            <Input
              id="key"
              placeholder="API_KEY"
              value={formData.key}
              onChange={(e) =>
                setFormData({ ...formData, key: e.target.value })
              }
              disabled={isLoading}
              className="font-mono"
            />
          </div>

          {/* Variable Value */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium mb-2">
              Value
            </label>
            <Textarea
              id="value"
              placeholder="sk_test_..."
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              disabled={isLoading}
              className="font-mono resize-none"
              rows={4}
            />
          </div>

          {/* Overwrite Toggle */}
          {isDuplicate && (
            <div className="flex items-center gap-2 py-2 px-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <input
                type="checkbox"
                id="overwrite-existing"
                checked={overwriteExisting}
                onChange={(e) => setOverwriteExisting(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
              />
              <label
                htmlFor="overwrite-existing"
                className="text-sm cursor-pointer select-none text-orange-600 dark:text-orange-400 font-medium"
              >
                Overwrite existing variable
              </label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isDuplicate && overwriteExisting
                ? "Update Variable"
                : "Add Variable"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
