import ButtonSignin from "./ButtonSignin";
import config from "@/config";

const CTA = () => {
  return (
    <section className="px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-muted/40 p-10 text-center shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to ship your next SaaS faster?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Reuse this foundation, focus on product value, and skip repetitive
          setup work on every new project.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonSignin text={`Get ${config.appName}`} />
        </div>
      </div>
    </section>
  );
};

export default CTA;
