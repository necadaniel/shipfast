# EnvSync - Copilot Memory & Project Knowledge Base

**Last Updated:** October 12, 2025

---

## Project Overview

**EnvSync** is a secure environment variable management and synchronization tool designed for developers and small teams. It solves the problem of managing `.env` files across multiple devices and team members without exposing secrets through unsafe channels.

---

## Core Value Propositions

1. **Security First**: End-to-end AES-256 encryption, zero-knowledge architecture
2. **Cross-Device Sync**: Real-time sync between Windows, macOS, Linux, mobile
3. **Developer Experience**: Web app + CLI tool for seamless workflow integration
4. **Team Collaboration**: Secure sharing with role-based permissions

---

## Key Features

### Security

- Client-side AES-256 encryption
- Zero-knowledge architecture (server never sees unencrypted secrets)
- 2FA and SSO support
- Tamper-proof audit trail
- GDPR & SOC2-ready architecture

### Core Functionality

- Project-based organization of .env files
- Cross-device real-time synchronization
- Web interface for manual editing
- CLI utility for local workflow
- One-click device authentication (QR/secure code)
- Remote device revocation
- Version control & change history
- Rollback capability
- Collaborative sharing with role-based permissions (admin/read/write)

### Planned Features

- VS Code extension
- GitHub/GitLab webhook integrations
- Mobile app for emergency access
- Fast copy/paste and export capabilities

---

## Target Users

1. **Solo Developers**: Sync secrets across personal devices
2. **Small Teams**: Share credentials securely without Slack/email
3. **Agencies & Freelancers**: Isolate client secrets by project

---

## Tech Stack (Current Implementation)

Based on workspace structure:

### Framework & Core

- **Next.js** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (with PostCSS)

### Authentication & Payments

- **NextAuth.js** - Authentication (`libs/next-auth.ts`)
- **Stripe** - Payment processing (`libs/stripe.ts`)
  - One-time payment model (not subscription)
  - Two plans: Solo Developer ($29) and Team ($79)
  - Plan upgrade/downgrade logic:
    - Free users can purchase any plan
    - Solo users can upgrade to Team but cannot re-purchase Solo
    - Team users cannot purchase anything (highest tier)
    - Downgrade from Team to Solo requires contacting support

### Database

- **MongoDB** with Mongoose ORM
  - Models: `User.ts`, `Lead.ts`
  - Connection utilities in `libs/mongo.ts` and `libs/mongoose.ts`

### Communication

- **Resend** - Email service (`libs/resend.ts`)

### UI Components

- Shadcn/ui components (in `components/ui/`)
- Custom components for marketing/dashboard
- Theme support (dark mode)

### API Routes

