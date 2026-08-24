import type { Metadata } from "next";
import config from "@/config";

// Default SEO tags for every page. Already applied in app/layout.tsx, so you only
// need to call this again when you want to override something on a specific page:
//   export const metadata = getSEOTags({ title: "…", canonicalUrlRelative: "/pricing" });
export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, unknown>;
} = {}) => {
  return {
    // up to 50 characters (what does your app do for the user?) > your main should be here
    title: title || config.appName,
    // up to 160 characters (how does your app help the user?)
    description: description || config.appDescription,
    // some keywords separated by commas. by default it will be your app name
    keywords: keywords || [config.appName],
    applicationName: config.appName,
    // set a base URL prefix for other fields that require a fully qualified URL (.e.g og:image: og:image: 'https://yourdomain.com/share.png' => '/share.png')
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : `https://${config.domainName}/`
    ),

    openGraph: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: openGraph?.title || config.appName,
      // If you add an opengraph-image.(jpg|jpeg|png|gif) image to the /app folder, you don't need the code below
      // images: [
      //   {
      //     url: `https://${config.domainName}/share.png`,
      //     width: 1200,
      //     height: 660,
      //   },
      // ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      // If you add an twitter-image.(jpg|jpeg|png|gif) image to the /app folder, you don't need the code below
      // images: [openGraph?.image || defaults.og.image],
      card: "summary_large_image",
      // Add your own handle: creator: "@yourhandle",
    },

    // If a canonical URL is given, we add it. The metadataBase will turn the relative URL into a fully qualified URL
    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    // If you want to add extra tags, you can pass them here
    ...extraTags,
  };
};

// Structured data for rich results on Google.
// Docs: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
// Validate with: https://search.google.com/test/rich-results
//
// Add <RenderSchemaTags /> to your landing page once you have real data to show.
// Only include aggregateRating if you have genuine reviews — fake ratings are a
// manual-action risk and Google ignores unverifiable ones anyway.
export const renderSchemaTags = () => {
  const cheapestPlan = [...config.stripe.plans].sort(
    (a, b) => a.price - b.price
  )[0];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: config.appName,
          description: config.appDescription,
          image: `https://${config.domainName}/icon.png`,
          url: `https://${config.domainName}/`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          ...(cheapestPlan && {
            offers: [
              {
                "@type": "Offer",
                price: String(cheapestPlan.price),
                priceCurrency: "USD",
              },
            ],
          }),
        }),
      }}
    />
  );
};
