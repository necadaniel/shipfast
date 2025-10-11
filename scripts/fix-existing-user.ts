/**
 * Fix Existing User - Add Missing Custom Fields
 *
 * This script updates an existing user to include all custom fields
 * that should have been set on user creation.
 *
 * Usage:
 *   npx tsx scripts/fix-existing-user.ts <email>
 *
 * Example:
 *   npx tsx scripts/fix-existing-user.ts user@example.com
 */

import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import User from "@/models/User";

async function fixExistingUser(email: string) {
  try {
    console.log(`\n🔍 Fixing user: ${email}\n`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB\n");

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log("📊 Current User State:");
    console.log("============================================================");
    console.log(JSON.stringify(user.toObject(), null, 2));
    console.log(
      "============================================================\n"
    );

    // Update user with missing fields (only if they don't exist)
    const updateFields: any = {};

    if (user.hasAccess === undefined) updateFields.hasAccess = false;
    if (!user.plan) updateFields.plan = "solo";
    if (user.teamId === undefined) updateFields.teamId = null;
    if (user.teamRole === undefined) updateFields.teamRole = null;
    if (user.encryptionKey === undefined) updateFields.encryptionKey = null;
    if (user.customerId === undefined) updateFields.customerId = null;
    if (user.priceId === undefined) updateFields.priceId = null;

    if (Object.keys(updateFields).length === 0) {
      console.log("✅ User already has all custom fields!");
      await mongoose.connection.close();
      return;
    }

    console.log("🔧 Adding missing fields:");
    console.log(JSON.stringify(updateFields, null, 2));
    console.log();

    // Apply updates
    await User.findByIdAndUpdate(user._id, {
      $set: updateFields,
    });

    // Fetch updated user
    const updatedUser = await User.findById(user._id);

    console.log("✅ User Updated Successfully!\n");
    console.log("📊 New User State:");
    console.log("============================================================");
    console.log(JSON.stringify(updatedUser?.toObject(), null, 2));
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
  console.log("\nUsage: npx tsx scripts/fix-existing-user.ts <email>");
  process.exit(1);
}

fixExistingUser(email);
