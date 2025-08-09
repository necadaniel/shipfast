import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// A one or two sentences testimonial from a customer.
// Highlight the outcome for your customer (how did your product changed her/his life?) or the pain it's removing — Use <span className="bg-warning/25 px-1.5"> to highlight a part of the sentence
const Testimonial1Small = () => {
  return (
    <section className="bg-background">
      <div className="space-y-6 md:space-y-8 max-w-lg mx-auto px-8 py-16 md:py-32">
        <div className="flex justify-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        
        <div className="text-base leading-relaxed space-y-2 max-w-md mx-auto text-center text-foreground">
          <p>
            <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1.5 rounded">
              I don&apos;t want to pay Stripe $2 for every invoice.
            </span>{" "}
            I don&apos;t want to spend 10 minutes manually crafting every
            invoice either.
          </p>
          <p>
            Zenvoice solved this problem once and for all. The app is simple,
            but it nails the job perfectly.
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-3 md:gap-4">
          <Avatar className="w-10 h-10 md:w-12 md:h-12">
            <AvatarImage
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="XYZ feedback for ZenVoice"
            />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">Someone Nice</p>
            <p className="text-muted-foreground text-sm">23.1K followers on 𝕏</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial1Small;
