"use client";

import { useState, useEffect, useRef } from "react";
import type { JSX } from "react";
import { Mail, CreditCard, User, Database, FileText, Palette, Check } from "lucide-react";

// List of features to display:
// - name: name of the feature
// - description: description of the feature (can be any JSX)
// - icon: icon of the feature
const features: {
  name: string;
  description: JSX.Element;
  icon: JSX.Element;
}[] = [
  {
    name: "Emails",
    description: (
      <>
        <ul className="space-y-1">
          {[
            "Send transactional emails",
            "DNS setup to avoid spam folder (DKIM, DMARC, SPF in subdomain)",
            "Webhook to receive & forward emails",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <Check className="w-[18px] h-[18px] shrink-0 text-muted-foreground" />
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-accent-foreground font-medium">
            <Check className="w-[18px] h-[18px] shrink-0" />
            Time saved: 2 hours
          </li>
        </ul>
      </>
    ),
    icon: <Mail className="w-8 h-8" />,
  },
  {
    name: "Payments",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Create checkout sessions",
            "Handle webhooks to update user's account",
            "Tips to setup your account & reduce chargebacks",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <Check className="w-[18px] h-[18px] shrink-0 text-muted-foreground" />
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-accent-foreground font-medium">
            <Check className="w-[18px] h-[18px] shrink-0" />
            Time saved: 2 hours
          </li>
        </ul>
      </>
    ),
    icon: <CreditCard className="w-8 h-8" />,
  },
  {
    name: "Login",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Magic links setup",
            "Login with Google walkthrough",
            "Save user data in MongoDB",
            "Private/protected pages & API calls",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <Check className="w-[18px] h-[18px] shrink-0 text-muted-foreground" />
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-accent-foreground font-medium">
            <Check className="w-[18px] h-[18px] shrink-0" />
            Time saved: 3 hours
          </li>
        </ul>
      </>
    ),
    icon: <User className="w-8 h-8" />,
  },
  {
    name: "Database",
    description: (
      <>
        <ul className="space-y-2">
          {["Mongoose schema", "Mongoose plugins to make your life easier"].map(
            (item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="w-[18px] h-[18px] shrink-0 text-muted-foreground" />
                {item}
              </li>
            )
          )}
          <li className="flex items-center gap-3 text-accent-foreground font-medium">
            <Check className="w-[18px] h-[18px] shrink-0" />
            Time saved: 2 hours
          </li>
        </ul>
      </>
    ),
    icon: <Database className="w-8 h-8" />,
  },
  {
    name: "SEO",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "All meta tags to rank on Google",
            "OpenGraph tags to share on social media",
            "Automated sitemap generation to fasten Google indexing",
            "Structured data markup for Rich Snippets",
            "SEO-optimized UI components",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <Check className="w-[18px] h-[18px] shrink-0 text-muted-foreground" />
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-accent-foreground font-medium">
            <Check className="w-[18px] h-[18px] shrink-0" />
            Time saved: 6 hours
          </li>
        </ul>
      </>
    ),
    icon: <FileText className="w-8 h-8" />,
  },
  {
    name: "Style",
    description: (
      <>
        <ul className="space-y-2">
          {[
            "Components, animations & sections (like the pricing page below)",
            "20+ themes with daisyUI",
            "Automatic dark mode",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <Check className="w-[18px] h-[18px] shrink-0 text-muted-foreground" />
              {item}
            </li>
          ))}
          <li className="flex items-center gap-3 text-accent-foreground font-medium">
            <Check className="w-[18px] h-[18px] shrink-0" />
            Time saved: 5 hours
          </li>
        </ul>
      </>
    ),
    icon: <Palette className="w-8 h-8" />,
  },
];

// A list of features with a listicle style.
// - Click on a feature to display its description.
// - Good to use when multiples features are available.
// - Autoscroll the list of features (optional).
const FeaturesListicle = () => {
  const featuresEndRef = useRef<HTMLParagraphElement>(null);
  const [featureSelected, setFeatureSelected] = useState<string>(
    features[0].name
  );
  const [hasClicked, setHasClicked] = useState<boolean>(false);

  // (Optional) Autoscroll the list of features so user know it's interactive.
  // Stop scrolling when user scroll after the featuresEndRef element (end of section)
  // Remove useEffect is not needed.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasClicked) {
        const index = features.findIndex(
          (feature) => feature.name === featureSelected
        );
        const nextIndex = (index + 1) % features.length;
        setFeatureSelected(features[nextIndex].name);
      }
    }, 5000);

    try {
      // stop the interval when the user scroll after the featuresRef element
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log("STOP AUTO CHANGE");
            clearInterval(interval);
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      if (featuresEndRef.current) {
        observer.observe(featuresEndRef.current);
      }
    } catch (e) {
      console.error(e);
    }

    return () => clearInterval(interval);
  }, [featureSelected, hasClicked]);

  return (
    <section className="py-24" id="features">
      <div className="max-w-3xl mx-auto">
        <div className="bg-background max-md:px-8 max-w-3xl">
          <p className="text-accent-foreground font-medium text-sm font-mono mb-3">
            {/* Pure decoration, you can remove it */}
            const launch_time = &quot;Today&quot;;
          </p>
          <h2 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-8 text-foreground">
            {/* 💡 COPY TIP: Remind visitors about the value of your product. Why do they need it? */}
            Supercharge your app instantly, launch faster, make $
          </h2>
          <div className="text-muted-foreground leading-relaxed mb-8 lg:text-lg">
            {/* 💡 COPY TIP: Explain how your product delivers what you promise in the headline. */}
            Login users, process payments and send emails at lightspeed. Spend
            your time building your startup, not integrating APIs. ShipFast
            provides you with the boilerplate code you need to launch, FAST.
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-4 md:flex justify-start gap-4 md:gap-12 max-md:px-8 max-w-3xl mx-auto mb-8">
          {features.map((feature) => (
            <span
              key={feature.name}
              onClick={() => {
                if (!hasClicked) setHasClicked(true);
                setFeatureSelected(feature.name);
              }}
              className="flex flex-col items-center justify-center gap-3 select-none cursor-pointer p-2 duration-200 group"
            >
              <span
                className={`duration-100 ${
                  featureSelected === feature.name
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground/70"
                }`}
              >
                {feature.icon}
              </span>
              <span
                className={`font-semibold text-sm ${
                  featureSelected === feature.name
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {feature.name}
              </span>
            </span>
          ))}
        </div>
        <div className="bg-muted/50">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-center md:justify-start md:items-center gap-12">
            <div
              className="text-foreground leading-relaxed space-y-4 px-12 md:px-0 py-12 max-w-xl animate-in fade-in duration-300"
              key={featureSelected}
            >
              <h3 className="font-semibold text-foreground text-lg">
                {features.find((f) => f.name === featureSelected)?.["name"]}
              </h3>

              {features.find((f) => f.name === featureSelected)?.["description"]}
            </div>
          </div>
        </div>
      </div>
      {/* Just used to know it's the end of the autoscroll feature (optional, see useEffect) */}
      <p className="opacity-0" ref={featuresEndRef}></p>
    </section>
  );
};

export default FeaturesListicle;
