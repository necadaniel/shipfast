# Plan System Implementation Summary

**Date:** October 12, 2025

## Overview

Implemented a comprehensive plan system with three tiers: Free, Solo, and Team. Users start with a free plan and can upgrade through Stripe payments.

---

## Plan Tiers & Limits

### Free Plan (Default)

- **Cost:** $0
- **Max Projects:** 5
- **Max Devices:** 1
- **Max Variables per Project:** 50
- **Features:**
  - Basic encryption
  - Web access
  - Version history (7 days)

### Solo Developer Plan

- **Cost:** $29 (one-time payment)
- **Max Projects:** 30
- **Max Devices:** 3
- **Max Variables per Project:** 200
- **Features:**
  - End-to-end encryption
  - Real-time sync
  - CLI & Web access
  - Version history (30 days)

### Team Plan

- **Cost:** $79 (one-time payment)
- **Max Projects:** Unlimited
- **Max Devices:** Unlimited
- **Max Variables per Project:** Unlimited
- **Features:**
  - Everything in Solo
  - Team collaboration
  - Role-based permissions
  - Unlimited version history
  - Priority support

---

## Implementation Details

### 1. User Model Updates

**File:** `/models/User.ts`

- Updated `plan` field enum: `["free", "solo", "team"]`
- Default value: `"free"`

### 2. NextAuth Configuration

**File:** `/libs/next-auth.ts`

- New users are created with `plan: "free"` by default
- Encryption key is generated immediately on signup
- All custom fields are initialized in the `createUser` event

### 3. Plan Limits Configuration

**File:** `/config.ts`

Added `plans` object with limits for each tier:

```typescript
plans: {
  free: { maxProjects: 5, maxDevices: 1, maxVariablesPerProject: 50 },
  solo: { maxProjects: 30, maxDevices: 3, maxVariablesPerProject: 200 },
  team: { maxProjects: -1, maxDevices: -1, maxVariablesPerProject: -1 }, // -1 = unlimited
}
```

### 4. Plan Helper Functions

**File:** `/libs/plans.ts`

Created utility functions:

- `getPlanLimits(plan)` - Get limits for a specific plan
- `canCreateProject(count, plan)` - Check if user can create more projects
- `canAddVariable(count, plan)` - Check if user can add more variables
- `getPlanLimitError(plan, limitType)` - Get user-friendly error messages

### 5. Project Creation API

**File:** `/app/api/projects/route.ts`

- Fetches user's plan before creating project
- Counts existing projects
- Checks against plan limits using `canCreateProject()`
- Returns 403 error with upgrade message if limit reached

Example error response:

```json
{
  "error": "You've reached the maximum of 5 projects on the free plan. Upgrade to create more projects."
}
```

### 6. Stripe Webhook Integration

**File:** `/app/api/webhook/stripe/route.ts`

Updated webhook handlers:

**`checkout.session.completed`:**

- Maps Stripe priceId to plan tier
- Sets `user.plan = "solo"` or `user.plan = "team"`
- Sets `user.hasAccess = true`

**`invoice.paid`:**

- Updates plan on recurring payments
- Ensures plan stays in sync with Stripe subscription

**`customer.subscription.deleted`:**

- Resets user to `plan: "free"`
- Sets `hasAccess: false`

### 7. Migration Script

**File:** `/scripts/migrate-to-free-plan.ts`

- Updates all users without purchases to `plan: "free"`
- Users with priceId get the correct plan based on Stripe config
- Command: `npm run migrate:free-plan`

---

## User Flow

### New User Signup

1. User signs up with Google/Email
2. `createUser` event fires
3. User is created with:
   - `plan: "free"`
   - `hasAccess: false`
   - `encryptionKey: <generated>`
   - Can create up to 5 projects

### Purchasing a Plan

1. User clicks "Upgrade" and goes to Stripe checkout
2. Completes payment
3. Stripe webhook `checkout.session.completed` fires
4. User document updated:
   - `plan: "solo"` or `plan: "team"`
   - `hasAccess: true`
   - `priceId: <stripe_price_id>`
   - `customerId: <stripe_customer_id>`
