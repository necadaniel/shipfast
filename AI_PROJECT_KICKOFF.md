# AI Project Kickoff (Fill Once, Paste Prompt, Start Building)

Use this file right after cloning the starter.

## 1) Fill This Brief

### Project Identity

- Project name:
- One-line pitch:
- Target launch date:
- Business model (subscription, one-time, usage-based):

### Problem and User

- Core problem:
- Ideal customer profile (ICP):
- Main user roles (owner, admin, member, viewer, etc):
- Top 3 user outcomes:

### Product Scope

- Must-have features (MVP):
  - [ ]
  - [ ]
  - [ ]
- Should-have features (v1.1):
  - [ ]
  - [ ]
- Nice-to-have features (later):
  - [ ]
  - [ ]
- Explicitly out of scope:
  - [ ]
  - [ ]

### Feature List (Detailed)

For each feature, add one block:

```md
#### Feature: <name>
- User story:
- Inputs:
- Outputs:
- Success criteria:
- Edge cases:
- Priority: P0 | P1 | P2
```

### Data and Integrations

- Core entities you expect (ex: Project, Secret, Team, AuditLog):
- External APIs/services needed (Stripe, Resend, OpenAI, etc):
- Webhooks needed:
- Compliance/security needs (PII, GDPR, SOC2, encryption):

### UI and UX Direction

- Pages/routes needed:
- Dashboard sections:
- Design style words (3-5):
- Reference products/sites:

### Technical Constraints

- Required stack constraints:
- Performance constraints:
- Browser/device constraints:
- Deployment target:

### Definition of Done

- What must work before first launch:
  - [ ]
  - [ ]
  - [ ]

### Open Questions

- [ ]
- [ ]
- [ ]

---

## 2) Copy/Paste This Prompt Into Chat

Paste this block in a new chat after you complete section 1:

```md
You are my principal engineer working in this repository.

Read this file first:
- ./AI_PROJECT_KICKOFF.md

Then read these project files for context:
- ./config.ts
- ./app/page.tsx
- ./app/api
- ./libs
- ./supabase/migrations
- ./types/database.ts
- ./components

Your job:
1. Summarize the product in 8-12 lines (problem, user, value, scope).
2. Convert the filled brief into a concrete implementation plan for THIS codebase.
3. Propose an ordered build sequence (Phase 1, 2, 3...) with clear deliverables.
4. List required backend changes:
   - data models
   - API routes
   - integrations/webhooks
5. List required frontend changes:
   - routes/pages
   - reusable components
   - state/data flow
6. Generate a prioritized task backlog:
   - P0 now
   - P1 next
   - P2 later
7. For each P0 task, provide acceptance criteria in checklist form.
8. Identify risks and unknowns.
9. Ask only the critical missing questions (max 7).

Rules:
- Fit the plan to existing stack and architecture.
- Prefer incremental changes over big rewrites.
- If the brief has missing info, make explicit assumptions and continue.
- Keep output structured and implementation-ready.
```

---

## 3) Optional Follow-Up Prompt (Start Coding)

After the plan is approved, use this:

```md
Use the approved plan and start implementation now.
Work in small, testable increments.
After each increment, report:
1) what changed
2) which files changed
3) what was validated
4) what is next
```
