/**
 * Generic Database Migration Script
 *
 * This script helps you update documents in any collection to match your schema.
 * Useful when you add new fields or change defaults.
 *
 * Usage:
 *   npx tsx scripts/migrate-schema.ts
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectMongo from "../libs/mongoose";
import User from "../models/User";
import Project from "../models/Project";
import Team from "../models/Team";
import Lead from "../models/Lead";

interface MigrationConfig {
  model: mongoose.Model<any>;
  modelName: string;
  updates: (doc: any) => { updates: any; hasChanges: boolean; log: string[] };
}

async function runMigration(config: MigrationConfig) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🔄 Migrating ${config.modelName}...`);
  console.log("=".repeat(60) + "\n");

  const docs = await config.model.find({});
  console.log(`📊 Found ${docs.length} documents\n`);

  let updatedCount = 0;
  let skippedCount = 0;
  const logs: string[] = [];

  for (const doc of docs) {
    const { updates, hasChanges, log } = config.updates(doc);

    if (hasChanges) {
      await config.model.findByIdAndUpdate(doc._id, { $set: updates });
      updatedCount++;
      logs.push(...log.map((l) => `  ✅ ${l}`));
    } else {
      skippedCount++;
    }
  }

  // Print logs
  if (logs.length > 0) {
    console.log(logs.join("\n"));
    console.log("");
  }

  console.log(`📈 Updated: ${updatedCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);

  return { updatedCount, skippedCount };
}

async function migrate() {
  try {
    console.log("🚀 Starting database migration...\n");

    // Connect to MongoDB
    await connectMongo();
    console.log("✅ Connected to MongoDB\n");

    const results: { [key: string]: { updated: number; skipped: number } } = {};

    // ============================================================
    // USER MIGRATIONS
    // ============================================================
    const userMigration = await runMigration({
      model: User,
      modelName: "User",
      updates: (user) => {
        const updates: any = {};
        const log: string[] = [];
        let hasChanges = false;

        // Add plan field (default: solo)
        if (!user.plan) {
          updates.plan = "solo";
          log.push(`User ${user.email || user._id}: Added plan='solo'`);
          hasChanges = true;
        }

        // Add teamId field (default: null)
        if (user.teamId === undefined) {
          updates.teamId = null;
          log.push(`User ${user.email || user._id}: Added teamId=null`);
          hasChanges = true;
        }

        // Add teamRole field (default: null)
        if (user.teamRole === undefined) {
          updates.teamRole = null;
          log.push(`User ${user.email || user._id}: Added teamRole=null`);
          hasChanges = true;
        }

        return { updates, hasChanges, log };
      },
    });
    results.User = {
      updated: userMigration.updatedCount,
      skipped: userMigration.skippedCount,
    };

    // ============================================================
    // PROJECT MIGRATIONS
    // ============================================================
    const projectMigration = await runMigration({
      model: Project,
      modelName: "Project",
      updates: (project) => {
        const updates: any = {};
        const log: string[] = [];
        let hasChanges = false;

        // Example: Add teamId field if you want projects to support teams
        // if (project.teamId === undefined) {
        //   updates.teamId = null;
        //   log.push(`Project ${project.name}: Added teamId=null`);
        //   hasChanges = true;
        // }

        // Example: Add sharedWith array
        // if (!project.sharedWith) {
        //   updates.sharedWith = [];
        //   log.push(`Project ${project.name}: Added sharedWith=[]`);
        //   hasChanges = true;
        // }

        return { updates, hasChanges, log };
      },
    });
    results.Project = {
      updated: projectMigration.updatedCount,
      skipped: projectMigration.skippedCount,
    };

    // ============================================================
    // SUMMARY
    // ============================================================
    console.log("\n" + "=".repeat(60));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=".repeat(60));
    Object.entries(results).forEach(([model, counts]) => {
      console.log(`\n${model}:`);
      console.log(`  Updated: ${counts.updated}`);
      console.log(`  Skipped: ${counts.skipped}`);
    });
    console.log("\n" + "=".repeat(60) + "\n");

    console.log("✅ Migration completed successfully!");

    // Disconnect
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run migration
migrate();
