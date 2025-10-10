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
    // Reference to the user who owns this project
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

export default (mongoose.models.Project ||
  mongoose.model("Project", projectSchema)) as mongoose.Model<any>;
