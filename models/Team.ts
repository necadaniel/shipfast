import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// Team Member Schema (embedded)
const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Team Invitation Schema (embedded)
const teamInvitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
    token: {
      type: String,
      required: true,
      // Note: unique: true is removed here because we create index at schema level
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Default: 24 hours from now
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Wrapped Team Key Schema (embedded)
const wrappedTeamKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wrappedKey: {
      type: String,
      required: true, // Team key encrypted with user's personal key
    },
    wrappedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// TEAM SCHEMA
const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [teamMemberSchema],
    pendingInvitations: [teamInvitationSchema],
    // Encryption - Team Master Key (encrypted with each member's personal key)
    teamEncryptionKey: {
      type: String,
      required: false, // Will be generated on first team project creation
      select: false, // Never send to client directly
    },
    wrappedTeamKeys: [wrappedTeamKeySchema], // Team key wrapped for each member
    // Plan limits
    maxMembers: {
      type: Number,
      default: 10, // First 10 members included, then charge per-seat
    },
    // Billing status
    isActive: {
      type: Boolean,
      default: true,
    },
    // If payment fails, grace period until data deletion
    gracePeriodEndsAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual for total member count (including owner)
teamSchema.virtual("memberCount").get(function () {
  return this.members.length + 1; // +1 for owner
});

// Virtual for pending invitation count
teamSchema.virtual("pendingInvitationCount").get(function () {
  return this.pendingInvitations.length;
});

// Virtual for owner - creates a populate-able field
teamSchema.virtual("owner", {
  ref: "User",
  localField: "ownerId",
  foreignField: "_id",
  justOne: true,
});

// Index for faster queries
teamSchema.index({ ownerId: 1 });
teamSchema.index({ "members.userId": 1 });
teamSchema.index({ "pendingInvitations.email": 1 });
teamSchema.index({ "pendingInvitations.token": 1 });

// Method to check if user is member
teamSchema.methods.isMember = function (userIdOrEmail: string) {
  // Check if it's an email
  if (userIdOrEmail.includes("@")) {
    const email = userIdOrEmail.toLowerCase();
    // Check if email matches owner (need to populate owner first)
    // or any member email
    return this.members.some((m: any) => m.email?.toLowerCase() === email);
  }

  // Otherwise treat as userId
  return (
    this.ownerId.toString() === userIdOrEmail ||
    this.members.some((m: any) => m.userId.toString() === userIdOrEmail)
  );
};

// Method to get user's role in team
teamSchema.methods.getUserRole = function (userId: string) {
  if (this.ownerId.toString() === userId) return "owner";
  const member = this.members.find((m: any) => m.userId.toString() === userId);
  return member ? member.role : null;
};

// Method to check if user can invite others (owner or admin)
teamSchema.methods.canInvite = function (userId: string) {
  const role = this.getUserRole(userId);
  return role === "owner" || role === "admin";
};

// Method to check if user can remove members (owner or admin)
teamSchema.methods.canRemoveMember = function (userId: string) {
  const role = this.getUserRole(userId);
  return role === "owner" || role === "admin";
};

// Add plugin that converts mongoose to json
teamSchema.plugin(toJSON);

export default (mongoose.models.Team ||
  mongoose.model("Team", teamSchema)) as mongoose.Model<any>;
