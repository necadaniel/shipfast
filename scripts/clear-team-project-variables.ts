import mongoose from "mongoose";
import Project from "../models/Project.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

/**
 * This script clears all variables from team projects
 * so they can be re-added with the correct team encryption
 */
async function clearTeamProjectVariables() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB\n");

    // Find all team projects with variables
    const teamProjects = await Project.find({
      isTeamProject: true,
      variableCount: { $gt: 0 },
    });

    console.log(
      `Found ${teamProjects.length} team project(s) with variables\n`
    );
    console.log("=".repeat(60));

    for (const project of teamProjects) {
      console.log(`\n📁 Project: ${project.name}`);
      console.log(`   ID: ${project._id}`);
      console.log(`   Current variable count: ${project.variableCount}`);

      // Clear variables
      project.variables = "[]";
      project.variableCount = 0;
      await project.save();

      console.log(`   ✅ Cleared all variables`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("\n✅ Migration complete!");
    console.log("\nNOTE: Variables were encrypted with personal keys.");
    console.log(
      "Please re-add them manually. They will now use team encryption.\n"
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

clearTeamProjectVariables();
