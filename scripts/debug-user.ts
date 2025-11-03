// Quick debug script to check user data in database
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectMongo from "../libs/mongoose";
import User from "../models/User";

async function checkUser() {
  try {
    const email = process.argv[2] || "neca.danii@gmail.com";

    console.log(`\n🔍 Checking user: ${email}\n`);

    await connectMongo();
    console.log("✅ Connected to MongoDB\n");

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log("📊 User Document (Raw):");
    console.log("=".repeat(60));
    console.log(JSON.stringify(user.toObject(), null, 2));
    console.log("=".repeat(60));

    console.log("\n📋 Key Fields:");
    console.log("  _id:", user._id);
    console.log("  name:", user.name);
    console.log("  email:", user.email);
    console.log("  plan:", user.plan);
    console.log("  teamId:", user.teamId);
    console.log("  teamRole:", user.teamRole);
    console.log("  hasAccess:", user.hasAccess);

    console.log("\n🔬 Type Checks:");
    console.log("  typeof plan:", typeof user.plan);
    console.log("  plan === 'team':", user.plan === "team");
    console.log("  plan === 'solo':", user.plan === "solo");
    console.log("  plan value:", `'${user.plan}'`);

    await mongoose.disconnect();
    console.log("\n👋 Done\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkUser();
