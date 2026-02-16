import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  return (
    <section className="overflow-hidden bg-background py-20 lg:py-28" id="pricing">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Pick the plan that matches your build velocity
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {config.stripe.plans.map((plan) => (
            <article
              key={plan.priceId}
              className={`relative rounded-2xl border p-8 shadow-sm ${
                plan.isFeatured
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/20"
              }`}
            >
              {plan.isFeatured && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Popular
                </Badge>
              )}

              <div className="mb-5 space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
                {plan.description && (
                  <p className="text-muted-foreground">{plan.description}</p>
                )}
              </div>

              <div className="mb-6 flex items-end gap-2">
                {plan.priceAnchor && (
                  <span className="pb-1 text-lg text-muted-foreground line-through">
                    ${plan.priceAnchor}
                  </span>
                )}
                <span className="text-5xl font-extrabold tracking-tight">
                  ${plan.price}
                </span>
                <span className="pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  USD
                </span>
              </div>

              {plan.features?.length > 0 && (
                <ul className="mb-7 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.name}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="space-y-2">
                <ButtonCheckout priceId={plan.priceId} />
                <p className="text-center text-sm text-muted-foreground">
                  Secure Stripe checkout.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
