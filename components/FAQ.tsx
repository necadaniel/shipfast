"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import config from "@/config";

// Add your own questions to faqList below. Answers accept any JSX.

interface FAQItem {
  question: string;
  answer: ReactNode;
}

const faqList: FAQItem[] = [
  {
    question: `What do I get exactly?`,
    answer: (
      <p>
        A production-ready Next.js app with authentication, Stripe billing,
        transactional emails, a protected dashboard and a component library — so
        you can start on your actual product instead of the plumbing.
      </p>
    ),
  },
  {
    question: "Can I get a refund?",
    answer: (
      <p>
        Yes. Request a refund within 7 days of your purchase by emailing{" "}
        {config.resend.supportEmail ?? "our support team"}.
      </p>
    ),
  },
  {
    question: "Do I need a database?",
    answer: (
      <p>
        MongoDB is used for user accounts and magic-link tokens. Add your
        connection string as <code>MONGODB_URI</code> and everything else works
        out of the box.
      </p>
    ),
  },
  {
    question: "I have another question",
    answer: (
      <p>
        Reach out at{" "}
        {config.resend.supportEmail ? (
          <a
            href={`mailto:${config.resend.supportEmail}`}
            className="text-primary hover:underline"
          >
            {config.resend.supportEmail}
          </a>
        ) : (
          "our support address"
        )}
        .
      </p>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItem }) => (
  <Collapsible className="group border-border border-t">
    <CollapsibleTrigger className="hover:text-primary flex w-full items-center gap-2 py-5 text-left text-base font-semibold transition-colors md:text-lg">
      <span className="flex-1">{item.question}</span>
      <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
      <div className="text-muted-foreground pb-5 leading-relaxed">
        {item.answer}
      </div>
    </CollapsibleContent>
  </Collapsible>
);

const FAQ = () => {
  return (
    <section className="bg-muted/30" id="faq">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 lg:flex-row lg:px-8 lg:py-28">
        <div className="flex flex-col lg:basis-1/2">
          <p className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
            FAQ
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="lg:basis-1/2">
          {faqList.map((item) => (
            <FaqItem key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
