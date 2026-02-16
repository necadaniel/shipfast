"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, CreditCard, Loader2, LogOut } from "lucide-react";
import apiClient from "@/libs/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ButtonAccount = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleBilling = async () => {
    setIsLoading(true);
    try {
      const { url }: { url: string } = await apiClient.post(
        "/stripe/create-portal",
        {
          returnUrl: window.location.href,
        }
      );
      window.location.href = url;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "unauthenticated") return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Avatar className="size-6">
            <AvatarImage
              src={session?.user?.image || undefined}
              alt={session?.user?.name || "Account"}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="text-xs">
              {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {session?.user?.name || "Account"}
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ChevronDown className="size-4 opacity-70" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleBilling} className="gap-2">
          <CreditCard className="size-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="gap-2"
          variant="destructive"
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonAccount;
