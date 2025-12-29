import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";
import config from "@/config";
import logo from "@/app/icon.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-5">
            <Link
              href="/#"
              className="inline-flex items-center gap-2 group mb-4"
            >
              <div className="w-8 h-8 rounded-lg corner-squircle bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)]">
                <Image
                  src={logo}
                  alt={`${config.appName} logo`}
                  className="w-5 h-5"
                  width={20}
                  height={20}
                />
              </div>
              <strong className="font-bold tracking-tight text-lg text-foreground group-hover:text-primary transition-colors">
                {config.appName}
              </strong>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              {config.appDescription}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg corner-squircle bg-muted hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_8px_rgba(0,0,0,0.15)] hover:translate-y-[-1px]"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg corner-squircle bg-muted hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_8px_rgba(0,0,0,0.15)] hover:translate-y-[-1px]"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg corner-squircle bg-muted hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_8px_rgba(0,0,0,0.15)] hover:translate-y-[-1px]"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground text-sm mb-4 tracking-wide">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground text-sm mb-4 tracking-wide">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://docs.changeme.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
              </li>
              {config.resend.supportEmail && (
                <li>
                  <a
                    href={`mailto:${config.resend.supportEmail}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Support
                  </a>
                </li>
              )}
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-foreground text-sm mb-4 tracking-wide">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/tos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {config.appName}. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Status
              </Link>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Updates
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
