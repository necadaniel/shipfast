# History Feature - Planning Document

## ✅ PHASE 1 - COMPLETED!

**Implementation Date:** October 14, 2025

---

## ✅ PHASE 2 - COMPLETED!

**Implementation Date:** October 14, 2025

### Filtering & Search Features

1. ✅ **Filter Controls UI**:
   - Project dropdown (implicit - viewing single project)
   - Date range picker with calendar
   - Action type filter (All, Created, Updated, Deleted, Imported)
   - Team member filter (for team projects with multiple members)
2. ✅ **API Query Parameters**:
   - `action` - Filter by action type
   - `startDate` / `endDate` - Date range filtering
   - `search` - Search by variable name (case-insensitive)
   - `userId` - Filter by team member
3. ✅ **Search Functionality**:
   - Real-time search with 500ms debounce
   - Search by variable name (case-insensitive regex)
   - Filters applied instantly with loading state
   - Clear all filters button
   - Active filter count badge
4. ✅ **UX Improvements**:
   - Collapsible filter panel
   - "No results found" state when filters return empty
   - Loading spinner during API calls
   - Responsive grid layout for filter controls
   - Filters persist during session

---

## What We Built (Phase 1)

### 1. **VariableHistory Model** (`/models/VariableHistory.ts`)

- Comprehensive audit trail for all variable changes
- Tracks: projectId, teamId, userId, action type, variable key, old/new values (encrypted)
- Supports bulk operations and rollback tracking
- Optimized indexes for fast queries

### 2. **API Routes Updated**

- **POST `/api/projects/[id]/variables`** - Logs "created" action
- **DELETE `/api/projects/[id]/variables/[key]`** - Logs "deleted" action with old value
- **GET `/api/projects/[id]/history`** - Fetch change history for a project

### 3. **History List Page** (`/dashboard/history`)

- Shows all projects the user has access to
- Displays change count and last change time per project
- Sorts by most recently changed
- Click to view detailed timeline
- Empty state for new users

### 4. **Project History Timeline** (`/dashboard/history/[id]`)

- Chronological timeline of all changes
- Grouped by date (Today, Yesterday, specific dates)
- Shows: user avatar, action type, variable key, timestamp, source
- Color-coded action badges (green=created, blue=updated, red=deleted, purple=imported)
- Beautiful UI with shadows and no borders

---

## Next Steps (Future Phases)

### Phase 3 - Rollback & Advanced Features

- [ ] "Restore" button to rollback changes
- [ ] Value masking/reveal toggle (security)
- [ ] Bulk operation grouping
- [ ] Quick stats cards

### Phase 4 - Team & Compliance

- [ ] Export audit logs (CSV/JSON)
- [ ] Team activity overview
- [ ] Retention policies by plan

---

## Overview

The History page should provide users with a comprehensive audit trail of all changes made to their environment variables across all projects. This is critical for:

- **Security**: Track who changed what and when
- **Debugging**: Identify when a variable was modified that may have broken something
- **Compliance**: Audit trail for GDPR/SOC2 requirements
- **Rollback**: Ability to restore previous versions

---

## Design Options

### Option 1: Project-Centric View (Recommended)

**Structure:** List of projects → Click project → See timeline of changes

**Pros:**

- Natural organization (users think in terms of projects)
- Scoped view makes it easier to find relevant changes
- Can show project-level stats (total changes, last modified)
- Works well for teams (filter by project access)

**Cons:**

- Requires two clicks to see specific changes
- Harder to see cross-project activity

**UI Flow:**

```
/dashboard/history
├── Project Card: "Production API"
│   ├── Last changed: 2 hours ago
│   ├── Total changes: 47
│   └── [View History] button
│
├── Project Card: "Staging DB"
│   ├── Last changed: 1 day ago
│   ├── Total changes: 23
│   └── [View History] button

Click → /dashboard/history/[projectId]
├── Timeline view of all changes
├── Filters: Date range, change type, member (for teams)
└── Each entry shows:
    ├── Timestamp
    ├── User (avatar + name)
    ├── Action (created, updated, deleted)
    ├── Variable name
    ├── Old value → New value (masked/truncated)
    └── [Rollback] button
```

---

### Option 2: Unified Activity Feed

**Structure:** Single chronological feed of ALL changes across all projects

**Pros:**

- See everything at a glance
- Good for global overview
- One page, no navigation needed

**Cons:**

- Can be overwhelming with many projects
- Harder to focus on specific project issues
- More complex filtering needed

**UI Flow:**

```
/dashboard/history
├── Filter bar: [All Projects ▼] [Date Range] [Change Type]
├── Activity Feed:
│   ├── 2 hours ago - Production API
│   │   └── @you updated DATABASE_URL
│   │
│   ├── 1 day ago - Staging DB
│   │   └── @john added REDIS_HOST
│   │
│   └── 3 days ago - Production API
│       └── @you deleted OLD_API_KEY
```

---

### Option 3: Hybrid Approach (Best of Both Worlds)

**Structure:** Unified feed by default, with project filter + detailed project view

**Pros:**

- Flexible - users can choose their workflow
- Quick overview + deep dive capability
- Powerful filtering

**Cons:**

- More complex to build
- Need to design two different views

**UI Flow:**

