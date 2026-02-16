"use client";

import { Crisp } from "crisp-sdk-web";
import config from "@/config";
import { Button } from "@/components/ui/button";
import { LifeBuoy } from "lucide-react";

// Use this button if chat is hidden on some routes. config.js has onlyShowOnRoutes set to ["/"] so it will be hidden on all routes except the home page.
// If Crisp is not enable, it will open the support email in the default email client.
const ButtonSupport = () => {
  const handleClick = () => {
    if (config.crisp?.id) {
      Crisp.chat.show();
      Crisp.chat.open();
    } else if (config.resend?.supportEmail) {
      // open default email client in new window with "need help with ${config.appName}" as subject
      window.open(
        `mailto:${config.resend.supportEmail}?subject=Need help with ${config.appName}`,
        "_blank"
      );
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleClick}
      data-tooltip-id="tooltip"
      data-tooltip-content="Talk to support"
      title="Chat with support"
    >
      <LifeBuoy className="size-4" />
      Support
    </Button>
  );
};

export default ButtonSupport;
