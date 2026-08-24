import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ⚠️ PLACEHOLDER CONTENT — replace with real quotes before launching.
// Never ship invented testimonials: it's a legal risk in most markets and
// readers spot generic praise immediately.
//
// The best quotes name a specific outcome ("cut our onboarding from 3 days to
// 2 hours") rather than offering vague enthusiasm.

const testimonials = [
  {
    name: "Your Customer",
    role: "Founder, Company",
    quote:
      "Replace this with a real quote that names a concrete result your product produced.",
  },
  {
    name: "Another Customer",
    role: "CTO, Company",
    quote:
      "Quotes that mention a number, a timeframe or a specific workflow convert far better than generic praise.",
  },
  {
    name: "A Third Customer",
    role: "Indie Maker",
    quote:
      "Ask for permission to use a real name, role and photo — attribution is what makes social proof credible.",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-muted/25 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
            Testimonials
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            What people are saying
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.name}
              className="border-border bg-background corner-squircle flex flex-col rounded-2xl border p-6"
            >
              <div className="mb-3 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              <blockquote className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs">
                    {initials(testimonial.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;
