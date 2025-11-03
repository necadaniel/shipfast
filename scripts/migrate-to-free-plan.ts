/**
 * Migrate All Users to Free Plan
 *
 * This script updates all users without a valid plan to "free" plan.
 * Users who already purchased (have priceId) will keep their plan.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-free-plan.ts
 */

import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import config from "../config";

async function migrateToFreePlan() {
  try {
    console.log("\n🔄 Migrating users to free plan...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const usersCollection = db?.collection("users");

    if (!usersCollection) {
      console.error("❌ Could not access users collection");
      process.exit(1);
    }

    // Get all users
    const allUsers = await usersCollection.find({}).toArray();
    console.log(`📊 Found ${allUsers.length} users\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of allUsers) {
      const email = user.email || "unknown";

      // If user has a priceId, determine their plan from Stripe
      if (user.priceId) {
        const priceId = user.priceId;
        let plan = user.plan;

        // Match priceId to plan
        if (priceId === config.stripe.plans[0].priceId) {
          plan = "solo";
        } else if (priceId === config.stripe.plans[1].priceId) {
          plan = "team";
        }

        // Update if plan doesn't match
        if (user.plan !== plan) {
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: { plan } }
          );
          console.log(
            `✅ ${email}: Updated to "${plan}" plan (has priceId: ${priceId})`
          );
          updatedCount++;
        } else {
          console.log(`⏭️  ${email}: Already has "${plan}" plan`);
          skippedCount++;
        }
      } else {
        // No priceId = free user
        if (user.plan !== "free") {
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: { plan: "free" } }
          );
          console.log(`✅ ${email}: Updated to "free" plan (no purchase)`);
          updatedCount++;
        } else {
          console.log(`⏭️  ${email}: Already has "free" plan`);
          skippedCount++;
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary:");
    console.log("=".repeat(60));
    console.log(`Total users: ${allUsers.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log("=".repeat(60) + "\n");

    await mongoose.connection.close();
    console.log("👋 Done");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

migrateToFreePlan();
