"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { encryptValue } from "@/libs/encryption";
import { useEncryption } from "@/hooks/useEncryption";
import { useTeamEncryption } from "@/hooks/useTeamEncryption";

interface EditVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  variableKey: string;
  currentValue: string;
  existingKeys: string[];
  isTeamProject?: boolean;
  teamId?: string | null;
  onSuccess: (variable: { key: string; value: string }) => void;
}

export default function EditVariableModal({
  open,
  onOpenChange,
  projectId,
  variableKey,
  currentValue,
  existingKeys,
  isTeamProject,
  teamId,
  onSuccess,
}: EditVariableModalProps) {
  const [newKey, setNewKey] = useState(variableKey);
  const [value, setValue] = useState(currentValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Personal encryption
  const { encryptionKey: personalKey } = useEncryption();

  // Team encryption (only if it's a team project)
  const { teamKey } = useTeamEncryption(
    isTeamProject && teamId ? teamId : "",
    personalKey
  );

  // Determine which encryption key to use
  const encryptionKey = isTeamProject ? teamKey : personalKey;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setNewKey(variableKey);
      setValue(currentValue);
      setError("");
    }
  }, [open, variableKey, currentValue]);

  // Validate key format
  const validateKey = (key: string) => {
    if (!key.trim()) {
      return "Key is required";
    }

    // Check if key is valid (uppercase, numbers, underscores)
    if (!/^[A-Z0-9_]+$/.test(key)) {
      return "Key must contain only uppercase letters, numbers, and underscores";
    }

    // Check for duplicates (excluding the current key)
    if (key !== variableKey && existingKeys.includes(key)) {
      return "A variable with this key already exists";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const keyError = validateKey(newKey);
    if (keyError) {
      setError(keyError);
      return;
    }

    if (!value.trim()) {
      setError("Value is required");
      return;
    }

    if (!encryptionKey) {
      toast.error("Encryption key not loaded. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Encrypt the value before sending
      const encryptedValue = await encryptValue(value, encryptionKey);

      // Use PATCH to update the variable
      const response = await fetch(
        `/api/projects/${projectId}/variables/${variableKey}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newKey: newKey !== variableKey ? newKey : undefined,
            value: encryptedValue,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update variable");
      }

      toast.success(
        newKey !== variableKey
          ? "Variable updated and renamed!"
          : "Variable updated successfully!"
      );
      onSuccess({ key: newKey, value });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating variable:", error);
      toast.error("Failed to update variable");
      setError("Failed to update variable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Variable</DialogTitle>
          <DialogDescription>
            Update the key or value of your environment variable.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Key Input */}
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                placeholder="API_KEY"
                value={newKey}
                onChange={(e) => {
                  setNewKey(e.target.value.toUpperCase());
                  setError("");
                }}
                disabled={isSubmitting}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Use UPPER_CASE with underscores
              </p>
            </div>

            {/* Value Input */}
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                placeholder="your-secret-value"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                autoComplete="off"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Variable"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
