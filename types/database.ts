// Hand-written to match supabase/migrations/20260926120000_init.sql.
// Regenerate with the Supabase CLI if you add tables, then keep the billing
// columns (`customerId`, `priceId`, `hasAccess`) in sync with libs/plans.ts.

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          email: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
  next_auth: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          emailVerified: string | null;
          image: string | null;
          customerId: string | null;
          priceId: string | null;
          hasAccess: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email?: string | null;
          emailVerified?: string | null;
          image?: string | null;
          customerId?: string | null;
          priceId?: string | null;
          hasAccess?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          emailVerified?: string | null;
          image?: string | null;
          customerId?: string | null;
          priceId?: string | null;
          hasAccess?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};

export type User = Database["next_auth"]["Tables"]["users"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
