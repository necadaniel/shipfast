import {
  CreditCard,
  LockKeyhole,
  Mail,
  Rocket,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Authentication Included",
    description:
      "Google + magic links with protected routes and session-aware APIs out of the box.",
    icon: LockKeyhole,
    bullets: ["NextAuth v5", "Session callbacks", "Private dashboard layout"],
  },
  {
    title: "Stripe Billing Flow",
    description:
      "Checkout, customer portal, and webhook lifecycle already wired into your user model.",
    icon: CreditCard,
    bullets: ["Checkout endpoint", "Billing portal endpoint", "Webhook plan sync"],
  },
  {
    title: "Production UI Foundation",
    description:
      "shadcn + Radix primitives with Tailwind v4 tokens ready for SaaS-grade interfaces.",
    icon: ShieldCheck,
    bullets: ["Theme variables", "Reusable UI primitives", "Accessible interactions"],
  },
  {
    title: "Launch Velocity",
    description:
      "Focus on product logic while core plumbing is already stable and reusable.",
    icon: Rocket,
    bullets: ["API client wrapper", "Email integration", "SEO metadata helpers"],
  },
];

const quickWins = [
  { icon: Zap, text: "Ship first paid feature in hours" },
  { icon: Mail, text: "Transactional email setup included" },
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="bg-muted/25 py-20 lg:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            Build once, launch repeatedly
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            This starter removes repetitive setup work so each new SaaS project
            starts from a tested foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-border bg-background p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-xl border border-border bg-muted/40 p-2.5">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-2 text-2xl font-bold tracking-tight">
                {feature.title}
              </h3>
              <p className="mb-4 text-muted-foreground">{feature.description}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-[2px] size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickWins.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"
            >
              <item.icon className="size-4 text-primary" />
              <span className="text-sm font-medium text-foreground/90">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
