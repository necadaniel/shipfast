import mongoose, { type Model } from "mongoose";
import toJSON from "./plugins/toJSON";

export interface IUser {
  name?: string;
  email?: string;
  image?: string;
  /** Stripe customer ID. Set by the webhook; used for the Customer Portal. */
  customerId?: string;
  /** Stripe price ID of the plan they paid for. The user's plan is derived
   *  from this via libs/plans.ts — there is deliberately no `plan` field. */
  priceId?: string;
  /** The single gate for paid features. Toggled by the Stripe webhook. */
  hasAccess?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
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
    customerId: {
      type: String,
      validate: (value: string) => value.includes("cus_"),
    },
    priceId: {
      type: String,
      validate: (value: string) => value.includes("price_"),
    },
    hasAccess: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Strips _id/__v and any field marked `private: true` from JSON output
userSchema.plugin(toJSON);

// The `mongoose.models` check keeps hot reload from redefining the model
export default (mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema)) as Model<IUser>;
