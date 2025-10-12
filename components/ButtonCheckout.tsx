"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, Check } from "lucide-react";
import apiClient from "@/libs/api";
import config from "@/config";
import { toast } from "react-hot-toast";

// This component is used to create Stripe Checkout Sessions
// It calls the /api/stripe/create-checkout route with the priceId, successUrl and cancelUrl
// It requires users to be authenticated before proceeding to checkout
// If not logged in, redirects to sign in page with callback to complete checkout
// You can also change the mode to "subscription" if you want to create a subscription instead of a one-time payment
const ButtonCheckout = ({
  priceId,
  mode = "payment",
}: {
  priceId: string;
  mode?: "payment" | "subscription";
}) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  // Fetch user's current plan
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchUserPlan();
    }
  }, [status, session]);

  const fetchUserPlan = async () => {
    try {
      const response = await fetch("/api/user/plan");
      if (response.ok) {
        const data = await response.json();
        setUserPlan(data.plan);
      }
    } catch (error) {
      console.error("Error fetching user plan:", error);
    }
  };

  // Check for pending checkout after login
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const pendingCheckout = sessionStorage.getItem("pendingCheckout");
      if (pendingCheckout) {
        // Clear the pending checkout
        sessionStorage.removeItem("pendingCheckout");

        // Parse and proceed with checkout
        const checkoutData = JSON.parse(pendingCheckout);
        proceedToCheckout(checkoutData);
      }
    }
  }, [status, session]);

  const proceedToCheckout = async (checkoutData: {
    priceId: string;
    mode: string;
    successUrl: string;
    cancelUrl: string;
  }) => {
    setIsLoading(true);

    try {
      const { url }: { url: string } = await apiClient.post(
        "/stripe/create-checkout",
        checkoutData
      );

      window.location.href = url;
    } catch (e: any) {
      console.error(e);
      // Show error message to user
      const errorMessage = e?.message || "Failed to start checkout";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Check if user is authenticated
      if (status === "unauthenticated" || !session?.user) {
        // Store checkout details in sessionStorage to resume after login
        sessionStorage.setItem(
          "pendingCheckout",
          JSON.stringify({
            priceId,
            mode,
            successUrl: window.location.href,
            cancelUrl: window.location.href,
          })
        );

        // Redirect to sign in with callback to current page
        window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(
          window.location.href
        )}`;
        return;
      }

      // Check plan restrictions
      const soloPlan = config.stripe.plans.find(
        (p) => p.name === "Solo Developer"
      );
      const teamPlan = config.stripe.plans.find((p) => p.name === "Team");
      const isPurchasingSolo = priceId === soloPlan?.priceId;
      const isPurchasingTeam = priceId === teamPlan?.priceId;

      if (userPlan === "team") {
        toast.error(
          "You already have the Team plan. To downgrade, please contact support."
        );
        setIsLoading(false);
        return;
      }

      if (userPlan === "solo" && isPurchasingSolo) {
        toast.error("You already have the Solo plan.");
        setIsLoading(false);
        return;
      }

      // User is authenticated and plan is valid, proceed with checkout
      await proceedToCheckout({
        priceId,
        mode,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  // Determine button state
  const soloPlan = config.stripe.plans.find((p) => p.name === "Solo Developer");
  const teamPlan = config.stripe.plans.find((p) => p.name === "Team");
  const isPurchasingSolo = priceId === soloPlan?.priceId;
  const isPurchasingTeam = priceId === teamPlan?.priceId;

  const isCurrentPlan =
    (userPlan === "solo" && isPurchasingSolo) ||
    (userPlan === "team" && (isPurchasingSolo || isPurchasingTeam));

  if (isCurrentPlan) {
    return (
      <Button className="group" size="lg" disabled variant="outline">
        <Check className="w-5 h-5 mr-2" />
        {userPlan === "team" && isPurchasingSolo
          ? "Current Plan (Team)"
          : "Current Plan"}
      </Button>
    );
  }

  return (
    <Button
      className="group"
      size="lg"
      onClick={handlePayment}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Zap className="w-5 h-5 fill-primary-foreground group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200" />
      )}
      {userPlan === "solo" && isPurchasingTeam ? "Upgrade" : "Get"}{" "}
      {config?.appName}
    </Button>
  );
};

export default ButtonCheckout;
