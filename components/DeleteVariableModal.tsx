"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variableKey: string;
  onConfirm: () => Promise<void>;
}

export default function DeleteVariableModal({
  open,
  onOpenChange,
  variableKey,
  onConfirm,
}: DeleteVariableModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast.success(`Variable "${variableKey}" deleted successfully!`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting variable:", error);
      toast.error("Failed to delete variable. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Variable</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-3">
            Are you sure you want to delete this environment variable?
          </p>
          <div className="bg-muted/30 rounded-lg p-3 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_8px_rgba(0,0,0,0.04)]">
            <p className="text-sm font-mono font-semibold break-all">
              {variableKey}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Variable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
