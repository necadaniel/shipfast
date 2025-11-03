import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden" id="pricing">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Simple Pricing</span>
          </div>

          <h2 className="font-bold text-4xl lg:text-5xl tracking-tight mb-6 text-foreground">
            Choose your plan.
            <span className="block mt-2">Pay once. Own forever.</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            No subscriptions. No hidden fees. Just secure environment sync that
            works.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8 max-w-5xl mx-auto">
          {config.stripe.plans.map((plan) => (
            <div
              key={plan.priceId}
              className={`
                relative w-full max-w-lg group
                ${plan.isFeatured ? "lg:scale-105" : ""}
              `}
            >
              {/* Popular badge */}
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <Badge className="text-xs font-semibold bg-primary text-primary-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_6px_16px_rgba(0,0,0,0.4)] border-0 px-4 py-1.5">
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              {/* Card */}
              <div
                className={`
                relative flex flex-col h-full rounded-2xl overflow-hidden
                ${
                  plan.isFeatured
                    ? "bg-gradient-to-br from-primary/10 via-background to-background"
                    : "bg-background"
                }
                shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.12)]
                dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_12px_48px_rgba(0,0,0,0.3)]
                group-hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_12px_40px_rgba(0,0,0,0.15)]
                dark:group-hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_16px_56px_rgba(0,0,0,0.4)]
                transition-all duration-300
                backdrop-blur-sm
                ${
                  plan.isFeatured
                    ? "border-2 border-primary/20"
                    : "border border-border/40"
                }
              `}
              >
                <div className="flex flex-col h-full gap-6 lg:gap-8 p-8 lg:p-10">
                  {/* Plan Header */}
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p className="text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3">
                    {plan.priceAnchor && (
                      <div className="flex items-center">
                        <span className="relative text-2xl text-muted-foreground">
                          <span className="absolute inset-0 flex items-center">
                            <span className="w-full h-[2px] bg-destructive"></span>
                          </span>
                          ${plan.priceAnchor}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground font-medium">
                        USD
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  {plan.features && (
                    <ul className="space-y-4 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className={`
                            mt-0.5 p-1 rounded-md shrink-0
                            ${
                              plan.isFeatured
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }
                            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
                          `}
                          >
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="text-foreground leading-relaxed">
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA */}
                  <div className="space-y-4">
                    <ButtonCheckout priceId={plan.priceId} mode="payment" />

                    <p className="text-sm text-center text-muted-foreground">
                      One-time payment • Lifetime access
                    </p>
                  </div>
                </div>

                {/* Shine effect on hover */}
                {plan.isFeatured && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground">
            All plans include end-to-end encryption, real-time sync, and CLI
            access.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
