"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";

// This component is used to collect the emails from the landing page
// You'd use this if your product isn't ready yet or you want to collect leads
// For instance: A popup to send a freebie, joining a waitlist, etc.
// It calls the /api/lead/route.js route and store a Lead document in the database
const ButtonLead = ({ extraStyle }: { extraStyle?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setIsLoading(true);
    try {
      await apiClient.post("/lead", { email });

      toast.success("Thanks for joining the waitlist!");

      // just remove the focus on the input
      inputRef.current?.blur();
      setEmail("");
      setIsDisabled(true);
    } catch {
      // apiClient already showed a toast
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className={`w-full max-w-xs space-y-3 ${extraStyle ? extraStyle : ""}`}
      onSubmit={handleSubmit}
    >
      <Input
        required
        type="email"
        value={email}
        ref={inputRef}
        autoComplete="email"
        placeholder="tom@cruise.com"
        className="w-full"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button
        className="w-full gap-2"
        type="submit"
        disabled={isDisabled || isLoading}
      >
        Join waitlist
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
      </Button>
    </form>
  );
};

export default ButtonLead;
