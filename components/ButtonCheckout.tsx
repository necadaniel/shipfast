"use client";

import { useState } from "react";
import apiClient from "@/libs/api";
import config from "@/config";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";

// Starts a Stripe Checkout session for a given price.
// The payment mode (one-time vs subscription) is read from config.stripe.plans
// server-side, so it can't be tampered with from the browser.
const ButtonCheckout = ({
  priceId,
  label,
}: {
  priceId: string;
  label?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const { url } = await apiClient.post<{ url: string }>(
        "/stripe/create-checkout",
        {
          priceId,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
        }
      );

      window.location.href = url;
    } catch {
      // apiClient already showed a toast
      setIsLoading(false);
    }
  };

  // No price configured yet — don't send an empty priceId to Stripe
  const isConfigured = Boolean(priceId);

  return (
    <Button
      className="w-full gap-2"
      onClick={handlePayment}
      disabled={isLoading || !isConfigured}
      title={isConfigured ? undefined : "Add this plan's Stripe price ID first"}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Rocket className="size-4" />
      )}
      {label ?? `Get ${config.appName}`}
    </Button>
  );
};

export default ButtonCheckout;