5. User can now create 30 projects (Solo) or unlimited (Team)

### Subscription Cancellation

1. User cancels subscription in Stripe Customer Portal
2. Stripe webhook `customer.subscription.deleted` fires
3. User document updated:
   - `plan: "free"`
   - `hasAccess: false`
4. User reverts to 5 project limit

---

## API Enforcement

### Project Creation

```typescript
POST / api / projects;
```

**Before creating project:**

1. Fetch user's plan from database
2. Count user's existing projects
3. Check: `canCreateProject(currentCount, userPlan)`
4. If limit reached → Return 403 with upgrade message
5. If within limit → Create project

**Response Codes:**

- `201` - Project created successfully
- `403` - Plan limit reached (upgrade required)
- `401` - Unauthorized (not logged in)
- `400` - Validation error (missing name)

### Variable Creation (Future)

Similar enforcement will be added to:

- `POST /api/projects/[id]/variables`
- Bulk imports via Upload .env

---

## TypeScript Types

### Updated Config Type

**File:** `/types/config.ts`

Added optional `plans` property to `ConfigProps`:

```typescript
plans?: {
  free: PlanLimits;
  solo: PlanLimits;
  team: PlanLimits;
};
```

### New Plan Types

**File:** `/libs/plans.ts`

```typescript
export type UserPlan = "free" | "solo" | "team";

export interface PlanLimits {
  maxProjects: number; // -1 = unlimited
  maxDevices: number;
  maxVariablesPerProject: number;
  features: string[];
}
```

---

## Testing Checklist

### ✅ Completed

- [x] User model accepts "free" plan
- [x] New users start with "free" plan
- [x] Encryption key generated on signup
- [x] Plan limits configured in config.ts
- [x] Helper functions created
- [x] Project creation enforces limits
- [x] Stripe webhook updates plan on purchase
- [x] Stripe webhook resets to free on cancellation
- [x] Migration script created

### 🔄 To Test

- [ ] Create 5 projects with free plan → 6th should fail
- [ ] Purchase Solo plan → Should allow 30 projects
- [ ] Purchase Team plan → Should allow unlimited projects
- [ ] Cancel subscription → Should revert to free plan limits
- [ ] Verify error messages are user-friendly
- [ ] Test Stripe webhook with test mode payments

---

## Next Steps

1. **Test Plan System:**

   - Sign up new user (should be free)
   - Try creating 6 projects (should block at 6th)
   - Test Stripe integration (webhook)

2. **Add Variable Limits:**

   - Enforce `maxVariablesPerProject` in variable creation API
   - Add checks to bulk import

3. **Team Features:**

   - Only allow team creation with `plan: "team"`
   - Update team API route to check plan

4. **UI Enhancements:**

   - Show current plan in sidebar
   - Add upgrade prompts when hitting limits
   - Show usage stats (X / Y projects used)

5. **Documentation:**
   - Update README with plan tiers
   - Add pricing page details
   - Create upgrade flow documentation

---

## Files Modified

1. `/models/User.ts` - Added "free" to plan enum
2. `/libs/next-auth.ts` - Set default plan to "free"
3. `/config.ts` - Added plan limits configuration
4. `/types/config.ts` - Updated ConfigProps interface
5. `/libs/plans.ts` - NEW: Plan helper functions
6. `/app/api/projects/route.ts` - Added plan limit checks
7. `/app/api/webhook/stripe/route.ts` - Plan assignment logic
8. `/scripts/migrate-to-free-plan.ts` - NEW: Migration script
9. `/package.json` - Added migrate:free-plan command

---

## Notes

- **-1 in limits means unlimited** (for team plan)
- **Plan is always fetched from database** (not session) to ensure accuracy
- **Stripe is the source of truth** for paid plans
- **Free plan is the fallback** if no purchase is made
- **hasAccess field is separate from plan** - used for general product access
