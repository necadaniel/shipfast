import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import { Button } from "@/components/ui/button";

// ⚠️ PLACEHOLDER — replace this before you launch.
//
// Generate a first draft by pasting the prompt below into any LLM, then have a
// lawyer review it. Requirements differ by jurisdiction (GDPR, CCPA…).
//
//   You are an excellent lawyer. Write a simple privacy policy for my website.
//   - Website: https://<your-domain>
//   - Name: <your app>
//   - User data collected: name, email, payment information
//   - Non-personal data: web cookies
//   - Purpose of collection: <...>
//   - Data sharing: <...>
//   - Children's privacy: we do not knowingly collect data from children
//   - Updates: users will be notified by email
//   - Contact: <your support email>
//   Add today's date. Do not explain your reasoning.

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="mx-auto max-w-xl p-5">
      <Button asChild variant="ghost" size="sm" className="mb-2 gap-2">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <h1 className="pb-6 text-3xl font-extrabold">
        Privacy Policy for {config.appName}
      </h1>

      <pre className="font-sans leading-relaxed whitespace-pre-wrap">
        {`Last updated: [DATE]

This Privacy Policy explains how ${config.appName} ("we", "us") collects, uses and protects your information when you use https://${config.domainName} (the "Website").

1. Information We Collect

Personal data: name, email address and payment information, provided by you when you create an account or make a purchase.

Non-personal data: web cookies and standard analytics collected automatically as you browse.

2. How We Use Your Information

[Describe why you collect each category — e.g. order processing, account management, support.]

3. Data Sharing

[Describe who you share data with, e.g. Stripe for payments, Resend for email. State plainly if you do not sell data.]

4. Data Retention and Security

[Describe how long you keep data and how it is protected.]

5. Your Rights

[Describe how users can access, export or delete their data.]

6. Children's Privacy

${config.appName} is not intended for children under 13, and we do not knowingly collect their data. If you believe a child has provided us with personal information, contact us and we will delete it.

7. Updates to This Policy

We may update this policy. Users will be notified of material changes by email.

8. Contact

Questions about this policy: ${config.resend.supportEmail ?? "[YOUR SUPPORT EMAIL]"}
`}
      </pre>
    </main>
  );
};

export default PrivacyPolicy;
