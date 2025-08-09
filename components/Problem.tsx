import { ArrowDown } from "lucide-react";

const Arrow = ({ extraStyle }: { extraStyle: string }) => {
  return (
    <ArrowDown className={`shrink-0 w-12 h-12 text-muted-foreground opacity-70 ${extraStyle}`} />
  );
};

const Step = ({ emoji, text }: { emoji: string; text: string }) => {
  return (
    <div className="w-full md:w-48 flex flex-col gap-2 items-center justify-center">
      <span className="text-4xl">{emoji}</span>
      <h3 className="font-bold text-foreground">{text}</h3>
    </div>
  );
};

// Problem Agitation: A crucial, yet overlooked, component for a landing page that sells.
// It goes under your Hero section, and above your Features section.
// Your Hero section makes a promise to the customer: "Our product will help you achieve XYZ".
// Your Problem section explains what happens to the customer if its problem isn't solved.
// The copy should NEVER mention your product. Instead, it should dig the emotional outcome of not fixing a problem.
// For instance:
// - Hero: "ShipFast helps developers launch startups fast"
// - Problem Agitation: "Developers spend too much time adding features, get overwhelmed, and quit." (not about ShipFast at all)
// - Features: "ShipFast has user auth, Stripe, emails all set up for you"
const Problem = () => {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
        <h2 className="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8">
          80% of startups fail because founders never launch
        </h2>
        <p className="max-w-xl mx-auto text-lg text-secondary-foreground/90 leading-relaxed mb-12 md:mb-20">
          Emails, DNS records, user authentication... There&apos;s so much going
          on.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
          <Step emoji="🧑‍💻" text="8 hrs to add Stripe" />

          <Arrow extraStyle="max-md:-scale-x-100 md:-rotate-90" />

          <Step emoji="😮‍💨" text="Struggle to find time" />

          <Arrow extraStyle="md:-scale-x-100 md:-rotate-90" />

          <Step emoji="😔" text="Quit project" />
        </div>
      </div>
    </section>
  );
};

export default Problem;
