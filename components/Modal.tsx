"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ isModalOpen, setIsModalOpen }: ModalProps) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>I&apos;m a modal</DialogTitle>
        </DialogHeader>
        <section>And here is my content</section>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
