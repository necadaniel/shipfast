"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// A simple modal component which can be shown/hidden with a boolean and a function
// Because of the setIsModalOpen function, you can't use it in a server component.
const Modal = ({ isModalOpen, setIsModalOpen }: ModalProps) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-full max-w-3xl h-full max-h-[90vh] overflow-visible p-6 md:p-8">
        <DialogHeader className="flex flex-row justify-between items-center space-y-0 mb-4">
          <DialogTitle className="font-semibold text-foreground">
            I&apos;m a modal
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="w-5 h-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <section className="text-foreground">
          And here is my content
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
