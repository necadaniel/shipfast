import {
  AlertTriangle,
  MessageSquare,
  Mail,
  X,
  ArrowRight,
} from "lucide-react";

const ProblemCard = ({
  icon: Icon,
  title,
  description,
  danger = false,
}: {
  icon: any;
  title: string;
  description: string;
  danger?: boolean;
}) => {
  return (
    <div className={`relative group ${danger ? "md:col-span-2" : ""}`}>
      <div
        className={`
        h-full p-6 rounded-2xl corner-squircle transition-all duration-300
        ${
          danger
            ? "bg-gradient-to-br from-destructive/10 to-destructive/5 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(239,68,68,0.15)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_3px_12px_rgba(239,68,68,0.25)]"
            : "bg-background/60 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_3px_12px_rgba(0,0,0,0.3)]"
        }
        backdrop-blur-sm
        group-hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_4px_16px_rgba(0,0,0,0.12)] 
        dark:group-hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_6px_20px_rgba(0,0,0,0.4)]
      `}
      >
        <div
          className={`
          inline-flex p-3 rounded-xl corner-squircle mb-4
          ${
            danger
              ? "bg-destructive/20 text-destructive"
              : "bg-primary/10 text-primary"
          }
          shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
        `}
        >
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// Problem Agitation: Show developers the pain of managing secrets without proper tooling
// Emphasize security risks, workflow friction, and team collaboration issues
const Problem = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full corner-squircle bg-destructive/10 text-destructive mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">The Hidden Cost</span>
          </div>

          <h2 className="font-bold text-4xl lg:text-5xl tracking-tight mb-6 text-foreground">
            Your secrets are everywhere.
            <span className="block mt-2 text-destructive">
              And nowhere safe.
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Every developer knows the pain: switching devices, onboarding
            teammates, or just trying to remember where you put that API key
            from last month.
          </p>
        </div>

        {/* Problem Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <ProblemCard
            icon={MessageSquare}
            title="Slack & Email"
            description="Sending API keys through chat? That's a security breach waiting to happen."
          />

          <ProblemCard
            icon={Mail}
            title="Lost in Messages"
            description="Searching through months of DMs to find that one environment variable you shared."
          />

          <ProblemCard
            icon={X}
            title="Manual Sync Hell"
            description="Copy-pasting .env files between devices. Missing one variable breaks everything."
          />

          <ProblemCard
            icon={AlertTriangle}
            title="No Version Control"
            description="Git ignores .env for good reason, but now you have zero history or rollback."
          />
        </div>

        {/* Big danger callout */}
        <div className="grid md:grid-cols-3 gap-6">
          <ProblemCard
            icon={AlertTriangle}
            title="The Real Damage"
            description="One leaked API key can cost thousands in fraudulent charges. One missing variable breaks production. Your team wastes hours just trying to get their environment working. Meanwhile, your secrets are scattered across chat logs, note apps, and email threads—all unencrypted."
            danger={true}
          />

          {/* Visual flow element */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="text-6xl opacity-40">😰</div>
              <ArrowRight className="w-8 h-8 text-muted-foreground rotate-90 md:rotate-0" />
              <p className="text-sm text-center text-muted-foreground font-medium">
                There&apos;s a better way
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
