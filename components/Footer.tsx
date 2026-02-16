import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";

const footerLinkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

const Footer = () => {
  return (
    <footer className="border-t border-border/70 bg-muted/20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <Link
            href="/"
            aria-current="page"
            className="flex items-center gap-2"
            title={`${config.appName} homepage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="size-6"
              priority
              width={24}
              height={24}
            />
            <strong className="text-base font-extrabold tracking-tight">
              {config.appName}
            </strong>
          </Link>
          <p className="text-sm text-muted-foreground">{config.appDescription}</p>
          <p className="text-sm text-muted-foreground">
            Copyright © {new Date().getFullYear()} {config.appName}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Links
          </p>
          <div className="flex flex-col gap-2">
            {config.resend.supportEmail && (
              <a
                href={`mailto:${config.resend.supportEmail}`}
                className={footerLinkClass}
                aria-label="Contact Support"
              >
                Support
              </a>
            )}
            <Link href="/#pricing" className={footerLinkClass}>
              Pricing
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Legal
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/tos" className={footerLinkClass}>
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className={footerLinkClass}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
