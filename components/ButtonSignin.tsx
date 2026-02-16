"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import config from "@/config";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// A simple button to sign in with our providers (Google & Magic Links).
// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const ButtonSignin = ({
  text = "Get started",
  extraStyle,
}: {
  text?: string;
  extraStyle?: string;
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleClick = () => {
    if (status === "authenticated") {
      router.push(config.auth.callbackUrl);
    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  if (status === "authenticated") {
    return (
      <Button asChild className={cn("gap-2", extraStyle)}>
        <Link href={config.auth.callbackUrl}>
          <Avatar className="size-6">
            <AvatarImage
              src={session.user?.image || undefined}
              alt={session.user?.name || "Account"}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="text-xs">
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {session.user?.name || session.user?.email || "Account"}
        </Link>
      </Button>
    );
  }

  return (
    <Button className={cn(extraStyle)} onClick={handleClick}>
      {text}
    </Button>
  );
};

export default ButtonSignin;