```
/dashboard/history
├── Quick Stats Cards:
│   ├── Total Changes: 342
│   ├── This Week: 47
│   └── Active Projects: 8
│
├── Filter Bar:
│   ├── [All Projects ▼] or individual project
│   ├── [Date Range: Last 30 days ▼]
│   ├── [Action Type: All ▼]
│   └── [Team Member: All ▼] (if team plan)
│
└── Activity Timeline:
    ├── Group by date
    ├── Show project context for each entry
    └── Expand for details + rollback

Click project name → /dashboard/project/[id]?tab=history
└── Project-specific history view
```

---

## Data Model Needed

### New Model: `ChangeHistory` or `VariableHistory`

```typescript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Project),
  teamId?: ObjectId (ref: Team), // if team project
  userId: ObjectId (ref: User), // who made the change

  action: 'created' | 'updated' | 'deleted' | 'bulk_import',

  variableKey: string,

  // Encrypted previous and new values
  oldValue?: string (encrypted),
  newValue?: string (encrypted),

  // For bulk operations
  bulkChanges?: [{
    key: string,
    action: string,
    oldValue?: string,
    newValue?: string
  }],

  metadata?: {
    source: 'web' | 'cli' | 'api', // how it was changed
    ipAddress?: string,
    userAgent?: string
  },

  createdAt: Date,

  // For rollback capability
  canRollback: boolean,
  rolledBackAt?: Date,
  rolledBackBy?: ObjectId
}
```

**Indexes:**

- `projectId + createdAt` (descending) - Fast project history queries
- `userId + createdAt` - User activity tracking
- `teamId + createdAt` - Team activity tracking

---

## Key Features to Include

### 1. **Activity Timeline**

- Chronological list of changes
- Group by date (Today, Yesterday, This Week, etc.)
- Infinite scroll or pagination

### 2. **Filtering & Search**

- Filter by project
- Filter by date range
- Filter by action type (created/updated/deleted)
- Filter by team member (for team projects)
- Search by variable name

### 3. **Change Details**

- Who made the change (avatar + name)
- When it happened (relative time + absolute timestamp)
- What changed (variable name)
- Before/after values (masked for security, click to reveal)
- Source of change (web app, CLI, API)

### 4. **Rollback Capability**

- "Restore" button on each entry
- Confirmation modal before rollback
- Shows what will be restored
- Creates a new history entry (doesn't delete the rollback action)
- Only works for updated/deleted variables (can't un-create)

### 5. **Bulk Operation Handling**

- When user imports .env file, group all changes together
- Show expandable card: "Imported 12 variables from .env file"
- Can expand to see individual changes
- One-click rollback for entire bulk operation

### 6. **Security Features**

- Values are encrypted in database
- Masked by default in UI (show "•••••" or first/last 3 chars)
- Click to reveal (decrypts client-side)
- Option to hide values entirely (privacy mode)

---

## My Recommendation: **Option 3 (Hybrid)**

**Why?**

1. **Flexibility**: Works for solo devs (simple timeline) and teams (need filtering)
2. **Scalability**: Can handle 10 projects or 100 projects
3. **User-friendly**: Quick overview without forcing deep navigation
4. **Professional**: Matches what enterprise tools like Vault or AWS Secrets Manager do

**MVP Implementation Path:**

1. **Phase 1**: Build unified activity feed with basic filtering (Option 2 simplified)
2. **Phase 2**: Add quick stats cards and better filtering
3. **Phase 3**: Add project-specific deep dive view

---

## Implementation Steps (Phased Approach)

### Phase 1 - MVP (Core History Tracking)

1. Create `VariableHistory` model with indexes
2. Update existing API routes to log changes:
   - POST/PATCH/DELETE `/api/projects/[id]/variables`
   - Log who, what, when for every change
3. Build basic history page:
   - Fetch all history entries for user's projects
   - Display timeline with date grouping
   - Show change details (who, what, when)
4. No rollback yet - just read-only audit trail

### Phase 2 - Filtering & Search

1. Add filter controls:
   - Project dropdown
   - Date range picker
   - Action type filter
2. Update API to support query parameters
3. Add search functionality

### Phase 3 - Rollback & Advanced Features

1. Implement rollback logic:
   - API endpoint to restore previous value
   - Confirmation modal
   - Create new history entry for rollback
2. Add bulk operation grouping
3. Add value masking/reveal toggle
4. Quick stats cards

### Phase 4 - Team Features

1. Filter by team member
2. Team activity overview
3. Export audit logs (CSV/JSON for compliance)

---

## Questions to Decide

1. **How long do we keep history?**

   - Forever (expensive for storage)
   - Last 90 days (reasonable for debugging)
   - Depends on plan (Free: 30 days, Paid: unlimited)

2. **Should we show values at all?**

   - Security risk if someone looks over shoulder
   - Maybe encrypted preview only ("first 3 + last 3 chars")
   - Privacy mode toggle?

3. **Rollback for team projects?**

   - Only admins can rollback?
   - Or anyone with write access?
   - Notify team when rollback happens?

4. **Export capability?**

   - For compliance, some companies need CSV exports
   - Include in paid plans only?

5. **Real-time updates?**
   - If teammate makes a change, should history update live?
   - Use WebSocket or just refresh on focus?

---

## What do you think?

Which approach resonates with you? Any specific features you want to prioritize or change?

Let's discuss and then I can start building! 🚀
