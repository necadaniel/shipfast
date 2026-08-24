import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import { Button } from "@/components/ui/button";

// ⚠️ PLACEHOLDER — replace this before you launch.
//
// Generate a first draft by pasting the prompt below into any LLM, then have a
// lawyer review it. Do not ship someone else's terms with your name on them.
//
//   You are an excellent lawyer. Write simple Terms of Service for my website.
//   - Website: https://<your-domain>
//   - Name: <your app>
//   - Contact: <your support email>
//   - Description: <what your product does>
//   - Ownership / license terms: <...>
//   - Refund policy: <...>
//   - User data collected: name, email, payment information
//   - Non-personal data: web cookies
//   - Link to privacy policy: https://<your-domain>/privacy-policy
//   - Governing law: <your country>
//   - Updates to the Terms: users will be notified by email
//   Add today's date. Do not explain your reasoning.

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="mx-auto max-w-xl p-5">
      <Button asChild variant="ghost" size="sm" className="mb-2 gap-2">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <h1 className="pb-6 text-3xl font-extrabold">
        Terms and Conditions for {config.appName}
      </h1>

      <pre className="font-sans leading-relaxed whitespace-pre-wrap">
        {`Last updated: [DATE]

These Terms of Service ("Terms") govern your use of ${config.appName} at https://${config.domainName} (the "Website") and the services we provide. By using the Website you agree to these Terms.

1. Description of ${config.appName}

[Describe what your product does.]

2. Ownership and Use Rights

[Describe what customers may and may not do with what they buy.]

3. Refunds

[Describe your refund policy and the window it applies to.]

4. User Data

We collect and store the data necessary to provide the service, including name, email and payment information. See our Privacy Policy at https://${config.domainName}/privacy-policy for details.

5. Non-Personal Data

We use web cookies to operate and improve the Website.

6. Governing Law

These Terms are governed by the laws of [YOUR COUNTRY].

7. Updates to the Terms

We may update these Terms. Users will be notified of material changes by email.

8. Contact

Questions about these Terms: ${config.resend.supportEmail ?? "[YOUR SUPPORT EMAIL]"}
`}
      </pre>
    </main>
  );
};

export default TOS;
