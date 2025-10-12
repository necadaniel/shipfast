import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// PROJECT SCHEMA
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Reference to the user who owns this project (for personal projects)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Not required for team projects
    },
    // Reference to team (for team projects)
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: false,
    },
    // Is this a team project?
    isTeamProject: {
      type: Boolean,
      default: false,
    },
    // Color for visual identification (optional)
    color: {
      type: String,
      default: "#2b7fff",
    },
    // Environment variables - stored as encrypted JSON string
    // Structure: { key: string, value: string, encrypted: boolean }[]
    variables: {
      type: String,
      default: "[]",
    },
    // Number of environment variables in this project
    variableCount: {
      type: Number,
      default: 0,
    },
    // Last sync timestamp
    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add plugin that converts mongoose to json
projectSchema.plugin(toJSON);

// Index for faster queries
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ teamId: 1, createdAt: -1 });

// Validation: Either userId or teamId must be present
projectSchema.pre("validate", function (next) {
  // Convert null to undefined for validation purposes
  if (this.userId === null) {
    this.userId = undefined;
  }
  if (this.teamId === null) {
    this.teamId = undefined;
  }

  if (!this.userId && !this.teamId) {
    next(new Error("Project must belong to either a user or a team"));
  } else {
    next();
  }
});

// Clear the model from cache if it exists to ensure schema updates are applied
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.model("Project", projectSchema) as mongoose.Model<any>;
