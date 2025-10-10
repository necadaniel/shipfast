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
import { encryptValue } from "@/libs/encryption";

interface AddVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  existingKeys: string[];
  onSuccess: (variable: { key: string; value: string }) => void;
}

export default function AddVariableModal({
  open,
  onOpenChange,
  projectId,
  existingKeys,
  onSuccess,
}: AddVariableModalProps) {
  const { encryptionKey } = useEncryption();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    key: "",
    value: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.key.trim()) {
      setError("Variable name is required");
      return;
    }

    // Check for duplicate keys
    if (existingKeys.includes(formData.key)) {
      setError("A variable with this name already exists");
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
      toast.success(`Variable "${formData.key}" added successfully!`);
      setFormData({ key: "", value: "" });
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
      }
    }
  };

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
              Add Variable
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
