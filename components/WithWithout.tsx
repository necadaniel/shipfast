import { X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// A useful component when your product is challenging the status quo.
// Highlight the current pain points (left) and how your product is solving them (right)
// Try to match the lines from left to right, so the user can easily compare the two columns
const WithWithout = () => {
  return (
    <section className="bg-background">
      <div className="max-w-5xl mx-auto px-8 py-16 md:py-32">
        <h2 className="text-center font-extrabold text-3xl md:text-5xl tracking-tight mb-12 md:mb-20 text-foreground">
          Tired of managing Stripe invoices?
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30 w-full">
            <CardContent className="p-8 md:p-12">
              <h3 className="font-bold text-lg mb-4 text-red-700 dark:text-red-400">
                Stripe invoices without ZenVoice
              </h3>

              <ul className="space-y-1.5">
                {/* Pains the user is experiencing by not using your product */}
                {[
                  "Manually create invoices",
                  "Or pay up to $2 per invoice",
                  "Waste hours in customer support",
                  "Can't update details once sent (VAT, Tax ID)",
                  "Can't make invoices for previous purchases",
                ].map((item, index) => (
                  <li key={index} className="flex gap-2 items-center text-red-700 dark:text-red-400">
                    <X className="w-4 h-4 shrink-0 opacity-75" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30 w-full">
            <CardContent className="p-8 md:p-12">
              <h3 className="font-bold text-lg mb-4 text-green-700 dark:text-green-400">
                Stripe invoices + ZenVoice
              </h3>

              <ul className="space-y-1.5">
                {/* Features of your product fixing the pain (try to match each with/without lines) */}
                {[
                  "Self-serve invoices",
                  "One-time payment for unlimited invoices",
                  "No more customer support",
                  "Editable invoices to stay compliant",
                  "Invoices for any payment, even past ones",
                ].map((item, index) => (
                  <li key={index} className="flex gap-2 items-center text-green-700 dark:text-green-400">
                    <Check className="w-4 h-4 shrink-0 opacity-75" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WithWithout;
