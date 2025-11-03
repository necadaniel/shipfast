import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    image: {
      type: String,
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value: string) {
        return value.includes("cus_");
      },
    },
    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value: string) {
        return value.includes("price_");
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
    // Master encryption key for user's environment variables (base64 encoded)
    // This is generated once per user and used to encrypt all their secrets
    encryptionKey: {
      type: String,
      private: true, // Don't expose in API responses
    },
    // User's subscription plan
    plan: {
      type: String,
      enum: ["free", "solo", "team"],
      default: "free",
    },
    // Reference to team if user is part of one
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    // User's role within the team
    teamRole: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default (mongoose.models.User ||
  mongoose.model("User", userSchema)) as mongoose.Model<any>;
