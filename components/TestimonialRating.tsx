import { Star, Quote } from "lucide-react";

const TestimonialRating = () => {
  return (
    <div className="flex -gap-1 items-center mt-auto">
      <Quote className="w-8 h-8 fill-muted-foreground/40 text-muted-foreground/40 rotate-12 shrink-0" />
      
      <div>
        <p className="text-muted-foreground text-sm text-center">
          1000+ happy users
        </p>
        <div className="flex flex-row justify-center gap-0 pt-1">
          {[...Array(5)].map((e, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-yellow-500 text-yellow-500"
            />
          ))}
        </div>
      </div>
      
      <Quote className="w-8 h-8 fill-muted-foreground/40 text-muted-foreground/40 -rotate-12 shrink-0" />
    </div>
  );
};

export default TestimonialRating;
