/**
 * Database Migration Script: Update User Schema
 *
 * This script updates all existing users to match the current User schema.
 * Run this whenever you add new fields to the User model.
 *
 * Usage:
 *   npx tsx scripts/migrate-user-schema.ts
 *
 * Or add to package.json:
 *   "migrate:users": "tsx scripts/migrate-user-schema.ts"
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectMongo from "../libs/mongoose";
import User from "../models/User";

async function migrateUserSchema() {
  try {
    console.log("🚀 Starting User schema migration...\n");

    // Connect to MongoDB
    await connectMongo();
    console.log("✅ Connected to MongoDB\n");

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to migrate\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const updates: any = {};
      let hasUpdates = false;

      // Check and add 'plan' field if missing
      if (!user.plan) {
        updates.plan = "solo"; // Default to solo plan
        hasUpdates = true;
        console.log(
          `  📝 User ${user.email}: Adding plan field (default: solo)`
        );
      }

      // Check and add 'teamId' field if missing (should be null by default)
      if (user.teamId === undefined) {
        updates.teamId = null;
        hasUpdates = true;
        console.log(
          `  📝 User ${user.email}: Adding teamId field (default: null)`
        );
      }

      // Check and add 'teamRole' field if missing (should be null by default)
      if (user.teamRole === undefined) {
        updates.teamRole = null;
        hasUpdates = true;
        console.log(
          `  📝 User ${user.email}: Adding teamRole field (default: null)`
        );
      }

      // Apply updates if any
      if (hasUpdates) {
        await User.findByIdAndUpdate(user._id, { $set: updates });
        updatedCount++;
        console.log(`  ✅ User ${user.email}: Updated successfully\n`);
      } else {
        skippedCount++;
        console.log(`  ⏭️  User ${user.email}: Already up to date\n`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Migration Summary:");
    console.log("=".repeat(50));
    console.log(`Total users: ${users.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (already up to date): ${skippedCount}`);
    console.log("=".repeat(50) + "\n");

    console.log("✅ Migration completed successfully!");

    // Disconnect
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateUserSchema();
