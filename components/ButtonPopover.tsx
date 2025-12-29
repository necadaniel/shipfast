"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, Flame, Gift, GraduationCap } from "lucide-react";

const ButtonPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          Popover Button
          <ChevronDown className="w-5 h-5 transition-transform duration-200 data-[state=open]:rotate-180" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-screen max-w-full sm:max-w-sm lg:max-w-2xl p-0" 
        align="start"
      >
        <div className="relative grid gap-4 p-4 lg:grid-cols-2">
          <div className="text-sm flex items-center gap-3 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg corner-squircle transition-colors duration-200">
            <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg corner-squircle bg-orange-500/20">
              <Flame className="w-6 h-6 text-orange-600" />
            </span>
            <div>
              <p className="font-bold">Get Started</p>
              <p className="text-muted-foreground">
                Loreum ipseum de la madre de papa
              </p>
            </div>
          </div>
          
          <div className="text-sm flex items-center gap-3 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg corner-squircle transition-colors duration-200">
            <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg corner-squircle bg-yellow-500/20">
              <Gift className="w-6 h-6 text-yellow-600" />
            </span>
            <div>
              <p className="font-bold">Rewards</p>
              <p className="text-muted-foreground">
                Loreum ipseum de el papi de la mama
              </p>
            </div>
          </div>
          
          <div className="text-sm flex items-center gap-3 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg corner-squircle transition-colors duration-200">
            <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg corner-squircle bg-green-500/20">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </span>
            <div>
              <p className="font-bold">Academics</p>
              <p className="text-muted-foreground">
                Loreum ipseum de la madre de papa
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ButtonPopover;
