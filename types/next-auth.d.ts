import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and passed to the `SessionProvider`
   * React context. `id` is added by the jwt/session callbacks in libs/next-auth.ts.
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export {};
