"use client";

import React from "react";
import { Button } from "@/components/ui/button";

const ButtonGradient = ({
  title = "Gradient Button",
  onClick = () => {},
}: {
  title?: string;
  onClick?: () => void;
}) => {
  return (
    <Button
      className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 text-white hover:opacity-95"
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default ButtonGradient;
