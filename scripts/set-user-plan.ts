/**
 * Quick Fix: Set User Plan to Team
 *
 * This script updates a specific user's plan to "team".
 * Useful for testing or upgrading specific users.
 *
 * Usage:
 *   npx tsx scripts/set-user-plan.ts your@email.com team
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectMongo from "../libs/mongoose";
import User from "../models/User";

async function setUserPlan() {
  try {
    const email = process.argv[2];
    const plan = process.argv[3] as "solo" | "team";

    if (!email || !plan) {
      console.error(
        "❌ Usage: npx tsx scripts/set-user-plan.ts <email> <plan>"
      );
      console.error(
        "   Example: npx tsx scripts/set-user-plan.ts user@example.com team"
      );
      process.exit(1);
    }

    if (plan !== "solo" && plan !== "team") {
      console.error("❌ Plan must be either 'solo' or 'team'");
      process.exit(1);
    }

    console.log(`🚀 Setting plan for ${email} to "${plan}"...\n`);

    // Connect to MongoDB
    await connectMongo();
    console.log("✅ Connected to MongoDB\n");

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`📝 Found user: ${user.name || user.email}`);
    console.log(`   Current plan: ${user.plan || "not set"}`);
    console.log(`   Updating to: ${plan}\n`);

    // Update user
    await User.findByIdAndUpdate(user._id, {
      $set: {
        plan: plan,
        // Also ensure team fields exist
        teamId: user.teamId || null,
        teamRole: user.teamRole || null,
      },
    });

    console.log("✅ User plan updated successfully!");

    // Verify
    const updatedUser = await User.findById(user._id);
    console.log(`\n📊 Verification:`);
    console.log(`   Plan: ${updatedUser.plan}`);
    console.log(`   Team ID: ${updatedUser.teamId || "null"}`);
    console.log(`   Team Role: ${updatedUser.teamRole || "null"}\n`);

    // Disconnect
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed to update user:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run
setUserPlan();
