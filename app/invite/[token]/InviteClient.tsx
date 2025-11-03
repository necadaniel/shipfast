"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  Users,
  Mail,
  Clock,
  Shield,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import apiClient from "@/libs/api";

interface InvitationData {
  team: {
    id: string;
    name: string;
    owner: {
      name: string;
      email: string;
      image: string | null;
    };
    memberCount: number;
  };
  invitation: {
    email: string;
    role: string;
    invitedBy: {
      name: string;
      email: string;
      image: string | null;
    };
    sentAt: string;
    expiresAt: string;
  };
  token: string;
  isAuthenticated: boolean;
  userEmail: string | null;
}

export default function InviteClient({ data }: { data: InvitationData }) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [emailMismatch, setEmailMismatch] = useState(false);

  useEffect(() => {
    // Check if user is authenticated but with wrong email
    if (data.isAuthenticated && data.userEmail) {
      if (
        data.userEmail.toLowerCase() !== data.invitation.email.toLowerCase()
      ) {
        setEmailMismatch(true);
      }
    }
  }, [data]);

  const handleAcceptInvitation = async () => {
    try {
      setIsAccepting(true);

      await apiClient.post(`/invite/${data.token}/accept`, {});

      toast.success(`Welcome to ${data.team.name}! 🎉`);

      // Redirect to team page
      setTimeout(() => {
        router.push("/dashboard/team");
      }, 1000);
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to accept invitation";
      toast.error(errorMessage);
      setIsAccepting(false);
    }
  };

  const handleSignInWithCorrectEmail = async () => {
    // Store the invitation token in sessionStorage so we can redirect back after login
    sessionStorage.setItem("pendingInvite", data.token);
    // Redirect to sign in page
    await signIn(undefined, { callbackUrl: `/invite/${data.token}` });
  };

  const handleCreateAccount = async () => {
    // Store the invitation token so we can redirect back after signup
    sessionStorage.setItem("pendingInvite", data.token);
    // Redirect to sign up page
    router.push(`/api/auth/signin?callbackUrl=/invite/${data.token}`);
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === "admin")
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    if (role === "member") return "bg-primary/10 text-primary";
    if (role === "viewer")
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    return "bg-muted text-muted-foreground";
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(data.invitation.expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours} hours` : "Less than 1 hour";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
          {/* Header */}
          <div className="p-8 border-b border-border/50">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              You&apos;re Invited!
            </h1>
            <p className="text-center text-muted-foreground">
              Join {data.team.name} and start collaborating
            </p>
          </div>

          {/* Team Info */}
          <div className="p-8 space-y-6">
            {/* Team Card */}
            <div className="bg-background/50 rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {data.team.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{data.team.memberCount} members</span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleBadgeColor(
                    data.invitation.role
                  )}`}
                >
                  <Shield className="w-3 h-3" />
                  <span className="capitalize">{data.invitation.role}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-3">
                  Invited by:
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={data.invitation.invitedBy.image || undefined}
                    />
                    <AvatarFallback>
                      {data.invitation.invitedBy.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {data.invitation.invitedBy.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.invitation.invitedBy.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invitation Details */}
            <div className="bg-background/50 rounded-lg p-6 space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Invitation sent to:
                  </p>
                  <p className="font-medium">{data.invitation.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Expires in:</p>
                  <p className="font-medium">{getTimeRemaining()}</p>
                </div>
              </div>
            </div>

            {/* Email Mismatch Warning */}
            {emailMismatch && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  ⚠️ You&apos;re currently signed in as{" "}
                  <strong>{data.userEmail}</strong>, but this invitation was
                  sent to <strong>{data.invitation.email}</strong>. Please sign
                  in with the correct email address to accept this invitation.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4">
              {data.isAuthenticated && !emailMismatch ? (
                <Button
                  onClick={handleAcceptInvitation}
                  disabled={isAccepting}
                  className="w-full"
                  size="lg"
                >
                  {isAccepting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Joining Team...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Accept Invitation
                    </>
                  )}
                </Button>
              ) : emailMismatch ? (
                <Button
                  onClick={handleSignInWithCorrectEmail}
                  className="w-full"
                  size="lg"
                >
                  Sign in with {data.invitation.email}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCreateAccount}
                    className="w-full"
                    size="lg"
                  >
                    Create Account & Join Team
                  </Button>
                  <Button
                    onClick={handleSignInWithCorrectEmail}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Already have an account? Sign In
                  </Button>
                </>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By accepting this invitation, you agree to collaborate with the
              team and follow their guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
