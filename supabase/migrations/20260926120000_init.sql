-- Supabase schema for this starter.
--
-- Auth.js (@auth/supabase-adapter) stores accounts in the next_auth schema.
-- That schema name is hardcoded by the adapter. Billing columns live on
-- next_auth.users so a user is still one row. Waitlist emails live in
-- public.leads.
--
-- After running this in the Supabase SQL editor:
--   Project Settings → Data API → Exposed schemas → add next_auth
-- Without that, the adapter cannot see its tables.
--
-- The app talks to Supabase with the service role key, server-side only.
-- RLS is enabled and no policies are granted to anon/authenticated, so the
-- public API key cannot read these rows.

create schema if not exists next_auth;

grant usage on schema next_auth to service_role;
grant all on schema next_auth to postgres;

create table if not exists next_auth.users
(
    id uuid not null default gen_random_uuid(),
    name text,
    email text,
    "emailVerified" timestamp with time zone,
    image text,
    -- Stripe customer id. Set by the webhook; used to open the Customer Portal.
    "customerId" text,
    -- Stripe price id the user paid for. The plan is derived from this in
    -- libs/plans.ts — there is deliberately no plan column.
    "priceId" text,
    -- The single gate for paid features. Toggled by the Stripe webhook.
    "hasAccess" boolean not null default false,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    constraint users_pkey primary key (id),
    constraint users_email_unique unique (email),
    constraint users_customer_id_format check (
        "customerId" is null or "customerId" like '%cus_%'
    ),
    constraint users_price_id_format check (
        "priceId" is null or "priceId" like '%price_%'
    )
);

create index if not exists users_customer_id_idx
    on next_auth.users ("customerId");

grant all on table next_auth.users to postgres;
grant all on table next_auth.users to service_role;

-- Reads the Auth.js user id out of a Supabase JWT. Useful if you later add
-- RLS policies for a browser client. The starter does not call this itself.
create or replace function next_auth.uid() returns uuid
    language sql
    stable
    as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

create table if not exists next_auth.sessions
(
    id uuid not null default gen_random_uuid(),
    expires timestamp with time zone not null,
    "sessionToken" text not null,
    "userId" uuid,
    constraint sessions_pkey primary key (id),
    constraint sessions_session_token_unique unique ("sessionToken"),
    constraint sessions_user_id_fkey foreign key ("userId")
        references next_auth.users (id) match simple
        on update no action
        on delete cascade
);

grant all on table next_auth.sessions to postgres;
grant all on table next_auth.sessions to service_role;

create table if not exists next_auth.accounts
(
    id uuid not null default gen_random_uuid(),
    type text not null,
    provider text not null,
    "providerAccountId" text not null,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    "userId" uuid,
    constraint accounts_pkey primary key (id),
    constraint accounts_provider_unique unique (provider, "providerAccountId"),
    constraint accounts_user_id_fkey foreign key ("userId")
        references next_auth.users (id) match simple
        on update no action
        on delete cascade
);

grant all on table next_auth.accounts to postgres;
grant all on table next_auth.accounts to service_role;

create table if not exists next_auth.verification_tokens
(
    identifier text,
    token text,
    expires timestamp with time zone not null,
    constraint verification_tokens_pkey primary key (token),
    constraint verification_tokens_token_unique unique (token),
    constraint verification_tokens_token_identifier_unique unique (token, identifier)
);

grant all on table next_auth.verification_tokens to postgres;
grant all on table next_auth.verification_tokens to service_role;

create or replace function next_auth.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on next_auth.users;
create trigger users_set_updated_at
    before update on next_auth.users
    for each row
    execute function next_auth.set_updated_at();

alter table next_auth.users enable row level security;
alter table next_auth.sessions enable row level security;
alter table next_auth.accounts enable row level security;
alter table next_auth.verification_tokens enable row level security;

revoke all on function next_auth.uid() from public;
revoke all on function next_auth.set_updated_at() from public;

-- Waitlist emails captured by <ButtonLead /> via POST /api/lead.
create table if not exists public.leads
(
    id uuid not null default gen_random_uuid(),
    email text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now(),
    constraint leads_pkey primary key (id),
    constraint leads_email_unique unique (email)
);

grant all on table public.leads to service_role;
revoke all on table public.leads from anon, authenticated;

alter table public.leads enable row level security;

create or replace function public.set_lead_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
    before update on public.leads
    for each row
    execute function public.set_lead_updated_at();

revoke all on function public.set_lead_updated_at() from public;

notify pgrst, 'reload schema';
