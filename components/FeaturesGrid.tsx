/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";

const features = [
  {
    title: "Collect user feedback",
    description:
      "Use your Insighto's board to let users submit features they want.",
    styles: "bg-primary text-primary-foreground",
    demo: (
      <div className="overflow-hidden h-full flex items-stretch">
        <div className="w-full translate-x-12 bg-muted rounded-t-3xl h-full p-6">
          <p className="font-medium uppercase tracking-wide text-muted-foreground text-sm mb-3">
            Suggest a feature
          </p>
          <div className="relative h-full mr-12 bg-muted group-hover:bg-background border border-border rounded-md p-4 group-hover:border-border/50 text-foreground">
            <div className="absolute left-4 top-4 group-hover:hidden flex items-center">
              <span>Notifica</span>
              <span className="w-[2px] h-6 bg-primary animate-pulse ml-1"></span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 duration-500">
              Notifications should be visible only on certain pages.
            </div>
            <div className="opacity-0 group-hover:opacity-100 duration-1000 flex items-center gap-0.5">
              <span>Terms & privacy pages don&apos;t need them</span>
              <span className="w-[2px] h-6 bg-primary animate-pulse"></span>
            </div>
            <Button className="shadow-lg absolute right-4 bottom-6 opacity-0 group-hover:opacity-100 duration-1000">
              Submit
            </Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Prioritize features",
    description: "Users upvote features. You know what to ship next.",
    styles: "md:col-span-2 bg-muted text-foreground",
    demo: (
      <div className="px-6 max-w-[600px] flex flex-col gap-4 overflow-hidden">
        {[
          {
            text: "Add LemonSqueezy integration to the boilerplate",
            secondaryText: "Yes, ship this! ✅",
            votes: 48,
            transition: "group-hover:-mt-36 group-hover:md:-mt-28 duration-500",
          },
          {
            text: "A new pricing table for metered billing",
            secondaryText: "Maybe ship this 🤔",
            votes: 12,
          },
          {
            text: "A new UI library for the dashboard",
            secondaryText: "But don't ship that ❌",
            votes: 1,
          },
        ].map((feature, i) => (
          <Card
            className={`bg-background text-foreground mb-2 ${feature?.transition}`}
            key={i}
          >
            <CardContent className="p-4 flex justify-between gap-4">
              <div>
                <p className="font-semibold mb-1">{feature.text}</p>
                <p className="text-muted-foreground">{feature.secondaryText}</p>
              </div>
              <Button
                variant="default"
                size="sm"
                className="px-4 py-2 rounded-lg text-center text-lg border border-transparent group"
              >
                <ChevronUp className="w-5 h-5 ease-in-out duration-150 -translate-y-0.5 group-hover:translate-y-0" />
                {feature.votes}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
  {
    title: "Your brand, your board",
    description: "Customize your Insighto board with 7 themes.",
    styles: "md:col-span-2 bg-background text-foreground",
    demo: (
      <div className="flex left-0 w-full h-full pt-0 lg:pt-8 overflow-hidden -mt-4">
        <div className="-rotate-[8deg] flex min-w-max overflow-x-visible h-full lg:pt-4">
          {[
            {
              buttonStyles: "bg-primary text-primary-foreground",
              css: "-ml-1 rotate-[6deg] w-72 h-72 z-30 bg-muted text-foreground rounded-2xl group-hover:-ml-64 group-hover:opacity-0 group-hover:scale-75 transition-all duration-500 p-4",
            },
            {
              buttonStyles: "bg-secondary text-secondary-foreground",
              css: "rotate-[6deg] bg-muted text-foreground w-72 h-72 -mr-20 -ml-20 z-20 rounded-xl p-4",
            },
            {
              buttonStyles: "bg-accent text-accent-foreground",
              css: "rotate-[6deg] bg-muted text-foreground z-10 w-72 h-72 rounded-xl p-4",
            },
            {
              buttonStyles: "bg-destructive text-destructive-foreground",
              css: "rotate-[6deg] bg-muted text-foreground w-72 h-72 -ml-20 rounded-xl p-4",
            },
            {
              buttonStyles: "bg-background text-foreground border border-border",
              css: "rotate-[6deg] bg-muted text-foreground w-72 h-72 -ml-10 -z-10 rounded-xl p-4 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300",
            },
          ].map((theme, i) => (
            <div className={theme.css} key={i}>
              <div className="font-medium uppercase tracking-wide text-muted-foreground text-sm mb-3">
                Trending feedback
              </div>
              <div className="space-y-2">
                <Card className="bg-background">
                  <CardContent className="p-4 flex justify-between">
                    <div>
                      <p className="font-semibold mb-1">Clickable cards</p>
                      <p className="text-muted-foreground">Make cards more accessible</p>
                    </div>
                    <Button
                      size="sm"
                      className={`px-4 py-2 rounded-lg group text-center text-lg duration-150 border border-transparent ${theme.buttonStyles}`}
                    >
                      <ChevronUp className="w-5 h-5 ease-in-out duration-150 -translate-y-0.5 group-hover:translate-y-0" />
                      8
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-background">
                  <CardContent className="p-4 flex justify-between">
                    <div>
                      <p className="font-semibold mb-1">Bigger images</p>
                      <p className="text-muted-foreground">Make cards more accessible</p>
                    </div>
                    <Button
                      size="sm"
                      className={`px-4 py-2 rounded-lg group text-center text-lg duration-150 border border-transparent ${theme.buttonStyles}`}
                    >
                      <ChevronUp className="w-5 h-5 ease-in-out duration-150 -translate-y-0.5 group-hover:translate-y-0" />
                      5
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Discover new ideas",
    description: "Users can chat and discuss features.",
    styles: "bg-secondary text-secondary-foreground",
    demo: (
      <div className="px-6 space-y-4">
        {[
          {
            id: 1,
            text: "Can we have a feature to add a custom domain to IndiePage?",
            userImg:
              "https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg",
            userName: "Marc Lou",
            createdAt: "2024-09-01T00:00:00Z",
          },
          {
            id: 2,
            text: "I'd definitelly pay for that 🤩",
            userImg:
              "https://pbs.twimg.com/profile_images/1778434561556320256/knBJT1OR_400x400.jpg",
            userName: "Dan K.",
            createdAt: "2024-09-02T00:00:00Z",
            transition:
              "opacity-0 group-hover:opacity-100 duration-500 translate-x-1/4 group-hover:translate-x-0",
          },
        ]?.map((reply) => (
          <Card
            key={reply.id}
            className={`bg-background text-foreground ${reply?.transition}`}
          >
            <CardContent className="p-6">
              <div className="mb-2 whitespace-pre-wrap">{reply.text}</div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={reply.userImg} alt={reply.userName} />
                    <AvatarFallback>
                      {reply.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>{reply.userName}</div>
                </div>
                •
                <div>
                  {new Date(reply.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
];

const FeaturesGrid = () => {
  return (
    <section className="flex justify-center items-center w-full bg-muted/30 text-foreground py-20 lg:py-32">
      <div className="flex flex-col max-w-[82rem] gap-16 md:gap-20 px-4">
        <h2 className="max-w-3xl font-black text-4xl md:text-6xl tracking-[-0.01em]">
          Ship features <br /> users{" "}
          <span className="underline decoration-dashed underline-offset-8 decoration-muted-foreground">
            really want
          </span>
        </h2>
        <div className="flex flex-col w-full h-fit gap-4 lg:gap-10 max-w-[82rem]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`${feature.styles} rounded-3xl flex flex-col gap-6 w-full h-[22rem] lg:h-[25rem] pt-6 overflow-hidden group`}
              >
                <div className="px-6 space-y-2">
                  <h3 className="font-bold text-xl lg:text-3xl tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="opacity-80">{feature.description}</p>
                </div>
                {feature.demo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
