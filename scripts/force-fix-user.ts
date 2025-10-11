/**
 * Force Fix User - Ensure ALL Custom Fields Are Present
 *
 * This script forcefully updates a user to include all custom fields,
 * regardless of whether they exist or not.
 *
 * Usage:
 *   npx tsx scripts/force-fix-user.ts <email>
 *
 * Example:
 *   npx tsx scripts/force-fix-user.ts user@example.com
 */

import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import mongoose from "mongoose";

async function forceFixUser(email: string) {
  try {
    console.log(`\n🔍 Force fixing user: ${email}\n`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB\n");

    // Get the raw collection (bypass Mongoose schema)
    const db = mongoose.connection.db;
    const usersCollection = db?.collection("users");

    if (!usersCollection) {
      console.error("❌ Could not access users collection");
      process.exit(1);
    }

    // Find user (raw query)
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log("📊 Current User State (Raw):");
    console.log("============================================================");
    console.log(JSON.stringify(user, null, 2));
    console.log(
      "============================================================\n"
    );

    // Force set ALL custom fields
    const updateFields = {
      hasAccess: user.hasAccess ?? false,
      plan: user.plan ?? "solo",
      teamId: user.teamId ?? null,
      teamRole: user.teamRole ?? null,
      encryptionKey: user.encryptionKey ?? null,
      customerId: user.customerId ?? null,
      priceId: user.priceId ?? null,
      updatedAt: new Date(),
    };

    console.log("🔧 Setting fields to:");
    console.log(JSON.stringify(updateFields, null, 2));
    console.log();

    // Apply updates (force with $set)
    const result = await usersCollection.updateOne(
      { _id: user._id },
      { $set: updateFields }
    );

    console.log(
      `✅ Update Result: ${result.modifiedCount} document(s) modified\n`
    );

    // Fetch updated user
    const updatedUser = await usersCollection.findOne({ _id: user._id });

    console.log("📊 New User State (Raw):");
    console.log("============================================================");
    console.log(JSON.stringify(updatedUser, null, 2));
    console.log(
      "============================================================\n"
    );

    await mongoose.connection.close();
    console.log("👋 Done");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("\nUsage: npx tsx scripts/force-fix-user.ts <email>");
  process.exit(1);
}

forceFixUser(email);
