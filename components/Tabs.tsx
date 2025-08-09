"use client";

import type { JSX } from "react";
import { Tabs as ShadcnTabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Tablet, Monitor } from "lucide-react";

interface Tab {
  id: string;
  title: string;
  icon?: JSX.Element;
  content: JSX.Element;
}

// The list of tabs to be displayed. It only shows the content of the active tab.
// - icon is optional
// - title is required
// - content is required, it's the content to be displayed when the tab is active

const tabs: Tab[] = [
  {
    id: "mobile",
    title: "Mobile",
    icon: <Smartphone className="w-5 h-5" />,
    content: (
      <div className="space-y-2">
        <p>
          <strong>Device:</strong> iPhone 13 Pro
        </p>
        <p>
          <strong>Screen Size:</strong> 6.1 inches
        </p>
        <p>
          <strong>Resolution:</strong> 2532 x 1170 pixels
        </p>
        <p>
          <strong>Processor:</strong> A15 Bionic chip
        </p>
        <p>
          <strong>RAM:</strong> 6 GB
        </p>
        <p>
          <strong>Storage:</strong> 256 GB
        </p>
        <p>
          <strong>Battery:</strong> 3095 mAh
        </p>
      </div>
    ),
  },
  {
    id: "tablet",
    title: "Tablet",
    icon: <Tablet className="w-5 h-5" />,
    content: (
      <div className="space-y-2">
        <p>
          <strong>Device:</strong> iPad Pro (12.9-inch)
        </p>
        <p>
          <strong>Screen Size:</strong> 12.9 inches
        </p>
        <p>
          <strong>Resolution:</strong> 2732 x 2048 pixels
        </p>
        <p>
          <strong>Processor:</strong> A12X Bionic chip
        </p>
        <p>
          <strong>RAM:</strong> 4 GB
        </p>
        <p>
          <strong>Storage:</strong> 256 GB
        </p>
        <p>
          <strong>Battery:</strong> 10000 mAh
        </p>
      </div>
    ),
  },
  {
    id: "desktop",
    title: "Desktop",
    icon: <Monitor className="w-5 h-5" />,
    content: (
      <div className="space-y-2">
        <p>
          <strong>Device:</strong> MacBook Pro (16-inch)
        </p>
        <p>
          <strong>Screen Size:</strong> 16 inches
        </p>
        <p>
          <strong>Resolution:</strong> 3072 x 1920 pixels
        </p>
        <p>
          <strong>Processor:</strong> Apple M3 chip
        </p>
        <p>
          <strong>RAM:</strong> 16 GB
        </p>
        <p>
          <strong>Storage:</strong> 1 TB
        </p>
        <p>
          <strong>Battery:</strong> 10000 mAh
        </p>
      </div>
    ),
  },
];

const Tabs = () => {
  return (
    <section className="max-w-lg mx-auto">
      <ShadcnTabs defaultValue={tabs[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground"
            >
              {tab.icon}
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="mt-4 animate-in fade-in-50 duration-200"
          >
            {tab.content}
          </TabsContent>
        ))}
      </ShadcnTabs>
    </section>
  );
};

export default Tabs;
