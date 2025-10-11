# Database Migration Scripts

These scripts help you keep your MongoDB database in sync with your Mongoose schema changes.

---

## Quick Fix - Set Your Plan to "Team"

If you're getting "Pick a plan to use this feature" error, run this to update your account:

```bash
npm run user:set-plan neca.danii@gmail.com team
```

Or directly:

```bash
npx tsx scripts/set-user-plan.ts neca.danii@gmail.com team
```

---

## Available Scripts

### 1. Migrate All Users

Updates all users to match the current User schema (adds missing fields with defaults).

```bash
npm run migrate:users
```

This will:

- Add `plan` field (default: "solo") to users who don't have it
- Add `teamId` field (default: null) to users who don't have it
- Add `teamRole` field (default: null) to users who don't have it

### 2. Migrate All Collections

Runs migrations on all collections (User, Project, Team, etc.).

```bash
npm run migrate:all
```

Use this when you make schema changes across multiple models.

### 3. Set User Plan

Update a specific user's plan (solo or team).

```bash
npm run user:set-plan <email> <plan>
```

Examples:

```bash
npm run user:set-plan john@example.com team
npm run user:set-plan jane@example.com solo
```

---

## When to Use These Scripts

### After Adding New Fields to Schema

When you add new fields to your Mongoose models, existing documents in MongoDB won't have those fields. Run the appropriate migration script to add them with default values.

**Example:**

```typescript
// You added this to User model:
plan: {
  type: String,
  enum: ["solo", "team"],
  default: "solo",
}

// Run migration to add it to existing users:
npm run migrate:users
```

### After Changing Field Types

If you change a field type or structure, use the migration scripts to update existing documents.

### For Testing/Development

Use `user:set-plan` to quickly switch between plans for testing team features.

---

## How It Works

1. **Connects to MongoDB** using your existing connection
2. **Finds all documents** in the specified collection
3. **Checks each document** for missing or outdated fields
4. **Updates documents** that need changes
5. **Logs results** showing what was updated
6. **Safely exits** and closes connection

---

## Creating Custom Migrations

Edit `scripts/migrate-schema.ts` to add custom migration logic:

```typescript
// In the PROJECT MIGRATIONS section:
const projectMigration = await runMigration({
  model: Project,
  modelName: "Project",
  updates: (project) => {
    const updates: any = {};
    const log: string[] = [];
    let hasChanges = false;

    // Add your custom logic here
    if (!project.teamId) {
      updates.teamId = null;
      log.push(`Project ${project.name}: Added teamId=null`);
      hasChanges = true;
    }

    return { updates, hasChanges, log };
  },
});
```

---

## Safety Notes

✅ **Safe to run multiple times** - Scripts only update documents that need changes
✅ **No data loss** - Only adds/updates fields, never deletes
✅ **Idempotent** - Running twice produces the same result
✅ **Logged output** - See exactly what changed

⚠️ **Always backup** your database before running migrations in production!

---

## Troubleshooting

### Script won't run

Make sure you have `tsx` installed:

```bash
npm install -D tsx
```

### Connection errors

Check your MongoDB connection string in `.env.local`:

```
MONGODB_URI=mongodb+srv://...
```

### "Cannot find module" errors

Make sure you're in the project root directory when running scripts.

---

## Example Output

```
🚀 Starting User schema migration...

✅ Connected to MongoDB

📊 Found 3 users to migrate

  📝 User john@example.com: Adding plan field (default: solo)
  📝 User john@example.com: Adding teamId field (default: null)
  📝 User john@example.com: Adding teamRole field (default: null)
  ✅ User john@example.com: Updated successfully

  ⏭️  User jane@example.com: Already up to date

  📝 User bob@example.com: Adding plan field (default: solo)
  ✅ User bob@example.com: Updated successfully

==================================================
📊 Migration Summary:
==================================================
Total users: 3
Updated: 2
Skipped (already up to date): 1
==================================================

✅ Migration completed successfully!
👋 Disconnected from MongoDB
```
