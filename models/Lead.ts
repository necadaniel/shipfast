import mongoose, { type Model } from "mongoose";
import toJSON from "./plugins/toJSON";

// Stores emails collected from the landing page — useful when your product
// isn't ready yet and you're building a waitlist.
// Captured by <ButtonLead /> via the /api/lead route.
export interface ILead {
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const leadSchema = new mongoose.Schema<ILead>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

leadSchema.plugin(toJSON);

export default (mongoose.models.Lead ||
  mongoose.model<ILead>("Lead", leadSchema)) as Model<ILead>;
