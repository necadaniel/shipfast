import { Check, X } from "lucide-react";
import config from "@/config";

// Use this section when your product challenges the status quo.
// Keep the two lists the same length and match them line for line, so the
// reader can compare them at a glance.

const without = [
  "Wire up auth, billing and emails from scratch",
  "Debug Stripe webhooks for a weekend",
  "Rebuild the same dashboard shell every time",
  "Copy-paste config between half-finished projects",
  "Lose momentum before launching",
];

const with_ = [
  "Auth, billing and emails already connected",
  "Webhook lifecycle handled and documented",
  "Protected dashboard layout ready to extend",
  "One config file drives the whole app",
  "Ship the first paid feature on day one",
];

const WithWithout = () => {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
        <h2 className="mb-14 text-center text-3xl font-extrabold tracking-tight md:text-5xl">
          Stop rebuilding the same foundation
        </h2>

        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="border-destructive/30 bg-destructive/5 corner-squircle w-full rounded-2xl border p-8">
            <h3 className="mb-5 text-lg font-bold">Starting from scratch</h3>
            <ul className="space-y-3">
              {without.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <X className="text-destructive mt-0.5 size-4 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-primary/30 bg-primary/5 corner-squircle w-full rounded-2xl border p-8">
            <h3 className="mb-5 text-lg font-bold">With {config.appName}</h3>
            <ul className="space-y-3">
              {with_.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check className="text-primary mt-0.5 size-4 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WithWithout;
