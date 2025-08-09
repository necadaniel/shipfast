import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  return (
    <section className="bg-muted overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">Pricing</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight text-foreground">
            Save hours of repetitive code and ship faster!
          </h2>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {config.stripe.plans.map((plan) => (
            <div key={plan.priceId} className="relative w-full max-w-lg">
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <Badge className="text-xs font-semibold bg-primary text-primary-foreground border-0">
                    POPULAR
                  </Badge>
                </div>
              )}

              {plan.isFeatured && (
                <div className="absolute -inset-[1px] rounded-[9px] bg-primary z-10"></div>
              )}

              <Card className="relative flex flex-col h-full z-10 bg-background border-border">
                <CardContent className="flex flex-col h-full gap-5 lg:gap-8 p-8">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <p className="text-lg lg:text-xl font-bold text-foreground">{plan.name}</p>
                      {plan.description && (
                        <p className="text-muted-foreground mt-2">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {plan.priceAnchor && (
                      <div className="flex flex-col justify-end mb-[4px] text-lg">
                        <p className="relative">
                          <span className="absolute bg-foreground h-[1.5px] inset-x-0 top-[53%]"></span>
                          <span className="text-muted-foreground">
                            ${plan.priceAnchor}
                          </span>
                        </p>
                      </div>
                    )}
                    <p className="text-5xl tracking-tight font-extrabold text-foreground">
                      ${plan.price}
                    </p>
                    <div className="flex flex-col justify-end mb-[4px]">
                      <p className="text-xs text-muted-foreground/80 uppercase font-semibold">
                        USD
                      </p>
                    </div>
                  </div>
                  
                  {plan.features && (
                    <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-foreground">
                          <Check className="w-[18px] h-[18px] text-muted-foreground shrink-0" />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="space-y-2">
                    <ButtonCheckout priceId={plan.priceId} />

                    <p className="flex items-center justify-center gap-2 text-sm text-center text-muted-foreground font-medium relative">
                      Pay once. Access forever.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