- `/api/auth/[...nextauth]` - Authentication
- `/api/lead` - Lead generation
- `/api/stripe/create-checkout` - Checkout sessions (with plan validation)
- `/api/stripe/create-portal` - Customer portal
- `/api/webhook/stripe` - Stripe webhooks
- `/api/projects` - GET (list projects), POST (create project)
- `/api/projects/[id]` - GET, PATCH, DELETE (single project)
- `/api/projects/[id]/variables` - GET, POST (manage variables)
- `/api/projects/[id]/history` - GET (fetch change history for project)
- `/api/user/plan` - GET (fetch user's current plan)
- `/api/team` - GET (list all teams user has access to), POST (create team)
- `/api/team/[id]` - GET (team details), PATCH (update), DELETE (delete team)
- `/api/encryption/key` - GET (fetch/generate user's encryption key)

---

## Application Structure

### Main Pages

- `/` - Landing page with Hero, Features, Pricing, Testimonials, FAQ
- `/dashboard` - Main app interface (authenticated)
- `/privacy-policy` - Privacy policy
- `/tos` - Terms of service

### Key Components

- **Marketing**: Hero, CTA, Features (Grid/Listicle/Accordion), Pricing, Testimonials, FAQ
- **Auth**: ButtonSignin, ButtonAccount
- **Payments**: ButtonCheckout (with authentication check and plan validation)
- **UI**: Modal, Tabs, Popover, various shadcn/ui components

---

## Database Models

### User Model (`models/User.ts`)

- Standard user authentication and account management
- Likely includes Stripe customer ID for payments

### Lead Model (`models/Lead.ts`)

- Captures potential customers/email signups

### Project Model (`models/Project.ts`) - NEW

- Stores user projects with environment variables
- Fields: name, description, userId, color, variables (encrypted JSON string), variableCount, lastSyncedAt
- Indexed by userId and createdAt for performance
- Uses Mongoose with toJSON plugin

### VariableHistory Model (`models/VariableHistory.ts`) - NEW

- Comprehensive audit trail for all variable changes
- Fields: projectId, teamId, userId, action, variableKey, oldValue, newValue, metadata, canRollback
- Action types: created, updated, deleted, bulk_import
- Metadata tracks source (web/cli/api), IP address, user agent
- Compound indexes: projectId+createdAt, userId+createdAt, teamId+createdAt
- Supports rollback tracking (rolledBackAt, rolledBackBy)

---

## Environment Variables Needed

Based on integrations:

- NextAuth configuration (NEXTAUTH_SECRET, NEXTAUTH_URL)
- MongoDB connection string
- Stripe API keys (public & secret)
- Resend API key
- OAuth providers (if configured)

---

## Design Language

- **Minimal, bold interface** for distraction-free focus
- **Mascot-driven onboarding** (friendly, fun visuals)
- **Dark mode** support
- Focus on developer-friendly UX

### UI Design Principles (From YouTube Guide)

**Color System:**

- Base color: `oklch(0.623 0.214 259.815)` (primary purple/blue from globals.css)
- Create 3-4 shades using systematic lightness increments
- Layer lighter shades on important/interactive elements
- Use darker backgrounds for general sections

**Depth & Elevation:**

- Apply combined light/dark box-shadows to raised elements (cards, dropdowns, active tabs)
  - Light shadow on top, dark on bottom
  - Small, soft shadows for natural effect
  - Increase shadow size for elevation/hover feedback
- Use gradients with light inner shadow on top for realistic elevation
- For progress bars: use inset shadows to create depth

**Interactive States:**

- Active states (selected tabs, chosen radio options) use lighter backgrounds
- Higher text/icon contrast for active elements
- Use icons in selection lists/radio buttons for clarity

**Hierarchy & Separation:**

- Upgrade typography for information hierarchy
- Add generous spacing
- Separate using layered color—NOT borders
- Remove borders unless required for clarity—let layering do the work

**Layout Principles:**

- Round corners (use existing `--radius: 0.65rem`)
- Generous padding for sections and cards
- Avoid unnecessary detail and overworked gradients
- Minimal, restrained application of depth

**Dark/Light Mode:**

- Switch background and shadow variables
- Use same logic for depth in both modes
- Already configured in globals.css with CSS variables

**Key Mantras:**

- ❌ No borders unless necessary
- ✅ Subtle layering and realistic depth
- ✅ Clear hierarchy through color and shadow
- ✅ Don't perfect every detail—prioritize hierarchy, clarity, separation
- ✅ Let elevation and layering do the work

---

## Security Architecture (Planned)

### Zero-Knowledge Implementation

- All encryption/decryption happens client-side
- Server only stores encrypted blobs
- User-controlled encryption keys (never sent to server)

### Device Management

- Each device gets unique authentication
- QR code or secure code for device linking
- Remote revocation capability

### Audit & Compliance

- Change history tracking
- Version control for all .env files
- GDPR and SOC2 compliance goals

---

## Development Priorities

1. **MVP Core Features**:

   - User authentication & account management ✓ (appears implemented)
   - Project creation and management (TO BUILD)
   - .env file upload/storage with encryption (TO BUILD)
   - Basic web interface for viewing/editing secrets (TO BUILD)
   - Device authentication system (TO BUILD)

2. **Phase 2**:

   - Real-time sync infrastructure
   - CLI tool development
   - Version control & history
   - Team collaboration features

3. **Phase 3**:
   - VS Code extension
   - Mobile app
   - Advanced integrations (GitHub/GitLab)

---

## Important Considerations

### Security Implementation Notes

- Must implement client-side encryption BEFORE server upload
- Key management strategy critical (where/how users store master keys)
- Consider key derivation from user password + salt
- Need secure key storage on each device

### Sync Strategy

- WebSocket or polling for real-time updates?
- Conflict resolution strategy for concurrent edits
- Offline support considerations

### CLI Tool Design

- Should work seamlessly with git workflows
- Commands like `envsync pull`, `envsync push`, `envsync init`
- Auto-detection of .env files in project

---

## Current State Assessment

✅ **Implemented:**

- Next.js app structure with App Router
- Authentication system (NextAuth)
- **Payment integration (Stripe)** with plan validation:
  - Requires authentication before checkout
  - Redirects to sign-in with callback URL if not authenticated
  - Automatically proceeds to checkout after login
  - Enforces plan upgrade/downgrade rules
  - Shows "Current Plan" button for owned plans
  - Shows "Upgrade" button for Solo → Team upgrades
  - Displays error toasts for invalid purchase attempts
- Basic marketing pages
- UI component library
- Database models for users and leads
- **NEW: Redesigned Header with depth & elevation**
  - Sticky header with backdrop blur
  - Combined light/dark shadows for depth
  - Logo with gradient background and subtle elevation
  - Navigation links with animated underline on hover
  - Improved mobile menu with better spacing
- **NEW: Enhanced Button component**
  - Combined light (top) and dark (bottom) shadows
  - Subtle hover elevation effect (translate-y)
  - Active state with pressed appearance
  - Dark mode shadow adjustments
  - **Fixed dark mode text color** - Primary buttons now use white text in dark mode for better readability
- **NEW: Enhanced Input component**
  - Inset shadows for recessed appearance
  - Focus state with ring and shadow
  - Better padding and rounded corners
- **NEW: Modern Hero section**
  - Full-height layout with animated grid background
  - Gradient orbs for ambient depth
  - Interactive code editor mockup with live sync indicator
  - Feature pills and social proof
  - Zero-Knowledge Security badge
- **NEW: Redesigned Problem section**
  - Grid of problem cards with icons
  - Combined light/dark shadows on cards
  - Danger callout for security risks
  - Gradient background with grid pattern
  - Visual flow element showing path to solution
- **NEW: Modern Features Grid**
  - 6 interactive feature cards with live demos
  - End-to-End Encryption visualization with animated data flow
  - Real-Time Sync with device status indicators
  - CLI & Web App terminal mockup
  - Project Organization grid with color-coded projects
  - Version History timeline
  - Team Collaboration member list
  - All cards use combined light/dark shadows
  - Hover effects with increased elevation
  - Gradient backgrounds for depth
- **NEW: Redesigned Pricing Section**
  - Two pricing tiers: Solo Developer ($29) and Team ($79)
  - Featured plan with scale effect and gradient background
  - Combined light/dark shadows on cards
  - Strikethrough anchor pricing
  - Icon badges for feature checkmarks
  - Hover shine effect on featured plan
  - "Pay once. Own forever" messaging
  - Gradient background with grid pattern
- **NEW: Modern CTA Section**
  - Large gradient card with primary color background
  - Combined light/dark shadows for depth
  - Animated gradient orbs with pulse effect
  - Feature badges (Zero-Knowledge, Real-time Sync, AES-256)
  - Primary and secondary CTA buttons with hover effects
  - Stats section with frosted glass cards
  - Trust indicators for social proof
- **NEW: Clean Footer Design**
  - Gradient background with subtle grid pattern
  - Organized into 4 columns: Brand, Product, Resources, Legal
  - Logo with gradient container and combined shadows
  - Social media links (Twitter, GitHub, LinkedIn) with hover elevation
  - Essential links only: Pricing, Features, Dashboard, Documentation, Support, FAQ, Privacy, Terms
  - Bottom bar with copyright and status links
  - Removed unnecessary links (Blog, Affiliates)
- **NEW: Dashboard Sidebar Component**
  - Fixed left sidebar with collapsible functionality
  - Gradient background (from-muted/50 via-muted/30 to-muted/50)
  - Main navigation: Projects, Devices, Team (conditional), History
  - Settings at bottom above account section
  - "New Project" button with custom event dispatch
  - Active state with left border accent and primary/10 background
  - User account section at bottom with avatar and plan display
  - Collapse/expand toggle button
  - Combined shadows on interactive elements
  - Team nav only shows for Team plan users
  - **Mobile-responsive with Sheet drawer**:
    - Fixed mobile header at top with logo and hamburger menu
    - Slide-out drawer from left on mobile
    - Full navigation in mobile menu
    - Auto-closes when navigating
    - Touch-friendly spacing and sizing
- **NEW: Project Management System**
  - Project database model with MongoDB/Mongoose
  - API routes for creating and listing projects
  - **DELETE API endpoint** - `/api/projects/[id]` - Delete project with auth check
  - CreateProjectModal component with form (name, description, color picker)
  - **DeleteProjectModal component** - Confirmation dialog for deleting projects:
    - Warning icon with destructive styling
    - Requires typing project name to confirm deletion
    - Shows warning about permanent data loss
    - Toast notifications for success/error
    - Redirects to dashboard after successful deletion
  - **DashboardClient component** - Main projects view:
    - **Mobile-responsive design**:
      - Stacked layout on mobile with full-width button
      - Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
      - Touch-friendly card sizes and spacing
      - Active state with scale animation for mobile
      - Reduced padding on mobile (p-4 vs p-6)
      - Smaller text sizes on mobile
      - Flexible stats layout that wraps on narrow screens
    - **Project card dropdown menu** with quick actions:
      - Open Project - Navigate to project detail page
      - Edit Details - Edit project (placeholder)
      - Duplicate - Clone project with variables (placeholder)
      - Import Variables - Opens project with import modal
      - Export .env - Downloads decrypted .env file
      - Delete Project - Opens delete confirmation modal
    - Project cards with color coding, stats, and hover effects
    - Empty state with "Create First Project" CTA
    - Real-time updates using router.refresh()
    - Event-based communication between sidebar and dashboard
    - Projects displayed in responsive grid
    - Each project card shows: name, description, variable count, created date
    - "Add New Project" card in grid for quick access
  - **Sidebar navigation** - "Projects" stays active when viewing project detail pages
- **NEW: Project Detail Page (Environment Variables Editor)**
  - `/dashboard/project/[id]` - Dynamic route for each project
  - Server component fetches project + variables from MongoDB
  - ProjectDetailClient.tsx - Main workspace component with:
    - Project header with name, description, color badge, stats
    - Quick action buttons: Download .env, Upload .env
    - Searchable variables table with filtering
    - Each variable row shows: key, masked value (toggle visibility), actions
    - **Action buttons**: Show/hide value, Copy, Edit, Delete
    - Empty state for projects with no variables
    - Copy to clipboard functionality **with toast notification**
    - **Edit variable** with confirmation modal and encryption
    - Delete variable with confirmation modal
    - **Decryption on load** - Variables decrypted client-side on component mount
    - Loading state with lock icon while decrypting
    - Error handling for decryption failures
    - **Toast notifications** for all user actions (copy, add, edit, delete, import)
  - AddVariableModal.tsx - Form to add new key-value pairs:
    - Validates key format (UPPER_CASE, no special chars)
    - Checks for duplicate keys
    - Shows errors inline
    - **Encrypts value before API call**
    - **Toast notifications** for success and errors
  - EditVariableModal.tsx - Form to edit existing variables:
    - Allows changing key name and/or value
    - Validates key format and checks for duplicates
    - Shows errors inline
    - **Encrypts value before API call**
    - Supports team project encryption
    - **Toast notifications** for success and errors
  - DeleteVariableModal.tsx - Confirmation dialog for deleting variables:
    - Warning icon with destructive color scheme
    - Shows variable key being deleted
    - Cancel and Delete buttons
    - Loading state during deletion
    - "This action cannot be undone" warning
    - Clean modal design with combined shadows
    - **Toast notifications** for success and errors
  - UploadEnvModal.tsx - Bulk import from .env files:
    - File upload with drag & drop
    - **No file type restrictions** in file picker (validates filename after selection for better compatibility)
    - Validates .env file extensions: .env, .env.local, .env.development, .env.production, .env.test, .env.staging
    - **Toast notifications** for invalid file types, parse errors, and success
    - Shows inline error message + toast for better visibility
    - Parses KEY=VALUE format (handles comments, quotes, empty lines)
    - Preview with duplicate detection
    - Shows count of new vs existing variables
    - Imports only new variables, skips duplicates
    - **Encrypts all values before bulk import**
    - **Sequential processing** - Imports one variable at a time to avoid race conditions
    - **Progress bar** - Shows real-time import progress (X / Y variables)
    - **Success feedback** - Green checkmark when all variables imported + toast notification
    - 100ms delay between imports to prevent server overload
    - Continues on error - if one variable fails, continues with the next
  - Download functionality - Exports variables as .env file (decrypted)
  - API endpoints:
    - GET `/api/projects/[id]/variables` - Fetch all variables (encrypted)
    - POST `/api/projects/[id]/variables` - Add new variable (receives encrypted)
    - PATCH `/api/projects/[id]/variables/[key]` - Update variable (value or key)
    - DELETE `/api/projects/[id]/variables/[key]` - Delete variable
  - Updates lastSyncedAt timestamp on all modifications
  - Combined shadows and layered colors throughout (no borders)
  - Hover effects with elevation on variable rows
- **NEW: Encryption System (Zero-Knowledge Architecture)**
  - `/libs/encryption.ts` - Client-side encryption utilities:
    - AES-256-GCM encryption using Web Crypto API
    - Random 12-byte IV (Initialization Vector) per encryption
    - Base64 encoding for storage
    - `encryptValue(value, key)` - Encrypt string with IV prepended
    - `decryptValue(encryptedValue, key)` - Decrypt with IV extraction
    - `encryptVariables()` / `decryptVariables()` - Batch operations
    - SessionStorage caching for encryption key
  - `/app/api/encryption/key/route.ts` - Master key management:
    - GET endpoint to fetch or generate user's encryption key
    - Uses Node crypto to generate 32-byte (256-bit) random keys
    - Stores in User model's `encryptionKey` field (marked private)
    - Key generated once per user on first request
  - `/hooks/useEncryption.ts` - React hook for encryption:
    - Loads encryption key from sessionStorage or API
    - Caches key in memory for session
    - Provides loading/error states
    - `logout()` method to clear key from session
  - User model updated with `encryptionKey` field (private, not exposed in API)
  - **Zero-Knowledge**: Server never sees plaintext values
  - **Client-side only**: All encryption/decryption in browser
  - **Session-based**: Key loaded once per session, cached in memory
  - **Secure transport**: HTTPS ensures encrypted data in transit

🔨 **To Build:**

- Core EnvSync functionality:
  - ✅ Project creation and basic management
  - ✅ Variable editor interface (add/edit/delete)
  - ✅ .env file upload/parsing with bulk import
  - ✅ .env file download/export
  - ✅ Client-side AES-256-GCM encryption/decryption
  - Device authentication system (TO BUILD)
- **Encryption System (IMPLEMENTED)**:
  - ✅ Client-side encryption using Web Crypto API
  - ✅ AES-256-GCM encryption with random IVs
  - ✅ Master key per user stored in database
  - ✅ Encryption key cached in sessionStorage
  - ✅ Variables encrypted before API calls
  - ✅ Variables decrypted on client after fetch
  - ✅ Zero-knowledge architecture (server only sees encrypted data)
  - Server-side encryption at rest (TO BUILD - optional additional layer)
- Device management system (TO BUILD)
- **Dashboard Pages:**
  - ✅ Projects list page with grid view (mobile-responsive)
  - ✅ Empty state for new users
  - ✅ Create project modal
  - ✅ Project detail page with .env editor
  - ✅ Mobile navigation with hamburger menu
  - Devices management page (TO BUILD)
  - Team collaboration page (TO BUILD)
  - History/version control page (TO BUILD)
  - Settings page (TO BUILD)
- CLI tool (TO BUILD)
- Real-time sync infrastructure (TO BUILD)
- Version control system (TO BUILD)
- Team collaboration features (IN PROGRESS - Phase 2)
  - ✅ Team Model created with members, invitations, billing status
  - ✅ User Model updated with plan, teamId, teamRole fields
  - ✅ Team API routes (GET list, POST create, GET/PATCH/DELETE individual)
  - ✅ **Team list page** - `/dashboard/team` - Shows all teams user owns/is member of
  - ✅ **Team detail page** - `/dashboard/team/[id]` - Individual team management
  - ✅ **TeamsListClient component** - Grid view of teams with create/delete actions
  - ✅ **TeamDetailClient component** - Tabbed interface with:
    - **Members Tab** - Team members list, roles, pending invitations
    - **Projects Tab** - Placeholder for shared team projects (coming soon)
    - **Settings Tab** - Team name editor, danger zone (delete team - owner only)
  - ✅ Database migration scripts for schema updates
  - ✅ Multiple teams support - Users with Team plan can create multiple teams
  - ✅ Access control - Only team owners/members can view team details
  - ✅ Update team name - Owners can rename their teams
  - ✅ Delete team - Owners can delete teams with double confirmation
  - ✅ **Invitation system** (COMPLETED):
    - **POST /api/team/[id]/invite** - Send email invitation via Resend
    - **InviteMemberModal component** - Owner/admin can invite by email
    - 24-hour expiration on invitation links
    - Role selection: Viewer, Member, Admin
    - Beautiful HTML email template with branded styling
    - Email validation and duplicate checking
  - ✅ **Accept invitation flow** (COMPLETED):
    - **GET /api/invite/[token]** - Fetch invitation details
    - **POST /api/invite/[token]/accept** - Accept invitation
    - **/invite/[token]** page - Public invitation acceptance page
    - **InviteClient component** - Beautiful invitation UI with:
      - Team preview with member count
      - Inviter information with avatar
      - Role badge display
      - Time remaining countdown
      - Email mismatch detection and warning
      - Sign in / Create account flow
      - Auto-redirect to /dashboard/team after acceptance
      - Success toast notification on join
    - Authentication handling:
      - Unauthenticated users: "Create Account" or "Sign In" buttons
      - Wrong email: Warning message with "Sign in with correct email" button
      - Correct email: "Accept Invitation" button
    - SessionStorage persistence for post-auth redirect
    - Members added with role from invitation
    - **Auto-wraps team encryption key for new members**
  - ✅ **Team Encryption Architecture** (COMPLETED):
    - Hybrid encryption with key wrapping pattern (industry standard)
    - Flow: User Personal Key → Wrapped Team Key → Team Master Key → Project Variables
    - Team Model updated with `teamEncryptionKey` (select: false) and `wrappedTeamKeys` array
    - New encryption functions in `/libs/encryption.ts`:
      - `generateTeamEncryptionKey()` - Generate team master key
      - `wrapTeamKey(teamKey, personalKey)` - Wrap team key with personal key
      - `unwrapTeamKey(wrappedKey, personalKey)` - Unwrap team key
      - `encryptWithTeamKey()` and `decryptWithTeamKey()` - Team value encryption
      - `decryptTeamValue()` - Two-layer decryption helper
    - **GET /api/team/[id]/encryption-key** - Fetch wrapped team key for user:
      - Auto-generates team key on first request
      - Auto-wraps key for requesting user
      - Returns existing wrapped key if available
    - **useTeamEncryption hook** (`/hooks/useTeamEncryption.ts`):
      - Auto-fetches wrapped key from API
      - Auto-unwraps with personal key
      - In-memory caching per session
      - `clearTeamKeyCache()` helper for logout
    - Security benefits:
      - Zero-knowledge maintained (server never sees plaintext)
      - Efficient (one encryption per variable)
      - Secure (requires personal key to unwrap)
      - Scalable (easy to add/remove members)
      - Revocable (remove wrapped key = instant access loss)
  - ✅ **Team Projects** (COMPLETED):
    - Project Model updated to support team projects:
      - `userId` - Optional (for personal projects)
      - `teamId` - Optional (for team projects)
      - `isTeamProject` - Boolean flag
      - Validation: either userId or teamId must be present
      - New index: `{ teamId: 1, createdAt: -1 }`
    - **GET /api/team/[id]/projects** - List team projects:
      - Access control: owner or member only
      - Returns all team projects sorted by creation date
    - **POST /api/team/[id]/projects** - Create team project:
      - Permission: owner and admin only
      - Creates project with `isTeamProject: true` and `teamId`
    - Team Projects tab in TeamDetailClient:
      - Grid view with project cards
      - "New Project" button (owner/admin only)
      - Empty state with call-to-action
      - Loading state during fetch
      - Team badge on project cards
      - Auto-fetches when tab is active
    - CreateProjectModal updated:
      - Props: `teamId`, `isTeamProject`, `onProjectCreated`
      - Dynamic API endpoint based on project type
      - Optional callback instead of router.refresh
  - [ ] Team variable encryption/decryption in project detail - NEXT
  - [ ] Role management (change member roles) - Future
  - [ ] Remove members functionality - Future
  - [ ] Cancel pending invitations - Future
  - [ ] Share existing personal project with team - Future
- **Version Control & History System (IN PROGRESS - Phase 2)**:
  - ✅ **VariableHistory Model** - Comprehensive audit trail:
    - Tracks all variable changes (create, update, delete, bulk_import)
    - Stores encrypted old/new values for potential rollback
    - Indexes: projectId+createdAt, userId+createdAt, teamId+createdAt
    - Fields: action, variableKey, oldValue, newValue, metadata (source, IP, userAgent)
    - Rollback capability flags (canRollback, rolledBackAt, rolledBackBy)
  - ✅ **API Routes Updated to Log Changes**:
    - POST `/api/projects/[id]/variables` - Logs "created" action
    - PATCH `/api/projects/[id]/variables/[key]` - Logs "updated" action with old and new values
    - DELETE `/api/projects/[id]/variables/[key]` - Logs "deleted" action with old value
    - Helper function `logVariableChange()` for consistent logging
    - Logs user, timestamp, project, team context
  - ✅ **History API Endpoint** - Enhanced with filtering:
    - GET `/api/projects/[id]/history` - Fetch project change history
    - Query parameters: `action`, `startDate`, `endDate`, `search`, `userId`
    - Case-insensitive regex search on variableKey
    - Date range filtering with proper day boundaries
    - Sorted by newest first
    - Populates user details (name, email, image)
    - Access control (personal or team project members only)
  - ✅ **History List Page** - `/dashboard/history`:
    - Shows all projects with change history
    - Grid view of project cards
    - Stats per project: change count, last change time
    - Sorts by most recently changed
    - Combined shadows, no borders
    - Empty state for no history
  - ✅ **HistoryClient Component**:
    - Project cards with color coding
    - Change count and last change timestamp
    - "Team Project" badge for team projects
    - Click to view detailed timeline
  - ✅ **Project History Detail Page** - `/dashboard/history/[id]`:
    - Timeline view of all changes for a project
    - Grouped by date (Today, Yesterday, specific dates)
    - Each entry shows: user avatar, action badge, variable key, timestamp
    - Action types: Created (green), Updated (blue), Deleted (red), Imported (purple)
    - Relative time + absolute time display
    - Source indicator (web, CLI, API)
    - Breadcrumb navigation back to history list
  - ✅ **ProjectHistoryClient Component** - Enhanced with filtering:
    - Client-side data fetching with React state
    - **Filter Panel** (collapsible):
      - Search input for variable names (debounced 500ms)
      - Action type dropdown (All, Created, Updated, Deleted, Imported)
      - Team member dropdown (for team projects with multiple users)
      - Date range picker with dual-month calendar (react-day-picker)
      - Active filter count badge
      - "Clear Filters" button
    - Loading spinner during API calls
    - "No results found" state when filters return empty
    - Date-grouped timeline
    - Color-coded action badges with icons
    - User avatars and names
    - Formatted timestamps with date-fns
    - Empty state handling
    - Sticky date headers
  - ✅ **New UI Components**:
    - `/components/ui/select.tsx` - Radix UI Select dropdown
    - `/components/ui/calendar.tsx` - Date picker calendar (react-day-picker)
    - `/components/ui/date-range-picker.tsx` - Date range picker with calendar
  - [ ] Rollback capability - Phase 3
  - [ ] Value masking/reveal toggle - Phase 3
  - [ ] Bulk operation grouping - Phase 3
  - [ ] Export audit logs (CSV/JSON) - Phase 4
- **Landing Page Components (COMPLETED)**
  - ✅ Header
  - ✅ Hero section
  - ✅ Problem section
  - ✅ Features Grid
  - ✅ Pricing section
  - ✅ CTA section
  - ✅ Footer

---

## Dashboard Architecture

**Layout Structure:**

- Fixed sidebar (64 = 256px width on desktop, collapsible to 20 = 80px)
- Main content area with overflow scroll
- Sidebar stays fixed while content scrolls
- Responsive: mobile will use drawer/sheet component

**Navigation Structure:**

```
Main Nav:
- Projects (default /dashboard)
- Devices (/dashboard/devices)
- Team (/dashboard/team) - conditional on plan
- History (/dashboard/history)

Secondary Nav:
- Settings (/dashboard/settings)

Bottom:
- User Account (avatar, name, plan, logout)
```

**Design Features:**

- No borders - using layered colors for separation
- Active nav items: left border accent (inset shadow), lighter background
- Hover states on nav items
- Combined shadows throughout
- Collapsible with animated chevron icon
- Plan-based conditional rendering (Team nav)

**Pages to Build:**

1. ✅ `/dashboard` - Projects list (grid/table)
2. ✅ `/dashboard/project/[id]` - Project detail & .env editor
3. `/dashboard/devices` - Device management (TO BUILD)
4. ✅ `/dashboard/team` - Teams list (grid view)
5. ✅ `/dashboard/team/[id]` - Team detail & member management
6. ✅ `/dashboard/history` - Projects with change history (list view)
7. ✅ `/dashboard/history/[id]` - Project timeline with all changes
8. `/dashboard/settings` - Account settings (TO BUILD)

---

## Questions to Resolve

1. Key storage: User password-derived or separate master key?
2. Sync frequency: Real-time WebSocket vs polling?
3. Conflict resolution: Last-write-wins or merge strategy?
4. Free tier limitations: Number of projects? Devices? File size?
5. CLI authentication: API tokens vs OAuth flow?

---

## Notes

- This appears to be built on the ShipFast boilerplate (based on repo name and structure)
- Marketing site is ready, now need to build core product features
- Consider progressive disclosure in onboarding (don't overwhelm with security details)
- Mascot could help explain encryption concepts in friendly way

---

_This file is for AI assistant memory and project context. Update as features are built and decisions are made._
