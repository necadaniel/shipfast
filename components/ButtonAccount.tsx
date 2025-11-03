/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import apiClient from "@/libs/api";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown, CreditCard, Loader2, LogOut, User } from "lucide-react";

// A button to show user some account actions
//  1. Billing: open a Stripe Customer Portal to manage their billing (cancel subscription, update payment method, etc.).
//     You have to manually activate the Customer Portal in your Stripe Dashboard (https://dashboard.stripe.com/test/settings/billing/portal)
//     This is only available if the customer has a customerId (they made a purchase previously)
//  2. Logout: sign out and go back to homepage
// See more at https://shipfa.st/docs/components/buttonAccount
const ButtonAccount = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleSignIn = () => {
    signIn();
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
    }

    setIsLoading(false);
  };

  if (status === "unauthenticated") {
    return (
      <Button variant="outline" onClick={handleSignIn}>
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-auto px-3 py-2.5 hover:bg-muted/50 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_2px_4px_rgba(0,0,0,0.05)]"
        >
          {session?.user?.image ? (
            <img
              src={session?.user?.image}
              alt={session?.user?.name || "Account"}
              className="w-8 h-8 rounded-full shrink-0"
              referrerPolicy="no-referrer"
              width={32}
              height={32}
            />
          ) : (
            <div className="w-8 h-8 bg-primary/20 flex justify-center items-center rounded-full shrink-0 text-primary font-semibold text-sm">
              {session?.user?.name?.charAt(0) ||
                session?.user?.email?.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-foreground truncate">
              {session?.user?.name || session?.user?.email || "Account"}
            </p>
            <p className="text-xs text-muted-foreground truncate">Solo Plan</p>
          </div>

          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 opacity-50 transition-transform duration-200 shrink-0 data-[state=open]:rotate-180" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-1" align="start" side="top">
        <div className="space-y-0.5 text-sm">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto py-2 px-3 font-medium text-left"
            onClick={handleBilling}
          >
            <CreditCard className="w-4 h-4" />
            Billing
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto py-2 px-3 font-medium text-left hover:bg-destructive/10 hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ButtonAccount;
