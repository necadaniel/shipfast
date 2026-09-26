import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import config from "@/config";
import { getSupabaseAuthConfig } from "@/libs/supabase";

const supabaseAuth = getSupabaseAuthConfig();

// A missing secret makes every auth call 500. In development we fall back to a
// fixed dev-only value so a fresh clone boots before you've written .env.local.
// In production this stays undefined on purpose, so it fails loudly instead of
// signing sessions with a public constant.
const resolveSecret = (): string | undefined => {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") return undefined;

  console.warn(
    "\n⚠️  AUTH_SECRET is not set — using an insecure development fallback." +
      "\n   Generate one with: openssl rand -base64 32\n"
  );
  return "development-only-insecure-secret-do-not-use-in-production";
};

const providers: NextAuthConfig["providers"] = [];

// Google OAuth. Follow the "Login with Google" tutorial to get your credentials.
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name || profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    })
  );
}

// Magic links by email. Requires both Resend and Supabase — the one-time
// tokens are stored by the Auth.js adapter in next_auth.verification_tokens.
if (process.env.RESEND_API_KEY && supabaseAuth) {
  providers.push(
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY,
      from: config.resend.fromNoReply,
    })
  );
}

export const authOptions: NextAuthConfig = {
  // Set any random string in AUTH_SECRET (or NEXTAUTH_SECRET) in .env.local
  secret: resolveSecret(),
  // Required when deploying anywhere other than Vercel (Render, Fly, a VPS, Docker…)
  trustHost: true,
  providers,
  // Users, OAuth accounts, and magic-link tokens live in the next_auth schema.
  // See supabase/migrations. Billing columns are on next_auth.users.
  ...(supabaseAuth ? { adapter: SupabaseAdapter(supabaseAuth) } : {}),

  callbacks: {
    jwt: async ({ token, user }) => {
      // On sign in, attach the database user ID to the token
      if (user) token.id = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = (token.id as string) ?? token.sub;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  theme: {
    brandColor: config.colors.main,
    // Recommended size is a rectangle (~200x50px) showing your logo + name.
    // Shown in the magic-link email and on the default sign-in page.
    logo: `https://${config.domainName}/icon.png`,
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
