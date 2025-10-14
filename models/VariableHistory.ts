import mongoose, { Schema, Document } from "mongoose";
import toJSON from "./plugins/toJSON";

export interface IVariableHistory extends Document {
  projectId: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: "created" | "updated" | "deleted" | "bulk_import";
  variableKey: string;
  oldValue?: string; // encrypted
  newValue?: string; // encrypted
  bulkChanges?: Array<{
    key: string;
    action: string;
    oldValue?: string;
    newValue?: string;
  }>;
  metadata?: {
    source: "web" | "cli" | "api";
    ipAddress?: string;
    userAgent?: string;
  };
  canRollback: boolean;
  rolledBackAt?: Date;
  rolledBackBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const variableHistorySchema = new Schema<IVariableHistory>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "bulk_import"],
      required: true,
    },
    variableKey: {
      type: String,
      required: true,
    },
    oldValue: {
      type: String, // encrypted
    },
    newValue: {
      type: String, // encrypted
    },
    bulkChanges: [
      {
        key: String,
        action: String,
        oldValue: String,
        newValue: String,
      },
    ],
    metadata: {
      source: {
        type: String,
        enum: ["web", "cli", "api"],
        default: "web",
      },
      ipAddress: String,
      userAgent: String,
    },
    canRollback: {
      type: Boolean,
      default: true,
    },
    rolledBackAt: Date,
    rolledBackBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
variableHistorySchema.index({ projectId: 1, createdAt: -1 });
variableHistorySchema.index({ userId: 1, createdAt: -1 });
variableHistorySchema.index({ teamId: 1, createdAt: -1 });

// Apply toJSON plugin
variableHistorySchema.plugin(toJSON);

export default mongoose.models.VariableHistory ||
  mongoose.model<IVariableHistory>("VariableHistory", variableHistorySchema);
